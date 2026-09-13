export function ProductCatalog({ products, search, category, onSearch, onCategory, onAdd }) {
  const categories = ["All", "Phone", "Laptop", "Tablet"];
  return (
    <section aria-labelledby="products-title">
      <div className="catalog-toolbar">
        <h2 id="products-title">Products</h2>
        <label className="search-label">
          <span className="sr-only">Search products</span>
          <input placeholder="Search phones, laptops, tablets..." value={search}
            onChange={(event) => onSearch(event.target.value)} />
        </label>
      </div>
      <div className="categories" aria-label="Product categories">
        {categories.map((name) => (
          <button key={name} className={category === name ? "active" : "secondary"}
            onClick={() => onCategory(name)}>{name}</button>
        ))}
      </div>
      {products.length === 0 ? (
        <p className="empty-state">No products match your search.</p>
      ) : (
        <div className="products">
          {products.map((product) => (
            <article key={product.id}>
              <span className="badge">{product.category}</span>
              <h3>{product.name}</h3>
              <p>{product.brand}</p>
              <strong className="price">${Number(product.price).toFixed(2)}</strong>
              <button onClick={() => onAdd(product)}>Add to Cart</button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
