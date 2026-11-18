import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import BottomNav from "../components/BottomNav";

function Profile() {
  const navigate = useNavigate();

  const {
    user,
    logout
  } = useAuth();

  function roleName(role) {
    const roles = {
      consumer: "Consumidor",
      merchant: "Comerciante",
      delivery: "Entregador",
      admin: "Administrador"
    };

    return roles[role] || role;
  }

  function handleLogout() {
    const confirmed = window.confirm(
      "Deseja sair da sua conta?"
    );

    if (!confirmed) {
      return;
    }

    logout();

    navigate("/login");
  }

  function handleSwitchAccount() {
    logout();

    navigate("/login");
  }

  if (!user) {
    return (
      <div className="app">

        <main>

          <section className="profile-page">

            <div className="profile-login-required">

              <span>
                👤
              </span>

              <h1>
                Entre na sua conta
              </h1>

              <p>
                Faça login para acessar sua conta,
                pedidos e configurações.
              </p>

              <Link
                to="/login"
                className="profile-login-button"
              >
                Entrar
              </Link>

              <Link
                to="/cadastro"
                className="profile-register-link"
              >
                Criar uma conta
              </Link>

            </div>

          </section>

        </main>

        <BottomNav />

      </div>
    );
  }

  return (
    <div className="app">

      <main>

        <section className="profile-page">

          <div className="page-top">

            <Link
              to="/"
              className="back-button"
            >
              ←
            </Link>

            <div>

              <h1>
                Minha conta
              </h1>

              <p>
                Gerencie sua conta e acesse
                seus serviços.
              </p>

            </div>

          </div>

          <div className="profile-user-card">

            <div className="profile-avatar">
              {user.name
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <div className="profile-user-info">

              <strong>
                {user.name}
              </strong>

              <span>
                {user.email}
              </span>

              <small>
                {roleName(user.role)}
              </small>

            </div>

          </div>

          <div className="profile-options">

            <Link
              to="/"
              className="profile-option"
            >
              <span>
                🏠 Início
              </span>

              <strong>
                ›
              </strong>
            </Link>

            {user.role === "consumer" && (
              <>

                <Link
                  to="/pedidos"
                  className="profile-option"
                >
                  <span>
                    📦 Meus pedidos
                  </span>

                  <strong>
                    ›
                  </strong>
                </Link>

                <Link
                  to="/endereco"
                  className="profile-option"
                >
                  <span>
                    📍 Meus endereços
                  </span>

                  <strong>
                    ›
                  </strong>
                </Link>

                <Link
                  to="/carrinho"
                  className="profile-option"
                >
                  <span>
                    🛒 Meu carrinho
                  </span>

                  <strong>
                    ›
                  </strong>
                </Link>

                <Link
                  to="/restaurantes"
                  className="profile-option"
                >
                  <span>
                    🏪 Estabelecimentos
                  </span>

                  <strong>
                    ›
                  </strong>
                </Link>

              </>
            )}

            {user.role === "merchant" && (
              <Link
                to="/parceiro"
                className="profile-option"
              >
                <span>
                  🏪 Painel do comerciante
                </span>

                <strong>
                  ›
                </strong>
              </Link>
            )}

            {user.role === "delivery" && (
              <Link
                to="/entregador"
                className="profile-option"
              >
                <span>
                  🛵 Painel do entregador
                </span>

                <strong>
                  ›
                </strong>
              </Link>
            )}

            {user.role === "admin" && (
              <Link
                to="/admin"
                className="profile-option"
              >
                <span>
                  ⚙️ Painel administrativo
                </span>

                <strong>
                  ›
                </strong>
              </Link>
            )}

          </div>

          <div className="profile-account-actions">

            <button
              type="button"
              className="switch-account-button"
              onClick={handleSwitchAccount}
            >
              🔄 Trocar conta
            </button>

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Sair da conta
            </button>

          </div>

        </section>

      </main>

      <BottomNav />

    </div>
  );
}

export default Profile;