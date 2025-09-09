import tkinter as tk
from tkinter import messagebox, filedialog

class WishlistApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Clover Line Wishlist")
        self.root.geometry("500x400")

        # Available items to add
        self.items = [
            "Black Biker Shorts",
            "Sky Blue Sports Bra",
            "Olive Scrubs Set",
            "Dad Hat - Sand",
            "Women's Scrubs Set",
            "Activewear Hoodie"
        ]

        # Wishlist list
        self.wishlist = []

        # Widgets
        self.create_widgets()

    def create_widgets(self):
        # Title
        tk.Label(self.root, text="📝 Add Items to Your Wishlist", font=("Arial", 16)).pack(pady=10)

        # Dropdown
        self.selected_item = tk.StringVar()
        self.selected_item.set(self.items[0])
        self.dropdown = tk.OptionMenu(self.root, self.selected_item, *self.items)
        self.dropdown.pack(pady=5)

        # Add Button
        tk.Button(self.root, text="Add to Wishlist", command=self.add_to_wishlist, bg="#90ee90").pack(pady=5)

        # View Wishlist Button
        tk.Button(self.root, text="View Wishlist", command=self.view_wishlist).pack(pady=5)

        # Save Button
        tk.Button(self.root, text="Save Wishlist to File", command=self.save_wishlist).pack(pady=10)

        # Wishlist Display
        self.wishlist_display = tk.Text(self.root, height=10, width=50)
        self.wishlist_display.pack(pady=10)

    def add_to_wishlist(self):
        item = self.selected_item.get()
        if item not in self.wishlist:
            self.wishlist.append(item)
            messagebox.showinfo("Added", f"'{item}' has been added to your wishlist.")
        else:
            messagebox.showinfo("Already Added", f"'{item}' is already in your wishlist.")

    def view_wishlist(self):
        self.wishlist_display.delete(1.0, tk.END)
        if not self.wishlist:
            self.wishlist_display.insert(tk.END, "Your wishlist is empty.\n")
        else:
            self.wishlist_display.insert(tk.END, "Your Wishlist:\n\n")
            for i, item in enumerate(self.wishlist, start=1):
                self.wishlist_display.insert(tk.END, f"{i}. {item}\n")

    def save_wishlist(self):
        if not self.wishlist:
            messagebox.showwarning("Empty", "Your wishlist is empty. Add items first.")
            return

        file_path = filedialog.asksaveasfilename(defaultextension=".txt",
                                                 filetypes=[("Text files", "*.txt")],
                                                 title="Save Wishlist As")
        if file_path:
            with open(file_path, "w") as f:
                f.write("Your Wishlist:\n\n")
                for item in self.wishlist:
                    f.write(f"- {item}\n")
            messagebox.showinfo("Saved", f"Wishlist saved to {file_path}")

# Run the app
if __name__ == "__main__":
    root = tk.Tk()
    app = WishlistApp(root)
    root.mainloop()
