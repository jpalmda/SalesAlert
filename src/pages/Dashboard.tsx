import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockClients, mockProducts, mockAlerts, getInactiveClients, getLowStockProducts } from "@/lib/mock-data";
import { Users, Package, Bell, AlertTriangle, Star, ArrowRight, Zap } from "lucide-react";

export default function Dashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const inactiveClients = useMemo(() => getInactiveClients(mockClients), []);
  const lowStockProducts = useMemo(() => getLowStockProducts(mockProducts), []);
  const unreadAlerts = useMemo(() => mockAlerts.filter(a => !a.is_read), []);
  const highlightProducts = useMemo(() => mockProducts.filter(p => p.is_highlight_of_day), []);

  const firstName = profile?.name?.split(" ")[0] || "Vendedor";

  return (
    <AppLayout>
      <div className="px-4 pt-6 space-y-6 animate-slide-up">
        {/* Header */}
        <div>
          <p className="text-sm text-muted-foreground">Bom dia,</p>
          <h1 className="font-display text-2xl font-bold">{firstName} 👋</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => navigate("/clients")} className="text-left">
            <Card className="border-0 bg-accent/60 transition-transform active:scale-95">
              <CardContent className="p-3">
                <Users className="h-5 w-5 text-accent-foreground mb-1" />
                <p className="text-2xl font-bold font-display text-accent-foreground">{inactiveClients.length}</p>
                <p className="text-[10px] text-accent-foreground/70">Inativos</p>
              </CardContent>
            </Card>
          </button>

          <button onClick={() => navigate("/alerts")} className="text-left">
            <Card className="border-0 bg-destructive/10 transition-transform active:scale-95">
              <CardContent className="p-3">
                <Bell className="h-5 w-5 text-destructive mb-1" />
                <p className="text-2xl font-bold font-display text-destructive">{unreadAlerts.length}</p>
                <p className="text-[10px] text-destructive/70">Alertas</p>
              </CardContent>
            </Card>
          </button>

          <button onClick={() => navigate("/stock")} className="text-left">
            <Card className="border-0 bg-warning/10 transition-transform active:scale-95">
              <CardContent className="p-3">
                <Package className="h-5 w-5 text-warning mb-1" />
                <p className="text-2xl font-bold font-display text-warning">{lowStockProducts.length}</p>
                <p className="text-[10px] text-warning/70">Estoque baixo</p>
              </CardContent>
            </Card>
          </button>
        </div>

        {/* Urgent Alerts */}
        {unreadAlerts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-base font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Alertas Urgentes
              </h2>
              <button onClick={() => navigate("/alerts")} className="text-xs text-primary flex items-center gap-1">
                Ver todos <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="space-y-2">
              {unreadAlerts.slice(0, 3).map(alert => (
                <Card key={alert.id} className="border-0 shadow-sm transition-transform active:scale-[0.98]">
                  <CardContent className="p-3 flex items-start gap-3">
                    <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${
                      alert.type === "urgent_alert" ? "bg-destructive" :
                      alert.type === "low_stock" ? "bg-warning" : "bg-primary"
                    }`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-tight">{alert.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{alert.message}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Highlights */}
        <section>
          <h2 className="font-display text-base font-semibold flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-primary" />
            Destaques do Dia
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {highlightProducts.map(product => (
              <Card key={product.id} className="border-0 shadow-sm shrink-0 w-36 transition-transform active:scale-95">
                <CardContent className="p-3">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm font-medium leading-tight">{product.name}</p>
                  <div className="mt-1.5 flex items-center gap-1">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {product.stock_quantity} un.
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Inactive Clients Preview */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-base font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Clientes para Visitar
            </h2>
            <button onClick={() => navigate("/clients")} className="text-xs text-primary flex items-center gap-1">
              Ver todos <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-2">
            {inactiveClients.slice(0, 3).map(client => {
              const daysSince = client.last_purchase_date
                ? Math.floor((Date.now() - new Date(client.last_purchase_date).getTime()) / (1000 * 60 * 60 * 24))
                : 999;
              return (
                <Card key={client.id} className="border-0 shadow-sm transition-transform active:scale-[0.98]"
                  onClick={() => navigate(`/clients/${client.id}`)}>
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{client.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {client.type === "b2b_empresa" ? "Empresa" : "Pessoa Física"}
                          {client.is_vip && " · ⭐ VIP"}
                        </p>
                      </div>
                    </div>
                    <Badge variant={daysSince > 60 ? "destructive" : "secondary"} className="text-[10px]">
                      {daysSince}d
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
