#!/bin/bash

# setup.sh - Script to set up the Python backend environment for the Ecomply Anonymize application.

# Exit immediately if a command exits with a non-zero status.
set -e

# Define the Python virtual environment directory
VENV_DIR="venv"

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed. Please install Python 3 to proceed."
    exit 1
fi

# Check if pip is installed
if ! command -v pip &> /dev/null; then
    echo "Error: pip is not installed. Please install pip to proceed."
    exit 1
fi

# Create a virtual environment if it doesn't exist
if [ ! -d "$VENV_DIR" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv "$VENV_DIR"
fi

# Activate the virtual environment
echo "Activating Python virtual environment..."
source "$VENV_DIR/bin/activate"

# Upgrade pip to the latest version
echo "Upgrading pip..."
pip install --upgrade pip

# Install Python dependencies from requirements.txt
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Deactivate the virtual environment
echo "Deactivating Python virtual environment..."
deactivate

echo "Setup completed successfully. To activate the virtual environment, run 'source $VENV_DIR/bin/activate'."
