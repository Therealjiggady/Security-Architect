import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import csv
import os
import re
from datetime import datetime

class ClothingSizeApp:
    """GUI application to recommend clothing sizes based on user input."""
    def __init__(self, root):
        """Initialize the main application window and variables."""
        self.root = root
        self.root.title("Clothing Size Recommendation System")
        self.root.geometry("600x780")
        self.root.resizable(True, True)
        
        # Variables
        self.bust_var = tk.StringVar()
        self.waist_var = tk.StringVar()
        self.hips_var = tk.StringVar()
        self.inseam_var = tk.StringVar()
        self.height_var = tk.StringVar()
        self.weight_var = tk.StringVar()
        self.product_var = tk.StringVar()
        self.activity_var = tk.StringVar()
        
        # Product-specific variables
        self.length_var = tk.StringVar()
        self.fit_var = tk.StringVar()
        self.layers_var = tk.BooleanVar()
        self.padding_var = tk.StringVar()
        
        # Result variable
        self.recommendation = ""
        
        self.setup_ui()
        
    def setup_ui(self):
        """Build the GUI layout including all input fields and buttons."""
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Title
        title_label = ttk.Label(main_frame, text="Clothing Size Recommendation System", 
                               font=('Arial', 16, 'bold'))
        title_label.grid(row=0, column=0, columnspan=2, pady=(0, 20))
        
        # Basic measurements section
        measurements_frame = ttk.LabelFrame(main_frame, text="Body Measurements (inches)", padding="10")
        measurements_frame.grid(row=1, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=(0, 10))
        
        ttk.Label(measurements_frame, text="Bust:").grid(row=0, column=0, sticky=tk.W, padx=(0, 10))
        ttk.Entry(measurements_frame, textvariable=self.bust_var, width=15).grid(row=0, column=1, sticky=tk.W)
        
        ttk.Label(measurements_frame, text="Waist:").grid(row=1, column=0, sticky=tk.W, padx=(0, 10), pady=(5, 0))
        ttk.Entry(measurements_frame, textvariable=self.waist_var, width=15).grid(row=1, column=1, sticky=tk.W, pady=(5, 0))
        
        ttk.Label(measurements_frame, text="Hips:").grid(row=2, column=0, sticky=tk.W, padx=(0, 10), pady=(5, 0))
        ttk.Entry(measurements_frame, textvariable=self.hips_var, width=15).grid(row=2, column=1, sticky=tk.W, pady=(5, 0))
        
        ttk.Label(measurements_frame, text="Inseam:").grid(row=3, column=0, sticky=tk.W, padx=(0, 10), pady=(5, 0))
        ttk.Entry(measurements_frame, textvariable=self.inseam_var, width=15).grid(row=3, column=1, sticky=tk.W, pady=(5, 0))
        
        ttk.Separator(measurements_frame, orient=tk.HORIZONTAL).grid(row=4, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=10)
        
        ttk.Label(measurements_frame, text="Height (e.g., 5'8):").grid(row=5, column=0, sticky=tk.W, padx=(0, 10))
        ttk.Entry(measurements_frame, textvariable=self.height_var, width=15).grid(row=5, column=1, sticky=tk.W)
        
        ttk.Label(measurements_frame, text="Weight (pounds):").grid(row=6, column=0, sticky=tk.W, padx=(0, 10), pady=(5, 0))
        ttk.Entry(measurements_frame, textvariable=self.weight_var, width=15).grid(row=6, column=1, sticky=tk.W, pady=(5, 0))
        
        # Product selection section
        product_frame = ttk.LabelFrame(main_frame, text="Product Information", padding="10")
        product_frame.grid(row=2, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=(0, 10))
        
        ttk.Label(product_frame, text="Product Type:").grid(row=0, column=0, sticky=tk.W, padx=(0, 10))
        product_combo = ttk.Combobox(product_frame, textvariable=self.product_var, 
                                   values=["Biker Shorts", "Scrubs", "Sports Bra"], 
                                   state="readonly", width=20)
        product_combo.grid(row=0, column=1, sticky=tk.W)
        product_combo.bind('<<ComboboxSelected>>', self.on_product_change)
        
        ttk.Label(product_frame, text="Activity Type:").grid(row=1, column=0, sticky=tk.W, padx=(0, 10), pady=(5, 0))
        activity_combo = ttk.Combobox(product_frame, textvariable=self.activity_var,
                                    values=["Yoga", "Running", "Medical Work", "Gym/Fitness", "Casual"],
                                    state="readonly", width=20)
        activity_combo.grid(row=1, column=1, sticky=tk.W, pady=(5, 0))
        
        # Dynamic options frame
        self.options_frame = ttk.LabelFrame(main_frame, text="Product Options", padding="10")
        self.options_frame.grid(row=3, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=(0, 10))
        
        # Results section
        results_frame = ttk.LabelFrame(main_frame, text="Recommendation", padding="10")
        results_frame.grid(row=4, column=0, columnspan=2, sticky=(tk.W, tk.E, tk.N, tk.S), pady=(0, 10))
        
        self.result_text = tk.Text(results_frame, height=10, width=60, wrap=tk.WORD)
        scrollbar = ttk.Scrollbar(results_frame, orient="vertical", command=self.result_text.yview)
        self.result_text.configure(yscrollcommand=scrollbar.set)
        
        self.result_text.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        scrollbar.grid(row=0, column=1, sticky=(tk.N, tk.S))
        
        # Buttons frame
        buttons_frame = ttk.Frame(main_frame)
        buttons_frame.grid(row=5, column=0, columnspan=2, pady=(10, 0))
        
        ttk.Button(buttons_frame, text="Get Recommendation", 
                  command=self.calculate_recommendation).grid(row=0, column=0, padx=(0, 10))
        ttk.Button(buttons_frame, text="Save to CSV", 
                  command=self.save_to_csv).grid(row=0, column=1, padx=(0, 10))
        ttk.Button(buttons_frame, text="Reset Form", 
                  command=self.reset_form).grid(row=0, column=2)
        
        # Configure grid weights
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(1, weight=1)
        main_frame.rowconfigure(4, weight=1)
        results_frame.columnconfigure(0, weight=1)
        results_frame.rowconfigure(0, weight=1)
        
    def on_product_change(self, event=None):
        """Dynamically show product-specific options based on selection."""
        for widget in self.options_frame.winfo_children():
            widget.destroy()
            
        product = self.product_var.get()
        
        if product == "Biker Shorts":
            ttk.Label(self.options_frame, text="Length:").grid(row=0, column=0, sticky=tk.W, padx=(0, 10))
            length_combo = ttk.Combobox(self.options_frame, textvariable=self.length_var,
                                      values=["Mid-Thigh", "Above-Knee", "Below-Knee"],
                                      state="readonly", width=15)
            length_combo.grid(row=0, column=1, sticky=tk.W)
            
        elif product == "Scrubs":
            ttk.Label(self.options_frame, text="Fit:").grid(row=0, column=0, sticky=tk.W, padx=(0, 10))
            fit_combo = ttk.Combobox(self.options_frame, textvariable=self.fit_var,
                                   values=["Slim", "Loose", "Baggy"],
                                   state="readonly", width=15)
            fit_combo.grid(row=0, column=1, sticky=tk.W)
            
            ttk.Checkbutton(self.options_frame, text="I wear layers underneath",
                          variable=self.layers_var).grid(row=1, column=0, columnspan=2, sticky=tk.W, pady=(5, 0))
            
        elif product == "Sports Bra":
            ttk.Label(self.options_frame, text="Padding:").grid(row=0, column=0, sticky=tk.W, padx=(0, 10))
            padding_combo = ttk.Combobox(self.options_frame, textvariable=self.padding_var,
                                       values=["Padded", "Unpadded"],
                                       state="readonly", width=15)
            padding_combo.grid(row=0, column=1, sticky=tk.W)
    
    def parse_height(self, height_str):
        """Convert height in format like 5'8 into total inches."""
        try:
            height_str = height_str.strip()
            # Use regex to match patterns like 6'2, 5'8, etc.
            match = re.match(r"(\d+)'(\d+)", height_str)
            if match:
                feet = int(match.group(1))
                inches = int(match.group(2))
                total_inches = feet * 12 + inches
                return total_inches
            else:
                # Try to match just feet without inches like 6' or 5
                match_feet_only = re.match(r"(\d+)'?$", height_str)
                if match_feet_only:
                    feet = int(match_feet_only.group(1))
                    return feet * 12
                else:
                    return None
        except Exception as e:
            print("Error parsing height:", e)
            return None
    
    def estimate_size_from_height_weight(self, height_str, weight):
        """Estimate clothing size using BMI from height/weight."""
        try:
            height_inches = self.parse_height(height_str)
            if height_inches is None:
                return "Unknown"
            
            height_m = height_inches * 0.0254
            weight_kg = float(weight) * 0.453592
            bmi = weight_kg / (height_m ** 2)
            if bmi < 18.5:
                return "XS"
            elif bmi < 21:
                return "S"
            elif bmi < 25:
                return "M"
            elif bmi < 29:
                return "L"
            else:
                return "XL"
        except Exception as e:
            print("Error estimating size:", e)
            return "Unknown"
    
    def validate_inputs(self):
        """Validate form inputs before generating recommendation."""
        
        bust = self.bust_var.get().strip()
        waist = self.waist_var.get().strip()
        hips = self.hips_var.get().strip()
        inseam = self.inseam_var.get().strip()
        height = self.height_var.get().strip()
        weight = self.weight_var.get().strip()
        
        # Check that either bust/waist/hips all filled or height & weight filled
        has_full_measurements = all([bust, waist, hips])
        has_height_weight = all([height, weight])
        
        if not has_full_measurements and not has_height_weight:
            messagebox.showwarning("Missing Info", "Please enter either full measurements (bust, waist, hips) OR height and weight.")
            return False
        
        # Validate numeric and positive for filled fields
        def is_positive_float(value):
            try:
                val = float(value)
                return val > 0
            except:
                return False
        
        # Validate full measurements if present
        if has_full_measurements:
            for val, name in [(bust, "Bust"), (waist, "Waist"), (hips, "Hips")]:
                if not is_positive_float(val):
                    messagebox.showerror("Invalid Input", f"Please enter a valid positive number for {name}.")
                    return False
        
        # Validate inseam if entered
        if inseam and not is_positive_float(inseam):
            messagebox.showerror("Invalid Input", "Please enter a valid positive number for Inseam.")
            return False
        
        # Validate height & weight if present
        if has_height_weight:
            # Validate height format
            if height and self.parse_height(height) is None:
                messagebox.showerror("Invalid Input", "Please enter height in format like 5'8 or 6'2.")
                return False
            
            # Validate height range (between 3' and 8' seems reasonable)
            if height:
                height_inches = self.parse_height(height)
                if height_inches and (height_inches < 36 or height_inches > 96):
                    messagebox.showerror("Invalid Input", "Height seems unrealistic. Please enter a height between 3'0 and 8'0.")
                    return False
            
            # Validate weight
            if weight and not is_positive_float(weight):
                messagebox.showerror("Invalid Input", "Please enter a valid positive number for Weight.")
                return False
        
        # Validate product and activity selections
        if not self.product_var.get():
            messagebox.showerror("Missing Information", "Please select a product type.")
            return False
            
        if not self.activity_var.get():
            messagebox.showerror("Missing Information", "Please select an activity type.")
            return False
        
        # Product-specific validation
        product = self.product_var.get()
        if product == "Biker Shorts" and not self.length_var.get():
            messagebox.showerror("Missing Information", "Please select a length for biker shorts.")
            return False
        elif product == "Scrubs" and not self.fit_var.get():
            messagebox.showerror("Missing Information", "Please select a fit for scrubs.")
            return False
        elif product == "Sports Bra" and not self.padding_var.get():
            messagebox.showerror("Missing Information", "Please select padding option for sports bra.")
            return False
        
        return True
    
    def calculate_size(self, bust, waist, hips):
        """Calculate clothing size using average of bust/waist/hips."""
        measurements = [bust, waist, hips]
        avg_measurement = sum(measurements) / len(measurements)
        
        if avg_measurement < 32:
            return "XS"
        elif avg_measurement < 36:
            return "S"
        elif avg_measurement < 40:
            return "M"
        elif avg_measurement < 44:
            return "L"
        elif avg_measurement < 48:
            return "XL"
        else:
            return "XXL"
    
    def calculate_recommendation(self):
        """Generate recommendation and display it in the result box."""
        if not self.validate_inputs():
            return
        
        # Parse inputs safely
        bust = self.bust_var.get().strip()
        waist = self.waist_var.get().strip()
        hips = self.hips_var.get().strip()
        inseam = self.inseam_var.get().strip()
        height = self.height_var.get().strip()
        weight = self.weight_var.get().strip()
        product = self.product_var.get()
        activity = self.activity_var.get()
        
        # Convert to floats where possible
        bust_val = float(bust) if bust else None
        waist_val = float(waist) if waist else None
        hips_val = float(hips) if hips else None
        inseam_val = float(inseam) if inseam else None
        weight_val = float(weight) if weight else None
        
        # Determine base size by measurements or fallback to height/weight
        if bust_val and waist_val and hips_val:
            base_size = self.calculate_size(bust_val, waist_val, hips_val)
        else:
            base_size = self.estimate_size_from_height_weight(height, weight_val)
        
        recommended_size = base_size
        
        # Build recommendation text
        recommendation_text = f"=== SIZE RECOMMENDATION ===\n\n"
        recommendation_text += f"Product: {product}\n"
        recommendation_text += f"Activity: {activity}\n"
        
        meas_list = []
        if bust_val: meas_list.append(f"Bust {bust_val}\"")
        if waist_val: meas_list.append(f"Waist {waist_val}\"")
        if hips_val: meas_list.append(f"Hips {hips_val}\"")
        if inseam_val: meas_list.append(f"Inseam {inseam_val}\"")
        if height: meas_list.append(f"Height {height}")
        if weight_val: meas_list.append(f"Weight {weight_val} lbs")
        
        recommendation_text += "Measurements: " + ", ".join(meas_list) + "\n\n"
        
        # Product-specific logic
        if product == "Scrubs":
            fit = self.fit_var.get()
            layers = self.layers_var.get()
            
            if fit == "Loose" or layers:
                # Size up for loose fit or layering
                size_map = {"XS": "S", "S": "M", "M": "L", "L": "XL", "XL": "XXL", "XXL": "XXL"}
                recommended_size = size_map.get(base_size, base_size)
            elif fit == "Slim":
                # Size down for slim fit
                size_map = {"S": "XS", "M": "S", "L": "M", "XL": "L", "XXL": "XL", "XS": "XS"}
                recommended_size = size_map.get(base_size, base_size)
            
            recommendation_text += f"Recommended Size: {recommended_size}\n"
            recommendation_text += f"Fit Style: {fit}\n"
            if layers:
                recommendation_text += "✓ Adjusted for layering\n"
            recommendation_text += "\n💡 Tip: Scrubs should allow comfortable movement during long shifts."
            
        elif product == "Sports Bra":
            padding = self.padding_var.get()
            
            recommendation_text += f"Recommended Size: {recommended_size}\n"
            recommendation_text += f"Padding: {padding}\n"
            
            if bust_val is not None:
                if bust_val >= 38 and padding == "Padded":
                    recommendation_text += "\n⚠️  Tip: For larger bust sizes, consider unpadded options for better support and comfort during high-impact activities."
                elif activity in ["Running", "Gym/Fitness"] and bust_val >= 36:
                    recommendation_text += "\n💡 Tip: For high-impact activities with your bust size, look for sports bras with additional support features."
                else:
                    recommendation_text += f"\n💡 Tip: {padding} option works well for your measurements and {activity.lower()} activities."
            else:
                recommendation_text += f"\n💡 Tip: {padding} option works well for your selected activity."
                
        elif product == "Biker Shorts":
            length = self.length_var.get()
            
            recommendation_text += f"Recommended Size: {recommended_size}\n"
            recommendation_text += f"Length: {length}\n"
            
            if length == "Mid-Thigh" and activity == "Running":
                recommendation_text += "\n💡 Tip: Mid-thigh length is perfect for running - provides good coverage without restricting movement."
            elif length == "Below-Knee" and activity == "Yoga":
                recommendation_text += "\n💡 Tip: Below-knee length offers extra coverage and is great for deeper yoga poses."
            elif length == "Above-Knee":
                recommendation_text += "\n💡 Tip: Above-knee length offers maximum freedom of movement for high-intensity activities."
            
            if inseam_val is not None and inseam_val < 28:
                recommendation_text += f"\n📏 Note: With your {inseam_val}\" inseam, consider the {length.lower()} length for optimal fit."
        
        recommendation_text += f"\n\n=== SUMMARY ===\n"
        recommendation_text += f"Final Recommendation: {recommended_size}\n"
        recommendation_text += f"Perfect for: {activity}\n"
        recommendation_text += f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        
        self.recommendation = recommendation_text
        self.result_text.delete(1.0, tk.END)
        self.result_text.insert(1.0, recommendation_text)
    
    def save_to_csv(self):
        """Export recommendation to a CSV file."""
        if not self.recommendation:
            messagebox.showwarning("No Recommendation", "Please generate a recommendation first.")
            return
        
        filename = filedialog.asksaveasfilename(
            defaultextension=".csv",
            filetypes=[("CSV files", "*.csv"), ("All files", "*.*")],
            title="Save Recommendation"
        )
        
        if filename:
            try:
                # Check if file exists to determine if we need headers
                file_exists = os.path.exists(filename)
                
                with open(filename, 'a', newline='', encoding='utf-8') as csvfile:
                    fieldnames = ['timestamp', 'product', 'activity', 'bust', 'waist', 'hips', 
                                'inseam', 'height', 'weight', 'recommended_size', 'product_options', 'full_recommendation']
                    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                    
                    if not file_exists:
                        writer.writeheader()
                    
                    # Prepare product options
                    options = ""
                    if self.product_var.get() == "Biker Shorts":
                        options = f"Length: {self.length_var.get()}"
                    elif self.product_var.get() == "Scrubs":
                        options = f"Fit: {self.fit_var.get()}, Layers: {self.layers_var.get()}"
                    elif self.product_var.get() == "Sports Bra":
                        options = f"Padding: {self.padding_var.get()}"
                    
                    # Extract recommended size from recommendation text
                    rec_size = "N/A"
                    for line in self.recommendation.split('\n'):
                        if "Recommended Size:" in line:
                            rec_size = line.split("Recommended Size:")[-1].strip()
                            break
                    
                    writer.writerow({
                        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                        'product': self.product_var.get(),
                        'activity': self.activity_var.get(),
                        'bust': self.bust_var.get(),
                        'waist': self.waist_var.get(),
                        'hips': self.hips_var.get(),
                        'inseam': self.inseam_var.get(),
                        'height': self.height_var.get(),
                        'weight': self.weight_var.get(),
                        'recommended_size': rec_size,
                        'product_options': options,
                        'full_recommendation': self.recommendation.replace('\n', ' | ')
                    })
                
                messagebox.showinfo("Success", f"Recommendation saved to {filename}")
                
            except Exception as e:
                messagebox.showerror("Error", f"Failed to save file: {str(e)}")
    
    def reset_form(self):
        """Clear all fields and reset the form to its initial state."""
        self.bust_var.set("")
        self.waist_var.set("")
        self.hips_var.set("")
        self.inseam_var.set("")
        self.height_var.set("")
        self.weight_var.set("")
        self.product_var.set("")
        self.activity_var.set("")
        self.length_var.set("")
        self.fit_var.set("")
        self.layers_var.set(False)
        self.padding_var.set("")
        
        # Clear result text
        self.result_text.delete(1.0, tk.END)
        self.recommendation = ""
        
        # Clear dynamic options
        for widget in self.options_frame.winfo_children():
            widget.destroy()

def main():
    """Run the application."""
    root = tk.Tk()
    app = ClothingSizeApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()