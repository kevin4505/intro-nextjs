// src/components/PokemonCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface PokemonCardProps {
  name: string
  url: string
}

export function PokemonCard({ name, url }: PokemonCardProps) {
  // Extraer ID del URL para mostrar imagen
  const pokemonId = url.split('/').filter(Boolean).pop()
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`
  
  return (
    <Link href={`/pokemons/${name}`}>
      <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer">
        <CardHeader className="pb-2">
          <CardTitle className="capitalize text-center text-lg">
            {name}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Image 
            src={imageUrl}
            alt={name}
            width={80}
            height={80}
            className="w-20 h-20 mx-auto mb-2"
          />
          <p className="text-sm text-gray-500">#{pokemonId}</p>
        </CardContent>
      </Card>
    </Link>
  )
}