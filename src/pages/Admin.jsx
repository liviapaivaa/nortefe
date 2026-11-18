import { useOrders } from "../context/OrderContext";

import { useAuth } from "../context/AuthContext";

import { useEstablishments } from "../context/EstablishmentContext";

function Admin() {
  const { orders } = useOrders();

  const { users, toggleUserStatus } = useAuth();

  const { establishments, updateEstablishment } = useEstablishments();

  const merchants = users.filter((user) => user.role === "merchant");

  const deliveryPeople = users.filter((user) => user.role === "delivery");

  const consumers = users.filter((user) => user.role === "consumer");

  const completedOrders = orders.filter(
    (order) => order.status === "completed",
  );

  const totalSales = completedOrders.reduce(
    (total, order) => total + Number(order.total || 0),
    0,
  );

  function statusLabel(status) {
    const labels = {
      confirmed: "Confirmado",
      preparing: "Em preparo",
      ready: "Pronto",
      delivery: "Em entrega",
      completed: "Concluído",
      rejected: "Recusado",
    };

    return labels[status] || status;
  }

  function roleLabel(role) {
    const roles = {
      consumer: "Consumidor",
      merchant: "Comerciante",
      delivery: "Entregador",
      admin: "Administrador",
    };

    return roles[role] || role;
  }

  function getOwner(ownerId) {
    return users.find((user) => user.id === ownerId);
  }

  function formatDate(date) {
    if (!date) {
      return "Data não informada";
    }

    return new Date(date).toLocaleDateString("pt-BR");
  }

  function toggleEstablishment(establishment) {
    const newStatus = establishment.active === false;

    const action = newStatus ? "ativar" : "desativar";

    const confirmed = window.confirm(
      `Deseja ${action} o estabelecimento "${establishment.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    updateEstablishment(establishment.id, {
      active: newStatus,
    });
  }

  function handleToggleUser(selectedUser) {
    if (selectedUser.role === "admin") {
      alert("A conta de administrador não pode ser desativada por esta tela.");

      return;
    }

    const isActive = selectedUser.active !== false;

    const action = isActive ? "desativar" : "ativar";

    const confirmed = window.confirm(
      `Deseja ${action} o usuário "${selectedUser.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    toggleUserStatus(selectedUser.id);
  }

  return (
    <div className="app">
      <main className="admin-page">
        <div className="admin-header">
          <h1>Painel administrativo</h1>

          <p>Visão geral e gerenciamento do NORTEFE.</p>
        </div>

        {/* RESUMO */}

        <div className="admin-dashboard">
          <div className="admin-card">
            <span>Pedidos</span>

            <strong>{orders.length}</strong>
          </div>

          <div className="admin-card">
            <span>Consumidores</span>

            <strong>{consumers.length}</strong>
          </div>

          <div className="admin-card">
            <span>Comerciantes</span>

            <strong>{merchants.length}</strong>
          </div>

          <div className="admin-card">
            <span>Entregadores</span>

            <strong>{deliveryPeople.length}</strong>
          </div>

          <div className="admin-card">
            <span>Estabelecimentos</span>

            <strong>{establishments.length}</strong>
          </div>

          <div className="admin-card admin-sales">
            <span>Vendas concluídas</span>

            <strong>R$ {totalSales.toFixed(2).replace(".", ",")}</strong>
          </div>
        </div>

        {/* ESTABELECIMENTOS */}

        <section className="admin-section">
          <h2>Estabelecimentos cadastrados</h2>

          {establishments.length === 0 ? (
            <p>Nenhum estabelecimento cadastrado.</p>
          ) : (
            establishments.map((establishment) => {
              const owner = getOwner(establishment.ownerId);

              const isActive = establishment.active !== false;

              return (
                <div className="admin-establishment" key={establishment.id}>
                  <div className="admin-establishment-info">
                    <strong>{establishment.name}</strong>

                    <span>Categoria: {establishment.category}</span>

                    {establishment.description && (
                      <span>{establishment.description}</span>
                    )}

                    {establishment.openingHours && (
                      <span>Horário: {establishment.openingHours}</span>
                    )}

                    {establishment.serviceRegion && (
                      <span>
                        Região atendida: {establishment.serviceRegion}
                      </span>
                    )}

                    <span>
                      Responsável: {owner ? owner.name : "Não identificado"}
                    </span>

                    {owner && <small>{owner.email}</small>}
                  </div>

                  <div className="admin-establishment-actions">
                    <span
                      className={
                        isActive
                          ? "admin-status-active"
                          : "admin-status-inactive"
                      }
                    >
                      {isActive ? "Ativo" : "Desativado"}
                    </span>

                    <button
                      type="button"
                      className="admin-action-button"
                      onClick={() => {
                        const name = window.prompt(
                          "Nome do estabelecimento:",
                          establishment.name,
                        );

                        if (!name) {
                          return;
                        }

                        const category = window.prompt(
                          "Categoria:",
                          establishment.category || "",
                        );

                        if (!category) {
                          return;
                        }

                        {
                          establishment.contact && (
                            <span>Contato: {establishment.contact}</span>
                          );
                        }

                        {
                          establishment.address && (
                            <span>Endereço: {establishment.address}</span>
                          );
                        }

                        const contact = window.prompt(
                          "Contato:",
                          establishment.contact || "",
                        );

                        const address = window.prompt(
                          "Endereço:",
                          establishment.address || "",
                        );

                        const openingHours = window.prompt(
                          "Horário de funcionamento:",
                          establishment.openingHours || "",
                        );

                        const serviceRegion = window.prompt(
                          "Região atendida:",
                          establishment.serviceRegion || "",
                        );

                        updateEstablishment(establishment.id, {
                          name,
                          category,
                          contact,
                          address,
                          openingHours,
                          serviceRegion,
                        });
                      }}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleEstablishment(establishment)}
                      className="admin-action-button"
                    >
                      {isActive ? "Desativar" : "Ativar"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </section>

        {/* PEDIDOS */}

        <section className="admin-section">
          <h2>Pedidos registrados</h2>

          {orders.length === 0 ? (
            <p>Nenhum pedido registrado.</p>
          ) : (
            orders.map((order) => (
              <div className="admin-order" key={order.id}>
                <div>
                  <strong>Pedido #{order.number}</strong>

                  <small>{formatDate(order.createdAt)}</small>

                  {order.consumerName && (
                    <span>Cliente: {order.consumerName}</span>
                  )}

                  {order.storeName && (
                    <span>Estabelecimento: {order.storeName}</span>
                  )}

                  <span>Status: {statusLabel(order.status)}</span>
                </div>

                <strong>
                  R${" "}
                  {Number(order.total || 0)
                    .toFixed(2)
                    .replace(".", ",")}
                </strong>
              </div>
            ))
          )}
        </section>

        {/* USUÁRIOS */}

        <section className="admin-section">
          <h2>Usuários cadastrados</h2>

          {users.length === 0 ? (
            <p>Nenhum usuário cadastrado.</p>
          ) : (
            users.map((registeredUser) => {
              const isActive = registeredUser.active !== false;

              return (
                <div className="admin-user" key={registeredUser.id}>
                  <div>
                    <strong>{registeredUser.name}</strong>

                    <span>{registeredUser.email}</span>

                    <small>{roleLabel(registeredUser.role)}</small>
                  </div>

                  <div className="admin-establishment-actions">
                    <span
                      className={
                        isActive
                          ? "admin-status-active"
                          : "admin-status-inactive"
                      }
                    >
                      {isActive ? "Ativo" : "Desativado"}
                    </span>

                    {registeredUser.role !== "admin" && (
                      <button
                        type="button"
                        className="admin-action-button"
                        onClick={() => handleToggleUser(registeredUser)}
                      >
                        {isActive ? "Desativar" : "Ativar"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
}

export default Admin;
