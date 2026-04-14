import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, Key, Clock, Building, LogOut, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const { profile, role, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState("Doces da Maria");
  const [apiToken, setApiToken] = useState("");
  const [inactiveDays, setInactiveDays] = useState("30");
  const [lowStockThreshold, setLowStockThreshold] = useState("10");

  const handleSave = () => {
    toast({ title: "Configurações salvas!", description: "Parâmetros atualizados com sucesso." });
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <AppLayout>
      <div className="px-4 pt-6 space-y-4 animate-slide-up">
        <h1 className="font-display text-xl font-bold flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configurações
        </h1>

        {/* Profile */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{profile?.name || "Usuário"}</p>
              <p className="text-xs text-muted-foreground">{profile?.email}</p>
            </div>
            <Badge variant="secondary" className="text-xs capitalize">{role || "vendedor"}</Badge>
          </CardContent>
        </Card>

        {/* Company */}
        {role === "gestor" && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 px-4 pt-4">
              <CardTitle className="text-sm font-display flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Nome da Empresa</Label>
                <Input
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="rounded-xl border-0 bg-secondary"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* API Token */}
        {role === "gestor" && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 px-4 pt-4">
              <CardTitle className="text-sm font-display flex items-center gap-2">
                <Key className="h-4 w-4 text-muted-foreground" />
                API SmartPOS
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Token de Integração</Label>
                <Input
                  type="password"
                  value={apiToken}
                  onChange={e => setApiToken(e.target.value)}
                  placeholder="sk_live_xxxx..."
                  className="rounded-xl border-0 bg-secondary font-mono text-xs"
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                Configure o token para sincronizar dados automaticamente com o SmartPOS.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Parameters */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 px-4 pt-4">
            <CardTitle className="text-sm font-display flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Parâmetros
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Dias para considerar inativo</Label>
              <Input
                type="number"
                value={inactiveDays}
                onChange={e => setInactiveDays(e.target.value)}
                className="rounded-xl border-0 bg-secondary"
                min={1}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Limite de estoque baixo (unidades)</Label>
              <Input
                type="number"
                value={lowStockThreshold}
                onChange={e => setLowStockThreshold(e.target.value)}
                className="rounded-xl border-0 bg-secondary"
                min={1}
              />
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full h-11 rounded-xl font-semibold">
          Salvar Configurações
        </Button>

        <Separator />

        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full h-11 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sair da conta
        </Button>
      </div>
    </AppLayout>
  );
}
