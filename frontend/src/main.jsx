import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";


function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);

  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const validUsername = "testuser";
  const validPassword = "Test@123";


  // Login
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

        alert("Could not record login.");

      }

    } else {

      alert("Invalid username or password.");

    }
  };


  // Get products from FastAPI
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
            ? {
                ...item,
                quantity: item.quantity + amount
              }
            : item
        )
        .filter(item => item.quantity > 0)
    );

  };


  // Search and category filter
  const filtered = products.filter(p => {

    const matchesSearch =
      p.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      p.brand
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      p.category === category;

    return matchesSearch && matchesCategory;

  });


  // Cart count
  const cartCount = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );


  // Cart total
  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );


  return (
    <main>


      {/* Header */}

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


      {/* Login */}

      {!loggedIn ? (

        <div className="login-section">

          <h2>
            🔐 Login
          </h2>


          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e =>
              setUsername(e.target.value)
            }
          />


          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e =>
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


          {/* Welcome */}

          <div className="welcome-section">

            <h2>
              Welcome, {username}! 👋
            </h2>


            <button
              onClick={() => {
                setLoggedIn(false);
                setPassword("");
                setSelectedProduct(null);
              }}
            >
              Logout
            </button>

          </div>


          {/* Search */}

          <input
            placeholder="Search phones, laptops, tablets..."
            value={search}
            onChange={e =>
              setSearch(e.target.value)
            }
          />


          {/* Categories */}

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


          {/* Product Details */}

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
                  `The ${selectedProduct.brand} ${selectedProduct.name} is a
                  high-quality ${selectedProduct.category} designed for
                  excellent performance and everyday use.`}
              </p>


              <h3>
                Specifications
              </h3>


              <ul>

                <li>
                  Display:
                  {" "}
                  {selectedProduct.display ||
                    "6.1 inch"}
                </li>


                <li>
                  Storage:
                  {" "}
                  {selectedProduct.storage ||
                    "128 GB"}
                </li>


                <li>
                  RAM:
                  {" "}
                  {selectedProduct.ram ||
                    "8 GB"}
                </li>


                <li>
                  Camera:
                  {" "}
                  {selectedProduct.camera ||
                    "48 MP"}
                </li>


                <li>
                  Battery:
                  {" "}
                  {selectedProduct.battery ||
                    "4000 mAh"}
                </li>


                <li>
                  Color:
                  {" "}
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


          {/* Products + Cart */}

          <div className="store-layout">


            {/* Products */}

            <section className="products">

              {filtered.map(p => (

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


            {/* Shopping Cart */}

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


                  {cart.map(item => (

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
                        {(item.price *
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


                  <div className="cart-total">

                    <h2>
                      Cart Total
                    </h2>


                    <h2>
                      $
                      {cartTotal.toFixed(2)}
                    </h2>


                    <button
                      className="checkout-button"
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