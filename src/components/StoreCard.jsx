import { Link } from 'react-router-dom'

function StoreCard({
  id,
  name,
  description,
  category,
  image
}) {
  const storeIds = {
    'Sabor do Norte': 1,
    'Cantinho da Pizza': 2,
    'Mercadinho Central': 3,
    'Drogaria Bem Estar': 4,
    'Feira Municipal': 5,
    'Loja Popular': 6,
    'Distribuidora Tefé': 7,
    'Padaria Central': 8
  }

  const storeId = id || storeIds[name]

  return (
    <article className="store-card">

      <img
        src={image}
        alt={name}
        className="store-image"
      />

      <div className="store-content">

        <span className="store-category">
          {category}
        </span>

        <h3>{name}</h3>

        <p>{description}</p>

        <div className="store-info">
          <span>★ 4,8</span>
          <span>30–40 min</span>
        </div>

        <Link
          to={`/loja/${storeId}`}
          className="store-button"
        >
          Ver estabelecimento
        </Link>

      </div>

    </article>
  )
}

export default StoreCard