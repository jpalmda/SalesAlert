import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockClients, mockSalesHistory, mockProducts, getSuggestedProducts } from "@/lib/mock-data";
import { ArrowLeft, Star, ShoppingBag, Lightbulb, MessageCircle, CalendarPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const client = mockClients.find(c => c.id === id);
  const sales = useMemo(() => mockSalesHistory.filter(s => s.client_id === id), [id]);
  const suggestions = useMemo(
    () => getSuggestedProducts(id || "", mockSalesHistory, mockProducts),
    [id]
  );

  if (!client) {
    return (
      <AppLayout>
        <div className="px-4 pt-6">
          <p>Cliente não encontrado.</p>
        </div>
      </AppLayout>
    );
  }

  const daysSince = client.last_purchase_date
    ? Math.floor((Date.now() - new Date(client.last_purchase_date).getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  const totalSpent = sales.reduce((sum, s) => sum + s.total_amount, 0);

  return (
    <AppLayout>
      <div className="px-4 pt-4 space-y-4 animate-slide-up">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>

        {/* Client Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
            {client.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold flex items-center gap-2">
              {client.name}
              {client.is_vip && <Star className="h-4 w-4 text-primary fill-primary" />}
            </h1>
            <p className="text-sm text-muted-foreground">
              {client.type === "b2b_empresa" ? "Empresa (B2B)" : "Pessoa Física (B2C)"}
            </p>
            <div className="flex gap-1.5 mt-1.5">
              <Badge variant={daysSince > 60 ? "destructive" : "default"} className="text-[10px]">
                Inativo há {daysSince}d
              </Badge>
              {client.tags?.map(tag => (
                <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="default"
            className="h-11 rounded-xl gap-2"
            onClick={() => toast({ title: "Abrindo mensagem..." })}
          >
            <MessageCircle className="h-4 w-4" /> Mensagem
          </Button>
          <Button
            variant="outline"
            className="h-11 rounded-xl gap-2"
            onClick={() => toast({ title: "Visita agendada!" })}
          >
            <CalendarPlus className="h-4 w-4" /> Agendar
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-0 bg-secondary">
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold font-display">{sales.length}</p>
              <p className="text-[10px] text-muted-foreground">Compras</p>
            </CardContent>
          </Card>
          <Card className="border-0 bg-secondary">
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold font-display">R${totalSpent.toFixed(0)}</p>
              <p className="text-[10px] text-muted-foreground">Total gasto</p>
            </CardContent>
          </Card>
          <Card className="border-0 bg-secondary">
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold font-display">{daysSince}d</p>
              <p className="text-[10px] text-muted-foreground">Sem comprar</p>
            </CardContent>
          </Card>
        </div>

        {/* Purchase History */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 px-4 pt-4">
            <CardTitle className="text-sm font-display flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              Histórico de Compras
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {sales.length === 0 ? (
              <p className="text-xs text-muted-foreground">Nenhuma compra registrada.</p>
            ) : (
              <div className="space-y-2">
                {sales.map(sale => (
                  <div key={sale.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <p className="text-sm">
                      {new Date(sale.sale_date).toLocaleDateString("pt-BR")}
                    </p>
                    <p className="text-sm font-semibold">
                      R$ {sale.total_amount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cross-sell Suggestions */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 px-4 pt-4">
            <CardTitle className="text-sm font-display flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              Sugestões de Produtos
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-2">
              {suggestions.map(product => (
                <div key={product.id} className="rounded-xl bg-accent/50 p-3">
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {product.stock_quantity} em estoque
                  </p>
                  {product.is_highlight_of_day && (
                    <Badge className="mt-1 text-[9px] bg-primary/10 text-primary border-0">
                      ⭐ Destaque
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
