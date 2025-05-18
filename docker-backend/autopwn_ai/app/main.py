from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect, Request, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
from fastapi.responses import JSONResponse, FileResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
import uuid
import asyncio
import platform
import shutil
import tempfile
import subprocess
from loguru import logger
import time
import io
from pathlib import Path
from dotenv import load_dotenv

from app.services.kali_service import KaliService
from app.utils.tool_validator import is_command_safe, get_validation_error

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="AutoPwn Service",
    description="AI-Powered Automated Penetration Testing Assistant with Native Support",
    version="1.0.0"
)

# Create directories for binaries
os.makedirs("binaries/windows", exist_ok=True)
os.makedirs("binaries/linux", exist_ok=True)
os.makedirs("binaries/macos", exist_ok=True)
os.makedirs("uploads", exist_ok=True)

# Serve static files (including binaries)
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/binaries", StaticFiles(directory="binaries"), name="binaries")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiting middleware
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host
    current_time = time.time()
    requests_per_minute = 30  # Adjust as needed
    
    # Initialize request history dict if not in app state
    if not hasattr(app.state, "request_history"):
        app.state.request_history = {}
    
    # Clean old requests (older than 60 seconds)
    app.state.request_history = {
        ip: [t for t in times if current_time - t < 60] 
        for ip, times in app.state.request_history.items()
    }
    
    # Check and update client's request history
    if client_ip not in app.state.request_history:
        app.state.request_history[client_ip] = []
    
    if len(app.state.request_history[client_ip]) >= requests_per_minute:
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests"}
        )
    
    app.state.request_history[client_ip].append(current_time)
    
    # Process the request
    response = await call_next(request)
    return response

# API Key authentication
API_KEY = os.getenv("API_KEY", "12345")
api_key_header = APIKeyHeader(name="X-API-Key")

def get_api_key(api_key: str = Depends(api_key_header)):
    if api_key != API_KEY:
        logger.warning(f"Invalid API key attempt: {api_key[:5]}...")
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return api_key

# Initialize services
kali_service = KaliService()

# Model definitions
class CommandRequest(BaseModel):
    command: str
    timeout: Optional[int] = 300

class CommandResponse(BaseModel):
    command_id: str
    command: str
    stdout: str
    stderr: str
    success: bool
    execution_time: float

class ProxyConfig(BaseModel):
    host: str
    port: int = 22
    username: str
    password: str

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint - API information"""
    return {
        "name": "AutoPwn Service",
        "version": "1.0.0",
        "description": "Enhanced Penetration Testing Assistant with Native Support"
    }

# Available tools endpoint
@app.get("/tools")
async def get_available_tools(api_key: str = Depends(get_api_key)):
    """Get list of available tools on the Kali system"""
    try:
        # Get list of common security tools in Kali
        result = kali_service.execute_command(
            "find /usr/bin /usr/sbin -type f -executable -size +1k | sort | grep -v -E '\\.so$' | xargs -n1 basename"
        )
        
        if not result["success"]:
            raise HTTPException(status_code=500, detail="Failed to retrieve tools")
        
        # Parse tools list
        tools = [tool for tool in result["stdout"].split("\n") if tool.strip()]
        
        return {
            "count": len(tools),
            "tools": tools
        }
    except Exception as e:
        logger.error(f"Error getting tools: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Execute command endpoint
@app.post("/execute", response_model=CommandResponse)
async def execute_command(command_req: CommandRequest, api_key: str = Depends(get_api_key)):
    """Execute a command on the Kali server"""
    try:
        # Validate command
        if not is_command_safe(command_req.command):
            error_msg = get_validation_error(command_req.command)
            raise HTTPException(status_code=400, detail=f"Invalid command: {error_msg}")
        
        # Generate command ID
        command_id = str(uuid.uuid4())
        
        # Execute command
        result = kali_service.execute_command(
            command_req.command, 
            session_id=command_id,
            timeout=command_req.timeout
        )
        
        return {
            "command_id": command_id,
            "command": command_req.command,
            "stdout": result["stdout"],
            "stderr": result["stderr"],
            "success": result["success"],
            "execution_time": result["execution_time"]
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error executing command: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error executing command: {str(e)}")

# Execute local command (native binary wrapper)
@app.post("/execute/local")
async def execute_local_command(command_req: CommandRequest, api_key: str = Depends(get_api_key)):
    """Execute a command locally through the native binary wrapper"""
    try:
        # Validate command
        if not is_command_safe(command_req.command):
            error_msg = get_validation_error(command_req.command)
            raise HTTPException(status_code=400, detail=f"Invalid command: {error_msg}")
        
        # Execute command locally
        start_time = time.time()
        
        try:
            # Create a temporary file to store the command
            with tempfile.NamedTemporaryFile(mode='w+', delete=False) as temp:
                temp.write(command_req.command)
                temp_path = temp.name
            
            # Execute through autopwn-runner binary
            process = subprocess.Popen(
                ["./binaries/autopwn-runner", temp_path],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            stdout, stderr = process.communicate(timeout=command_req.timeout)
            
            # Remove the temporary file
            os.unlink(temp_path)
            
            return {
                "command_id": str(uuid.uuid4()),
                "command": command_req.command,
                "stdout": stdout,
                "stderr": stderr,
                "success": process.returncode == 0,
                "execution_time": time.time() - start_time
            }
            
        except subprocess.TimeoutExpired:
            return {
                "command_id": str(uuid.uuid4()),
                "command": command_req.command,
                "stdout": "",
                "stderr": "Command execution timed out",
                "success": False,
                "execution_time": time.time() - start_time
            }
            
    except Exception as e:
        logger.error(f"Error executing local command: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error executing local command: {str(e)}")

# WebSocket endpoint for streaming command output
@app.websocket("/ws/execute/{command_id}")
async def websocket_execute(websocket: WebSocket, command_id: str):
    await websocket.accept()
    
    try:
        # Get command details from websocket
        data = await websocket.receive_json()
        
        # Validate command
        cmd = data.get("command", "")
        timeout = data.get("timeout", 300)
        
        if not is_command_safe(cmd):
            error_msg = get_validation_error(cmd)
            await websocket.send_json({"type": "error", "message": f"Invalid command: {error_msg}"})
            await websocket.close()
            return
        
        # Callback for streaming results
        async def send_output(output):
            await websocket.send_json(output)
        
        # Execute command with streaming
        await kali_service.stream_command(
            cmd, 
            send_output, 
            session_id=command_id,
            timeout=timeout
        )
        
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for command {command_id}")
        kali_service.close_session(command_id)
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        try:
            await websocket.send_json({"type": "error", "message": str(e)})
            await websocket.close()
        except:
            pass
        kali_service.close_session(command_id)

# File operations endpoints
@app.get("/files")
async def list_files(path: str = "", api_key: str = Depends(get_api_key)):
    """List files in the workspace directory"""
    try:
        workspace = os.getenv("KALI_WORKSPACE", "/home/kaliuser/workspace")
        target_path = workspace
        
        if path:
            # Prevent directory traversal
            if ".." in path:
                raise HTTPException(status_code=400, detail="Path cannot contain '..'")
            
            # Ensure path is within workspace
            target_path = os.path.join(workspace, path.lstrip('/'))
        
        # List files
        result = kali_service.execute_command(f"ls -la {target_path}")
        
        if not result["success"]:
            raise HTTPException(status_code=500, detail=f"Failed to list files: {result['stderr']}")
        
        return {
            "path": path,
            "listing": result["stdout"]
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error listing files: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Download binary executables
@app.get("/download/binary/{platform}")
async def download_binary(platform: str, api_key: str = Depends(get_api_key)):
    """Download the AutoPwn native binary for the specified platform"""
    valid_platforms = ["windows", "linux", "macos"]
    if platform not in valid_platforms:
        raise HTTPException(status_code=400, detail=f"Invalid platform. Must be one of: {valid_platforms}")
    
    # Map platform to file
    file_map = {
        "windows": "autopwn-runner.exe",
        "linux": "autopwn-runner",
        "macos": "autopwn-runner-mac"
    }
    
    file_path = f"binaries/{platform}/{file_map[platform]}"
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"Binary not found for platform: {platform}")
    
    return FileResponse(
        path=file_path,
        filename=file_map[platform],
        media_type="application/octet-stream"
    )

# Get proxy setup script
@app.get("/download/proxy-setup/{platform}")
async def download_proxy_setup(platform: str, api_key: str = Depends(get_api_key)):
    """Download the proxy setup script for the specified platform"""
    valid_platforms = ["windows", "linux", "macos"]
    if platform not in valid_platforms:
        raise HTTPException(status_code=400, detail=f"Invalid platform. Must be one of: {valid_platforms}")
    
    # Map platform to file
    file_map = {
        "windows": "setup-proxy.bat",
        "linux": "setup-proxy.sh",
        "macos": "setup-proxy.sh"
    }
    
    file_path = f"scripts/{platform}/{file_map[platform]}"
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"Setup script not found for platform: {platform}")
    
    return FileResponse(
        path=file_path,
        filename=file_map[platform],
        media_type="application/octet-stream"
    )

# Generate proxy configuration
@app.post("/proxy/generate")
async def generate_proxy_config(config: ProxyConfig, api_key: str = Depends(get_api_key)):
    """Generate proxy configuration files customized for the user"""
    try:
        # Generate config file
        config_content = f"""
# AutoPwn Service - Proxy Configuration
HOST={config.host}
PORT={config.port}
USERNAME={config.username}
PASSWORD={config.password}
        """
        
        # Create a temporary file
        with tempfile.NamedTemporaryFile(mode='w+', delete=False) as temp:
            temp.write(config_content)
            temp_path = temp.name
        
        # Return the file
        return FileResponse(
            path=temp_path,
            filename="autopwn-proxy.conf",
            media_type="text/plain",
            background=BackgroundTask(lambda: os.unlink(temp_path))
        )
        
    except Exception as e:
        logger.error(f"Error generating proxy config: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating proxy config: {str(e)}")

# Start proxy connection
@app.post("/proxy/start")
async def start_proxy(config: ProxyConfig, api_key: str = Depends(get_api_key)):
    """Start a proxy connection to the AutoPwn server"""
    try:
        # This would normally use SSH to create the tunnel
        # For the API, we'll just return configuration instructions
        return {
            "status": "success",
            "message": "Proxy configuration generated",
            "instructions": f"To start the proxy manually, run:\n\nssh -N -R 1080:localhost:1080 {config.username}@{config.host} -p {config.port}",
            "config": {
                "host": config.host,
                "port": config.port,
                "username": config.username
            }
        }
    except Exception as e:
        logger.error(f"Error starting proxy: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error starting proxy: {str(e)}")

# GUI App download
@app.get("/download/gui/{platform}")
async def download_gui(platform: str, api_key: str = Depends(get_api_key)):
    """Download the AutoPwn GUI app for the specified platform"""
    valid_platforms = ["windows", "linux", "macos"]
    if platform not in valid_platforms:
        raise HTTPException(status_code=400, detail=f"Invalid platform. Must be one of: {valid_platforms}")
    
    # Map platform to file
    file_map = {
        "windows": "AutoPwnService.exe",
        "linux": "AutoPwnService",
        "macos": "AutoPwnService.app.zip"
    }
    
    file_path = f"gui/{platform}/{file_map[platform]}"
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"GUI app not found for platform: {platform}")
    
    return FileResponse(
        path=file_path,
        filename=file_map[platform],
        media_type="application/octet-stream"
    )

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test connection to Kali
        result = kali_service.execute_command("echo 'health_check'")
        if result["success"]:
            return {"status": "healthy", "kali_connection": True}
        else:
            return {"status": "unhealthy", "kali_connection": False, "error": result["stderr"]}
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {"status": "unhealthy", "kali_connection": False, "error": str(e)}

# Error handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"}
    )

# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("AutoPwn Service starting up...")
    # You can initialize resources here if needed

# Shutdown event
@app.on_event("shutdown")
def shutdown_event():
    """Close all SSH sessions on shutdown"""
    logger.info("AutoPwn Service shutting down...")
    kali_service.close_all_sessions()

# Run the app if executed directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)