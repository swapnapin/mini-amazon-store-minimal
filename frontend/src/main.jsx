import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/products")
      .then(r => r.json())
      .then(setProducts)
      .catch(() => alert("Could not connect Python API"));
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main>
      <h1>🛒 Mini Amazon Store</h1>
      <input
        placeholder="Search mobiles..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <section>
        {filtered.map(p => (
          <article key={p.id}>
            <h2>{p.name}</h2>
            <p>{p.brand}</p>
            <strong>${p.price}</strong>
            <button>Add to Cart</button>
          </article>
        ))}
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
