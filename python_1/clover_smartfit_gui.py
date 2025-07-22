import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import csv
import os
from datetime import datetime

class ClothingSizeApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Clothing Size Recommendation System")
        self.root.geometry("600x700")
        self.root.resizable(True, True)
        
        # Variables
        self.bust_var = tk.StringVar()
        self.waist_var = tk.StringVar()
        self.hips_var = tk.StringVar()
        self.inseam_var = tk.StringVar()
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
        # Main frame
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
        
        self.result_text = tk.Text(results_frame, height=8, width=60, wrap=tk.WORD)
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
        # Clear previous options
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
    
    def validate_inputs(self):
        try:
            bust = float(self.bust_var.get())
            waist = float(self.waist_var.get())
            hips = float(self.hips_var.get())
            inseam = float(self.inseam_var.get())
            
            if bust <= 0 or waist <= 0 or hips <= 0 or inseam <= 0:
                raise ValueError("Measurements must be positive numbers")
                
        except ValueError:
            messagebox.showerror("Invalid Input", "Please enter valid positive numbers for all measurements.")
            return False
        
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
        # Basic size calculation logic
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
        if not self.validate_inputs():
            return
        
        bust = float(self.bust_var.get())
        waist = float(self.waist_var.get())
        hips = float(self.hips_var.get())
        inseam = float(self.inseam_var.get())
        product = self.product_var.get()
        activity = self.activity_var.get()
        
        # Calculate base size
        base_size = self.calculate_size(bust, waist, hips)
        recommended_size = base_size
        
        # Product-specific logic
        recommendation_text = f"=== SIZE RECOMMENDATION ===\n\n"
        recommendation_text += f"Product: {product}\n"
        recommendation_text += f"Activity: {activity}\n"
        recommendation_text += f"Measurements: Bust {bust}\", Waist {waist}\", Hips {hips}\", Inseam {inseam}\"\n\n"
        
        if product == "Scrubs":
            fit = self.fit_var.get()
            layers = self.layers_var.get()
            
            if fit == "Loose" or layers:
                # Size up for loose fit or layers
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
            
            if bust >= 38 and padding == "Padded":
                recommendation_text += "\n⚠️  Tip: For larger bust sizes, consider unpadded options for better support and comfort during high-impact activities."
            elif activity in ["Running", "Gym/Fitness"] and bust >= 36:
                recommendation_text += "\n💡 Tip: For high-impact activities with your bust size, look for sports bras with additional support features."
            else:
                recommendation_text += f"\n💡 Tip: {padding} option works well for your measurements and {activity.lower()} activities."
                
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
            
            if inseam < 28:
                recommendation_text += f"\n📏 Note: With your {inseam}\" inseam, consider the {length.lower()} length for optimal fit."
        
        recommendation_text += f"\n\n=== SUMMARY ===\n"
        recommendation_text += f"Final Recommendation: {recommended_size}\n"
        recommendation_text += f"Perfect for: {activity}\n"
        recommendation_text += f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        
        self.recommendation = recommendation_text
        self.result_text.delete(1.0, tk.END)
        self.result_text.insert(1.0, recommendation_text)
    
    def save_to_csv(self):
        if not self.recommendation:
            messagebox.showwarning("No Recommendation", "Please generate a recommendation first.")
            return
        
        filename = filedialog.asksaveasfilename(
            defaultextension=".txt",
            filetypes=[("text files", "*.txt"), ("All files", "*.*")],
            title="Save Recommendation"
        )
        
        if filename:
            try:
                # Check if file exists to determine if we need headers
                file_exists = os.path.exists(filename)
                
                with open(filename, 'a', newline='', encoding='utf-8') as csvfile:
                    fieldnames = ['timestamp', 'product', 'activity', 'bust', 'waist', 'hips', 
                                'inseam', 'recommended_size', 'product_options', 'full_recommendation']
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
                        'recommended_size': rec_size,
                        'product_options': options,
                        'full_recommendation': self.recommendation.replace('\n', ' | ')
                    })
                
                messagebox.showinfo("Success", f"Recommendation saved to {filename}")
                
            except Exception as e:
                messagebox.showerror("Error", f"Failed to save file: {str(e)}")
    
    def reset_form(self):
        # Clear all variables
        self.bust_var.set("")
        self.waist_var.set("")
        self.hips_var.set("")
        self.inseam_var.set("")
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
    root = tk.Tk()
    app = ClothingSizeApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()