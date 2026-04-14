import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { mockProducts, getLowStockProducts } from "@/lib/mock-data";
import { Package, Search, Plus, AlertTriangle, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Stock() {
  const [products, setProducts] = useState(mockProducts);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const lowStock = getLowStockProducts(products);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleRestock = () => {
    if (!selectedProduct || !quantity) return;
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      toast({ title: "Erro", description: "Quantidade inválida.", variant: "destructive" });
      return;
    }
    setProducts(prev =>
      prev.map(p =>
        p.id === selectedProduct
          ? { ...p, stock_quantity: p.stock_quantity + qty }
          : p
      )
    );
    toast({ title: "Estoque atualizado!", description: `+${qty} unidades adicionadas.` });
    setQuantity("");
    setSelectedProduct(null);
    setDialogOpen(false);
  };

  const getStockColor = (qty: number) => {
    if (qty <= 5) return "destructive";
    if (qty <= 10) return "default";
    return "secondary";
  };

  return (
    <AppLayout>
      <div className="px-4 pt-6 space-y-4 animate-slide-up">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl font-bold">Estoque</h1>
          <Badge variant="destructive" className="text-xs gap-1">
            <AlertTriangle className="h-3 w-3" />
            {lowStock.length} baixo
          </Badge>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl border-0 bg-secondary"
          />
        </div>

        {/* Low Stock Alert */}
        {lowStock.length > 0 && (
          <Card className="border-0 bg-destructive/5">
            <CardHeader className="pb-1 px-4 pt-3">
              <CardTitle className="text-xs font-display text-destructive flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                Reposição Urgente
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <div className="flex gap-2 flex-wrap">
                {lowStock.map(p => (
                  <Badge key={p.id} variant="destructive" className="text-[10px]">
                    {p.name} ({p.stock_quantity})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Product List */}
        <div className="space-y-2">
          {filteredProducts.map(product => (
            <Card key={product.id} className="border-0 shadow-sm">
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    product.stock_quantity <= 10 ? "bg-destructive/10" : "bg-secondary"
                  }`}>
                    <Package className={`h-5 w-5 ${
                      product.stock_quantity <= 10 ? "text-destructive" : "text-muted-foreground"
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium flex items-center gap-1">
                      {product.name}
                      {product.is_highlight_of_day && <Star className="h-3 w-3 text-primary fill-primary" />}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      ID: {product.smartpos_id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={getStockColor(product.stock_quantity)} className="text-xs tabular-nums">
                    {product.stock_quantity}
                  </Badge>
                  <Dialog open={dialogOpen && selectedProduct === product.id} onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (open) setSelectedProduct(product.id);
                  }}>
                    <DialogTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[340px] rounded-2xl">
                      <DialogHeader>
                        <DialogTitle className="font-display text-base">Repor: {product.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3 pt-2">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Quantidade a adicionar</Label>
                          <Input
                            type="number"
                            placeholder="Ex: 50"
                            value={quantity}
                            onChange={e => setQuantity(e.target.value)}
                            className="rounded-xl"
                            min={1}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Estoque atual: <strong>{product.stock_quantity}</strong> unidades
                        </p>
                        <Button onClick={handleRestock} className="w-full rounded-xl">
                          Confirmar Reposição
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
