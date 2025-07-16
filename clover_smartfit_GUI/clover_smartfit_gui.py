import tkinter as tk
from tkinter import ttk, messagebox
import csv

root = tk.Tk()
root.title("Clover SmartFit GUI")
root.geometry("500x700")

# Variables
bust = tk.StringVar()
waist = tk.StringVar()
hips = tk.StringVar()
inseam = tk.StringVar()
product_type = tk.StringVar()
activity = tk.StringVar()
biker_length = tk.StringVar()
scrubs_fit = tk.StringVar()
layers = tk.BooleanVar()
sports_bra_padding = tk.StringVar()
recommendation_text = tk.StringVar()

# Function Definitions
def get_recommendation():
    try:
        bust_val = float(bust.get())
        waist_val = float(waist.get())
        hips_val = float(hips.get())
        inseam_val = float(inseam.get())
        product = product_type.get()
        act = activity.get()

        tip = ""
        size = "Medium"

        if product == "Biker Shorts":
            if biker_length.get() == "Below-Knee":
                tip += "Below-knee is best for cycling.\n"
            elif biker_length.get() == "Mid-Thigh":
                tip += "Mid-thigh works great for workouts.\n"

            if inseam_val < 25:
                size = "Small"
            elif inseam_val > 32:
                size = "Large"

        elif product == "Scrubs":
            adjustment = 0
            fit = scrubs_fit.get()
            if fit == "Slim":
                adjustment -= 1
            elif fit == "Baggy":
                adjustment += 1
            if layers.get():
                adjustment += 1

            if adjustment <= -1:
                size = "Small"
            elif adjustment >= 1:
                size = "Large"

            tip += f"Adjusted for {fit} fit.\n"
            if layers.get():
                tip += "Sized up for layering.\n"

        elif product == "Sports Bra":
            padded = sports_bra_padding.get()
            if padded == "Padded" and bust_val > 36:
                tip += "Padded offers more support for larger busts.\n"

            if bust_val <= 32:
                size = "Small"
            elif bust_val > 38:
                size = "Large"

        else:
            messagebox.showerror("Error", "Select a valid product type")
            return

        result = f"Recommended Size: {size}\nActivity: {act}\n{tip}"
        recommendation_text.set(result)

    except ValueError:
        messagebox.showerror("Input Error", "Please enter valid numbers for measurements.")

def save_to_csv():
    try:
        with open("recommendations.csv", "a", newline="") as file:
            writer = csv.writer(file)
            writer.writerow([
                bust.get(), waist.get(), hips.get(), inseam.get(), product_type.get(),
                activity.get(), biker_length.get(), scrubs_fit.get(), layers.get(),
                sports_bra_padding.get(), recommendation_text.get()
            ])
        messagebox.showinfo("Saved", "Recommendation saved to CSV!")
    except Exception as e:
        messagebox.showerror("Save Error", str(e))

def reset_form():
    bust.set("")
    waist.set("")
    hips.set("")
    inseam.set("")
    product_type.set("")
    activity.set("")
    biker_length.set("")
    scrubs_fit.set("")
    layers.set(False)
    sports_bra_padding.set("")
    recommendation_text.set("")
    update_dynamic_fields()

def update_dynamic_fields(event=None):
    for widget in dynamic_frame.winfo_children():
        widget.destroy()

    if product_type.get() == "Biker Shorts":
        ttk.Label(dynamic_frame, text="Length Preference:").pack()
        ttk.Combobox(dynamic_frame, textvariable=biker_length, values=["Mid-Thigh", "Above-Knee", "Below-Knee"]).pack()
    elif product_type.get() == "Scrubs":
        ttk.Label(dynamic_frame, text="Fit Preference:").pack()
        ttk.Combobox(dynamic_frame, textvariable=scrubs_fit, values=["Slim", "Loose", "Baggy"]).pack()
        ttk.Checkbutton(dynamic_frame, text="Do you wear layers?", variable=layers).pack()
    elif product_type.get() == "Sports Bra":
        ttk.Label(dynamic_frame, text="Padding Preference:").pack()
        ttk.Radiobutton(dynamic_frame, text="Padded", variable=sports_bra_padding, value="Padded").pack()
        ttk.Radiobutton(dynamic_frame, text="Unpadded", variable=sports_bra_padding, value="Unpadded").pack()

# Build GUI
frame = tk.Frame(root)
frame.pack(pady=10)

tk.Label(frame, text="Bust").pack()
tk.Entry(frame, textvariable=bust).pack()

tk.Label(frame, text="Waist").pack()
tk.Entry(frame, textvariable=waist).pack()

tk.Label(frame, text="Hips").pack()
tk.Entry(frame, textvariable=hips).pack()

tk.Label(frame, text="Inseam").pack()
tk.Entry(frame, textvariable=inseam).pack()

tk.Label(frame, text="Product Type").pack()
product_combo = ttk.Combobox(frame, textvariable=product_type, values=["Biker Shorts", "Scrubs", "Sports Bra"])
product_combo.pack()
product_combo.bind("<<ComboboxSelected>>", update_dynamic_fields)

tk.Label(frame, text="Activity").pack()
ttk.Combobox(frame, textvariable=activity, values=["Yoga", "Running", "Medical Work"]).pack()

dynamic_frame = tk.Frame(frame)
dynamic_frame.pack(pady=10)

tk.Button(frame, text="Get Recommendation", command=get_recommendation).pack(pady=5)
tk.Button(frame, text="Save to CSV", command=save_to_csv).pack(pady=5)
tk.Button(frame, text="Reset", command=reset_form).pack(pady=5)

tk.Label(frame, textvariable=recommendation_text, wraplength=450, justify="left").pack(pady=10)

root.mainloop()
import tkinter as tk
from tkinter import ttk, messagebox
import csv

root = tk.Tk()
root.title("Clover SmartFit GUI")
root.geometry("500x700")

# Variables
bust = tk.StringVar()
waist = tk.StringVar()
hips = tk.StringVar()
inseam = tk.StringVar()
product_type = tk.StringVar()
activity = tk.StringVar()
biker_length = tk.StringVar()
scrubs_fit = tk.StringVar()
layers = tk.BooleanVar()
sports_bra_padding = tk.StringVar()
recommendation_text = tk.StringVar()

# Function Definitions
def get_recommendation():
    try:
        bust_val = float(bust.get())
        waist_val = float(waist.get())
        hips_val = float(hips.get())
        inseam_val = float(inseam.get())
        product = product_type.get()
        act = activity.get()

        tip = ""
        size = "Medium"

        if product == "Biker Shorts":
            if biker_length.get() == "Below-Knee":
                tip += "Below-knee is best for cycling.\n"
            elif biker_length.get() == "Mid-Thigh":
                tip += "Mid-thigh works great for workouts.\n"

            if inseam_val < 25:
                size = "Small"
            elif inseam_val > 32:
                size = "Large"

        elif product == "Scrubs":
            adjustment = 0
            fit = scrubs_fit.get()
            if fit == "Slim":
                adjustment -= 1
            elif fit == "Baggy":
                adjustment += 1
            if layers.get():
                adjustment += 1

            if adjustment <= -1:
                size = "Small"
            elif adjustment >= 1:
                size = "Large"

            tip += f"Adjusted for {fit} fit.\n"
            if layers.get():
                tip += "Sized up for layering.\n"

        elif product == "Sports Bra":
            padded = sports_bra_padding.get()
            if padded == "Padded" and bust_val > 36:
                tip += "Padded offers more support for larger busts.\n"

            if bust_val <= 32:
                size = "Small"
            elif bust_val > 38:
                size = "Large"

        else:
            messagebox.showerror("Error", "Select a valid product type")
            return

        result = f"Recommended Size: {size}\nActivity: {act}\n{tip}"
        recommendation_text.set(result)

    except ValueError:
        messagebox.showerror("Input Error", "Please enter valid numbers for measurements.")

def save_to_csv():
    try:
        with open("recommendations.csv", "a", newline="") as file:
            writer = csv.writer(file)
            writer.writerow([
                bust.get(), waist.get(), hips.get(), inseam.get(), product_type.get(),
                activity.get(), biker_length.get(), scrubs_fit.get(), layers.get(),
                sports_bra_padding.get(), recommendation_text.get()
            ])
        messagebox.showinfo("Saved", "Recommendation saved to CSV!")
    except Exception as e:
        messagebox.showerror("Save Error", str(e))

def reset_form():
    bust.set("")
    waist.set("")
    hips.set("")
    inseam.set("")
    product_type.set("")
    activity.set("")
    biker_length.set("")
    scrubs_fit.set("")
    layers.set(False)
    sports_bra_padding.set("")
    recommendation_text.set("")
    update_dynamic_fields()

def update_dynamic_fields(event=None):
    for widget in dynamic_frame.winfo_children():
        widget.destroy()

    if product_type.get() == "Biker Shorts":
        ttk.Label(dynamic_frame, text="Length Preference:").pack()
        ttk.Combobox(dynamic_frame, textvariable=biker_length, values=["Mid-Thigh", "Above-Knee", "Below-Knee"]).pack()
    elif product_type.get() == "Scrubs":
        ttk.Label(dynamic_frame, text="Fit Preference:").pack()
        ttk.Combobox(dynamic_frame, textvariable=scrubs_fit, values=["Slim", "Loose", "Baggy"]).pack()
        ttk.Checkbutton(dynamic_frame, text="Do you wear layers?", variable=layers).pack()
    elif product_type.get() == "Sports Bra":
        ttk.Label(dynamic_frame, text="Padding Preference:").pack()
        ttk.Radiobutton(dynamic_frame, text="Padded", variable=sports_bra_padding, value="Padded").pack()
        ttk.Radiobutton(dynamic_frame, text="Unpadded", variable=sports_bra_padding, value="Unpadded").pack()

# Build GUI
frame = tk.Frame(root)
frame.pack(pady=10)

tk.Label(frame, text="Bust").pack()
tk.Entry(frame, textvariable=bust).pack()

tk.Label(frame, text="Waist").pack()
tk.Entry(frame, textvariable=waist).pack()

tk.Label(frame, text="Hips").pack()
tk.Entry(frame, textvariable=hips).pack()

tk.Label(frame, text="Inseam").pack()
tk.Entry(frame, textvariable=inseam).pack()

tk.Label(frame, text="Product Type").pack()
product_combo = ttk.Combobox(frame, textvariable=product_type, values=["Biker Shorts", "Scrubs", "Sports Bra"])
product_combo.pack()
product_combo.bind("<<ComboboxSelected>>", update_dynamic_fields)

tk.Label(frame, text="Activity").pack()
ttk.Combobox(frame, textvariable=activity, values=["Yoga", "Running", "Medical Work"]).pack()

dynamic_frame = tk.Frame(frame)
dynamic_frame.pack(pady=10)

tk.Button(frame, text="Get Recommendation", command=get_recommendation).pack(pady=5)
tk.Button(frame, text="Save to CSV", command=save_to_csv).pack(pady=5)
tk.Button(frame, text="Reset", command=reset_form).pack(pady=5)

tk.Label(frame, textvariable=recommendation_text, wraplength=450, justify="left").pack(pady=10)

root.mainloop()
