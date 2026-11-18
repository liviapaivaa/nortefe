import {
  Link,
  useParams
} from "react-router-dom";

import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

import { useOrders } from "../context/OrderContext";

function OrderTracking() {
  const {
    id
  } = useParams();

  const {
    getOrderById
  } = useOrders();

  const order =
    getOrderById(id);

  if (!order) {
    return (
      <div className="app">

        <Header />

        <main>

          <section className="order-not-found">

            <h1>
              Pedido não encontrado
            </h1>

            <Link
              to="/pedidos"
              className="continue-shopping"
            >
              Voltar para meus pedidos
            </Link>

          </section>

        </main>

        <BottomNav />

      </div>
    );
  }

  const statusSteps = [
    {
      id: "confirmed",
      title: "Pedido confirmado",
      description:
        "Recebemos seu pedido."
    },
    {
      id: "preparing",
      title: "Em preparo",
      description:
        "O estabelecimento está preparando seu pedido."
    },
    {
      id: "ready",
      title: "Pronto para entrega",
      description:
        "Seu pedido está pronto."
    },
    {
      id: "delivery",
      title: "Saiu para entrega",
      description:
        "O entregador está a caminho."
    },
    {
      id: "completed",
      title: "Pedido entregue",
      description:
        "Pedido finalizado."
    }
  ];

  const currentStatusIndex =
    statusSteps.findIndex(
      (step) =>
        step.id === order.status
    );

  function paymentName(method) {
    if (method === "pix") {
      return "PIX";
    }

    if (method === "card") {
      return "Cartão";
    }

    if (method === "cash") {
      return "Dinheiro";
    }

    return method;
  }

  return (
    <div className="app">

      <Header />

      <main>

        <section className="order-tracking-page">

          <div className="page-top">

            <Link
              to="/pedidos"
              className="back-button"
            >
              ←
            </Link>

            <div>

              <h1>
                Pedido #{order.number}
              </h1>

              <p>
                Acompanhe seu pedido.
              </p>

            </div>

          </div>

          <div className="order-status-box">

            <span>
              Status atual
            </span>

            <strong>
              {order.status === "rejected"
                ? "Pedido recusado"
                : statusSteps[
                    currentStatusIndex
                  ]?.title}
            </strong>

          </div>

          {order.status === "rejected" && (

            <div className="order-rejected">

              <h2>
                Pedido recusado
              </h2>

              <p>
                O estabelecimento não pôde aceitar este pedido.
              </p>

            </div>

          )}

          <section className="order-section">

            <h2>
              Acompanhamento
            </h2>

            <div className="order-timeline">

              {statusSteps.map(
                (step, index) => {

                  const completed =
                    index <=
                    currentStatusIndex;

                  return (
                    <div
                      className={
                        completed
                          ? "timeline-item completed"
                          : "timeline-item"
                      }
                      key={step.id}
                    >

                      <div className="timeline-marker">
                        {completed
                          ? "✓"
                          : index + 1}
                      </div>

                      <div className="timeline-content">

                        <strong>
                          {step.title}
                        </strong>

                        <span>
                          {step.description}
                        </span>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </section>

          <section className="order-section">

            <h2>
              Itens do pedido
            </h2>

            <div className="order-items">

              {order.items.map((item) => (

                <div
                  className="order-item"
                  key={item.id}
                >

                  <span>
                    {item.quantity}x{" "}
                    {item.name}
                  </span>

                  <strong>
                    R${" "}
                    {(
                      item.price *
                      item.quantity
                    )
                      .toFixed(2)
                      .replace(".", ",")}
                  </strong>

                </div>

              ))}

            </div>

          </section>

          {order.observation && (

            <section className="order-section">

              <h2>
                Observação
              </h2>

              <p>
                {order.observation}
              </p>

            </section>

          )}

          <section className="order-section">

            <h2>
              Entrega
            </h2>

            <div className="order-address">

              <strong>
                📍 {order.address.name}
              </strong>

              <span>
                {order.address.street},{" "}
                {order.address.number}
              </span>

              <span>
                {order.address.neighborhood}
                {" - "}
                {order.address.city}
              </span>

              {order.address.reference && (
                <small>
                  Referência:{" "}
                  {order.address.reference}
                </small>
              )}

            </div>

          </section>

          <section className="order-section">

            <h2>
              Pagamento
            </h2>

            <div className="order-payment">

              <span>
                Forma de pagamento
              </span>

              <strong>
                {paymentName(
                  order.paymentMethod
                )}
              </strong>

            </div>

          </section>

          <section className="order-section">

            <h2>
              Valores
            </h2>

            <div className="order-values">

              <div>

                <span>
                  Subtotal
                </span>

                <span>
                  R${" "}
                  {order.subtotal
                    .toFixed(2)
                    .replace(".", ",")}
                </span>

              </div>

              <div>

                <span>
                  Taxa de entrega
                </span>

                <span>
                  R${" "}
                  {order.deliveryFee
                    .toFixed(2)
                    .replace(".", ",")}
                </span>

              </div>

              <div className="order-total">

                <strong>
                  Total
                </strong>

                <strong>
                  R${" "}
                  {order.total
                    .toFixed(2)
                    .replace(".", ",")}
                </strong>

              </div>

            </div>

          </section>

          {order.status === "completed" &&
            order.deliveryConfirmation && (

              <section className="order-section">

                <h2>
                  Entrega concluída
                </h2>

                <div className="order-address">

                  <strong>
                    ✅ Pedido entregue
                  </strong>

                  <span>
                    Recebido por:{" "}
                    {
                      order
                        .deliveryConfirmation
                        .receivedBy
                    }
                  </span>

                  {order.deliveryConfirmation
                    .deliveryPersonName && (

                    <span>
                      Entregador:{" "}
                      {
                        order
                          .deliveryConfirmation
                          .deliveryPersonName
                      }
                    </span>

                  )}

                </div>

              </section>

            )}

          <Link
            to="/pedidos"
            className="order-home-button"
          >
            Ver meus pedidos
          </Link>

        </section>

      </main>

      <BottomNav />

    </div>
  );
}

export default OrderTracking;