# 🛡️DAE Projects 2025

Welcome to my **Security Architect** project! This repository brings together everything I’ve learned in **Logic 1**, **Python 1 & 2**, and **Unix 2** through a real-world simulation of a clothing brand's tech stack and support system.

## 📌 Project Summary

This project includes:
- A SmartFit clothing size recommender GUI (`clover_smartfit_GUI`)
- An order form system for customer purchases
- A FAQ pop-up tool for customer tips
- A support ticket/contact form (CSV-based)
- User profile/account data stored with file I/O
- Several backend tools, including list-based filters and recommendation logic

---

## ✅ Key Course Requirements & Features

### 🔢 Logic 1

- **✅ Crafted Algorithm**: Used a 6-step algorithm for clothing size recommendation with `if` conditions.
- **✅ Flowchart**: Built using standard symbols — Start, Process, Decision, Input/Output, End.
- **✅ Boolean Logic**: Used BMI logic (height/weight) as a Boolean trigger for size categories.
- **✅ Conditional Logic**: Integrated `if`, `elif`, `else` for size thresholds and customer filters.

### 🐍 Python 1 & 2

- **✅ Descriptive Variables**: Example — `bust_var`, `user_weight`, `size_recommendation`
- **✅ 3+ Data Types**: `str`, `float`, `list` all used across modules
- **✅ Decision Structures**: `if-else` used in form validation and size prediction
- **✅ Repetition**: `while` loop used in retry flows, `for` loop used for FAQ and data iteration
- **✅ Custom Functions**: `estimate_size_from_height_weight()` and `parse_height()` handle core logic
- **✅ List Iteration**: Loop over product sizes and FAQs
- **✅ Code Documentation**: Functions are documented with triple-quote docstrings
- **✅ Constants**: Defined file paths and unit conversions (e.g., `INCHES_TO_METERS`)
- **✅ File Operations**: Used CSV for orders, JSON for user profiles, TXT for logs
- **✅ Exception Handling**: `try-except-else-finally` blocks used in file handling

### 💻 Unix 2

- **✅ Commands Used**:
  - `mkdir`, `cp`, `mv`, `rm`, `less` — used in Unix-based development workflow
- **✅ Arguments & Options**:
  - Used flags and options with `mv -v`, `rm -r`, etc.
- **✅ Shell & Kernel Knowledge**:
  - Verified active shell with `echo $SHELL`, practiced using `zsh` and `bash`
- **✅ Custom Environment**:
  - Created an alias for launching Python GUI with `alias smartfit="python3 main.py"`

---

## 🧠 How It Works

1. User launches the GUI application.
2. They enter body measurements (bust, waist, height/weight).
3. If height & weight are provided instead of full measurements, BMI logic is used.
4. Size is calculated using custom logic and displayed.
5. Order form allows submission of a product request.
6. User can also:
   - View FAQs (via messagebox)
   - Submit help form (stored as CSV)
   - Store/load profiles and history (via JSON)

---

## 📁 Project Structure

```bash
Security-Architect/
│
├── clover_smartfit_GUI/          # GUI code for clothing size recommender
├── order_form.py                 # Order form logic and file saving
├── support_ticket_form.py        # Contact/help form saves to CSV
├── faqs_popup.py                 # Displays FAQs in messagebox
├── user_profiles.json            # Stores past user accounts
├── README.md                     # You are here!
[LinkedIn](https://www.linkedin.com/in/james-johnson-63b381367/?profileId=ACoAAFsAZk8B3pLdPd51n0dPIWEbm-1pqNeIGog)
[Github](https://therealjiggady.github.io/Security-Architect/)