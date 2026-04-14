import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockClients, getInactiveClients } from "@/lib/mock-data";
import { Search, MessageCircle, CalendarPlus, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Clients() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const inactiveClients = useMemo(() => getInactiveClients(mockClients), []);

  const b2b = useMemo(() => inactiveClients.filter(c => c.type === "b2b_empresa"), [inactiveClients]);
  const b2c = useMemo(() => inactiveClients.filter(c => c.type === "b2c_fisica"), [inactiveClients]);

  const filterBySearch = (clients: typeof mockClients) =>
    clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const getDaysSince = (date: string | null) => {
    if (!date) return 999;
    return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleMessage = (name: string) => {
    toast({ title: "Mensagem", description: `Abrindo conversa com ${name}...` });
  };

  const handleSchedule = (name: string) => {
    toast({ title: "Agendado", description: `Visita agendada para ${name}.` });
  };

  const ClientCard = ({ client }: { client: typeof mockClients[0] }) => {
    const days = getDaysSince(client.last_purchase_date);
    return (
      <Card className="border-0 shadow-sm animate-slide-up">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => navigate(`/clients/${client.id}`)} className="flex items-center gap-3 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold">
                {client.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold flex items-center gap-1">
                  {client.name}
                  {client.is_vip && <Star className="h-3 w-3 text-primary fill-primary" />}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Última compra: {days}d atrás
                </p>
              </div>
            </button>
            <Badge variant={days > 60 ? "destructive" : days > 30 ? "default" : "secondary"} className="text-[10px]">
              {days}d
            </Badge>
          </div>

          {client.tags && client.tags.length > 0 && (
            <div className="flex gap-1 mb-2 flex-wrap">
              {client.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-[9px] px-1.5 py-0">{tag}</Badge>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => handleMessage(client.name)}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/20 active:scale-95"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Mensagem
            </button>
            <button
              onClick={() => handleSchedule(client.name)}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 active:scale-95"
            >
              <CalendarPlus className="h-3.5 w-3.5" />
              Agendar
            </button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <AppLayout>
      <div className="px-4 pt-6 space-y-4">
        <h1 className="font-display text-xl font-bold">Clientes Inativos</h1>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl border-0 bg-secondary"
          />
        </div>

        <Tabs defaultValue="all">
          <TabsList className="w-full bg-secondary rounded-xl h-9">
            <TabsTrigger value="all" className="flex-1 text-xs rounded-lg">
              Todos ({inactiveClients.length})
            </TabsTrigger>
            <TabsTrigger value="b2b" className="flex-1 text-xs rounded-lg">
              B2B ({b2b.length})
            </TabsTrigger>
            <TabsTrigger value="b2c" className="flex-1 text-xs rounded-lg">
              B2C ({b2c.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-2 mt-3">
            {filterBySearch(inactiveClients).map(c => <ClientCard key={c.id} client={c} />)}
          </TabsContent>
          <TabsContent value="b2b" className="space-y-2 mt-3">
            {filterBySearch(b2b).map(c => <ClientCard key={c.id} client={c} />)}
          </TabsContent>
          <TabsContent value="b2c" className="space-y-2 mt-3">
            {filterBySearch(b2c).map(c => <ClientCard key={c.id} client={c} />)}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
