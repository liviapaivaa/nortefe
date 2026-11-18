import { useState } from "react";

import { useOrders } from "../context/OrderContext";
import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";
import { useEstablishments } from "../context/EstablishmentContext";

function Merchant() {
  const { orders, updateOrderStatus, updateOrder } = useOrders();

  const { user } = useAuth();

  const { createEstablishment, updateEstablishment, getEstablishmentByOwner } =
    useEstablishments();

  const {
    products,
    addProduct,
    updateProduct,
    removeProduct,
    toggleAvailability,
  } = useProducts();

  const merchantStore = getEstablishmentByOwner(user.id);

  const merchantProducts = merchantStore
    ? products.filter((product) => product.storeId === merchantStore.id)
    : [];

  const emptyStoreForm = {
    name: "",
    category: "Restaurante",
    description: "",
    contact: "",
    address: "",
    openingHours: "",
    serviceRegion: "",
  };

  const emptyProductForm = {
    name: "",
    description: "",
    category: "",
    price: "",
    promotion: "",
    image: "",
  };

  const [storeForm, setStoreForm] = useState(emptyStoreForm);
  const [editingStore, setEditingStore] = useState(false);

  const [productForm, setProductForm] = useState(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState(null);

  const merchantOrders = merchantStore
    ? orders.filter((order) => order.storeId === merchantStore.id)
    : [];

  const activeOrders = merchantOrders.filter((order) =>
    ["confirmed", "preparing", "ready"].includes(order.status),
  );

  function statusLabel(status) {
    const labels = {
      confirmed: "Pedido confirmado",
      preparing: "Em preparo",
      ready: "Pronto",
      delivery: "Saiu para entrega",
      completed: "Concluído",
      rejected: "Pedido recusado",
    };

    return labels[status] || status;
  }

  function acceptOrder(orderId) {
    const prepTime = prompt(
      "Informe o tempo estimado de preparo em minutos:",
      "30",
    );

    if (!prepTime) {
      return;
    }

    updateOrder(orderId, {
      status: "preparing",
      estimatedPrepTime: Number(prepTime),
    });
  }

  function rejectOrder(orderId) {
    const confirmed = window.confirm(
      "Tem certeza que deseja recusar este pedido?",
    );

    if (!confirmed) {
      return;
    }

    updateOrder(orderId, {
      status: "rejected",
    });
  }

  function handleStoreChange(event) {
    const { name, value } = event.target;

    setStoreForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function validateStoreForm() {
    if (
      !storeForm.name ||
      !storeForm.category ||
      !storeForm.contact ||
      !storeForm.address ||
      !storeForm.openingHours ||
      !storeForm.serviceRegion
    ) {
      alert("Preencha os campos obrigatórios do estabelecimento.");
      return false;
    }

    return true;
  }

  function handleStoreSubmit(event) {
    event.preventDefault();

    if (!validateStoreForm()) {
      return;
    }

    createEstablishment({
      ownerId: user.id,
      name: storeForm.name,
      category: storeForm.category,
      description: storeForm.description,
      contact: storeForm.contact,
      address: storeForm.address,
      openingHours: storeForm.openingHours,
      serviceRegion: storeForm.serviceRegion,
    });

    setStoreForm(emptyStoreForm);
  }

  function startEditingStore() {
    if (!merchantStore) {
      return;
    }

    setStoreForm({
      name: merchantStore.name || "",
      category: merchantStore.category || "Restaurante",
      description: merchantStore.description || "",
      contact: merchantStore.contact || "",
      address: merchantStore.address || "",
      openingHours: merchantStore.openingHours || "",
      serviceRegion: merchantStore.serviceRegion || "",
    });

    setEditingStore(true);
  }

  function cancelEditingStore() {
    setEditingStore(false);
    setStoreForm(emptyStoreForm);
  }

  function handleStoreUpdate(event) {
    event.preventDefault();

    if (!merchantStore || !validateStoreForm()) {
      return;
    }

    updateEstablishment(merchantStore.id, {
      name: storeForm.name,
      category: storeForm.category,
      description: storeForm.description,
      contact: storeForm.contact,
      address: storeForm.address,
      openingHours: storeForm.openingHours,
      serviceRegion: storeForm.serviceRegion,
    });

    setEditingStore(false);
  }

  function handleProductChange(event) {
    const { name, value } = event.target;

    setProductForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  function handleProductSubmit(event) {
    event.preventDefault();

    if (
      !merchantStore ||
      !productForm.name ||
      !productForm.category ||
      !productForm.price
    ) {
      alert("Preencha nome, categoria e preço do produto.");
      return;
    }

    const productData = {
      name: productForm.name,
      description: productForm.description,
      category: productForm.category,
      price: Number(productForm.price),
      promotion: productForm.promotion,
      image: productForm.image,
      available: true,
      storeId: merchantStore.id,
    };

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: productData.name,
        description: productData.description,
        category: productData.category,
        price: productData.price,
        promotion: productData.promotion,
        image: productData.image,
      });

      setEditingProductId(null);
    } else {
      addProduct(productData);
    }

    setProductForm(emptyProductForm);
  }

  function startEditingProduct(product) {
    setEditingProductId(product.id);

    setProductForm({
      name: product.name || "",
      description: product.description || "",
      category: product.category || "",
      price: product.price ?? "",
      promotion: product.promotion || "",
      image: product.image || "",
    });
  }

  function cancelEditingProduct() {
    setEditingProductId(null);
    setProductForm(emptyProductForm);
  }

  function deleteProduct(productId) {
    const confirmed = window.confirm("Deseja remover este produto?");

    if (!confirmed) {
      return;
    }

    removeProduct(productId);

    if (editingProductId === productId) {
      cancelEditingProduct();
    }
  }

  return (
    <div className="app">
      <main className="merchant-page">
        <div className="merchant-header">
          <div>
            <h1>Painel do comerciante</h1>
            <p>Gerencie seu estabelecimento, produtos e pedidos.</p>
          </div>
        </div>

        {!merchantStore ? (
          <section className="merchant-store-register">
            <h2>Cadastre seu estabelecimento</h2>

            <p>
              Após o cadastro, o estabelecimento deverá ser aprovado pela
              administração.
            </p>

            <form onSubmit={handleStoreSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Nome do estabelecimento *"
                value={storeForm.name}
                onChange={handleStoreChange}
                required
              />

              <select
                name="category"
                value={storeForm.category}
                onChange={handleStoreChange}
              >
                <option value="Restaurante">Restaurante</option>
                <option value="Supermercado">Supermercado</option>
                <option value="Farmácia">Farmácia</option>
                <option value="Feira Local">Feira Local</option>
                <option value="Loja">Loja</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Padaria">Padaria</option>
              </select>

              <textarea
                name="description"
                placeholder="Descrição do estabelecimento"
                value={storeForm.description}
                onChange={handleStoreChange}
              />

              <input
                type="text"
                name="contact"
                placeholder="Contato / telefone *"
                value={storeForm.contact}
                onChange={handleStoreChange}
                required
              />

              <input
                type="text"
                name="address"
                placeholder="Endereço do estabelecimento *"
                value={storeForm.address}
                onChange={handleStoreChange}
                required
              />

              <input
                type="text"
                name="openingHours"
                placeholder="Horário. Ex: 08:00 - 22:00 *"
                value={storeForm.openingHours}
                onChange={handleStoreChange}
                required
              />

              <input
                type="text"
                name="serviceRegion"
                placeholder="Região atendida. Ex: Centro, São João *"
                value={storeForm.serviceRegion}
                onChange={handleStoreChange}
                required
              />

              <button type="submit">Cadastrar estabelecimento</button>
            </form>
          </section>
        ) : (
          <>
            <section className="merchant-store-info">
              {merchantStore.active === false && (
                <div className="merchant-ready-message">
                  ⏳ Estabelecimento aguardando aprovação da administração.
                </div>
              )}

              {!editingStore ? (
                <>
                  <span>Meu estabelecimento</span>
                  <h2>{merchantStore.name}</h2>
                  <p>{merchantStore.category}</p>

                  {merchantStore.description && (
                    <small>{merchantStore.description}</small>
                  )}

                  {merchantStore.contact && (
                    <small>Contato: {merchantStore.contact}</small>
                  )}

                  {merchantStore.address && (
                    <small>Endereço: {merchantStore.address}</small>
                  )}

                  {merchantStore.openingHours && (
                    <small>Horário: {merchantStore.openingHours}</small>
                  )}

                  {merchantStore.serviceRegion && (
                    <small>
                      Região atendida: {merchantStore.serviceRegion}
                    </small>
                  )}

                  <button
                    type="button"
                    className="merchant-edit-store-button"
                    onClick={startEditingStore}
                  >
                    Editar estabelecimento
                  </button>
                </>
              ) : (
                <form
                  className="merchant-store-edit-form"
                  onSubmit={handleStoreUpdate}
                >
                  <h2>Editar estabelecimento</h2>

                  <input
                    type="text"
                    name="name"
                    placeholder="Nome do estabelecimento"
                    value={storeForm.name}
                    onChange={handleStoreChange}
                    required
                  />

                  <select
                    name="category"
                    value={storeForm.category}
                    onChange={handleStoreChange}
                  >
                    <option value="Restaurante">Restaurante</option>
                    <option value="Supermercado">Supermercado</option>
                    <option value="Farmácia">Farmácia</option>
                    <option value="Feira Local">Feira Local</option>
                    <option value="Loja">Loja</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Padaria">Padaria</option>
                  </select>

                  <textarea
                    name="description"
                    placeholder="Descrição"
                    value={storeForm.description}
                    onChange={handleStoreChange}
                  />

                  <input
                    type="text"
                    name="contact"
                    placeholder="Contato / telefone"
                    value={storeForm.contact}
                    onChange={handleStoreChange}
                    required
                  />

                  <input
                    type="text"
                    name="address"
                    placeholder="Endereço"
                    value={storeForm.address}
                    onChange={handleStoreChange}
                    required
                  />

                  <input
                    type="text"
                    name="openingHours"
                    placeholder="Horário"
                    value={storeForm.openingHours}
                    onChange={handleStoreChange}
                    required
                  />

                  <input
                    type="text"
                    name="serviceRegion"
                    placeholder="Região atendida"
                    value={storeForm.serviceRegion}
                    onChange={handleStoreChange}
                    required
                  />

                  <div className="merchant-store-edit-actions">
                    <button type="submit">Salvar alterações</button>

                    <button type="button" onClick={cancelEditingStore}>
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </section>

            <div className="merchant-summary">
              <div className="merchant-summary-card">
                <span>Pedidos ativos</span>
                <strong>{activeOrders.length}</strong>
              </div>

              <div className="merchant-summary-card">
                <span>Total de pedidos</span>
                <strong>{merchantOrders.length}</strong>
              </div>
            </div>

            <section className="merchant-orders-section">
              <h2>Pedidos</h2>

              {activeOrders.length === 0 ? (
                <div className="merchant-empty">
                  <span>📦</span>
                  <h3>Nenhum pedido ativo</h3>
                  <p>Os novos pedidos deste estabelecimento aparecerão aqui.</p>
                </div>
              ) : (
                <div className="merchant-orders-list">
                  {activeOrders.map((order) => (
                    <div key={order.id} className="merchant-order-card">
                      <div className="merchant-order-top">
                        <div>
                          <strong>Pedido #{order.number}</strong>
                          <span>{statusLabel(order.status)}</span>
                        </div>

                        <strong>
                          R${" "}
                          {Number(order.total || 0)
                            .toFixed(2)
                            .replace(".", ",")}
                        </strong>
                      </div>

                      <div className="merchant-order-items">
                        {(order.items || []).map((item) => (
                          <div key={item.id} className="merchant-order-item">
                            <span>
                              {item.quantity}x {item.name}
                            </span>

                            <span>
                              R${" "}
                              {(item.price * item.quantity)
                                .toFixed(2)
                                .replace(".", ",")}
                            </span>
                          </div>
                        ))}
                      </div>

                      {order.observation && (
                        <div className="merchant-order-observation">
                          <strong>📝 Observação do cliente</strong>
                          <p>{order.observation}</p>
                        </div>
                      )}

                      <div className="merchant-order-address">
                        <strong>Entrega:</strong>

                        <span>
                          {order.address?.street}
                          {order.address?.number
                            ? `, ${order.address.number}`
                            : ""}
                        </span>

                        {order.address?.reference && (
                          <small>Referência: {order.address.reference}</small>
                        )}
                      </div>

                      {order.estimatedPrepTime && (
                        <div className="merchant-prep-time">
                          ⏱ Tempo estimado de preparo:
                          <strong> {order.estimatedPrepTime} minutos</strong>
                        </div>
                      )}

                      <div className="merchant-order-actions">
                        {order.status === "confirmed" && (
                          <div className="merchant-confirm-actions">
                            <button
                              type="button"
                              className="merchant-accept-button"
                              onClick={() => acceptOrder(order.id)}
                            >
                              Aceitar pedido
                            </button>

                            <button
                              type="button"
                              className="merchant-reject-button"
                              onClick={() => rejectOrder(order.id)}
                            >
                              Recusar pedido
                            </button>
                          </div>
                        )}

                        {order.status === "preparing" && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, "ready")}
                          >
                            Marcar como pronto
                          </button>
                        )}

                        {order.status === "ready" && (
                          <div className="merchant-ready-message">
                            ✓ Pedido aguardando entregador
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="merchant-products-section">
              <h2>Produtos</h2>

              <form
                className="merchant-product-form"
                onSubmit={handleProductSubmit}
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Nome do produto"
                  value={productForm.name}
                  onChange={handleProductChange}
                  required
                />

                <textarea
                  name="description"
                  placeholder="Descrição do produto"
                  value={productForm.description}
                  onChange={handleProductChange}
                />

                <select
                  name="category"
                  value={productForm.category}
                  onChange={handleProductChange}
                  required
                >
                  <option value="">Selecione a categoria</option>
                  <option value="Refeições">Refeições</option>
                  <option value="Lanches">Lanches</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Doces">Doces</option>
                  <option value="Mercado">Mercado</option>
                  <option value="Farmácia">Farmácia</option>
                  <option value="Outros">Outros</option>
                </select>

                <input
                  type="number"
                  name="price"
                  step="0.01"
                  min="0"
                  placeholder="Preço"
                  value={productForm.price}
                  onChange={handleProductChange}
                  required
                />

                <input
                  type="text"
                  name="promotion"
                  placeholder="Promoção. Ex: 10% OFF"
                  value={productForm.promotion}
                  onChange={handleProductChange}
                />

                <input
                  type="url"
                  name="image"
                  placeholder="URL da imagem do produto"
                  value={productForm.image}
                  onChange={handleProductChange}
                />

                <button type="submit">
                  {editingProductId ? "Salvar alterações" : "Cadastrar produto"}
                </button>

                {editingProductId && (
                  <button type="button" onClick={cancelEditingProduct}>
                    Cancelar edição
                  </button>
                )}
              </form>

              <div className="merchant-products-list">
                {merchantProducts.length === 0 ? (
                  <div className="merchant-empty">
                    <span>🛍️</span>
                    <h3>Nenhum produto cadastrado</h3>
                    <p>Cadastre o primeiro produto do estabelecimento.</p>
                  </div>
                ) : (
                  merchantProducts.map((product) => (
                    <div className="merchant-product-card" key={product.id}>
                      <div>
                        <strong>{product.name}</strong>

                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="merchant-product-image"
                          />
                        )}

                        {product.description && (
                          <small>{product.description}</small>
                        )}

                        {product.category && (
                          <small>Categoria: {product.category}</small>
                        )}

                        <span>
                          R${" "}
                          {Number(product.price).toFixed(2).replace(".", ",")}
                        </span>

                        {product.promotion && (
                          <strong className="merchant-product-promotion">
                            🔥 {product.promotion}
                          </strong>
                        )}

                        <small>
                          {product.available ? "Disponível" : "Indisponível"}
                        </small>
                      </div>

                      <div className="merchant-product-actions">
                        <button
                          type="button"
                          onClick={() => startEditingProduct(product)}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleAvailability(product.id)}
                        >
                          {product.available ? "Desativar" : "Ativar"}
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteProduct(product.id)}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default Merchant;
