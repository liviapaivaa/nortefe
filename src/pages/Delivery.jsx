import { useOrders } from "../context/OrderContext";

import { useAuth } from "../context/AuthContext";

function Delivery() {
  const { orders, updateOrder } = useOrders();

  const { user } = useAuth();

  const availableOrders = orders.filter(
    (order) => order.status === "ready"
  );

  const activeDeliveries = orders.filter(
    (order) =>
      order.status === "delivery" &&
      order.deliveryPersonId === user.id
  );

  function acceptDelivery(orderId) {
    const confirmed = window.confirm(
      "Deseja aceitar esta entrega?"
    );

    if (!confirmed) {
      return;
    }

    updateOrder(orderId, {
      status: "delivery",

      deliveryPersonId: user.id,

      deliveryPersonName: user.name,

      acceptedDeliveryAt:
        new Date().toISOString()
    });
  }

  function completeDelivery(order) {
    const receivedBy = window.prompt(
      "Informe o nome da pessoa que recebeu o pedido:"
    );

    if (!receivedBy) {
      alert(
        "Informe quem recebeu o pedido para confirmar a entrega."
      );

      return;
    }

    const recipientName =
      receivedBy.trim();

    if (!recipientName) {
      alert(
        "Informe um nome válido."
      );

      return;
    }

    const confirmed =
      window.confirm(
        `Confirmar entrega do pedido #${order.number}?\n\n` +
        `Recebido por: ${recipientName}\n` +
        `Entregador: ${user.name}\n\n` +
        "Após confirmar, o pedido será marcado como entregue."
      );

    if (!confirmed) {
      return;
    }

    const deliveredAt =
      new Date().toISOString();

    updateOrder(order.id, {
      status: "completed",

      deliveredAt,

      deliveryConfirmation: {
        receivedBy: recipientName,

        deliveryPersonId:
          user.id,

        deliveryPersonName:
          user.name,

        confirmedAt:
          deliveredAt,

        orderNumber:
          order.number
      }
    });

    alert(
      `Entrega do pedido #${order.number} confirmada com sucesso.`
    );
  }

  return (
    <div className="app">

      <main className="delivery-page">

        <div className="delivery-header">

          <h1>
            Painel do entregador
          </h1>

          <p>
            Veja os pedidos disponíveis para entrega.
          </p>

        </div>

        <div className="delivery-summary">

          <div>

            <span>
              Entregas disponíveis
            </span>

            <strong>
              {availableOrders.length}
            </strong>

          </div>

          <div>

            <span>
              Minhas entregas
            </span>

            <strong>
              {activeDeliveries.length}
            </strong>

          </div>

        </div>

        <section className="delivery-orders">

          <h2>
            Pedidos disponíveis
          </h2>

          {availableOrders.length === 0 ? (

            <div className="delivery-empty">

              <p>
                Nenhuma entrega disponível no momento.
              </p>

            </div>

          ) : (

            availableOrders.map((order) => (

              <article
                className="delivery-order-card"
                key={order.id}
              >

                <div className="delivery-order-top">

                  <div>

                    <strong>
                      Pedido #{order.number}
                    </strong>

                    <span>
                      Pronto para retirada
                    </span>

                  </div>

                  <strong>
                    R${" "}
                    {order.total
                      .toFixed(2)
                      .replace(".", ",")}
                  </strong>

                </div>

                {order.storeName && (

                  <div className="delivery-order-address">

                    <strong>
                      Retirar em:
                    </strong>

                    <span>
                      {order.storeName}
                    </span>

                  </div>

                )}

                <div className="delivery-order-address">

                  <strong>
                    Entregar em:
                  </strong>

                  <span>
                    {order.address?.street}

                    {order.address?.number
                      ? `, ${order.address.number}`
                      : ""}
                  </span>

                  {order.address?.neighborhood && (

                    <span>
                      {order.address.neighborhood}
                    </span>

                  )}

                  {order.address?.reference && (

                    <small>
                      Referência:{" "}
                      {order.address.reference}
                    </small>

                  )}

                </div>

                <button
                  type="button"
                  className="delivery-accept-button"
                  onClick={() =>
                    acceptDelivery(
                      order.id
                    )
                  }
                >
                  Aceitar entrega
                </button>

              </article>

            ))

          )}

        </section>

        <section className="delivery-orders">

          <h2>
            Minhas entregas
          </h2>

          {activeDeliveries.length === 0 ? (

            <div className="delivery-empty">

              <p>
                Você ainda não possui
                uma entrega em andamento.
              </p>

            </div>

          ) : (

            activeDeliveries.map((order) => (

              <article
                className="delivery-order-card"
                key={order.id}
              >

                <div className="delivery-order-top">

                  <div>

                    <strong>
                      Pedido #{order.number}
                    </strong>

                    <span>
                      Saiu para entrega
                    </span>

                  </div>

                  <strong>
                    R${" "}
                    {order.total
                      .toFixed(2)
                      .replace(".", ",")}
                  </strong>

                </div>

                {order.storeName && (

                  <div className="delivery-order-address">

                    <strong>
                      Estabelecimento:
                    </strong>

                    <span>
                      {order.storeName}
                    </span>

                  </div>

                )}

                <div className="delivery-order-address">

                  <strong>
                    Destino:
                  </strong>

                  <span>
                    {order.address?.street}

                    {order.address?.number
                      ? `, ${order.address.number}`
                      : ""}
                  </span>

                  {order.address?.neighborhood && (

                    <span>
                      {order.address.neighborhood}
                    </span>

                  )}

                  {order.address?.reference && (

                    <small>
                      Referência:{" "}
                      {order.address.reference}
                    </small>

                  )}

                </div>

                <div className="delivery-active-message">

                  🛵 Entrega em andamento

                </div>

                <div className="delivery-security-info">

                  <strong>
                    🔒 Confirmação de entrega
                  </strong>

                  <span>
                    Ao concluir, informe o nome
                    da pessoa que recebeu o pedido.
                  </span>

                  <small>
                    A confirmação será registrada
                    com entregador, data e horário.
                  </small>

                </div>

                <button
                  type="button"
                  className="delivery-complete-button"
                  onClick={() =>
                    completeDelivery(order)
                  }
                >
                  Confirmar entrega
                </button>

              </article>

            ))

          )}

        </section>

      </main>

    </div>
  );
}

export default Delivery;