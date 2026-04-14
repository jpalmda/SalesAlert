import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockAlerts } from "@/lib/mock-data";
import { Bell, AlertTriangle, Package, Users, Check } from "lucide-react";

export default function Alerts() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const navigate = useNavigate();

  const unread = useMemo(() => alerts.filter(a => !a.is_read), [alerts]);
  const read = useMemo(() => alerts.filter(a => a.is_read), [alerts]);

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "inactive_client": return <Users className="h-4 w-4" />;
      case "low_stock": return <Package className="h-4 w-4" />;
      case "urgent_alert": return <AlertTriangle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "inactive_client": return "text-primary bg-primary/10";
      case "low_stock": return "text-warning bg-warning/10";
      case "urgent_alert": return "text-destructive bg-destructive/10";
      default: return "text-muted-foreground bg-secondary";
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case "inactive_client": return "Cliente";
      case "low_stock": return "Estoque";
      case "urgent_alert": return "Urgente";
      default: return type;
    }
  };

  const AlertCard = ({ alert }: { alert: typeof alerts[0] }) => (
    <Card className={`border-0 shadow-sm transition-all animate-slide-up ${alert.is_read ? "opacity-60" : ""}`}>
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${getColor(alert.type)}`}>
            {getIcon(alert.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <Badge variant="outline" className="text-[9px] px-1.5 py-0">{getLabel(alert.type)}</Badge>
              <span className="text-[10px] text-muted-foreground">
                {new Date(alert.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <p className="text-sm font-medium leading-tight">{alert.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>

            <div className="flex gap-2 mt-2">
              {alert.related_client_id && (
                <button
                  onClick={() => navigate(`/clients/${alert.related_client_id}`)}
                  className="text-xs text-primary font-medium hover:underline"
                >
                  Ver cliente →
                </button>
              )}
              {!alert.is_read && (
                <button
                  onClick={() => markAsRead(alert.id)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Check className="h-3 w-3" /> Marcar lido
                </button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AppLayout>
      <div className="px-4 pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl font-bold">Alertas</h1>
          <Badge variant="destructive" className="text-xs">{unread.length} novos</Badge>
        </div>

        <Tabs defaultValue="unread">
          <TabsList className="w-full bg-secondary rounded-xl h-9">
            <TabsTrigger value="unread" className="flex-1 text-xs rounded-lg">
              Não lidos ({unread.length})
            </TabsTrigger>
            <TabsTrigger value="read" className="flex-1 text-xs rounded-lg">
              Lidos ({read.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unread" className="space-y-2 mt-3">
            {unread.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Nenhum alerta pendente 🎉</p>
              </div>
            ) : (
              unread.map(a => <AlertCard key={a.id} alert={a} />)
            )}
          </TabsContent>
          <TabsContent value="read" className="space-y-2 mt-3">
            {read.map(a => <AlertCard key={a.id} alert={a} />)}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
