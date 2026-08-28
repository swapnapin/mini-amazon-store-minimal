import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);

  const [showCheckout, setShowCheckout] = useState(false);

  const [paymentDetails, setPaymentDetails] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    email: ""
  });

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const validUsername = "testuser";
  const validPassword = "Test@123";

  // =========================================================
  // LOGIN
  // =========================================================

  const handleLogin = async () => {
    if (username === validUsername && password === validPassword) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/login?username=${username}`,
          {
            method: "POST"
          }
        );

        if (!response.ok) {
          throw new Error("Login recording failed");
        }

        setLoggedIn(true);

        alert("Login successful! Welcome to Mini Amazon.");
      } catch (error) {
        console.error(error);
        alert("Could not record login.");
      }
    } else {
      alert("Invalid username or password.");
    }
  };

  // =========================================================
  // GET PRODUCTS
  // =========================================================

  useEffect(() => {
    fetch("http://127.0.0.1:8000/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Products API failed");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Products:", data);
        setProducts(data);
      })
      .catch((error) => {
        console.error("API Error:", error);
        alert("Could not connect Python API");
      });
  }, []);

  // =========================================================
  // ADD TO CART
  // =========================================================

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1
        }
      ];
    });
  };

  // =========================================================
  // REMOVE FROM CART
  // =========================================================

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  };

  // =========================================================
  // CHANGE QUANTITY
  // =========================================================

  const changeQuantity = (productId, amount) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity + amount
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // =========================================================
  // SEARCH + CATEGORY
  // =========================================================

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || p.category === category;

    return matchesSearch && matchesCategory;
  });

  // =========================================================
  // CART COUNT
  // =========================================================

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // =========================================================
  // CART TOTAL
  // =========================================================

  const cartTotal = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  // =========================================================
  // OPEN CHECKOUT
  // =========================================================

  const openCheckout = () => {
  console.log("CHECKOUT CLICKED");

  if (cart.length === 0) {
    alert("Your cart is empty. Please add a product first.");
    return;
  }

  setPaymentSuccess(false);
  setShowCheckout(true);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

  // =========================================================
  // CLOSE CHECKOUT
  // =========================================================

  const closeCheckout = () => {
    setShowCheckout(false);
  };

  // =========================================================
  // PAYMENT
  // =========================================================

  const handlePayment = async (e) => {
  e.preventDefault();

  console.log("Dummy payment button clicked");

  const {
    cardName,
    cardNumber,
    expiry,
    cvv,
    email
  } = paymentDetails;

  // Validate email
  if (!email) {
    alert("Please enter your email address.");
    return;
  }

  // Validate card name
  if (!cardName) {
    alert("Please enter the name on the card.");
    return;
  }

  // Validate card number
  if (cardNumber.length !== 16) {
    alert("Please enter a 16-digit dummy card number.");
    return;
  }

  // Validate expiry
  if (!expiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
    alert("Please enter expiry in MM/YY format.");
    return;
  }

  // Validate CVV
  if (cvv.length !== 3) {
    alert("Please enter a 3-digit CVV.");
    return;
  }

  // Validate cart
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  setPaymentLoading(true);

  // Simulate payment processing
  setTimeout(() => {
    const transaction =
      "DEMO-" +
      Date.now().toString().slice(-8);

    setPaidAmount(Number(cartTotal.toFixed(2)));
    setTransactionId(transaction);

    // Show success screen
    setPaymentSuccess(true);

    // Clear cart
    setCart([]);

    setPaymentLoading(false);

    alert("Dummy payment successful!");
  }, 1500);
};

  // =========================================================
  // CONTINUE SHOPPING
  // =========================================================

  const continueShopping = () => {
    setShowCheckout(false);

    setPaymentSuccess(false);

    setPaymentDetails({
      cardName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
      email: ""
    });

    setTransactionId("");
    setPaidAmount(0);
  };

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <main>

      {/* =====================================================
          CHECKOUT
      ===================================================== */}

      {showCheckout && (
        <div className="checkout-section">

          {!paymentSuccess ? (
            <>

              <h2>💳 Demo Checkout</h2>

              <p>
                Order Total:
                <strong>
                  ${cartTotal.toFixed(2)}
                </strong>
              </p>

              <form onSubmit={handlePayment}>

                {/* EMAIL */}

                <input
                  type="email"
                  placeholder="Email for invoice"
                  value={paymentDetails.email}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      email: e.target.value
                    })
                  }
                />

                {/* CARD NAME */}

                <input
                  type="text"
                  placeholder="Name on Card"
                  value={paymentDetails.cardName}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      cardName: e.target.value
                    })
                  }
                />

                {/* CARD NUMBER */}

                <input
                  type="text"
                  placeholder="Card Number"
                  maxLength="16"
                  value={paymentDetails.cardNumber}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      cardNumber:
                        e.target.value.replace(/\D/g, "")
                    })
                  }
                />

                {/* EXPIRY */}

                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength="5"
                  value={paymentDetails.expiry}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      expiry: e.target.value
                    })
                  }
                />

                {/* CVV */}

                <input
                  type="password"
                  placeholder="CVV"
                  maxLength="3"
                  value={paymentDetails.cvv}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      cvv:
                        e.target.value.replace(/\D/g, "")
                    })
                  }
                />

                {/* PAY */}

                <button
                  type="submit"
                  disabled={paymentLoading}
                >
                  {paymentLoading
                    ? "Processing..."
                    : `Pay $${cartTotal.toFixed(2)}`}
                </button>

                {/* CANCEL */}

                <button
                  type="button"
                  onClick={closeCheckout}
                  disabled={paymentLoading}
                >
                  Cancel
                </button>

              </form>

              <p>
                <strong>Demo only:</strong>{" "}
                No real payment will be processed.
              </p>

            </>
          ) : (

            /* =================================================
               SUCCESS
            ================================================= */

            <div className="payment-success">

              <h2>
                ✅ Payment Successful!
              </h2>

              <p>
                Thank you, {username}!
              </p>

              <p>
                Amount Paid:
                <strong>
                  ${paidAmount.toFixed(2)}
                </strong>
              </p>

              <p>
                Transaction ID:
                <strong>
                  {transactionId}
                </strong>
              </p>

              <p>
                📧 Invoice sent to:
                <strong>
                  {paymentDetails.email}
                </strong>
              </p>

              <button
                type="button"
                onClick={continueShopping}
              >
                Continue Shopping
              </button>

            </div>
          )}

        </div>
      )}

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header>

        <h1>
          🛒 Mini Amazon Store
        </h1>

        {loggedIn && (
          <div className="cart">
            🛒 Cart ({cartCount})
          </div>
        )}

      </header>

      {/* =====================================================
          LOGIN
      ===================================================== */}

      {!loggedIn ? (

        <div className="login-section">

          <h2>
            🔐 Login
          </h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button onClick={handleLogin}>
            Login
          </button>

          <p>
            Demo Username:
            <strong> testuser</strong>
          </p>

          <p>
            Demo Password:
            <strong> Test@123</strong>
          </p>

        </div>

      ) : (

        <>
          {/* =================================================
              WELCOME
          ================================================= */}

          <div className="welcome-section">

            <h2>
              Welcome, {username}! 👋
            </h2>

            <button
              onClick={() => {
                setLoggedIn(false);
                setPassword("");
                setSelectedProduct(null);
                setShowCheckout(false);
              }}
            >
              Logout
            </button>

          </div>

          {/* =================================================
              SEARCH
          ================================================= */}

          <input
            placeholder="Search phones, laptops, tablets..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {/* =================================================
              CATEGORIES
          ================================================= */}

          <div className="categories">

            <button
              onClick={() =>
                setCategory("All")
              }
            >
              All
            </button>

            <button
              onClick={() =>
                setCategory("Phone")
              }
            >
              📱 Phones
            </button>

            <button
              onClick={() =>
                setCategory("Laptop")
              }
            >
              💻 Laptops
            </button>

            <button
              onClick={() =>
                setCategory("Tablet")
              }
            >
              📲 Tablets
            </button>

          </div>

          {/* =================================================
              PRODUCT DETAILS
          ================================================= */}

          {selectedProduct && (

            <div className="product-details">

              <button
                onClick={() =>
                  setSelectedProduct(null)
                }
              >
                ← Back to Products
              </button>

              <h2>
                {selectedProduct.name}
              </h2>

              <h3>
                {selectedProduct.brand}
              </h3>

              <p>
                Category:
                <strong>
                  {" "}
                  {selectedProduct.category}
                </strong>
              </p>

              <h2>
                ${selectedProduct.price}
              </h2>

              <p>
                <strong>
                  Description:
                </strong>
              </p>

              <p>
                {selectedProduct.description ||
                  `The ${selectedProduct.brand} ${selectedProduct.name} is a high-quality ${selectedProduct.category} designed for excellent performance and everyday use.`}
              </p>

              <h3>
                Specifications
              </h3>

              <ul>

                <li>
                  Display:{" "}
                  {selectedProduct.display ||
                    "6.1 inch"}
                </li>

                <li>
                  Storage:{" "}
                  {selectedProduct.storage ||
                    "128 GB"}
                </li>

                <li>
                  RAM:{" "}
                  {selectedProduct.ram ||
                    "8 GB"}
                </li>

                <li>
                  Camera:{" "}
                  {selectedProduct.camera ||
                    "48 MP"}
                </li>

                <li>
                  Battery:{" "}
                  {selectedProduct.battery ||
                    "4000 mAh"}
                </li>

                <li>
                  Color:{" "}
                  {selectedProduct.color ||
                    "Black"}
                </li>

              </ul>

              <button
                onClick={() =>
                  addToCart(selectedProduct)
                }
              >
                Add to Cart
              </button>

            </div>
          )}

          {/* =================================================
              STORE
          ================================================= */}

          <div className="store-layout">

            {/* PRODUCTS */}

            <section className="products">

              {filtered.map((p) => (

                <article key={p.id}>

                  <h2
                    onClick={() =>
                      setSelectedProduct(p)
                    }
                    style={{
                      cursor: "pointer"
                    }}
                  >
                    {p.name}
                  </h2>

                  <p>
                    {p.brand}
                  </p>

                  <p>
                    Category:
                    {" "}
                    <strong>
                      {p.category}
                    </strong>
                  </p>

                  <strong>
                    ${p.price}
                  </strong>

                  <br />

                  <button
                    onClick={() =>
                      addToCart(p)
                    }
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() =>
                      setSelectedProduct(p)
                    }
                  >
                    View Details
                  </button>

                </article>

              ))}

            </section>

            {/* =================================================
                CART
            ================================================= */}

            <aside className="cart-section">

              <h2>
                🛒 Shopping Cart ({cartCount})
              </h2>

              {cart.length === 0 ? (

                <p>
                  Your cart is empty.
                </p>

              ) : (

                <>

                  {cart.map((item) => (

                    <div
                      key={item.id}
                      className="cart-item"
                    >

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        {item.brand}
                      </p>

                      <p>
                        ${item.price}
                      </p>

                      <div className="quantity">

                        <button
                          onClick={() =>
                            changeQuantity(
                              item.id,
                              -1
                            )
                          }
                        >
                          −
                        </button>

                        <span>
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            changeQuantity(
                              item.id,
                              1
                            )
                          }
                        >
                          +
                        </button>

                      </div>

                      <p>
                        Item Total: $
                        {(
                          Number(item.price) *
                          item.quantity
                        ).toFixed(2)}
                      </p>

                      <button
                        className="remove-button"
                        onClick={() =>
                          removeFromCart(item.id)
                        }
                      >
                        Remove
                      </button>

                    </div>

                  ))}

                  {/* CART TOTAL */}

                  <div className="cart-total">

                    <h2>
                      Cart Total
                    </h2>

                    <h2>
                      $
                      {cartTotal.toFixed(2)}
                    </h2>

                    {/* CHECKOUT BUTTON */}

                    <button
                    type="button"
                    className="checkout-button"
                    onClick={openCheckout}
                  >
                    Checkout
                  </button>

                  </div>

                </>
              )}

            </aside>

          </div>

        </>
      )}

    </main>
  );
}

createRoot(
  document.getElementById("root")
).render(<App />);