import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

import { useCart } from "../context/CartContext";
import { useAddress } from "../context/AddressContext";
import { useOrders } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";

function Payment() {
  const navigate = useNavigate();

  const { createOrder } = useOrders();
  const { cart, totalPrice, clearCart } = useCart();
  const { addresses, selectedAddress } = useAddress();
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [submitting, setSubmitting] = useState(false);

  const deliveryFee = 5;
  const finalTotal = totalPrice + deliveryFee;

  const address = addresses.find(
    (item) => String(item.id) === String(selectedAddress)
  );

  async function confirmOrder() {
    if (!user) {
      alert("Você precisa entrar na sua conta para finalizar o pedido.");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      alert("Seu carrinho está vazio.");
      return;
    }

    if (!address) {
      alert("Selecione um endereço de entrega.");
      return;
    }

    if (!paymentMethod) {
      alert("Selecione uma forma de pagamento.");
      return;
    }

    setSubmitting(true);

    const observation =
      localStorage.getItem("nortefe-order-observation") || "";

    const order = await createOrder({
      userId: user.id,
      consumerId: user.id,
      customerName: user.name,
      consumerName: user.name,

      items: cart,

      storeId: cart[0].storeId,
      storeName: cart[0].storeName,

      addressId: address.id,
      deliveryAddress: address,
      address,

      paymentMethod,

      notes: observation,
      observation,

      subtotal: totalPrice,
      deliveryFee,
      total: finalTotal
    });

    setSubmitting(false);

    if (!order) {
      alert("Não foi possível registrar o pedido. Tente novamente.");
      return;
    }

    clearCart();
    localStorage.removeItem("nortefe-order-observation");

    navigate(`/pedido/${order.id}`);
  }

  return (
    <div className="app">
      <Header />

      <main>
        <section className="payment-page">
          <div className="page-top">
            <Link to="/endereco" className="back-button">
              ←
            </Link>

            <div>
              <h1>Pagamento</h1>
              <p>Escolha como deseja pagar.</p>
            </div>
          </div>

          <section className="payment-section">
            <h2>Endereço de entrega</h2>

            {address ? (
              <div className="payment-address">
                <strong>📍 {address.name}</strong>
                <span>
                  {address.street}, {address.number}
                </span>
                <span>
                  {address.neighborhood} - {address.city}
                </span>
                {address.reference && (
                  <small>Referência: {address.reference}</small>
                )}
              </div>
            ) : (
              <p>Nenhum endereço selecionado.</p>
            )}
          </section>

          <section className="payment-section">
            <h2>Forma de pagamento</h2>

            <div className="payment-methods">
              <label
                className={
                  paymentMethod === "pix"
                    ? "payment-card selected"
                    : "payment-card"
                }
              >
                <input
                  type="radio"
                  name="payment"
                  value="pix"
                  checked={paymentMethod === "pix"}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                />
                <div>
                  <strong>PIX</strong>
                  <span>Pagamento rápido e seguro</span>
                </div>
              </label>

              <label
                className={
                  paymentMethod === "card"
                    ? "payment-card selected"
                    : "payment-card"
                }
              >
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                />
                <div>
                  <strong>Cartão</strong>
                  <span>Crédito ou débito</span>
                </div>
              </label>

              <label
                className={
                  paymentMethod === "cash"
                    ? "payment-card selected"
                    : "payment-card"
                }
              >
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                />
                <div>
                  <strong>Dinheiro</strong>
                  <span>Pagamento na entrega</span>
                </div>
              </label>
            </div>
          </section>

          {localStorage.getItem("nortefe-order-observation") && (
            <section className="payment-section">
              <h2>Observação</h2>
              <p>{localStorage.getItem("nortefe-order-observation")}</p>
            </section>
          )}

          <section className="payment-section">
            <h2>Resumo do pedido</h2>

            <div className="payment-items">
              {cart.map((item) => (
                <div className="payment-item" key={item.id}>
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <strong>
                    R${" "}
                    {(item.price * item.quantity)
                      .toFixed(2)
                      .replace(".", ",")}
                  </strong>
                </div>
              ))}
            </div>

            <div className="payment-values">
              <div>
                <span>Subtotal</span>
                <span>
                  R$ {totalPrice.toFixed(2).replace(".", ",")}
                </span>
              </div>

              <div>
                <span>Taxa de entrega</span>
                <span>
                  R$ {deliveryFee.toFixed(2).replace(".", ",")}
                </span>
              </div>

              <div className="payment-total">
                <strong>Total</strong>
                <strong>
                  R$ {finalTotal.toFixed(2).replace(".", ",")}
                </strong>
              </div>
            </div>
          </section>

          <button
            type="button"
            className="confirm-order-button"
            onClick={confirmOrder}
            disabled={submitting}
          >
            {submitting ? "Confirmando pedido..." : "Confirmar pedido"}
          </button>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

export default Payment;