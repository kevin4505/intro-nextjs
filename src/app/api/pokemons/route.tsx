// src/app/api/pokemons/route.tsx
import { NextRequest, NextResponse } from 'next/server'

// 🔍 Tipos para las respuestas de la API de Pokemon
interface PokemonApiListItem {
  name: string
  url: string
}

interface PokemonApiListResponse {
  count: number
  next: string | null
  previous: string | null
  results: PokemonApiListItem[]
}

interface PokemonType {
  type: {
    name: string
    url: string
  }
  slot: number
}

interface PokemonDetailResponse {
  id: number
  name: string
  sprites: {
    front_default: string
  }
  types: PokemonType[]
}

// 🔍 Tipos para nuestras respuestas
interface PokemonListItem {
  name: string
  url: string
  id: number
  image: string
  types: string[]
}

interface ApiResponse {
  pokemons: PokemonListItem[]
  total: number
  search?: string
  pagination: {
    currentPage: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
    limit: number
    offset: number
  }
}

// 📦 GET - Obtener lista de pokémons (con búsqueda y paginación)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '20')
  const page = parseInt(searchParams.get('page') || '1')
  const search = searchParams.get('search') || ''

  // Calcular offset basado en la página
  const offset = (page - 1) * limit

  try {
    // Obtener lista básica con offset
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`, {
      cache: 'force-cache'
    })

    if (!res.ok) {
      throw new Error('Error al obtener pokémons')
    }

    const data: PokemonApiListResponse = await res.json()

    // Enriquecer con detalles
    const enrichedPokemons = await Promise.all(
      data.results.map(async (pokemon: PokemonApiListItem) => {
        const detailRes = await fetch(pokemon.url, { cache: 'force-cache' })
        const detail: PokemonDetailResponse = await detailRes.json()

        return {
          name: detail.name,
          url: pokemon.url,
          id: detail.id,
          image: detail.sprites.front_default,
          types: detail.types.map((t: PokemonType) => t.type.name)
        }
      })
    )

    // Filtrar por búsqueda si existe
    const filteredPokemons = search
      ? enrichedPokemons.filter(p =>
          p.name.toLowerCase().includes(search.toLowerCase())
        )
      : enrichedPokemons

    // Calcular información de paginación
    const totalPages = Math.ceil(data.count / limit)

    const response: ApiResponse = {
      pokemons: filteredPokemons,
      total: data.count,
      search,
      pagination: {
        currentPage: page,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
        limit,
        offset
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Error al cargar pokémons' },
      { status: 500 }
    )
  }
}