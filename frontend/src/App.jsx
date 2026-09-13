import { useEffect, useMemo, useState } from "react";

import { Cart } from "./components/Cart";
import { Checkout } from "./components/Checkout";
import { LoginForm } from "./components/LoginForm";
import { ProductCatalog } from "./components/ProductCatalog";
import { api } from "./services/api";


export default function App() {
  const [products, setProducts] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [username, setUsername] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    api.getProducts(controller.signal).then(setProducts).catch((error) => {
      if (error.name !== "AbortError") setLoadError(error.message);
    });
    return () => controller.abort();
  }, []);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((product) =>
      (category === "All" || product.category === category) &&
      (!term || product.name.toLowerCase().includes(term) || product.brand.toLowerCase().includes(term))
    );
  }, [products, search, category]);

  async function login(name, password) {
    const response = await api.login(name, password);
    setUsername(response.username);
  }

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      return existing
        ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { ...product, quantity: 1 }];
    });
  }

  function changeQuantity(productId, amount) {
    setCart((current) => current.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + amount } : item
    ).filter((item) => item.quantity > 0));
  }

  async function pay(payload) {
    const result = await api.checkout(payload);
    setCart([]);
    return result;
  }

  function logout() {
    setUsername("");
    setCart([]);
    setShowCheckout(false);
  }

  return (
    <>
      <header className="site-header">
        <div className="container header-content">
          <h1>Mini Amazon Store</h1>
          {username && <button className="secondary" onClick={logout}>Logout</button>}
        </div>
      </header>
      <main className="container">
        {loadError && <p className="error api-error" role="alert">Could not load products: {loadError}</p>}
        {!username ? <LoginForm onLogin={login} /> : (
          <>
            <div className="welcome"><h2>Welcome, {username}!</h2></div>
            <div className="store-layout">
              <ProductCatalog products={filteredProducts} search={search} category={category}
                onSearch={setSearch} onCategory={setCategory} onAdd={addToCart} />
              <Cart cart={cart} onChangeQuantity={changeQuantity}
                onRemove={(id) => setCart((current) => current.filter((item) => item.id !== id))}
                onCheckout={() => setShowCheckout(true)} />
            </div>
          </>
        )}
      </main>
      {showCheckout && <Checkout cart={cart} username={username} onPay={pay}
        onClose={() => setShowCheckout(false)} />}
    </>
  );
}
