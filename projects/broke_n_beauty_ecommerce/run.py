#!/usr/bin/env python3

import os
import sys
import subprocess

def main():
    print("🚀 Starting Broke n Beauty Ecommerce Backend Setup...")

    # Check for virtual environment
    print("📦 Checking for virtual environment...")
    if not os.path.exists('.venv'):
        print("   Creating virtual environment...")
        result = subprocess.run([sys.executable, '-m', 'venv', '.venv'])
        if result.returncode != 0:
            print("❌ Failed to create virtual environment")
            sys.exit(1)
        print("✅ Virtual environment created")
    else:
        print("✅ Virtual environment found")

    # Check if running in virtual environment
    venv_python = os.path.join('.venv', 'bin', 'python')
    if sys.executable != venv_python:
        print("🔄 Restarting script in virtual environment...")
        os.execv(venv_python, [venv_python] + sys.argv)

    # Install dependencies
    print("📥 Installing dependencies...")
    result = subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'backend/requirements.txt'])
    if result.returncode != 0:
        print("❌ Failed to install dependencies")
        sys.exit(1)
    print("✅ Dependencies installed")

    # Seed database
    print("🌱 Seeding database...")
    result = subprocess.run([sys.executable, 'seed_products.py'])
    if result.returncode != 0:
        print("❌ Failed to seed database")
        sys.exit(1)
    print("✅ Database seeded")

    # Start FastAPI server
    print("🌐 Starting FastAPI server...")
    print("   Server will be available at http://localhost:8000")
    print("   Press Ctrl+C to stop the server")
    subprocess.run([sys.executable, '-m', 'uvicorn', 'backend.app.main:app', '--reload', '--host', '0.0.0.0', '--port', '8000'])

if __name__ == "__main__":
    main()