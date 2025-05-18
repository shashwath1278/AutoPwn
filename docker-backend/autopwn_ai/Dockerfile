# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    openssh-client \
    curl \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create SSH directory and set permissions
RUN mkdir -p /app/ssh \
    && chmod 700 /app/ssh

# Copy the current directory contents into the container at /app
COPY ./autopwn_ai /app

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Set environment variables
ENV PYTHONPATH=/app \
    DOCKER_HOST=localhost \
    DOCKER_SSH_PORT=22 \
    DOCKER_SSH_USER=autopwn-service \
    DOCKER_SSH_KEY_PATH=/app/ssh/id_rsa \
    KALI_CONTAINER=kali-pentest \
    KALI_USER=kali \
    KALI_WORKSPACE=/home/kali/shared \
    USE_SUDO=false

# Make sure the SSH key has the correct permissions
RUN chmod 600 /app/ssh/* || echo "No SSH keys found, will be mounted at runtime"

# Expose port for FastAPI
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]