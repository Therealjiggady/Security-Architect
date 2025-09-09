import tkinter as tk
from tkinter import messagebox
import csv
import os
from datetime import datetime

# === Constants ===
CSV_FILE = "support_tickets.csv"

class ContactFormApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Contact / Help Form")
        self.root.geometry("500x500")

        # Form Fields
        tk.Label(root, text="📬 Contact Support", font=("Arial", 18)).pack(pady=10)

        tk.Label(root, text="Name").pack()
        self.name_entry = tk.Entry(root, width=40)
        self.name_entry.pack(pady=5)

        tk.Label(root, text="Email").pack()
        self.email_entry = tk.Entry(root, width=40)
        self.email_entry.pack(pady=5)

        tk.Label(root, text="Subject").pack()
        self.subject_entry = tk.Entry(root, width=40)
        self.subject_entry.pack(pady=5)

        tk.Label(root, text="Message").pack()
        self.message_text = tk.Text(root, width=45, height=10)
        self.message_text.pack(pady=10)

        tk.Button(root, text="Submit", command=self.submit_ticket, bg="#87CEEB").pack(pady=10)

    def submit_ticket(self):
        name = self.name_entry.get().strip()
        email = self.email_entry.get().strip()
        subject = self.subject_entry.get().strip()
        message = self.message_text.get("1.0", tk.END).strip()
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        if not name or not email or not subject or not message:
            messagebox.showerror("Missing Info", "Please fill out all fields.")
            return

        # Save to CSV
        file_exists = os.path.isfile(CSV_FILE)
        with open(CSV_FILE, "a", newline="") as file:
            writer = csv.writer(file)
            if not file_exists:
                writer.writerow(["Timestamp", "Name", "Email", "Subject", "Message"])
            writer.writerow([timestamp, name, email, subject, message])

        messagebox.showinfo("Submitted", "Your message has been submitted. We'll be in touch!")
        self.clear_form()

    def clear_form(self):
        self.name_entry.delete(0, tk.END)
        self.email_entry.delete(0, tk.END)
        self.subject_entry.delete(0, tk.END)
        self.message_text.delete("1.0", tk.END)

# Run the app
if __name__ == "__main__":
    root = tk.Tk()
    app = ContactFormApp(root)
    root.mainloop()
