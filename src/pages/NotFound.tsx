
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-6xl font-bold mb-6 text-primary">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Страница не найдена
        </p>
        <p className="mb-8 text-muted-foreground">
          Запрошенный путь "{location.pathname}" не существует в приложении.
        </p>
        <div className="space-x-4">
          <Button asChild>
            <Link to="/">На главную</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard">Панель управления</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
