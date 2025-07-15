import datetime
import os

def get_customer_info():
    """Collect customer information"""
    print("=== ORDER FORM ===")
    print()
    
    name = input("Customer Name: ").strip()
    category = input("Category (e.g., Biker Shorts, Sports Bra, Scrubs, etc.): ").strip()
    item = input("Item: ").strip()
    size = input("Size: ").strip()
    color = input("Color: ").strip()
    quantity = input("Quantity (default 1): ").strip() or "1"
    
    try:
        quantity = int(quantity)
    except ValueError:
        quantity = 1
        print("Invalid quantity entered. Using default quantity of 1.")
    
    return {
        'name': name,
        'item': item,
        'category': category,
        'size': size,
        'color': color,
        'quantity': quantity,
        'timestamp': datetime.datetime.now()
    }

def print_order_summary(order):
    """Print formatted order summary"""
    print("\n" + "="*40)
    print("ORDER SUMMARY")
    print("="*40)
    print(f"Customer: {order['name']}")
    print(f"Category: {order['category']}")
    print(f"Item: {order['item']}")
    print(f"Size: {order['size']}")
    print(f"Color: {order['color']}")
    print(f"Quantity: {order['quantity']}")
    print(f"Order Date: {order['timestamp'].strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*40)

def save_order_to_file(order, filename="orders.txt"):
    """Save order to text file"""
    try:
        with open(filename, 'a', encoding='utf-8') as f:
            f.write(f"\n{'='*50}\n")
            f.write(f"ORDER #{order['timestamp'].strftime('%Y%m%d_%H%M%S')}\n")
            f.write(f"{'='*50}\n")
            f.write(f"Customer: {order['name']}\n")
            f.write(f"Category: {order['category']}\n")
            f.write(f"Item: {order['item']}\n")
            f.write(f"Size: {order['size']}\n")
            f.write(f"Color: {order['color']}\n")
            f.write(f"Quantity: {order['quantity']}\n")
            f.write(f"Order Date: {order['timestamp'].strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"{'='*50}\n")
        
        print(f"\n✅ Order saved to '{filename}'")
        return True
    except Exception as e:
        print(f"\n❌ Error saving order: {e}")
        return False

def view_all_orders(filename="orders.txt"):
    """View all saved orders with category filtering options"""
    try:
        if not os.path.exists(filename):
            print(f"\nNo orders file found ('{filename}').")
            return
        
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
            if not content.strip():
                print(f"\nNo orders found in '{filename}'.")
                return
        
        # Show viewing options
        print("\n" + "="*40)
        print("VIEW ORDERS")
        print("="*40)
        print("1. View All Orders")
        print("2. View by Category")
        print("3. List Available Categories")
        print("4. Back to Main Menu")
        print("="*40)
        
        choice = input("\nSelect viewing option (1-4): ").strip()
        
        if choice == '1':
            # View all orders
            print(f"\n=== ALL ORDERS FROM {filename.upper()} ===")
            print(content)
            
        elif choice == '2':
            # View by category
            category_filter = input("\nEnter category to filter by: ").strip().lower()
            if not category_filter:
                print("No category entered.")
                return
            
            filtered_orders = []
            orders = content.split("=" * 50)
            
            for order in orders:
                if order.strip() and f"category: {category_filter}" in order.lower():
                    filtered_orders.append(order)
            
            if filtered_orders:
                print(f"\n=== ORDERS IN CATEGORY: {category_filter.upper()} ===")
                for order in filtered_orders:
                    print("=" * 50 + order)
            else:
                print(f"\nNo orders found in category '{category_filter}'.")
        
        elif choice == '3':
            # List available categories
            categories = set()
            lines = content.split('\n')
            
            for line in lines:
                if line.strip().startswith('Category:'):
                    category = line.split(':', 1)[1].strip()
                    if category:
                        categories.add(category.lower())
            
            if categories:
                print(f"\n=== AVAILABLE CATEGORIES ===")
                for i, category in enumerate(sorted(categories), 1):
                    print(f"{i}. {category.title()}")
            else:
                print("\nNo categories found in orders.")
        
        elif choice == '4':
            return
        
        else:
            print("\n❌ Invalid choice. Please select 1, 2, 3, or 4.")
            
    except Exception as e:
        print(f"\n❌ Error reading orders: {e}")

def main():
    """Main program loop"""
    while True:
        print("\n" + "="*30)
        print("ORDER FORM GENERATOR")
        print("="*30)
        print("1. Create New Order")
        print("2. View All Orders")
        print("3. Exit")
        print("="*30)
        
        choice = input("\nSelect an option (1-3): ").strip()
        
        if choice == '1':
            # Create new order
            order = get_customer_info()
            
            # Validate required fields
            if not all([order['name'], order['item']]):
                print("\n❌ Name and Item are required fields!")
                continue
            
            # Print summary
            print_order_summary(order)
            
            # Ask if user wants to save
            save_choice = input("\nSave this order? (y/n): ").strip().lower()
            if save_choice in ['y', 'yes']:
                save_order_to_file(order)
            
        elif choice == '2':
            # View all orders
            view_all_orders()
            
        elif choice == '3':
            print("\nThank you for using Order Form Generator!")
            break
            
        else:
            print("\n❌ Invalid choice. Please select 1, 2, or 3.")

if __name__ == "__main__":
    main()
    # Clover Line E-Commerce App
# Master Python File (all modules integrated)

# You can copy modules from each individual file into this script to build a complete app.
# Starting template:

# Imports
import tkinter as tk
from tkinter import messagebox, ttk

# Data and Global Variables
products = [
    {"name": "High-Waist Biker Shorts", "category": "Biker Shorts", "price": 35, "popularity": 4},
    {"name": "Slim Scrubs Set", "category": "Scrubs", "price": 50, "popularity": 5},
    {"name": "Padded Sports Bra", "category": "Sports Bras", "price": 30, "popularity": 3},
]

wishlist = []
cart = {}

# Functions

def filter_and_sort():
    category = category_filter.get()
    sort_key = sort_option.get()

    filtered = [p for p in products if category == "All" or p["category"] == category]
    sorted_products = sorted(filtered, key=lambda x: x[sort_key.lower()], reverse=(sort_key != "price"))

    listbox.delete(0, tk.END)
    for p in sorted_products:
        listbox.insert(tk.END, f"{p['name']} - ${p['price']}")

def add_to_wishlist():
    item = product_entry.get()
    if item:
        wishlist.append(item)
        wishlist_listbox.insert(tk.END, item)
        product_entry.delete(0, tk.END)

def add_to_cart():
    item = cart_item_entry.get()
    price = cart_price_entry.get()
    if item and price:
        try:
            cart[item] = float(price)
            update_cart()
        except ValueError:
            messagebox.showerror("Invalid Input", "Price must be a number")

def update_cart():
    cart_listbox.delete(0, tk.END)
    for item, price in cart.items():
        cart_listbox.insert(tk.END, f"{item} - ${price:.2f}")
    total_label.config(text=f"Total: ${sum(cart.values()):.2f}")

# GUI Setup
root = tk.Tk()
root.title("Clover Line - E-Commerce GUI")

# Product Catalog
tk.Label(root, text="\nProduct Catalog").pack()
category_filter = tk.StringVar(value="All")
sort_option = tk.StringVar(value="price")

ttk.Combobox(root, textvariable=category_filter, values=["All", "Biker Shorts", "Scrubs", "Sports Bras"]).pack()
ttk.Combobox(root, textvariable=sort_option, values=["price", "popularity"]).pack()
tk.Button(root, text="Apply Filter", command=filter_and_sort).pack()

listbox = tk.Listbox(root, width=50)
listbox.pack()

# Wishlist
tk.Label(root, text="\nAdd to Wishlist").pack()
product_entry = tk.Entry(root)
product_entry.pack()
tk.Button(root, text="Add", command=add_to_wishlist).pack()
wishlist_listbox = tk.Listbox(root)
wishlist_listbox.pack()

# Cart System
tk.Label(root, text="\nShopping Cart").pack()
cart_item_entry = tk.Entry(root)
cart_item_entry.pack()
cart_price_entry = tk.Entry(root)
cart_price_entry.pack()
tk.Button(root, text="Add to Cart", command=add_to_cart).pack()

cart_listbox = tk.Listbox(root)
cart_listbox.pack()
total_label = tk.Label(root, text="Total: $0.00")
total_label.pack()

# Start
filter_and_sort()
root.mainloop()
