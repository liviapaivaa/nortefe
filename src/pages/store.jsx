import { useParams, Link } from "react-router-dom";

import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { useEstablishments } from "../context/EstablishmentContext";

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
    category: "Restaurante",
    description: "Comida regional",
    image: restauranteImg,
    products: [
      {
        id: 1,
        name: "Tacacá",
        description: "Tacacá tradicional da região",
        price: 20
      },
      {
        id: 2,
        name: "X-Caboquinho",
        description: "Pão, tucumã, queijo e banana",
        price: 18
      },
      {
        id: 3,
        name: "Tambaqui Assado",
        description: "Tambaqui assado com acompanhamentos",
        price: 35
      }
    ]
  },
  {
    id: 2,
    name: "Cantinho da Pizza",
    category: "Restaurante",
    description: "Pizzas e lanches",
    image: restauranteImg,
    products: [
      {
        id: 4,
        name: "Pizza Calabresa",
        description: "Molho, queijo, calabresa e cebola",
        price: 42
      },
      {
        id: 5,
        name: "Pizza Frango",
        description: "Frango, queijo e molho especial",
        price: 45
      }
    ]
  },
  {
    id: 3,
    name: "Mercadinho Central",
    category: "Supermercado",
    description: "Produtos para o dia a dia",
    image: supermercadoImg,
    products: [
      {
        id: 6,
        name: "Arroz 5kg",
        description: "Pacote de arroz",
        price: 28.9
      },
      {
        id: 7,
        name: "Feijão 1kg",
        description: "Feijão carioca",
        price: 9.5
      },
      {
        id: 8,
        name: "Açúcar 1kg",
        description: "Açúcar refinado",
        price: 6.5
      }
    ]
  },
  {
    id: 4,
    name: "Drogaria Bem Estar",
    category: "Farmácia",
    description: "Saúde e cuidados",
    image: farmaciaImg,
    products: [
      {
        id: 9,
        name: "Álcool em Gel",
        description: "Frasco 500ml",
        price: 12.9
      },
      {
        id: 10,
        name: "Sabonete",
        description: "Sabonete para cuidados pessoais",
        price: 5.5
      }
    ]
  },
  {
    id: 5,
    name: "Feira Municipal",
    category: "Feira Local",
    description: "Produtos locais e frescos",
    image: feiraImg,
    products: [
      {
        id: 11,
        name: "Banana",
        description: "Banana fresca da região",
        price: 8
      },
      {
        id: 12,
        name: "Macaxeira",
        description: "Macaxeira fresca",
        price: 7
      },
      {
        id: 13,
        name: "Farinha",
        description: "Farinha regional",
        price: 15
      }
    ]
  },
  {
    id: 6,
    name: "Loja Popular",
    category: "Loja",
    description: "Variedades e utilidades",
    image: lojasImg,
    products: [
      {
        id: 14,
        name: "Garrafa Térmica",
        description: "Garrafa térmica para bebidas",
        price: 35
      },
      {
        id: 15,
        name: "Copo",
        description: "Copo plástico resistente",
        price: 8
      },
      {
        id: 16,
        name: "Pote Plástico",
        description: "Pote com tampa",
        price: 12
      }
    ]
  },
  {
    id: 7,
    name: "Distribuidora Tefé",
    category: "Bebidas",
    description: "Bebidas em geral",
    image: bebidasImg,
    products: [
      {
        id: 17,
        name: "Refrigerante 2L",
        description: "Refrigerante gelado",
        price: 12
      },
      {
        id: 18,
        name: "Água Mineral",
        description: "Garrafa 1,5L",
        price: 5
      },
      {
        id: 19,
        name: "Suco",
        description: "Suco de frutas",
        price: 8
      }
    ]
  },
  {
    id: 8,
    name: "Padaria Central",
    category: "Padaria",
    description: "Pães, bolos e salgados",
    image: padariasImg,
    products: [
      {
        id: 20,
        name: "Pão Francês",
        description: "Pão francês fresquinho",
        price: 1
      },
      {
        id: 21,
        name: "Bolo de Chocolate",
        description: "Fatia de bolo de chocolate",
        price: 8
      },
      {
        id: 22,
        name: "Coxinha",
        description: "Coxinha de frango",
        price: 7
      }
    ]
  }
];

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

function Store() {
  const { id } = useParams();

  const { addToCart, totalItems } = useCart();

  const { products } = useProducts();

  const {
    getEstablishmentById
  } = useEstablishments();

  const staticStore = staticStores.find(
    (item) => item.id === Number(id)
  );

  const registeredStore =
    getEstablishmentById(id);

  let store = null;

  if (registeredStore) {
    const storeProducts = products.filter(
      (product) =>
        product.storeId === registeredStore.id &&
        product.available !== false
    );

    store = {
      id: registeredStore.id,
      name: registeredStore.name,
      category: registeredStore.category,
      description:
        registeredStore.description ||
        "Estabelecimento local",
      image: getCategoryImage(
        registeredStore.category
      ),
      products: storeProducts
    };
  } else if (staticStore) {
    store = staticStore;
  }

  if (!store) {
    return (
      <div className="app">

        <Header />

        <main>

          <section className="section">

            <h1>
              Estabelecimento não encontrado
            </h1>

            <Link
              to="/restaurantes"
              className="store-button"
            >
              Voltar para estabelecimentos
            </Link>

          </section>

        </main>

        <BottomNav />

      </div>
    );
  }

  return (
    <div className="app">

      <Header />

      <main>

        <section className="store-page-header">

          <Link
            to="/restaurantes"
            className="back-button"
          >
            ←
          </Link>

          <img
            src={store.image}
            alt={store.name}
            className="store-page-image"
          />

          <div className="store-page-info">

            <span className="store-category">
              {store.category}
            </span>

            <h1>
              {store.name}
            </h1>

            <p>
              {store.description}
            </p>

            <div className="store-info">

              <span>
                ★ 4,8
              </span>

              <span>
                30–40 min
              </span>

            </div>

          </div>

        </section>

        <section className="section">

          <div className="section-header">

            <h2>
              Produtos
            </h2>

          </div>

          <div className="product-list">

            {store.products.length === 0 ? (

              <div className="merchant-empty">

                <span>
                  🛍️
                </span>

                <h3>
                  Nenhum produto disponível
                </h3>

                <p>
                  Este estabelecimento ainda não
                  possui produtos disponíveis.
                </p>

              </div>

            ) : (

              store.products.map((product) => (

                <article
                  className="product-card"
                  key={product.id}
                >

                  <div className="product-info">

                    <h3>
                      {product.name}
                    </h3>

                    {product.description && (
                      <p>
                        {product.description}
                      </p>
                    )}

                    <strong>
                      R${" "}
                      {product.price
                        .toFixed(2)
                        .replace(".", ",")}
                    </strong>

                  </div>

                  <button
                    className="add-product-button"
                    type="button"
                    onClick={() =>
                      addToCart({
                        ...product,
                        storeId: store.id,
                        storeName: store.name
                      })
                    }
                  >
                    +
                  </button>

                </article>

              ))

            )}

          </div>

        </section>

        <Link
          to="/carrinho"
          className="cart-fixed-button"
        >
          🛒 Ver carrinho ({totalItems})
        </Link>

      </main>

      <BottomNav />

    </div>
  );
}

export default Store;