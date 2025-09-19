// src/components/Pagination.tsx
import Link from 'next/link'
import { Button } from './ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string // URL base para la paginación (ej: "/pokemons")
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  // Calcular páginas a mostrar (máximo 5 páginas)
  const getPageNumbers = () => {
    const pages = []
    const maxPages = 5
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2))
    const endPage = Math.min(totalPages, startPage + maxPages - 1)
    
    // Ajustar si estamos cerca del final
    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-center space-x-2 py-8">
      {/* Botón anterior */}
      <Link href={currentPage > 1 ? `${baseUrl}?page=${currentPage - 1}` : '#'}>
        <Button 
          variant={currentPage > 1 ? "outline" : "ghost"} 
          disabled={currentPage <= 1}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Anterior
        </Button>
      </Link>

      {/* Primera página */}
      {pageNumbers[0] > 1 && (
        <>
          <Link href={`${baseUrl}?page=1`}>
            <Button variant="outline">1</Button>
          </Link>
          {pageNumbers[0] > 2 && <span className="px-2">...</span>}
        </>
      )}

      {/* Páginas numeradas */}
      {pageNumbers.map((page) => (
        <Link key={page} href={`${baseUrl}?page=${page}`}>
          <Button 
            variant={page === currentPage ? "default" : "outline"}
            className={page === currentPage ? "bg-blue-600" : ""}
          >
            {page}
          </Button>
        </Link>
      ))}

      {/* Última página */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="px-2">...</span>
          )}
          <Link href={`${baseUrl}?page=${totalPages}`}>
            <Button variant="outline">{totalPages}</Button>
          </Link>
        </>
      )}

      {/* Botón siguiente */}
      <Link href={currentPage < totalPages ? `${baseUrl}?page=${currentPage + 1}` : '#'}>
        <Button 
          variant={currentPage < totalPages ? "outline" : "ghost"} 
          disabled={currentPage >= totalPages}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente →
        </Button>
      </Link>
    </div>
  )
}