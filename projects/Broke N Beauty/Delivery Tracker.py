import tkinter as tk
from tkinter import ttk
from datetime import datetime, timedelta

class DeliveryEstimateApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Delivery Estimate Tool")
        self.root.geometry("400x250")
        self.root.resizable(False, False)

        # === GUI Elements ===
        title_label = ttk.Label(root, text="Delivery Date Estimator", font=("Helvetica", 16))
        title_label.pack(pady=10)

        self.days_var = tk.StringVar(value="5")  # default days

        days_frame = ttk.Frame(root)
        days_frame.pack(pady=10)
        ttk.Label(days_frame, text="Days to Deliver: ").pack(side=tk.LEFT)
        self.days_entry = ttk.Entry(days_frame, textvariable=self.days_var, width=5)
        self.days_entry.pack(side=tk.LEFT)

        estimate_btn = ttk.Button(root, text="Get Estimate", command=self.estimate_delivery)
        estimate_btn.pack(pady=10)

        self.result_label = ttk.Label(root, text="", font=("Helvetica", 12), foreground="green")
        self.result_label.pack(pady=20)

    def estimate_delivery(self):
        try:
            days = int(self.days_var.get())
            today = datetime.now()
            delivery_date = today + timedelta(days=days)
            formatted_date = delivery_date.strftime("%A, %B %d, %Y")

            self.result_label.config(text=f"Estimated Delivery: {formatted_date}")
        except ValueError:
            self.result_label.config(text="Enter a valid number of days.", foreground="red")

if __name__ == "__main__":
    root = tk.Tk()
    app = DeliveryEstimateApp(root)
    root.mainloop()
