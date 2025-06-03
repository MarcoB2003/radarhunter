
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-radar-700 mb-4">404</h1>
        <h2 className="text-2xl font-medium mb-2">Página não encontrada</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          A página que você está procurando pode ter sido removida, renomeada ou está temporariamente indisponível.
        </p>
        <Button onClick={() => navigate('/')}>
          Voltar para a página inicial
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
