const CART_LIMIT = 10;
const TAX_RATE = 0.08;

function calculateSubtotal(price, quantity) {
    return price * quantity;
}

const price = 10;
const quantity = 2;
const subtotal = calculateSubtotal(price, quantity);
console.log(subtotal);
document.getElementById('subtotal').innerText = 'Subtotal: ' + subtotal;