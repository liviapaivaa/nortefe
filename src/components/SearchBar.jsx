import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SearchBar() {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    const value = search.trim()

    if (!value) {
      return
    }

    navigate(
      `/restaurantes?busca=${encodeURIComponent(value)}`
    )
  }

  return (
    <form
      className="search"
      onSubmit={handleSubmit}
    >
      <span className="search-icon">
        ⌕
      </span>

      <input
        type="text"
        placeholder="Buscar lojas, produtos ou pratos..."
        value={search}
        onChange={(event) =>
          setSearch(event.target.value)
        }
      />
    </form>
  )
}

export default SearchBar