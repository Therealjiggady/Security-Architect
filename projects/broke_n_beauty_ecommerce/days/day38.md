# Day 38: Backend Order Tests

## Overview
Comprehensive pytest testing for order management system, focusing on order lifecycle (pending → shipped → delivered) and business logic validation.

## Testing Scope

### Order Lifecycle Tests
1. **Order Creation** - Create orders with valid items and stock validation
2. **Status Transitions** - Test valid transitions (pending → shipped → delivered)
3. **Invalid Transitions** - Verify invalid transitions are rejected
4. **Stock Management** - Ensure inventory is properly decremented
5. **Authorization** - Verify users can only access their own orders

### Test Coverage

#### Core Functionality ✅
- [x] Create order with valid items
- [x] Validate stock before order creation
- [x] Transition from pending to shipped
- [x] Transition from shipped to delivered
- [x] Reject invalid transitions (e.g., pending → delivered)
- [x] Verify user ownership
- [x] List user orders
- [x] Stock decrement on order creation

#### Edge Cases ✅
- [x] Insufficient stock handling
- [x] Invalid product variants
- [x] Zero or negative quantities
- [x] Unauthorized order access
- [x] Non-existent orders
- [x] Invalid status values
- [x] Concurrent order updates

## Test Files Created

### 1. `/backend/tests/test_orders.py`
Main test file covering:
- Order creation and validation
- Status transition logic
- Authorization checks
- Stock management
- Error handling

### 2. `/backend/tests/conftest.py`
Pytest fixtures for:
- Database session management
- Test client setup
- Authentication helpers
- Test data factories

## Tools Used

- **pytest** - Python testing framework
- **pytest-cov** - Code coverage reporting
- **FastAPI TestClient** - API endpoint testing
- **SQLAlchemy** - Database testing

## Setup Instructions

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

# Run order tests only
pytest tests/test_orders.py

# Run with coverage
pytest --cov=app --cov-report=html

# Run with verbose output
pytest -v

# Run specific test
pytest tests/test_orders.py::test_create_order
```

### 3. View Coverage Report
```bash
# Generate HTML coverage report
pytest --cov=app --cov-report=html
open htmlcov/index.html
```

## Test Structure

### Test Organization
```
backend/tests/
├── conftest.py              # Shared fixtures
├── test_orders.py           # Order lifecycle tests
├── test_auth.py            # Authentication tests (future)
└── test_products.py        # Product tests (future)
```

### Fixture Strategy
- **db_session** - Clean database for each test
- **test_client** - FastAPI test client
- **test_user** - Authenticated test user
- **test_products** - Sample products with variants
- **auth_headers** - JWT authentication headers

## Test Examples

### Order Creation Test
```python
def test_create_order(test_client, test_user, test_products, auth_headers):
    """Test successful order creation"""
    order_data = {
        "items": [{
            "product_variant_id": 1,
            "quantity": 2,
            "price_at_purchase": 13.99
        }],
        "total_amount": 27.98
    }
    
    response = test_client.post(
        "/orders/",
        json=order_data,
        headers=auth_headers
    )
    
    assert response.status_code == 201
    assert response.json()["status"] == "pending"
```

### Status Transition Test
```python
def test_status_transition_pending_to_shipped(test_client, test_order, auth_headers):
    """Test valid transition from pending to shipped"""
    response = test_client.patch(
        f"/orders/{test_order['id']}/status",
        json={"status": "shipped"},
        headers=auth_headers
    )
    
    assert response.status_code == 200
    assert response.json()["status"] == "shipped"
```

## Test Results

### Sample Output
```
========================= test session starts ==========================
collected 25 items

tests/test_orders.py::test_create_order PASSED                   [  4%]
tests/test_orders.py::test_create_order_insufficient_stock PASSED [  8%]
tests/test_orders.py::test_transition_pending_to_shipped PASSED   [ 12%]
tests/test_orders.py::test_transition_shipped_to_delivered PASSED [ 16%]
tests/test_orders.py::test_invalid_transition_pending_to_delivered PASSED [ 20%]
tests/test_orders.py::test_unauthorized_order_access PASSED       [ 24%]
tests/test_orders.py::test_stock_decrement PASSED                 [ 28%]
tests/test_orders.py::test_list_user_orders PASSED                [ 32%]
tests/test_orders.py::test_nonexistent_order PASSED               [ 36%]
tests/test_orders.py::test_invalid_status_value PASSED            [ 40%]
...

========================= 25 passed in 3.45s ===========================
```

### Coverage Report
```
Name                              Stmts   Miss  Cover
-----------------------------------------------------
app/models/order.py                  45      2    96%
app/routers/orders.py               112      5    96%
app/schemas/order.py                 25      0   100%
-----------------------------------------------------
TOTAL                               182      7    96%
```

## Status Transition Rules

### Valid Transitions
```
pending → shipped    ✅ Valid
shipped → delivered  ✅ Valid
pending → pending    ✅ Valid (no-op)
shipped → shipped    ✅ Valid (no-op)
delivered → delivered ✅ Valid (no-op)
```

### Invalid Transitions
```
pending → delivered  ❌ Must ship first
delivered → shipped  ❌ Cannot revert
delivered → pending  ❌ Cannot revert
```

## Best Practices

### 1. Test Isolation
- Each test uses a clean database
- No shared state between tests
- Fixtures handle setup and teardown

### 2. Descriptive Test Names
```python
def test_transition_pending_to_shipped_succeeds()
def test_transition_pending_to_delivered_fails()
def test_create_order_with_insufficient_stock_fails()
```

### 3. Arrange-Act-Assert Pattern
```python
# Arrange - Set up test data
order = create_test_order(status="pending")

# Act - Perform action
response = update_status(order.id, "shipped")

# Assert - Verify outcome
assert response.status == "shipped"
```

### 4. Edge Case Coverage
- Empty orders
- Invalid product IDs
- Negative quantities
- Unauthorized access
- Concurrent updates

## CI/CD Integration

### GitHub Actions Workflow
```yaml
name: Backend Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
          pip install pytest pytest-cov
      - name: Run tests
        run: |
          cd backend
          pytest --cov=app --cov-report=xml
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Debugging Failed Tests

### 1. Use pytest markers
```bash
pytest -v -s  # Show print statements
pytest -x     # Stop on first failure
pytest --pdb  # Drop into debugger on failure
```

### 2. Check test database
```python
def test_example(db_session):
    # Add debugging
    print(f"Users in DB: {db_session.query(User).count()}")
    print(f"Orders in DB: {db_session.query(Order).count()}")
```

### 3. Inspect API responses
```python
response = test_client.post("/orders/", json=data)
print(f"Status: {response.status_code}")
print(f"Body: {response.json()}")
```

## Performance Considerations

### Database Efficiency
- Use transactions for test isolation
- Rollback after each test
- Use in-memory SQLite for speed

### Test Execution Time
- Parallel execution: `pytest -n auto`
- Skip slow tests: `@pytest.mark.slow`
- Use fixtures for expensive setup

## Next Steps

### Day 39: Performance Testing
- Load testing with Locust
- Database query optimization
- API response time benchmarks
- Stress testing order creation

### Future Enhancements
- Payment processing tests
- Webhook testing
- Email notification tests
- Rate limiting tests
- Caching validation

## Resources
- [pytest Documentation](https://docs.pytest.org)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)
- [SQLAlchemy Testing](https://docs.sqlalchemy.org/en/14/orm/session_transaction.html)
- [Coverage.py](https://coverage.readthedocs.io)

## Notes
- Tests use SQLite in-memory database for speed
- Each test gets a fresh database
- Authentication uses JWT tokens
- All tests are independent and can run in any order
- Coverage target: >90% for critical paths