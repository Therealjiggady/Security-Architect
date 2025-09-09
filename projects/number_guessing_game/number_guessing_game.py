8
import random

# Random number between 1 and 10
secret_number = random.randint(1, 10)

print("Welcome to the Number Guessing Game!")
print("Guess a number between 1 and 10.")

guess=None

while True:
    guess = input("Enter your guess: ")

    # Check if input is a number
    if not guess.isdigit():
        print("Please enter a valid number.")
        continue

    guess = int(guess)

    # Check if number is between 1 and 10
    if guess < 1 or guess > 10:
        print("Number must be between 1 and 10.")
        continue

    # Check the guess
    if guess < secret_number:
        print("Too low!")
    elif guess > secret_number:
        print("Too high!")
    else:
        print("Correct! You win!")
        break
