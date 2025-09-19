// src/app/pokemons/page.tsx
import { Badge } from '../../components/ui/badge'
import { PokemonCard } from '../../components/PokemonCard'
import { SearchPokemon } from '../../components/SearchPokemon'
import { Pagination } from '../../components/Pagination'



// Actualizar interface ApiResponse
interface ApiResponse {
  pokemons: Pokemon[]
  total: number
  pagination: {
    currentPage: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
    limit: number
    offset: number
  }
}

// Actualizar función para incluir página
async function getPokemons(page: number = 1): Promise<ApiResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/pokemons?page=${page}`, {
    cache: 'force-cache'
  })
  
  if (!res.ok) {
    throw new Error('Error al cargar pokémons')
  }
  
  return res.json()
}

// Agregar searchParams a la página
interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function PokemonsPage({ searchParams }: PageProps) {
  const { page } = await searchParams
  const currentPage = parseInt(page || '1')
  const data = await getPokemons(currentPage)
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Pokédex</h1>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {data.total} Pokémons total
        </Badge>
      </div>

      {/* Componente de búsqueda */}
      <div className="mb-8">
        <SearchPokemon />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.pokemons.map((pokemon) => (
          <PokemonCard 
            key={pokemon.name} 
            name={pokemon.name} 
            url={pokemon.url} 
          />
        ))}
      </div>

      {/* Componente de paginación */}
      <Pagination
        currentPage={data.pagination.currentPage}
        totalPages={data.pagination.totalPages}
        baseUrl="/pokemons"
      />
    </div>
  )
}