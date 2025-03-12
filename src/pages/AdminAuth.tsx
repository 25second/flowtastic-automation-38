
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAccentColor } from "@/hooks/useAccentColor";

export default function AdminAuth() {
  useAccentColor();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  
  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First authentication step - validate email/password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if the user has admin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      if (roleError) throw roleError;

      if (roleData?.role !== 'admin') {
        throw new Error('Доступ запрещен. Только администраторы могут входить в эту панель.');
      }

      // If we're here, show 2FA input
      setShowTwoFactor(true);
      setLoading(false);
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || 'Ошибка входа');
      setLoading(false);
    }
  };

  const handleVerifyTwoFactor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here we would verify the 2FA code
      // For now, we'll use a simplified implementation
      // In a real app, you'd use a proper 2FA library and validation

      if (twoFactorCode.length !== 6 || !/^\d+$/.test(twoFactorCode)) {
        throw new Error('Неверный код. Введите 6-значный код.');
      }

      // For demonstration, we'll consider code "123456" as valid
      // In a real implementation, you'd verify against a TOTP algorithm
      if (twoFactorCode !== "123456") {
        throw new Error('Неверный код аутентификации');
      }

      console.log("2FA successful, redirecting to admin panel");
      navigate('/admin');
      toast.success('Вход выполнен успешно');
    } catch (error: any) {
      console.error("2FA error:", error);
      toast.error(error.message || 'Ошибка проверки кода');
      setLoading(false);
    }
  };

  console.log("AdminAuth page rendering"); // Add this for debugging

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Вход в панель администратора</CardTitle>
          <CardDescription>
            Только для авторизованных администраторов
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showTwoFactor ? (
            <form onSubmit={handleAdminSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Пароль</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Загрузка..." : "Войти"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyTwoFactor} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="two-factor-code">Код двухфакторной аутентификации</Label>
                <Input
                  id="two-factor-code"
                  type="text"
                  placeholder="123456"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  required
                  maxLength={6}
                  className="text-center text-xl tracking-widest"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Введите 6-значный код из вашего приложения аутентификации
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Проверка..." : "Подтвердить"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Эта страница только для администраторов системы
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
