
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserRole } from "@/hooks/useUserRole";
import { ExternalLink, Lock, ShieldCheck, UserCheck } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

export function RoleVerificationWidget() {
  const { role, isAdmin, loading } = useUserRole();
  const [checkingRole, setCheckingRole] = useState(false);
  const { session } = useAuth();
  const [roleData, setRoleData] = useState<any>(null);
  
  const checkRoleDirectly = async () => {
    if (!session?.user) {
      toast.error("Вы должны быть авторизованы");
      return;
    }
    
    setCheckingRole(true);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', session.user.id);
      
      if (error) {
        console.error("Ошибка проверки роли:", error);
        toast.error("Не удалось проверить роль: " + error.message);
      } else {
        console.log("Результат прямой проверки роли:", data);
        setRoleData(data);
        
        if (data && data.length > 0) {
          toast.success(`Ваша роль: ${data[0].role}`);
        } else {
          toast.info("Роль не назначена");
        }
      }
    } catch (error) {
      console.error("Исключение при проверке роли:", error);
      toast.error("Произошла ошибка при проверке роли");
    } finally {
      setCheckingRole(false);
    }
  };
  
  const navigateToAdminPanel = () => {
    console.log("Переход на админ-панель: isAdmin =", isAdmin);
    
    if (!isAdmin) {
      toast.error("У вас нет прав администратора");
      return;
    }
  };
  
  const debugRoleNavigation = () => {
    console.log({
      role,
      isAdmin,
      loading,
      sessionExists: !!session,
      userId: session?.user?.id,
    });
    
    toast.info(`Текущая роль: ${role || 'не определена'}`);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lock className="mr-2 h-5 w-5" />
          Проверка прав доступа
        </CardTitle>
        <CardDescription>
          Проверьте ваши права доступа и попробуйте перейти в админ-панель
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center">
              <UserCheck className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>Текущая роль:</span>
            </div>
            <div className="flex items-center">
              {loading ? (
                <span>Загрузка...</span>
              ) : (
                <span className={`font-medium ${isAdmin ? 'text-green-500' : ''}`}>
                  {role || 'Не определена'}
                </span>
              )}
              {isAdmin && <ShieldCheck className="ml-2 h-4 w-4 text-green-500" />}
            </div>
          </div>
          
          {roleData && (
            <div className="p-3 bg-muted/50 rounded-lg overflow-auto max-h-32">
              <pre className="text-xs">{JSON.stringify(roleData, null, 2)}</pre>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          onClick={checkRoleDirectly} 
          disabled={checkingRole}
          className="flex-1"
        >
          {checkingRole ? "Проверка..." : "Проверить роль напрямую"}
        </Button>
        
        <Button 
          variant="outline"
          onClick={debugRoleNavigation}
          className="flex-1"
        >
          Отладка роли
        </Button>
        
        {isAdmin && (
          <Button asChild variant="default" className="w-full mt-2">
            <Link to="/admin" className="flex items-center">
              <ExternalLink className="mr-2 h-4 w-4" />
              Перейти в админ-панель
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
