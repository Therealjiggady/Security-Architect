import tkinter as tk
from tkinter import messagebox

class TipsApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Clover Line - Help & Tips")
        self.root.geometry("400x300")

        # Title Label
        tk.Label(root, text="👚 Help Center", font=("Arial", 18)).pack(pady=20)

        # Buttons
        tk.Button(root, text="Clothing Care Tips", command=self.show_care_tips, width=25).pack(pady=10)
        tk.Button(root, text="Size Guide Info", command=self.show_size_guide, width=25).pack(pady=10)
        tk.Button(root, text="Shipping FAQs", command=self.show_shipping_faqs, width=25).pack(pady=10)

    def show_care_tips(self):
        tips = (
            "🧼 Clothing Care Tips:\n\n"
            "- Wash in cold water to prevent shrinkage.\n"
            "- Hang dry or tumble dry on low.\n"
            "- Avoid bleach or harsh detergents.\n"
            "- Iron inside out if needed.\n"
            "- Store in a cool, dry place."
        )
        messagebox.showinfo("Care Tips", tips)

    def show_size_guide(self):
        guide = (
            "📏 Size Guide Info:\n\n"
            "- XS: Bust 30–32\" | Waist 24–26\"\n"
            "- S: Bust 32–34\" | Waist 26–28\"\n"
            "- M: Bust 34–36\" | Waist 28–30\"\n"
            "- L: Bust 36–38\" | Waist 30–32\"\n"
            "- XL: Bust 38–40\" | Waist 32–34\"\n\n"
            "Use the size recommender tool for best fit!"
        )
        messagebox.showinfo("Size Guide", guide)

    def show_shipping_faqs(self):
        faqs = (
            "🚚 Shipping FAQs:\n\n"
            "- Standard shipping: 5–7 business days.\n"
            "- Tracking numbers are emailed after order ships.\n"
            "- Free shipping on orders over $50.\n"
            "- Need help? Contact support via our Help Form."
        )
        messagebox.showinfo("Shipping Info", faqs)

# Run the app
if __name__ == "__main__":
    root = tk.Tk()
    app = TipsApp(root)
    root.mainloop()
