import { useState } from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import Header from "../components/Header";

import BottomNav from "../components/BottomNav";

import { useAddress } from "../context/AddressContext";

const emptyForm = {
  name: "",
  street: "",
  number: "",
  neighborhood: "",
  complement: "",
  reference: "",
  city: "Tefé - AM"
};

function Address() {
  const navigate =
    useNavigate();

  const {
    addresses,
    selectedAddress,
    setSelectedAddress,
    addAddress,
    updateAddress
  } = useAddress();

  const [showForm, setShowForm] =
    useState(false);

  const [editingAddressId, setEditingAddressId] =
    useState(null);

  const [form, setForm] =
    useState(emptyForm);

  function handleChange(event) {
    const {
      name,
      value
    } = event.target;

    setForm({
      ...form,
      [name]: value
    });
  }

  function openNewAddressForm() {
    setEditingAddressId(null);

    setForm(emptyForm);

    setShowForm(true);
  }

  function editAddress(address) {
    setEditingAddressId(address.id);

    setForm({
      name: address.name || "",
      street: address.street || "",
      number: address.number || "",
      neighborhood:
        address.neighborhood || "",
      complement:
        address.complement || "",
      reference:
        address.reference || "",
      city:
        address.city || "Tefé - AM"
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function cancelForm() {
    setShowForm(false);

    setEditingAddressId(null);

    setForm(emptyForm);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !form.name ||
      !form.street ||
      !form.number ||
      !form.neighborhood
    ) {
      alert(
        "Preencha os campos obrigatórios."
      );

      return;
    }

    if (editingAddressId) {
      updateAddress(
        editingAddressId,
        form
      );

      setSelectedAddress(
        editingAddressId
      );
    } else {
      addAddress(form);
    }

    setForm(emptyForm);

    setEditingAddressId(null);

    setShowForm(false);
  }

  function continueOrder() {
    if (!selectedAddress) {
      alert(
        "Selecione um endereço."
      );

      return;
    }

    navigate("/pagamento");
  }

  return (
    <div className="app">

      <Header />

      <main>

        <section className="address-page">

          <div className="page-top">

            <Link
              to="/carrinho"
              className="back-button"
            >
              ←
            </Link>

            <div>

              <h1>
                Endereço de entrega
              </h1>

              <p>
                Escolha onde deseja receber
                seu pedido.
              </p>

            </div>

          </div>

          <div className="address-list">

            {addresses.map(
              (address) => (

                <div
                  className={
                    selectedAddress ===
                    address.id
                      ? "address-card selected"
                      : "address-card"
                  }
                  key={address.id}
                >

                  <label className="address-select-area">

                    <input
                      type="radio"
                      name="address"
                      checked={
                        selectedAddress ===
                        address.id
                      }
                      onChange={() =>
                        setSelectedAddress(
                          address.id
                        )
                      }
                    />

                    <div className="address-card-content">

                      <strong>
                        📍 {address.name}
                      </strong>

                      <span>
                        {address.street},{" "}
                        {address.number}
                      </span>

                      <span>
                        {
                          address.neighborhood
                        }
                        {" - "}
                        {address.city}
                      </span>

                      {address.complement && (

                        <small>
                          Complemento:{" "}
                          {
                            address.complement
                          }
                        </small>

                      )}

                      {address.reference && (

                        <small>
                          Referência:{" "}
                          {
                            address.reference
                          }
                        </small>

                      )}

                    </div>

                  </label>

                  <button
                    type="button"
                    className="edit-address-button"
                    onClick={() =>
                      editAddress(
                        address
                      )
                    }
                  >
                    Editar
                  </button>

                </div>

              )
            )}

          </div>

          {!showForm && (

            <button
              type="button"
              className="new-address-button"
              onClick={
                openNewAddressForm
              }
            >
              + Adicionar novo endereço
            </button>

          )}

          {showForm && (

            <form
              className="address-form"
              onSubmit={handleSubmit}
            >

              <h2>
                {editingAddressId
                  ? "Editar endereço"
                  : "Novo endereço"}
              </h2>

              <div className="form-group">

                <label>
                  Nome do endereço *
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Ex: Casa, Trabalho"
                  value={form.name}
                  onChange={handleChange}
                />

              </div>

              <div className="form-group">

                <label>
                  Rua *
                </label>

                <input
                  type="text"
                  name="street"
                  placeholder="Nome da rua"
                  value={form.street}
                  onChange={handleChange}
                />

              </div>

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Número *
                  </label>

                  <input
                    type="text"
                    name="number"
                    placeholder="123"
                    value={form.number}
                    onChange={handleChange}
                  />

                </div>

                <div className="form-group">

                  <label>
                    Bairro *
                  </label>

                  <input
                    type="text"
                    name="neighborhood"
                    placeholder="Centro"
                    value={
                      form.neighborhood
                    }
                    onChange={handleChange}
                  />

                </div>

              </div>

              <div className="form-group">

                <label>
                  Complemento
                </label>

                <input
                  type="text"
                  name="complement"
                  placeholder="Casa, apto, bloco..."
                  value={
                    form.complement
                  }
                  onChange={handleChange}
                />

              </div>

              <div className="form-group">

                <label>
                  Ponto de referência
                </label>

                <input
                  type="text"
                  name="reference"
                  placeholder="Próximo a..."
                  value={
                    form.reference
                  }
                  onChange={handleChange}
                />

              </div>

              <div className="address-form-actions">

                <button
                  type="submit"
                  className="save-address-button"
                >
                  {editingAddressId
                    ? "Salvar alterações"
                    : "Salvar endereço"}
                </button>

                <button
                  type="button"
                  className="cancel-address-button"
                  onClick={cancelForm}
                >
                  Cancelar
                </button>

              </div>

            </form>

          )}

          <button
            type="button"
            className="continue-payment-button"
            onClick={continueOrder}
          >
            Continuar para pagamento
          </button>

        </section>

      </main>

      <BottomNav />

    </div>
  );
}

export default Address;