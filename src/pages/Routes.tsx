import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { mockRoutes } from "@/lib/mock-data";
import { Route, Fuel, CircleDollarSign, Plus, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Routes() {
  const [routes, setRoutes] = useState(mockRoutes);
  const [showForm, setShowForm] = useState(false);
  const [notes, setNotes] = useState("");
  const [fuel, setFuel] = useState("");
  const [toll, setToll] = useState("");
  const { toast } = useToast();

  const handleAdd = () => {
    if (!notes.trim()) {
      toast({ title: "Erro", description: "Adicione notas da rota.", variant: "destructive" });
      return;
    }
    const newRoute = {
      id: `r${Date.now()}`,
      user_id: "u1",
      date: new Date().toISOString().split("T")[0],
      route_notes: notes,
      fuel_expense: parseFloat(fuel) || 0,
      toll_expense: parseFloat(toll) || 0,
      created_at: new Date().toISOString(),
    };
    setRoutes(prev => [newRoute, ...prev]);
    setNotes("");
    setFuel("");
    setToll("");
    setShowForm(false);
    toast({ title: "Rota registrada!", description: "Gastos do dia salvos com sucesso." });
  };

  const totalFuel = routes.reduce((s, r) => s + r.fuel_expense, 0);
  const totalToll = routes.reduce((s, r) => s + r.toll_expense, 0);

  return (
    <AppLayout>
      <div className="px-4 pt-6 space-y-4 animate-slide-up">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl font-bold">Rotas & Custos</h1>
          <Button
            size="sm"
            className="h-9 rounded-xl gap-1"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus className="h-4 w-4" />
            {showForm ? "Fechar" : "Registrar"}
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-0 bg-accent/60">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Fuel className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Combustível</p>
                <p className="text-base font-bold font-display">R${totalFuel.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-accent/60">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <CircleDollarSign className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pedágio</p>
                <p className="text-base font-bold font-display">R${totalToll.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New Route Form */}
        {showForm && (
          <Card className="border-0 shadow-md animate-slide-up">
            <CardHeader className="pb-2 px-4 pt-4">
              <CardTitle className="text-sm font-display">Novo Registro</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Notas da Rota</Label>
                <Textarea
                  placeholder="Ex: Centro → Bairro Estrela → Vila Nova"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="min-h-[60px] rounded-xl border-0 bg-secondary text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Combustível (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={fuel}
                    onChange={e => setFuel(e.target.value)}
                    className="rounded-xl border-0 bg-secondary"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Pedágio (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={toll}
                    onChange={e => setToll(e.target.value)}
                    className="rounded-xl border-0 bg-secondary"
                  />
                </div>
              </div>
              <Button onClick={handleAdd} className="w-full h-10 rounded-xl">
                Salvar Registro
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Route History */}
        <section>
          <h2 className="font-display text-sm font-semibold mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            Histórico de Rotas
          </h2>
          <div className="space-y-2">
            {routes.map(route => (
              <Card key={route.id} className="border-0 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      {new Date(route.date).toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" })}
                    </p>
                    <p className="text-xs font-semibold">
                      R${(route.fuel_expense + route.toll_expense).toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm">{route.route_notes}</p>
                  <div className="flex gap-3 mt-1.5">
                    <span className="text-[10px] text-muted-foreground">⛽ R${route.fuel_expense.toFixed(2)}</span>
                    <span className="text-[10px] text-muted-foreground">🛣️ R${route.toll_expense.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
