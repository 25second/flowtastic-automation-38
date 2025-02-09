
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";

export const RegisterForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telegram, setTelegram] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (pass.match(/[A-Z]/)) strength += 25;
    if (pass.match(/[0-9]/)) strength += 25;
    if (pass.match(/[^A-Za-z0-9]/)) strength += 25;
    setPasswordStrength(strength);
    return strength;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordStrength < 75) {
      toast({
        variant: "destructive",
        title: "Weak Password",
        description: "Please use a stronger password with at least 8 characters, including uppercase, numbers, and special characters.",
      });
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            telegram: telegram,
          },
        },
      });
      if (error) throw error;
      toast({
        title: "Success!",
        description: "Check your email for the confirmation link.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input
          id="register-email"
          type="email"
          placeholder="m@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-telegram">Telegram Username</Label>
        <Input
          id="register-telegram"
          type="text"
          placeholder="@username"
          value={telegram}
          onChange={(e) => setTelegram(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-password">Password</Label>
        <Input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            checkPasswordStrength(e.target.value);
          }}
          required
        />
        <PasswordStrengthIndicator strength={passwordStrength} />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Loading..." : "Sign Up"}
      </Button>
    </form>
  );
};
