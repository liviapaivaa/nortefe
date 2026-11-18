import { NavLink } from "react-router-dom";

function BottomNav() {
  return (
    <nav className="consumer-bottom-nav">

      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          isActive
            ? "consumer-nav-item consumer-nav-active"
            : "consumer-nav-item"
        }
      >
        <span>⌂</span>
        <small>Início</small>
      </NavLink>

      <NavLink
        to="/pedidos"
        className={({ isActive }) =>
          isActive
            ? "consumer-nav-item consumer-nav-active"
            : "consumer-nav-item"
        }
      >
        <span>▣</span>
        <small>Pedidos</small>
      </NavLink>

      <NavLink
        to="/favoritos"
        className={({ isActive }) =>
          isActive
            ? "consumer-nav-item consumer-nav-active"
            : "consumer-nav-item"
        }
      >
        <span>♡</span>
        <small>Favoritos</small>
      </NavLink>

      <NavLink
        to="/perfil"
        className={({ isActive }) =>
          isActive
            ? "consumer-nav-item consumer-nav-active"
            : "consumer-nav-item"
        }
      >
        <span>♙</span>
        <small>Perfil</small>
      </NavLink>

    </nav>
  );
}

export default BottomNav;