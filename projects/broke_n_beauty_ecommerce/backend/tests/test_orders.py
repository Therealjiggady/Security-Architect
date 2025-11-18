"""
Comprehensive tests for order management and lifecycle
Tests cover: creation, status transitions, validation, authorization
"""
import pytest
from app.models.order import OrderStatus


class TestOrderCreation:
    """Test order creation and validation"""
    
    def test_create_order_success(self, test_client, test_user, test_products, auth_headers, db_session):
        """Test successful order creation with valid items"""
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
        
        response = test_client.post("/orders/", json=order_data, headers=auth_headers)
        
        assert response.status_code == 201
        data = response.json()
        assert data["status"] == "pending"
        assert data["total_amount"] == 27.98
        assert data["user_id"] == test_user.id
        assert len(data["items"]) == 1
        assert data["items"][0]["quantity"] == 2
    
    def test_create_order_multiple_items(self, test_client, test_user, test_products, auth_headers):
        """Test order creation with multiple items"""
        order_data = {
            "items": [
                {
                    "product_variant_id": test_products["variants"][0].id,
                    "quantity": 1,
                    "price_at_purchase": 13.99
                },
                {
                    "product_variant_id": test_products["variants"][3].id,
                    "quantity": 2,
                    "price_at_purchase": 9.99
                }
            ],
            "total_amount": 33.97
        }
        
        response = test_client.post("/orders/", json=order_data, headers=auth_headers)
        
        assert response.status_code == 201
        data = response.json()
        assert len(data["items"]) == 2
        assert data["total_amount"] == 33.97
    
    def test_create_order_insufficient_stock(self, test_client, test_user, test_products, auth_headers):
        """Test order creation fails with insufficient stock"""
        order_data = {
            "items": [
                {
                    "product_variant_id": test_products["variants"][0].id,
                    "quantity": 100,  # More than available stock
                    "price_at_purchase": 13.99
                }
            ],
            "total_amount": 1399.00
        }
        
        response = test_client.post("/orders/", json=order_data, headers=auth_headers)
        
        assert response.status_code == 400
        assert "Insufficient stock" in response.json()["detail"]
    
    def test_create_order_invalid_variant(self, test_client, test_user, auth_headers):
        """Test order creation fails with non-existent product variant"""
        order_data = {
            "items": [
                {
                    "product_variant_id": 99999,  # Non-existent
                    "quantity": 1,
                    "price_at_purchase": 13.99
                }
            ],
            "total_amount": 13.99
        }
        
        response = test_client.post("/orders/", json=order_data, headers=auth_headers)
        
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()
    
    def test_create_order_zero_quantity(self, test_client, test_user, test_products, auth_headers):
        """Test order creation fails with zero quantity"""
        order_data = {
            "items": [
                {
                    "product_variant_id": test_products["variants"][0].id,
                    "quantity": 0,
                    "price_at_purchase": 13.99
                }
            ],
            "total_amount": 0
        }
        
        response = test_client.post("/orders/", json=order_data, headers=auth_headers)
        
        assert response.status_code == 400
        assert "positive" in response.json()["detail"].lower()
    
    def test_create_order_negative_price(self, test_client, test_user, test_products, auth_headers):
        """Test order creation fails with negative price"""
        order_data = {
            "items": [
                {
                    "product_variant_id": test_products["variants"][0].id,
                    "quantity": 1,
                    "price_at_purchase": -13.99
                }
            ],
            "total_amount": -13.99
        }
        
        response = test_client.post("/orders/", json=order_data, headers=auth_headers)
        
        assert response.status_code == 400
    
    def test_create_order_unauthenticated(self, test_client, test_products):
        """Test order creation fails without authentication"""
        order_data = {
            "items": [
                {
                    "product_variant_id": test_products["variants"][0].id,
                    "quantity": 1,
                    "price_at_purchase": 13.99
                }
            ],
            "total_amount": 13.99
        }
        
        response = test_client.post("/orders/", json=order_data)
        
        assert response.status_code == 401


class TestStockManagement:
    """Test stock decrement after order creation"""
    
    def test_stock_decrements_on_order_creation(self, test_client, test_user, test_products, auth_headers, db_session):
        """Test that stock is properly decremented after order creation"""
        variant = test_products["variants"][0]
        initial_stock = variant.stock
        
        order_data = {
            "items": [
                {
                    "product_variant_id": variant.id,
                    "quantity": 3,
                    "price_at_purchase": 13.99
                }
            ],
            "total_amount": 41.97
        }
        
        response = test_client.post("/orders/", json=order_data, headers=auth_headers)
        assert response.status_code == 201
        
        # Refresh variant to get updated stock
        db_session.refresh(variant)
        assert variant.stock == initial_stock - 3
    
    def test_stock_multiple_items(self, test_client, test_user, test_products, auth_headers, db_session):
        """Test stock decrement for multiple items in one order"""
        variant1 = test_products["variants"][0]
        variant2 = test_products["variants"][1]
        initial_stock1 = variant1.stock
        initial_stock2 = variant2.stock
        
        order_data = {
            "items": [
                {
                    "product_variant_id": variant1.id,
                    "quantity": 2,
                    "price_at_purchase": 13.99
                },
                {
                    "product_variant_id": variant2.id,
                    "quantity": 1,
                    "price_at_purchase": 13.99
                }
            ],
            "total_amount": 41.97
        }
        
        response = test_client.post("/orders/", json=order_data, headers=auth_headers)
        assert response.status_code == 201
        
        db_session.refresh(variant1)
        db_session.refresh(variant2)
        assert variant1.stock == initial_stock1 - 2
        assert variant2.stock == initial_stock2 - 1


class TestOrderStatusTransitions:
    """Test order status lifecycle: pending → shipped → delivered"""
    
    def test_transition_pending_to_shipped(self, test_client, test_order, auth_headers):
        """Test valid transition from pending to shipped"""
        response = test_client.patch(
            f"/orders/{test_order['id']}/status",
            json={"status": "shipped"},
            headers=auth_headers
        )
        
        assert response.status_code == 200
        assert response.json()["status"] == "shipped"
    
    def test_transition_shipped_to_delivered(self, test_client, test_order, auth_headers):
        """Test valid transition from shipped to delivered"""
        # First transition to shipped
        test_client.patch(
            f"/orders/{test_order['id']}/status",
            json={"status": "shipped"},
            headers=auth_headers
        )
        
        # Then transition to delivered
        response = test_client.patch(
            f"/orders/{test_order['id']}/status",
            json={"status": "delivered"},
            headers=auth_headers
        )
        
        assert response.status_code == 200
        assert response.json()["status"] == "delivered"
    
    def test_invalid_transition_pending_to_delivered(self, test_client, test_order, auth_headers):
        """Test invalid transition from pending directly to delivered"""
        response = test_client.patch(
            f"/orders/{test_order['id']}/status",
            json={"status": "delivered"},
            headers=auth_headers
        )
        
        assert response.status_code == 400
        assert "invalid" in response.json()["detail"].lower()
    
    def test_invalid_transition_delivered_to_pending(self, test_client, test_order, auth_headers):
        """Test cannot revert from delivered to pending"""
        # Move to delivered
        test_client.patch(
            f"/orders/{test_order['id']}/status",
            json={"status": "shipped"},
            headers=auth_headers
        )
        test_client.patch(
            f"/orders/{test_order['id']}/status",
            json={"status": "delivered"},
            headers=auth_headers
        )
        
        # Try to revert to pending
        response = test_client.patch(
            f"/orders/{test_order['id']}/status",
            json={"status": "pending"},
            headers=auth_headers
        )
        
        assert response.status_code == 400
    
    def test_invalid_transition_delivered_to_shipped(self, test_client, test_order, auth_headers):
        """Test cannot revert from delivered to shipped"""
        # Move to delivered
        test_client.patch(
            f"/orders/{test_order['id']}/status",
            json={"status": "shipped"},
            headers=auth_headers
        )
        test_client.patch(
            f"/orders/{test_order['id']}/status",
            json={"status": "delivered"},
            headers=auth_headers
        )
        
        # Try to revert to shipped
        response = test_client.patch(
            f"/orders/{test_order['id']}/status",
            json={"status": "shipped"},
            headers=auth_headers
        )
        
        assert response.status_code == 400
    
    def test_idempotent_status_update(self, test_client, test_order, auth_headers):
        """Test setting the same status multiple times (should succeed)"""
        # Set to shipped
        response1 = test_client.patch(
            f"/orders/{test_order['id']}/status",
            json={"status": "shipped"},
            headers=auth_headers
        )
        assert response1.status_code == 200
        
        # Set to shipped again (idempotent)
        response2 = test_client.patch(
            f"/orders/{test_order['id']}/status",
            json={"status": "shipped"},
            headers=auth_headers
        )
        assert response2.status_code == 200
        assert response2.json()["status"] == "shipped"
    
    def test_invalid_status_value(self, test_client, test_order, auth_headers):
        """Test invalid status value is rejected"""
        response = test_client.patch(
            f"/orders/{test_order['id']}/status",
            json={"status": "invalid_status"},
            headers=auth_headers
        )
        
        assert response.status_code == 422  # Validation error


class TestOrderAuthorization:
    """Test user authorization for order operations"""
    
    def test_user_can_only_update_own_orders(self, test_client, test_order, test_user2, auth_headers2):
        """Test user cannot update another user's order"""
        response = test_client.patch(
            f"/orders/{test_order['id']}/status",
            json={"status": "shipped"},
            headers=auth_headers2  # Different user
        )
        
        assert response.status_code == 403
        assert "unauthorized" in response.json()["detail"].lower()
    
    def test_list_only_own_orders(self, test_client, test_order, test_user2, auth_headers2):
        """Test user can only see their own orders"""
        # Get orders for user 2 (should be empty)
        response = test_client.get("/orders/me", headers=auth_headers2)
        
        assert response.status_code == 200
        orders = response.json()
        # Should not include test_order which belongs to test_user
        assert test_order["id"] not in [o["id"] for o in orders]
    
    def test_update_nonexistent_order(self, test_client, auth_headers):
        """Test updating non-existent order returns 404"""
        response = test_client.patch(
            "/orders/99999/status",
            json={"status": "shipped"},
            headers=auth_headers
        )
        
        assert response.status_code == 404


class TestOrderRetrieval:
    """Test order retrieval endpoints"""
    
    def test_get_user_orders(self, test_client, test_order, auth_headers):
        """Test retrieving all orders for authenticated user"""
        response = test_client.get("/orders/me", headers=auth_headers)
        
        assert response.status_code == 200
        orders = response.json()
        assert len(orders) >= 1
        assert any(o["id"] == test_order["id"] for o in orders)
    
    def test_get_orders_unauthenticated(self, test_client):
        """Test retrieving orders without authentication fails"""
        response = test_client.get("/orders/me")
        
        assert response.status_code == 401
    
    def test_order_includes_items(self, test_client, test_order, auth_headers):
        """Test that order response includes order items"""
        response = test_client.get("/orders/me", headers=auth_headers)
        
        assert response.status_code == 200
        orders = response.json()
        order = next(o for o in orders if o["id"] == test_order["id"])
        assert "items" in order
        assert len(order["items"]) > 0
        assert "product_variant_id" in order["items"][0]
        assert "quantity" in order["items"][0]
        assert "price_at_purchase" in order["items"][0]


class TestOrderEdgeCases:
    """Test edge cases and error conditions"""
    
    def test_create_order_empty_items(self, test_client, auth_headers):
        """Test order creation with empty items list"""
        order_data = {
            "items": [],
            "total_amount": 0
        }
        
        response = test_client.post("/orders/", json=order_data, headers=auth_headers)
        
        # Should fail validation or business logic
        assert response.status_code in [400, 422]
    
    def test_order_sorting_by_date(self, test_client, test_user, test_products, auth_headers):
        """Test orders are returned in descending order by created_at"""
        # Create multiple orders
        for i in range(3):
            order_data = {
                "items": [
                    {
                        "product_variant_id": test_products["variants"][0].id,
                        "quantity": 1,
                        "price_at_purchase": 13.99
                    }
                ],
                "total_amount": 13.99
            }
            test_client.post("/orders/", json=order_data, headers=auth_headers)
        
        # Get all orders
        response = test_client.get("/orders/me", headers=auth_headers)
        orders = response.json()
        
        # Verify they're sorted by date (newest first)
        assert len(orders) >= 3
        for i in range(len(orders) - 1):
            assert orders[i]["created_at"] >= orders[i + 1]["created_at"]