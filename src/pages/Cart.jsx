import { useState } from "react";

import { Link } from "react-router-dom";

import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cart,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    totalPrice
  } = useCart();

  const [observation, setObservation] =
    useState(() => {
      return (
        localStorage.getItem(
          "nortefe-order-observation"
        ) || ""
      );
    });

  function handleObservationChange(event) {
    const value =
      event.target.value;

    setObservation(value);

    localStorage.setItem(
      "nortefe-order-observation",
      value
    );
  }

  function handleClearCart() {
    clearCart();

    setObservation("");

    localStorage.removeItem(
      "nortefe-order-observation"
    );
  }

  return (
    <div className="app">

      <Header />

      <main>

        <section className="cart-page">

          <div className="cart-page-header">

            <Link
              to="/restaurantes"
              className="back-button"
            >
              ←
            </Link>

            <h1>
              Meu carrinho
            </h1>

          </div>

          {cart.length === 0 ? (

            <div className="empty-cart">

              <span className="empty-cart-icon">
                🛒
              </span>

              <h2>
                Seu carrinho está vazio
              </h2>

              <p>
                Adicione produtos para continuar.
              </p>

              <Link
                to="/restaurantes"
                className="continue-shopping"
              >
                Explorar estabelecimentos
              </Link>

            </div>

          ) : (

            <>

              <div className="cart-items">

                {cart.map((product) => (

                  <article
                    className="cart-item"
                    key={product.id}
                  >

                    <div className="cart-item-info">

                      <h3>
                        {product.name}
                      </h3>

                      <p>
                        {product.description}
                      </p>

                      <strong>
                        R${" "}
                        {(
                          product.price *
                          product.quantity
                        )
                          .toFixed(2)
                          .replace(".", ",")}
                      </strong>

                    </div>

                    <div className="cart-actions">

                      <div className="quantity-control">

                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(
                              product.id
                            )
                          }
                        >
                          −
                        </button>

                        <span>
                          {product.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            addToCart(product)
                          }
                        >
                          +
                        </button>

                      </div>

                      <button
                        type="button"
                        className="remove-item"
                        onClick={() =>
                          removeFromCart(
                            product.id
                          )
                        }
                      >
                        Remover
                      </button>

                    </div>

                  </article>

                ))}

              </div>

              <div className="cart-observation">

                <label htmlFor="order-observation">

                  <strong>
                    Observação do pedido
                  </strong>

                  <span>
                    Opcional
                  </span>

                </label>

                <textarea
                  id="order-observation"
                  value={observation}
                  onChange={
                    handleObservationChange
                  }
                  maxLength={250}
                  placeholder="Ex.: sem cebola, retirar molho, tocar a campainha..."
                />

                <small>
                  {observation.length}/250
                </small>

              </div>

              <div className="cart-summary">

                <div className="cart-total">

                  <span>
                    Total
                  </span>

                  <strong>
                    R${" "}
                    {totalPrice
                      .toFixed(2)
                      .replace(".", ",")}
                  </strong>

                </div>

                <Link
                  to="/endereco"
                  className="checkout-button"
                >
                  Continuar pedido
                </Link>

                <button
                  type="button"
                  className="clear-cart"
                  onClick={handleClearCart}
                >
                  Limpar carrinho
                </button>

              </div>

            </>

          )}

        </section>

      </main>

      <BottomNav />

    </div>
  );
}

export default Cart;