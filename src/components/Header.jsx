import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user } = useAuth();

  const firstLetter = user?.name
    ? user.name.charAt(0).toUpperCase()
    : "";

  const firstName = user?.name
    ? user.name.split(" ")[0]
    : "";

  return (
    <header className="header">
      <button
        className="header-icon"
        type="button"
      >
        ☰
      </button>

      <Link
        to="/"
        className="logo-area"
      >
        <div className="logo">
          NOR<span>TEFE</span>
        </div>

        <p>Tudo em um só lugar</p>
      </Link>

      {user ? (
        <Link
          to="/perfil"
          className="header-user"
        >
          <div className="header-avatar">
            {firstLetter}
          </div>

          <span>{firstName}</span>
        </Link>
      ) : (
        <div className="header-auth">
          <Link to="/login">
            Entrar
          </Link>

          <Link
            to="/cadastro"
            className="header-register"
          >
            Cadastrar
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;