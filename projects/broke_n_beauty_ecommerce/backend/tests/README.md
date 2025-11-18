# Backend Tests

## Overview
Comprehensive pytest test suite for the Broken Beauty e-commerce backend, focusing on order lifecycle and business logic validation.

## Test Structure

```
tests/
├── conftest.py          # Shared fixtures and test configuration
├── test_orders.py       # Order lifecycle tests (pending → shipped → delivered)
├── test_auth.py        # Authentication tests (future)
└── test_products.py    # Product tests (future)
```

## Setup

### 1. Install Dependencies
```bash
cd backend
source ../.venv/bin/activate
pip install pytest pytest-cov httpx
```

### 2. Run Tests
```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_orders.py

# Run specific test class
pytest tests/test_orders.py::TestOrderStatusTransitions

# Run specific test
pytest tests/test_orders.py::TestOrderCreation::test_create_order_success

# Run with verbose output
pytest -v

# Run with coverage report
pytest --cov=app --cov-report=html

# Run and stop on first failure
pytest -x

# Run tests matching pattern
pytest -k "transition"
```

### 3. View Coverage Report
```bash
pytest --cov=app --cov-report=html
open htmlcov/index.html
```

## Test Categories

### Order Creation Tests
- ✅ Valid order creation
- ✅ Multiple items in order
- ✅ Insufficient stock validation
- ✅ Invalid product variant
- ✅ Zero/negative quantity validation
- ✅ Unauthenticated access prevention

### Stock Management Tests
- ✅ Stock decrement on order creation
- ✅ Multiple items stock management
- ✅ Stock validation before order

### Status Transition Tests
- ✅ pending → shipped (valid)
- ✅ shipped → delivered (valid)
- ✅ pending → delivered (invalid - must ship first)
- ✅ delivered → pending (invalid - cannot revert)
- ✅ delivered → shipped (invalid - cannot revert)
- ✅ Idempotent status updates

### Authorization Tests
- ✅ Users can only update own orders
- ✅ Users can only view own orders
- ✅ Unauthorized access prevention

### Edge Cases
- ✅ Empty orders
- ✅ Non-existent orders
- ✅ Invalid status values
- ✅ Order sorting by date

## Test Fixtures

### Database Fixtures
- `db_session` - Fresh database for each test
- `test_client` - FastAPI TestClient with DB override

### User Fixtures
- `test_user` - Primary test user
- `test_user2` - Secondary user for auth tests
- `auth_headers` - JWT authentication headers
- `auth_headers2` - JWT headers for second user

### Data Fixtures
- `test_products` - Sample products with variants
- `test_order` - Sample order with items

## Writing New Tests

### Test Template
```python
def test_your_feature(test_client, auth_headers):
    """Test description"""
    # Arrange
    data = {"field": "value"}
    
    # Act
    response = test_client.post("/endpoint", json=data, headers=auth_headers)
    
    # Assert
    assert response.status_code == 200
    assert response.json()["field"] == "expected"
```

### Using Fixtures
```python
def test_with_order(test_order, auth_headers):
    """Test using existing order fixture"""
    order_id = test_order["id"]
    # Test logic here
```

## Test Markers

Mark tests for organization:
```python
@pytest.mark.slow
def test_expensive_operation():
    """Mark as slow test"""
    pass

@pytest.mark.integration
def test_full_flow():
    """Mark as integration test"""
    pass
```

Run specific markers:
```bash
pytest -m "not slow"     # Skip slow tests
pytest -m integration     # Run only integration tests
```

## Debugging Tests

### Print Output
```bash
pytest -s  # Show print statements
```

### Debugger
```bash
pytest --pdb  # Drop into debugger on failure
```

### Inspect Test Output
```python
def test_example(test_client):
    response = test_client.get("/endpoint")
    print(f"Status: {response.status_code}")
    print(f"Body: {response.json()}")
    assert response.status_code == 200
```

## Common Issues

### Import Errors
```bash
# Make sure backend is in Python path
export PYTHONPATH=$PYTHONPATH:$(pwd)
```

### Database Errors
- Tests use in-memory SQLite (automatically cleaned up)
- Each test gets fresh database
- No need to manually clean test data

### Authentication Errors
- Use `auth_headers` fixture for authenticated requests
- Fixture automatically creates user and generates valid JWT

## Coverage Goals

- **Critical paths**: 100% coverage
- **Business logic**: 95%+ coverage
- **Overall**: 90%+ coverage

## CI/CD Integration

Tests run automatically on:
- Push to main branch
- Pull requests
- Manual workflow dispatch

See `.github/workflows/tests.yml` for CI configuration.

## Best Practices

1. **Isolation** - Each test is independent
2. **Descriptive names** - Test names explain what they test
3. **AAA pattern** - Arrange, Act, Assert
4. **One assertion focus** - Each test has clear purpose
5. **Use fixtures** - Avoid duplication
6. **Fast tests** - Use in-memory database
7. **Clean assertions** - Clear, specific assertions

## Performance

- Average test execution: ~0.1s per test
- Full suite: ~3-5 seconds
- Parallel execution: `pytest -n auto` (requires pytest-xdist)

## Next Steps

1. Add authentication tests
2. Add product CRUD tests
3. Add cart management tests
4. Add payment integration tests
5. Add email notification tests