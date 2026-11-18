import { Link } from 'react-router-dom'

function CategoryCard({ name, image }) {
  return (
    <Link
      to={`/restaurantes?categoria=${encodeURIComponent(name)}`}
      className="category-card"
    >
      <div className="category-icon">
        <img
          src={image}
          alt={name}
        />
      </div>

      <span>{name}</span>
    </Link>
  )
}

export default CategoryCard