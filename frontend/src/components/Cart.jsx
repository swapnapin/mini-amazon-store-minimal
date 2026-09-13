export function Cart({ cart, onChangeQuantity, onRemove, onCheckout }) {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  return (
    <aside className="panel cart-section" aria-labelledby="cart-title">
      <h2 id="cart-title">Shopping Cart ({count})</h2>
      {cart.length === 0 ? <p>Your cart is empty.</p> : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <h3>{item.name}</h3>
              <p>${Number(item.price).toFixed(2)}</p>
              <div className="quantity">
                <button className="secondary" aria-label={`Decrease ${item.name}`}
                  onClick={() => onChangeQuantity(item.id, -1)}>−</button>
                <span aria-label="Quantity">{item.quantity}</span>
                <button className="secondary" aria-label={`Increase ${item.name}`}
                  onClick={() => onChangeQuantity(item.id, 1)}>+</button>
              </div>
              <button className="link-button" onClick={() => onRemove(item.id)}>Remove</button>
            </div>
          ))}
          <div className="cart-total">
            <span>Total</span><strong>${total.toFixed(2)}</strong>
          </div>
          <button className="checkout-button" onClick={onCheckout}>Checkout</button>
        </>
      )}
    </aside>
  );
}
