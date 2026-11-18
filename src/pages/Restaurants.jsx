import {
  useSearchParams,
  Link
} from "react-router-dom";

import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

import { useEstablishments } from "../context/EstablishmentContext";
import { useProducts } from "../context/ProductContext";

import restauranteImg from "../assets/images/restaurante.jpg";
import supermercadoImg from "../assets/images/supermercado.jpg";
import farmaciaImg from "../assets/images/farmacia.jpg";
import feiraImg from "../assets/images/feira.jpg";
import lojasImg from "../assets/images/lojas.jpg";
import bebidasImg from "../assets/images/bebidas.jpg";
import padariasImg from "../assets/images/padarias.jpg";

const staticStores = [
  {
    id: 1,
    name: "Sabor do Norte",
    description: "Comida regional",
    category: "Restaurantes",
    image: restauranteImg,
    products: [
      "Tacacá",
      "X-Caboquinho",
      "Tambaqui Assado"
    ]
  },
  {
    id: 2,
    name: "Cantinho da Pizza",
    description: "Pizzas e lanches",
    category: "Restaurantes",
    image: restauranteImg,
    products: [
      "Pizza Calabresa",
      "Pizza Frango"
    ]
  },
  {
    id: 3,
    name: "Mercadinho Central",
    description: "Produtos para o dia a dia",
    category: "Supermercados",
    image: supermercadoImg,
    products: [
      "Arroz 5kg",
      "Feijão 1kg",
      "Açúcar 1kg"
    ]
  },
  {
    id: 4,
    name: "Drogaria Bem Estar",
    description: "Saúde e cuidados",
    category: "Farmácias",
    image: farmaciaImg,
    products: [
      "Álcool em Gel",
      "Sabonete"
    ]
  },
  {
    id: 5,
    name: "Feira Municipal",
    description: "Produtos locais e frescos",
    category: "Feiras Locais",
    image: feiraImg,
    products: [
      "Banana",
      "Macaxeira",
      "Farinha"
    ]
  },
  {
    id: 6,
    name: "Loja Popular",
    description: "Variedades e utilidades",
    category: "Lojas",
    image: lojasImg,
    products: [
      "Garrafa Térmica",
      "Copo",
      "Pote Plástico"
    ]
  },
  {
    id: 7,
    name: "Distribuidora Tefé",
    description: "Bebidas em geral",
    category: "Bebidas",
    image: bebidasImg,
    products: [
      "Refrigerante 2L",
      "Água Mineral",
      "Suco"
    ]
  },
  {
    id: 8,
    name: "Padaria Central",
    description: "Pães, bolos e salgados",
    category: "Padarias",
    image: padariasImg,
    products: [
      "Pão Francês",
      "Bolo de Chocolate",
      "Coxinha"
    ]
  }
];

function getCategoryPlural(category) {
  const categoryMap = {
    Restaurante: "Restaurantes",
    Supermercado: "Supermercados",
    Farmácia: "Farmácias",
    "Feira Local": "Feiras Locais",
    Loja: "Lojas",
    Bebidas: "Bebidas",
    Padaria: "Padarias"
  };

  return categoryMap[category] || category;
}

function getCategoryImage(category) {
  const imageMap = {
    Restaurante: restauranteImg,
    Supermercado: supermercadoImg,
    Farmácia: farmaciaImg,
    "Feira Local": feiraImg,
    Loja: lojasImg,
    Bebidas: bebidasImg,
    Padaria: padariasImg
  };

  return imageMap[category] || lojasImg;
}

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function Restaurants() {
  const [searchParams] =
    useSearchParams();

  const categoria =
    searchParams.get("categoria");

  const busca =
    searchParams.get("busca");

  const {
    establishments
  } = useEstablishments();

  const {
    products
  } = useProducts();

  const registeredStores =
    establishments
      .filter(
        (establishment) =>
          establishment.active !== false
      )
      .map((establishment) => {
        const storeProducts =
          products
            .filter(
              (product) =>
                product.storeId ===
                  establishment.id &&
                product.available !== false
            )
            .map(
              (product) =>
                product.name
            );

        return {
          id: establishment.id,

          name: establishment.name,

          description:
            establishment.description ||
            "Estabelecimento local",

          category:
            getCategoryPlural(
              establishment.category
            ),

          image:
            getCategoryImage(
              establishment.category
            ),

          products: storeProducts,

          isRegistered: true
        };
      });

  const allStores = [
    ...staticStores,
    ...registeredStores
  ];

  let filteredStores =
    allStores;

  if (categoria) {
    filteredStores =
      filteredStores.filter(
        (store) =>
          store.category === categoria
      );
  }

  if (busca) {
    const normalizedSearch =
      normalizeText(busca);

    filteredStores =
      filteredStores.filter(
        (store) => {
          const name =
            normalizeText(
              store.name
            );

          const description =
            normalizeText(
              store.description
            );

          const category =
            normalizeText(
              store.category
            );

          const productMatch =
            store.products?.some(
              (productName) =>
                normalizeText(
                  productName
                ).includes(
                  normalizedSearch
                )
            );

          return (
            name.includes(
              normalizedSearch
            ) ||
            description.includes(
              normalizedSearch
            ) ||
            category.includes(
              normalizedSearch
            ) ||
            productMatch
          );
        }
      );
  }

  return (
    <div className="app">

      <Header />

      <main>

        <section className="section">

          <div className="section-header">

            <div>

              <h2>
                {busca
                  ? `Resultados para "${busca}"`
                  : categoria ||
                    "Estabelecimentos"}
              </h2>

              {categoria && busca && (
                <p>
                  Categoria: {categoria}
                </p>
              )}

            </div>

            <Link
              to="/"
              className="see-all"
            >
              ← Início
            </Link>

          </div>

          <div className="stores">

            {filteredStores.length > 0 ? (

              filteredStores.map(
                (store) => (

                  <article
                    className="store-card"
                    key={store.id}
                  >

                    <img
                      src={store.image}
                      alt={store.name}
                      className="store-image"
                    />

                    <div className="store-content">

                      <span className="store-category">
                        {store.category}
                      </span>

                      <h3>
                        {store.name}
                      </h3>

                      <p>
                        {store.description}
                      </p>

                      {busca &&
                        store.products?.some(
                          (productName) =>
                            normalizeText(
                              productName
                            ).includes(
                              normalizeText(
                                busca
                              )
                            )
                        ) && (

                          <div className="store-search-match">

                            <strong>
                              Produto encontrado:
                            </strong>

                            {store.products
                              .filter(
                                (productName) =>
                                  normalizeText(
                                    productName
                                  ).includes(
                                    normalizeText(
                                      busca
                                    )
                                  )
                              )
                              .map(
                                (productName) => (

                                  <span
                                    key={productName}
                                  >
                                    {productName}
                                  </span>

                                )
                              )}

                          </div>

                        )}

                      <div className="store-info">

                        <span>
                          ★ 4,8
                        </span>

                        <span>
                          30–40 min
                        </span>

                      </div>

                      <Link
                        to={`/loja/${store.id}`}
                        className="store-button"
                      >
                        Ver estabelecimento
                      </Link>

                    </div>

                  </article>

                )
              )

            ) : (

              <div className="merchant-empty">

                <span>
                  🔎
                </span>

                <h3>
                  Nenhum resultado encontrado
                </h3>

                <p>
                  Tente pesquisar outro nome,
                  produto ou categoria.
                </p>

                <Link
                  to="/restaurantes"
                  className="store-button"
                >
                  Ver todos
                </Link>

              </div>

            )}

          </div>

        </section>

      </main>

      <BottomNav />

    </div>
  );
}

export default Restaurants;