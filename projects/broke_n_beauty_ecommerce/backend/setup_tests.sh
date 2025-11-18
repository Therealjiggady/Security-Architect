#!/bin/bash

echo "======================================"
echo "Setting up Backend Tests with pytest"
echo "======================================"

# Check if we're in the backend directory
if [ ! -f "requirements.txt" ]; then
    echo "Error: Must be run from backend directory"
    exit 1
fi

# Check if virtual environment is activated
if [ -z "$VIRTUAL_ENV" ]; then
    echo "Error: Virtual environment not activated"
    echo "Please run: source ../.venv/bin/activate"
    exit 1
fi

# Install test dependencies
echo ""
echo "Step 1: Installing test dependencies..."
pip install pytest pytest-cov httpx

echo ""
echo "======================================"
echo "✅ Setup Complete!"
echo "======================================"
echo ""
echo "To run tests:"
echo "  pytest                          # Run all tests"
echo "  pytest tests/test_orders.py     # Run order tests"
echo "  pytest -v                       # Verbose output"
echo "  pytest --cov=app                # With coverage"
echo "  pytest -k 'transition'          # Run matching tests"
echo ""
echo "To view coverage report:"
echo "  pytest --cov=app --cov-report=html"
echo "  open htmlcov/index.html"
echo ""
echo "======================================"