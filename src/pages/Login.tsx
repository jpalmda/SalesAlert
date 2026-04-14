import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Zap } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const { signIn, resetPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);

    try {
      if (isResetMode) {
        await resetPassword(email);
        toast({ title: "E-mail enviado!", description: "Verifique sua caixa de entrada para redefinir a senha." });
        setIsResetMode(false);
      } else {
        if (!password.trim()) return;
        await signIn(email, password);
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast({ title: "Erro", description: err.message || "Falha na autenticação", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-gradient-to-br from-[hsl(220,30%,8%)] via-[hsl(24,60%,12%)] to-[hsl(220,25%,6%)]">
      <div className="w-full max-w-sm animate-slide-up">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
            <Zap className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white">SalesAlert</h1>
          <p className="mt-1 text-sm text-white/60">Inteligência para vendas em campo</p>
        </div>

        <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/40">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-display">
              {isResetMode ? "Recuperar senha" : "Entrar"}
            </CardTitle>
            <CardDescription>
              {isResetMode ? "Enviaremos um link para redefinir sua senha" : "Use suas credenciais para acessar"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              {!isResetMode && (
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full h-12 text-base font-semibold rounded-xl" disabled={isLoading}>
                {isLoading ? "Carregando..." : isResetMode ? "Enviar link" : "Entrar"}
              </Button>
            </form>

            <button
              onClick={() => setIsResetMode(!isResetMode)}
              className="mt-4 block w-full text-center text-sm text-primary hover:underline"
            >
              {isResetMode ? "Voltar ao login" : "Esqueci minha senha"}
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
