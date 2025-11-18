"""
Pytest configuration and shared fixtures for backend tests
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.db import Base, get_db
from app.models import User, Product, ProductVariant, Order, OrderItem
from app.auth import get_password_hash, create_access_token


# Use in-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    """
    Create a fresh database for each test.
    Automatically rolls back after test completion.
    """
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Create a new session
    session = TestingSessionLocal()
    
    try:
        yield session
    finally:
        session.close()
        # Drop all tables after test
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def test_client(db_session):
    """
    FastAPI test client with overridden database dependency.
    """
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as client:
        yield client
    
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def test_user(db_session):
    """
    Create a test user in the database.
    """
    user = User(
        email="test@example.com",
        hashed_password=get_password_hash("testpassword123"),
        full_name="Test User",
        role="user"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture(scope="function")
def test_user2(db_session):
    """
    Create a second test user for authorization tests.
    """
    user = User(
        email="test2@example.com",
        hashed_password=get_password_hash("testpassword123"),
        full_name="Test User 2",
        role="user"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture(scope="function")
def auth_headers(test_user):
    """
    Generate authentication headers with JWT token.
    """
    token = create_access_token(sub=test_user.email)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="function")
def auth_headers2(test_user2):
    """
    Generate authentication headers for second user.
    """
    token = create_access_token(sub=test_user2.email)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="function")
def test_products(db_session):
    """
    Create test products with variants.
    """
    # Product 1: Sport Bra
    product1 = Product(
        name="BnB Sport Bra – Black",
        description="Comfortable sports bra",
        sku="BNB-SB-BLK",
        price=13.99,
        image_url="/static/images/sports_bra.png"
    )
    db_session.add(product1)
    db_session.flush()
    
    # Variants for Product 1
    variant1 = ProductVariant(product_id=product1.id, size="S", color="Black", stock=50)
    variant2 = ProductVariant(product_id=product1.id, size="M", color="Black", stock=45)
    variant3 = ProductVariant(product_id=product1.id, size="L", color="Black", stock=40)
    
    # Product 2: Biker Shorts
    product2 = Product(
        name="BnB Biker Short – Grey",
        description="High-waisted biker shorts",
        sku="BNB-BS-GRY",
        price=9.99,
        image_url="/static/images/biker_shorts.png"
    )
    db_session.add(product2)
    db_session.flush()
    
    # Variants for Product 2
    variant4 = ProductVariant(product_id=product2.id, size="XS", color="Grey", stock=30)
    variant5 = ProductVariant(product_id=product2.id, size="S", color="Grey", stock=35)
    
    db_session.add_all([variant1, variant2, variant3, variant4, variant5])
    db_session.commit()
    
    return {
        "products": [product1, product2],
        "variants": [variant1, variant2, variant3, variant4, variant5]
    }


@pytest.fixture(scope="function")
def test_order(test_client, test_user, test_products, auth_headers, db_session):
    """
    Create a test order with items.
    """
    order_data = {
        "items": [
            {
                "product_variant_id": test_products["variants"][0].id,
                "quantity": 2,
                "price_at_purchase": 13.99
            }
        ],
        "total_amount": 27.98
    }
    
    response = test_client.post(
        "/orders/",
        json=order_data,
        headers=auth_headers
    )
    
    assert response.status_code == 201
    return response.json()