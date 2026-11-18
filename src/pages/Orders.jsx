import { Link } from "react-router-dom";

import { useOrders } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";

import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

function Orders() {
  const { orders } = useOrders();

  const { user } = useAuth();

  const userOrders = orders.filter(
    (order) =>
      !order.consumerId ||
      order.consumerId === user?.id
  );

  function statusName(status) {
    const names = {
      confirmed: "Pedido confirmado",
      preparing: "Em preparo",
      ready: "Pronto para entrega",
      delivery: "Saiu para entrega",
      completed: "Entregue",
      rejected: "Recusado"
    };

    return names[status] || status;
  }

  function formatDate(date) {
    if (!date) {
      return "Data não informada";
    }

    return new Date(date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }
    );
  }

  function formatMoney(value) {
    return Number(value || 0)
      .toFixed(2)
      .replace(".", ",");
  }

  return (
    <div className="app">

      <Header />

      <main>

        <section className="orders-page">

          <div className="page-top">

            <Link
              to="/"
              className="back-button"
            >
              ←
            </Link>

            <div>

              <h1>
                Meus pedidos
              </h1>

              <p>
                Consulte seus pedidos e acompanhe
                cada etapa da entrega.
              </p>

            </div>

          </div>

          {userOrders.length === 0 ? (

            <div className="empty-orders">

              <span>
                📦
              </span>

              <h2>
                Nenhum pedido ainda
              </h2>

              <p>
                Seus pedidos aparecerão aqui.
              </p>

              <Link
                to="/restaurantes"
                className="continue-shopping"
              >
                Fazer pedido
              </Link>

            </div>

          ) : (

            <div className="orders-history">

              {userOrders.map((order) => (

                <article
                  className="history-order-card"
                  key={order.id}
                >

                  <div className="history-order-header">

                    <div className="history-order-meta">

                      <div>

                        <span>
                          PEDIDO REALIZADO
                        </span>

                        <strong>
                          {formatDate(
                            order.createdAt
                          )}
                        </strong>

                      </div>

                      <div>

                        <span>
                          TOTAL
                        </span>

                        <strong>
                          R${" "}
                          {formatMoney(
                            order.total
                          )}
                        </strong>

                      </div>

                      <div>

                        <span>
                          PEDIDO Nº
                        </span>

                        <strong>
                          #{order.number}
                        </strong>

                      </div>

                    </div>

                    <span
                      className={`history-order-status status-${order.status}`}
                    >
                      {statusName(
                        order.status
                      )}
                    </span>

                  </div>

                  <div className="history-order-body">

                    <div className="history-order-main">

                      <div className="history-store">

                        <span>
                          Estabelecimento
                        </span>

                        <h2>
                          {order.storeName ||
                            "Estabelecimento"}
                        </h2>

                      </div>

                      <div className="history-items">

                        <strong>
                          Itens do pedido
                        </strong>

                        {order.items.map(
                          (item) => (

                            <div
                              className="history-item"
                              key={item.id}
                            >

                              <span>
                                {item.quantity}x{" "}
                                {item.name}
                              </span>

                              <span>
                                R${" "}
                                {formatMoney(
                                  item.price *
                                    item.quantity
                                )}
                              </span>

                            </div>

                          )
                        )}

                      </div>

                      {order.observation && (

                        <div className="history-observation">

                          <strong>
                            📝 Observação
                          </strong>

                          <p>
                            {order.observation}
                          </p>

                        </div>

                      )}

                      {order.address && (

                        <div className="history-address">

                          <strong>
                            📍 Entregar em
                          </strong>

                          <span>
                            {order.address.name}
                          </span>

                          <span>
                            {order.address.street},{" "}
                            {order.address.number}
                          </span>

                          <span>
                            {
                              order.address
                                .neighborhood
                            }
                            {" - "}
                            {order.address.city}
                          </span>

                          {order.address
                            .reference && (

                            <small>
                              Referência:{" "}
                              {
                                order.address
                                  .reference
                              }
                            </small>

                          )}

                        </div>

                      )}

                    </div>

                    <div className="history-order-actions">

                      <Link
                        to={`/pedido/${order.id}`}
                        className="history-track-button"
                      >
                        {order.status ===
                        "completed"
                          ? "Ver detalhes"
                          : "Acompanhar pedido"}
                      </Link>

                      {order.status ===
                        "completed" && (

                        <span className="history-completed-message">
                          ✓ Pedido entregue
                        </span>

                      )}

                      {order.status ===
                        "rejected" && (

                        <span className="history-rejected-message">
                          Pedido recusado pelo
                          estabelecimento
                        </span>

                      )}

                    </div>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </main>

      <BottomNav />

    </div>
  );
}

export default Orders;