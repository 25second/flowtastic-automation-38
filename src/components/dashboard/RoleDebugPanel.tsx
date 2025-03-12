
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';

export function RoleDebugPanel() {
  const { role, loading, refetchRole } = useUserRole();
  const { session } = useAuth();

  const checkRoleDirectly = async () => {
    if (!session?.user) {
      toast.error("Не авторизован");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error checking role:", error);
        toast.error("Ошибка при проверке роли");
      } else {
        console.log("Direct role check result:", data);
        toast.success(`Текущая роль в БД: ${data?.role || 'не задана'}`);
      }
    } catch (e) {
      console.error("Role check failed:", e);
      toast.error("Не удалось проверить роль");
    }
  };

  const updateRole = async (newRole: 'admin' | 'client') => {
    if (!session?.user) {
      toast.error("Не авторизован");
      return;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: session.user.id,
          role: newRole
        });

      if (error) {
        console.error("Error updating role:", error);
        toast.error("Ошибка при обновлении роли");
      } else {
        toast.success(`Роль успешно обновлена на ${newRole}`);
        // Force reload to update permissions
        window.location.reload();
      }
    } catch (e) {
      console.error("Role update failed:", e);
      toast.error("Не удалось обновить роль");
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Управление ролями (Debug)</CardTitle>
        <Badge variant={role === 'admin' ? "success" : "secondary"}>
          {role === 'admin' ? 'Администратор' : role === 'client' ? 'Клиент' : 'Не задана'}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Текущая роль:</span>
          <span className="font-medium">{loading ? 'Загрузка...' : role || 'Не задана'}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={refetchRole}
            disabled={loading}
            title="Обновить роль"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={checkRoleDirectly}
            disabled={loading}
          >
            Проверить роль в БД
          </Button>

          <Select
            onValueChange={updateRole}
            defaultValue={role || undefined}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Выберите роль" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Администратор</SelectItem>
              <SelectItem value="client">Клиент</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
