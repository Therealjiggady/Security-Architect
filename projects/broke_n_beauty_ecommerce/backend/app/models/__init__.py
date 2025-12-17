# Import all models to register them with SQLAlchemy
from .user import User
from .product import Product, ProductVariant
from .cart import Cart
from .wishlist import Wishlist
from .sizing import UserSizingOffset
from .chat import ChatMessage
from .order import Order, OrderItem
from .review import Review, ReviewImage
from .recently_viewed import RecentlyViewed
from .inventory_alert import InventoryAlert

__all__ = [
    "User",
    "Product",
    "ProductVariant",
    "Cart",
    "Wishlist",
    "UserSizingOffset",
    "ChatMessage",
    "Order",
    "OrderItem",
    "Review",
    "ReviewImage",
    "RecentlyViewed",
    "InventoryAlert",
]