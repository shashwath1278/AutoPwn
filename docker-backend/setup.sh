#!/bin/bash
# Setup script for AutoPwn AI backend

set -e

echo "======================================"
echo "AutoPwn AI Backend Setup"
echo "======================================"

# Create main project directory
mkdir -p autopwn_ai
cd autopwn_ai

# Create core application structure
mkdir -p app
mkdir -p app/utils
mkdir -p app/services

# Create main files
touch app/__init__.py
touch app/main.py
touch app/utils/__init__.py
touch app/utils/tool_validator.py
touch app/services/__init__.py
touch app/services/kali_service.py

# Create requirements.txt
cat > requirements.txt << 'EOF'
fastapi==0.103.1
uvicorn==0.23.2
pydantic==2.3.0
python-multipart==0.0.6
python-jose==3.3.0
passlib==1.7.4
paramiko==3.3.1
python-dotenv==1.0.0
loguru==0.7.0
EOF

# Create .env file
cat > .env << 'EOF'
# AutoPwn AI Environment Variables
SECRET_KEY="your-secret-key-change-in-production"

# Kali SSH connection (remote Docker container)
KALI_HOST="your-kali-host"
KALI_PORT=22
KALI_USER="kaliuser"
KALI_PASSWORD="kalipassword"
EOF

# Create docker-compose for backend only
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - .:/app
    env_file:
      - .env
    restart: unless-stopped

networks:
  default:
    driver: bridge
EOF

# Create a Dockerfile
cat > Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
EOF

echo "======================================"
echo "AutoPwn AI Backend structure created!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Update the KALI_HOST and credentials in .env"
echo "2. Install dependencies: pip install -r requirements.txt"
echo "3. Run the app: uvicorn app.main:app --reload"