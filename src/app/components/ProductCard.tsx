import { ShoppingCart, TrendingDown, Flame, Store } from 'lucide-react';
import { ProductWithPrice } from '../types/product';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router';

interface ProductCardProps {
  product: ProductWithPrice;
  onAddToCart: (product: ProductWithPrice) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'proteina':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'bebestible':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'insumo':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'ensalada':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'proteina':
        return 'Proteína';
      case 'bebestible':
        return 'Bebestible';
      case 'insumo':
        return 'Insumo';
      case 'ensalada':
        return 'Ensalada';
      default:
        return category;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
      <CardHeader onClick={() => navigate(`/productos/${product.id}`)}>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg group-hover:text-primary transition-colors">
            {product.nombre}
          </CardTitle>
          <Badge className={getCategoryBadgeColor(product.category)}>
            {getCategoryLabel(product.category)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{product.tipo}</p>
      </CardHeader>
      
      <CardContent onClick={() => navigate(`/productos/${product.id}`)}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{formatPrice(product.precio.valor)}</span>
            <TrendingDown className="text-green-600 size-5" />
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Flame className="size-4 text-orange-500" />
              <span>{product.calorias} cal</span>
            </div>
            <div className="flex items-center gap-1">
              <Store className="size-4" />
              <span>{product.comercio.nombre}</span>
            </div>
          </div>

          {product.category === 'bebestible' && 'formato' in product && (
            <div className="text-sm">
              <span className="text-muted-foreground">Formato: </span>
              <span className="capitalize">{product.formato}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="w-full"
        >
          <ShoppingCart className="size-4 mr-2" />
          Agregar al Carrito
        </Button>
      </CardFooter>
    </Card>
  );
}
