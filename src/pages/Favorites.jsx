import { Link } from "react-router-dom";

import BottomNav from "../components/BottomNav";

function Favorites() {
  return (
    <div className="app">

      <main>

        <section className="section">

          <div className="page-top">

            <Link
              to="/"
              className="back-button"
            >
              ←
            </Link>

            <div>

              <h1>
                Favoritos
              </h1>

              <p>
                Seus estabelecimentos favoritos
                aparecerão aqui.
              </p>

            </div>

          </div>

          <div className="merchant-empty">

            <span>
              ♡
            </span>

            <h3>
              Nenhum favorito ainda
            </h3>

            <p>
              Você ainda não adicionou nenhum
              estabelecimento aos favoritos.
            </p>

            <Link
              to="/restaurantes"
              className="store-button"
            >
              Ver estabelecimentos
            </Link>

          </div>

        </section>

      </main>

      <BottomNav />

    </div>
  );
}

export default Favorites;