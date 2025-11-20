<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Day 18 – Cart Demo</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; padding: 16px; background:#0b0b0b; color:#e7e7e7; }
    .page { display:flex; gap:24px; }
    .col { flex:1; border:1px solid #333; border-radius:12px; padding:16px; }
    .title { font-weight:600; margin-bottom:12px; }

    .product-grid { display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap:12px; }
    .product-card { border:1px solid #333; border-radius:12px; padding:12px; }
    .product-card .name { font-weight:600; }
    .product-card .price { font-size:14px; color:#9aa; margin:6px 0; }

    .btn { padding:8px 12px; border-radius:10px; border:1px solid #444; background:#111; color:#eee; cursor:pointer; }
    .btn:hover { background:#161616; }

    /* highlight jersey */
    .highlight { outline:3px dashed #fff; }

    .cart-list { list-style:none; padding:0; margin:0; display:grid; gap:10px; }
    .cart-item { display:flex; justify-content:space-between; align-items:center; border:1px solid #333; border-radius:10px; padding:10px; }
    .line { font-size:14px; color:#9aa; }
    .totals { margin-top:16px; padding:12px; border:1px dashed #444; border-radius:10px; font-weight:600; }
  </style>
</head>
<body>
  <h1>Day 18 – Cart UI (Vanilla JS)</h1>

  <div class="page">
    <div class="col">
      <div class="title">Products</div>
      <div id="productGrid" class="product-grid"></div>
    </div>

    <div class="col">
      <div class="title">Cart</div>
      <ul id="cartList" class="cart-list"></ul>
      <div id="cartTotals" class="totals">Subtotal: $0.00</div>
    </div>
  </div>

  <script>
    // ✅ descriptive name
    let cartItems = [];

    // ✅ getElementById
    const productGrid = document.getElementById('productGrid');
    const cartList = document.getElementById('cartList');
    const cartTotals = document.getElementById('cartTotals');

    // some demo products
    const products = [
      { id:1, name:'BnB Sport Bra – Black', price_cents:1199 },
      { id:2, name:'BnB Biker Short – Navy', price_cents: 999 },
      { id:3, name:'BnB Unisex Scrub Top',   price_cents:3399 },
      { id:4, name:'BnB Jacket – Olive',     price_cents:4999 }
    ];

    function renderProducts(){
      productGrid.innerHTML = '';
      products.forEach(p=>{
        const card = document.createElement('div');
        card.className = 'product-card';
        card.id = 'product-' + p.id;  // used for highlight
        card.innerHTML = `
          <div class="name">${p.name}</div>
          <div class="price">$${(p.price_cents/100).toFixed(2)}</div>
          <button class="btn add-btn" data-id="${p.id}">Add to Cart</button>
        `;
        productGrid.appendChild(card);
      });

      // ✅ getElementsByClassName
      const addButtons = document.getElementsByClassName('add-btn');
      for (let i=0; i<addButtons.length; i++){
        addButtons[i].addEventListener('click', e=>{
          const id = Number(e.currentTarget.getAttribute('data-id'));
          addToCart(id);
        });
      }

      // ✅ getElementsByTagName
      const allButtons = document.getElementsByTagName('button');
      for (let i=0; i<allButtons.length; i++){
        allButtons[i].title = 'Click to perform an action';
      }
    }

    // ✅ array iteration to render cart
    function renderCart(){
      cartList.innerHTML = '';
      let subtotal = 0;
      cartItems.forEach(item=>{
        const line = item.price_cents * item.qty;
        subtotal += line;

        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `
          <div>
            <div><strong>${item.name}</strong></div>
            <div class="line">${item.qty} × $${(item.price_cents/100).toFixed(2)}</div>
          </div>
          <div>$${(line/100).toFixed(2)}</div>
        `;
        cartList.appendChild(li);
      });
      cartTotals.textContent = 'Subtotal: $' + (subtotal/100).toFixed(2);
    }

    function addToCart(productId){
      const p = products.find(x=>x.id===productId);
      const found = cartItems.find(x=>x.id===productId);
      if (found) found.qty += 1; else cartItems.push({ ...p, qty: 1 });
      renderCart();

      // ✅ dynamic CSS add/remove class
      const card = document.getElementById('product-' + productId);
      if (card){
        card.classList.add('highlight');
        setTimeout(()=> card.classList.remove('highlight'), 800);
      }
    }

    renderProducts();
    renderCart();
  </script>
</body>
</html>
