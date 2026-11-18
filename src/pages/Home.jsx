import '../App.css'

import { Link } from 'react-router-dom'

import Header from '../components/Header'
import SearchBar from '../components/SearchBar'
import CategoryCard from '../components/CategoryCard'
import StoreCard from '../components/StoreCard'
import BottomNav from '../components/BottomNav'

// =========================
// IMAGENS
// =========================

import bebidasImg from '../assets/images/bebidas.jpg'
import farmaciaImg from '../assets/images/farmacia.jpg'
import feiraImg from '../assets/images/feira.jpg'
import lojasImg from '../assets/images/lojas.jpg'
import padariasImg from '../assets/images/padarias.jpg'
import restauranteImg from '../assets/images/restaurante.jpg'
import supermercadoImg from '../assets/images/supermercado.jpg'
import outrosImg from '../assets/images/trepontos.jpg'
import heroImg from '../assets/hero.png'

// =========================
// CATEGORIAS
// =========================

const categories = [
  {
    name: 'Restaurantes',
    image: restauranteImg
  },
  {
    name: 'Supermercados',
    image: supermercadoImg
  },
  {
    name: 'Farmácias',
    image: farmaciaImg
  },
  {
    name: 'Feiras Locais',
    image: feiraImg
  },
  {
    name: 'Lojas',
    image: lojasImg
  },
  {
    name: 'Bebidas',
    image: bebidasImg
  },
  {
    name: 'Padarias',
    image: padariasImg
  },
  {
    name: 'Outros',
    image: outrosImg
  }
]

// =========================
// ESTABELECIMENTOS
// =========================

const stores = [
  {
    id: 1,
    name: 'Sabor do Norte',
    description: 'Comida regional',
    category: 'Restaurante',
    image: restauranteImg
  },
  {
    id: 3,
    name: 'Mercadinho Central',
    description: 'Produtos para o dia a dia',
    category: 'Supermercado',
    image: supermercadoImg
  },
  {
    id: 4,
    name: 'Drogaria Bem Estar',
    description: 'Saúde e cuidados',
    category: 'Farmácia',
    image: farmaciaImg
  }
]

// =========================
// HOME
// =========================

function Home() {
  return (
    <div className="app">

      <Header />

      <main>

        {/* LOCALIZAÇÃO */}

        <Link
          to="/endereco"
          className="location-section"
        >
          <div className="location-icon">
            📍
          </div>

          <div className="location-text">
            <span>
              Entregar em:
            </span>

            <strong>
              Centro, Tefé - AM
            </strong>

            <small>
              Ponto de referência: Praça Remanso
            </small>
          </div>

          <div className="location-arrow">
            ›
          </div>
        </Link>

        {/* BUSCA */}

        <SearchBar />

        {/* BANNER */}

        <section className="hero-banner">

          <div className="hero-content">

            <h1>
              Compre de tudo
              <br />
              sem sair de casa!
            </h1>

            <p>
              Restaurantes, mercados,
              <br />
              farmácias e muito mais.
            </p>

          </div>

          <img
            src={heroImg}
            alt="Compre de tudo no NORTEFE"
            className="hero-image"
          />

          <div className="banner-dots">
            <span className="active"></span>
            <span></span>
            <span></span>
          </div>

        </section>

        {/* CATEGORIAS */}

        <section
          className="section"
          id="categorias"
        >

          <div className="section-header">

            <h2>
              Categorias
            </h2>

            <Link
              to="/restaurantes"
              className="see-all"
            >
              Ver todas ›
            </Link>

          </div>

          <div className="categories">

            {categories.map((category) => (
              <CategoryCard
                key={category.name}
                name={category.name}
                image={category.image}
              />
            ))}

          </div>

        </section>

        {/* ESTABELECIMENTOS */}

        <section
          className="section"
          id="estabelecimentos"
        >

          <div className="section-header">

            <h2>
              Estabelecimentos
            </h2>

            <Link
              to="/restaurantes"
              className="see-all"
            >
              Ver todos ›
            </Link>

          </div>

          <div className="stores">

            {stores.map((store) => (
              <StoreCard
                key={store.id}
                id={store.id}
                name={store.name}
                description={store.description}
                category={store.category}
                image={store.image}
              />
            ))}

          </div>

        </section>

      </main>

      <BottomNav />

    </div>
  )
}

export default Home