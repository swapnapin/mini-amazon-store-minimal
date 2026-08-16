import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/products")
      .then(r => r.json())
      .then(setProducts)
      .catch(() => alert("Could not connect Python API"));
  }, []);

  // Add product to cart
  const addToCart = (product) => {
    setCart(currentCart => {
      const existingProduct = currentCart.find(
        item => item.id === product.id
      );

      if (existingProduct) {
        return currentCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCart(currentCart =>
      currentCart.filter(item => item.id !== productId)
    );
  };

  // Change quantity
  const changeQuantity = (productId, amount) => {
    setCart(currentCart =>
      currentCart
        .map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <main>

      {/* Header */}
      <header>
        <h1>🛒 Mini Amazon Store</h1>

        <div className="cart">
          🛒 Cart ({cartCount})
        </div>
      </header>

      {/* Search */}
      <input
        placeholder="Search mobiles..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Product Details */}
      {selectedProduct && (
        <div className="product-details">

          <button onClick={() => setSelectedProduct(null)}>
            ← Back to Products
          </button>

          <h2>{selectedProduct.name}</h2>

          <h3>{selectedProduct.brand}</h3>

          <h2>${selectedProduct.price}</h2>

          <p>
            <strong>Description:</strong>
          </p>

          <p>
            {selectedProduct.description ||
              `The ${selectedProduct.brand} ${selectedProduct.name} is a
              high-quality smartphone with excellent performance,
              display and camera features.`}
          </p>

          <h3>Specifications</h3>

          <ul>
            <li>Display: {selectedProduct.display || "6.1 inch"}</li>
            <li>Storage: {selectedProduct.storage || "128 GB"}</li>
            <li>RAM: {selectedProduct.ram || "8 GB"}</li>
            <li>Camera: {selectedProduct.camera || "48 MP"}</li>
            <li>Battery: {selectedProduct.battery || "4000 mAh"}</li>
            <li>Color: {selectedProduct.color || "Black"}</li>
          </ul>

          <button
            onClick={() => addToCart(selectedProduct)}
          >
            Add to Cart
          </button>

        </div>
      )}

      {/* Products */}
      {!selectedProduct && (
        <>
          <section className="products">

            {filtered.map(p => (
              <article key={p.id}>

                <h2
                  onClick={() => setSelectedProduct(p)}
                  style={{ cursor: "pointer" }}
                >
                  {p.name}
                </h2>

                <p>{p.brand}</p>

                <strong>${p.price}</strong>

                <br />

                <button
                  onClick={() => addToCart(p)}
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => setSelectedProduct(p)}
                >
                  View Details
                </button>

              </article>
            ))}

          </section>

          {/* Cart */}
          <section className="cart-section">

            <h2>🛒 Shopping Cart</h2>

            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} className="cart-item">

                    <h3>{item.name}</h3>

                    <p>${item.price}</p>

                    <div>
                      <button
                        onClick={() =>
                          changeQuantity(item.id, -1)
                        }
                      >
                        -
                      </button>

                      <span> {item.quantity} </span>

                      <button
                        onClick={() =>
                          changeQuantity(item.id, 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <p>
                      Item Total: $
                      {(item.price * item.quantity).toFixed(2)}
                    </p>

                    <button
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>

                  </div>
                ))}

                <h2>
                  Cart Total: ${cartTotal.toFixed(2)}
                </h2>
              </>
            )}

          </section>
        </>
      )}

    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);