import { useState } from "react";


const initialDetails = { email: "", cardName: "", cardNumber: "", expiry: "", cvv: "" };

export function Checkout({ cart, username, onPay, onClose }) {
  const [details, setDetails] = useState(initialDetails);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  function update(field, value) {
    setDetails((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await onPay({
        username,
        customer_email: details.email,
        card_name: details.cardName,
        card_number: details.cardNumber,
        expiry: details.expiry,
        cvv: details.cvv,
        items: cart.map((item) => ({ product_id: item.id, quantity: item.quantity })),
      });
      setResult(response);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="checkout-section" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
        {result ? (
          <div className="payment-success" role="status">
            <h2 id="checkout-title">Payment Successful!</h2>
            <p>Thank you, {username}. This was a demo transaction.</p>
            <dl>
              <dt>Amount Paid</dt><dd>${Number(result.amount).toFixed(2)}</dd>
              <dt>Transaction ID</dt><dd>{result.transaction_id}</dd>
              <dt>Invoice email</dt><dd>{result.email_queued ? "Queued" : "Not configured"}</dd>
            </dl>
            <button onClick={onClose}>Continue Shopping</button>
          </div>
        ) : (
          <>
            <div className="dialog-header">
              <h2 id="checkout-title">Demo Checkout</h2>
              <button className="icon-button" type="button" onClick={onClose} aria-label="Close checkout">×</button>
            </div>
            <p>Order total: <strong>${total.toFixed(2)}</strong></p>
            <form onSubmit={handleSubmit}>
              <label>Email for invoice<input type="email" value={details.email}
                onChange={(event) => update("email", event.target.value)} required /></label>
              <label>Name on Card<input value={details.cardName}
                onChange={(event) => update("cardName", event.target.value)} required /></label>
              <label>Card Number<input inputMode="numeric" autoComplete="cc-number" pattern="[0-9]{16}"
                maxLength="16" value={details.cardNumber}
                onChange={(event) => update("cardNumber", event.target.value.replace(/\D/g, ""))} required /></label>
              <div className="form-row">
                <label>Expiry (MM/YY)<input placeholder="MM/YY" pattern="(0[1-9]|1[0-2])/[0-9]{2}"
                  maxLength="5" value={details.expiry} onChange={(event) => update("expiry", event.target.value)} required /></label>
                <label>CVV<input type="password" inputMode="numeric" pattern="[0-9]{3,4}" maxLength="4"
                  value={details.cvv} onChange={(event) => update("cvv", event.target.value.replace(/\D/g, ""))} required /></label>
              </div>
              {error && <p className="error" role="alert">{error}</p>}
              <button type="submit" disabled={submitting}>{submitting ? "Processing…" : `Pay $${total.toFixed(2)}`}</button>
              <p className="hint">Demo only. No real payment will be processed.</p>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
