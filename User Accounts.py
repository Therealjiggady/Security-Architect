import tkinter as tk
from tkinter import messagebox
import csv
import os

CSV_FILE = "user_profiles.csv"
FIELDNAMES = ["name", "email", "password", "orders"]

class UserProfileApp:
    def __init__(self, root):
        self.root = root
        self.root.title("User Profiles - Clover Line")
        self.root.geometry("500x400")

        self.name_var = tk.StringVar()
        self.email_var = tk.StringVar()
        self.password_var = tk.StringVar()
        self.order_var = tk.StringVar()

        tk.Label(root, text="👤 Create / Load User", font=("Helvetica", 16)).pack(pady=10)
        tk.Label(root, text="Name").pack()
        tk.Entry(root, textvariable=self.name_var).pack()

        tk.Label(root, text="Email").pack()
        tk.Entry(root, textvariable=self.email_var).pack()

        tk.Label(root, text="Password").pack()
        tk.Entry(root, textvariable=self.password_var, show="*").pack()

        tk.Label(root, text="New Order (optional)").pack()
        tk.Entry(root, textvariable=self.order_var).pack()

        tk.Button(root, text="Create / Save Profile", command=self.save_profile).pack(pady=5)
        tk.Button(root, text="Load Profile & Show Orders", command=self.load_profile).pack(pady=5)

    def save_profile(self):
        name = self.name_var.get().strip()
        email = self.email_var.get().strip().lower()
        password = self.password_var.get().strip()
        order = self.order_var.get().strip()

        if not name or not email or not password:
            messagebox.showerror("Error", "Please fill in all fields.")
            return

        profiles = self.load_profiles()

        # Check if profile exists
        updated = False
        for p in profiles:
            if p["email"] == email:
                if p["password"] != password:
                    messagebox.showerror("Error", "Incorrect password for this user.")
                    return
                if order:
                    p["orders"] += f"; {order}"
                updated = True
                break

        if not updated:
            profiles.append({
                "name": name,
                "email": email,
                "password": password,
                "orders": order
            })

        # Save to CSV
        with open(CSV_FILE, "w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
            writer.writeheader()
            writer.writerows(profiles)

        messagebox.showinfo("Success", "Profile saved!")

    def load_profile(self):
        email = self.email_var.get().strip().lower()
        password = self.password_var.get().strip()

        if not email or not password:
            messagebox.showerror("Error", "Enter email and password.")
            return

        profiles = self.load_profiles()

        for p in profiles:
            if p["email"] == email:
                if p["password"] != password:
                    messagebox.showerror("Error", "Incorrect password.")
                    return
                orders = p["orders"] or "No orders yet."
                messagebox.showinfo("Order History", f"Orders for {p['name']}:\n\n{orders}")
                return

        messagebox.showerror("Error", "User not found.")

    def load_profiles(self):
        if not os.path.exists(CSV_FILE):
            return []

        with open(CSV_FILE, "r", newline="") as f:
            reader = csv.DictReader(f)
            return list(reader)

# Run app
if __name__ == "__main__":
    root = tk.Tk()
    app = UserProfileApp(root)
    root.mainloop()
