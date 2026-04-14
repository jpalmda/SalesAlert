// Mock data for offline-first / demo mode
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];
type Alert = Database["public"]["Tables"]["alerts_and_notifications"]["Row"];
type SaleHistory = Database["public"]["Tables"]["sales_history"]["Row"];
type RouteExpense = Database["public"]["Tables"]["routes_and_expenses"]["Row"];

export const mockClients: Client[] = [
  { id: "c1", smartpos_id: "SP001", name: "Padaria Estrela", type: "b2b_empresa", last_purchase_date: "2026-03-10T10:00:00Z", is_vip: true, tags: ["frequente", "volume alto"], created_at: "2026-01-01T00:00:00Z", address: "Rua das Flores, 123", neighborhood: "Centro", city: "São Paulo", state: "SP", zip_code: "01001-000" },
  { id: "c2", smartpos_id: "SP002", name: "Maria Silva", type: "b2c_fisica", last_purchase_date: "2026-02-15T10:00:00Z", is_vip: false, tags: ["inativo"], created_at: "2026-01-01T00:00:00Z", address: "Av. Brasil, 456", neighborhood: "Vila Nova", city: "São Paulo", state: "SP", zip_code: "02002-000" },
  { id: "c3", smartpos_id: "SP003", name: "Restaurante Sabor", type: "b2b_empresa", last_purchase_date: "2026-04-01T10:00:00Z", is_vip: true, tags: ["frequente"], created_at: "2026-01-01T00:00:00Z", address: "Rua Augusta, 789", neighborhood: "Consolação", city: "São Paulo", state: "SP", zip_code: "01305-000" },
  { id: "c4", smartpos_id: "SP004", name: "João Santos", type: "b2c_fisica", last_purchase_date: "2026-01-20T10:00:00Z", is_vip: false, tags: ["inativo", "reativar"], created_at: "2026-01-01T00:00:00Z", address: "Rua Vergueiro, 101", neighborhood: "Liberdade", city: "São Paulo", state: "SP", zip_code: "01504-000" },
  { id: "c5", smartpos_id: "SP005", name: "Café Central", type: "b2b_empresa", last_purchase_date: "2026-03-28T10:00:00Z", is_vip: false, tags: [], created_at: "2026-01-01T00:00:00Z", address: null, neighborhood: null, city: null, state: null, zip_code: null },
  { id: "c6", smartpos_id: "SP006", name: "Ana Oliveira", type: "b2c_fisica", last_purchase_date: "2026-04-10T10:00:00Z", is_vip: true, tags: ["frequente"], created_at: "2026-01-01T00:00:00Z", address: "Rua Oscar Freire, 55", neighborhood: "Pinheiros", city: "São Paulo", state: "SP", zip_code: "05409-000" },
];

export const mockProducts: Product[] = [
  { id: "p1", smartpos_id: "PR001", name: "Brigadeiro Gourmet", stock_quantity: 150, is_highlight_of_day: true, frequently_bought_with: ["p2", "p3"], created_at: "2026-01-01T00:00:00Z", unit_price: 5.50, profit_margin: 65 },
  { id: "p2", smartpos_id: "PR002", name: "Beijinho", stock_quantity: 80, is_highlight_of_day: false, frequently_bought_with: ["p1"], created_at: "2026-01-01T00:00:00Z", unit_price: 5.00, profit_margin: 60 },
  { id: "p3", smartpos_id: "PR003", name: "Trufa de Chocolate", stock_quantity: 5, is_highlight_of_day: true, frequently_bought_with: ["p1", "p4"], created_at: "2026-01-01T00:00:00Z", unit_price: 8.00, profit_margin: 55 },
  { id: "p4", smartpos_id: "PR004", name: "Coxinha de Doce de Leite", stock_quantity: 45, is_highlight_of_day: false, frequently_bought_with: ["p3"], created_at: "2026-01-01T00:00:00Z", unit_price: 7.00, profit_margin: 50 },
  { id: "p5", smartpos_id: "PR005", name: "Palha Italiana", stock_quantity: 3, is_highlight_of_day: false, frequently_bought_with: ["p1", "p2"], created_at: "2026-01-01T00:00:00Z", unit_price: 6.50, profit_margin: 58 },
  { id: "p6", smartpos_id: "PR006", name: "Bolo no Pote", stock_quantity: 200, is_highlight_of_day: true, frequently_bought_with: [], created_at: "2026-01-01T00:00:00Z", unit_price: 12.00, profit_margin: 45 },
];

export const mockAlerts: Alert[] = [
  { id: "a1", type: "inactive_client", title: "Cliente inativo há 30+ dias", message: "Maria Silva não compra há 58 dias. Considere uma visita.", is_read: false, related_client_id: "c2", created_at: "2026-04-14T08:00:00Z" },
  { id: "a2", type: "low_stock", title: "Estoque baixo: Trufa de Chocolate", message: "Apenas 5 unidades em estoque. Considere reposição urgente.", is_read: false, related_client_id: null, created_at: "2026-04-14T07:00:00Z" },
  { id: "a3", type: "inactive_client", title: "Cliente inativo há 60+ dias", message: "João Santos não compra há 84 dias. Alto risco de perda.", is_read: false, related_client_id: "c4", created_at: "2026-04-14T06:00:00Z" },
  { id: "a4", type: "urgent_alert", title: "Palha Italiana quase esgotada", message: "Apenas 3 unidades restantes. Reposição necessária hoje!", is_read: true, related_client_id: null, created_at: "2026-04-13T18:00:00Z" },
  { id: "a5", type: "inactive_client", title: "VIP sem compra recente", message: "Padaria Estrela (VIP) não compra há 35 dias.", is_read: false, related_client_id: "c1", created_at: "2026-04-14T09:00:00Z" },
];

export const mockSalesHistory: SaleHistory[] = [
  { id: "s1", smartpos_id: "SH001", client_id: "c1", total_amount: 450.0, sale_date: "2026-03-10T10:00:00Z" },
  { id: "s2", smartpos_id: "SH002", client_id: "c1", total_amount: 380.0, sale_date: "2026-02-20T10:00:00Z" },
  { id: "s3", smartpos_id: "SH003", client_id: "c2", total_amount: 45.0, sale_date: "2026-02-15T10:00:00Z" },
  { id: "s4", smartpos_id: "SH004", client_id: "c3", total_amount: 620.0, sale_date: "2026-04-01T10:00:00Z" },
  { id: "s5", smartpos_id: "SH005", client_id: "c4", total_amount: 32.0, sale_date: "2026-01-20T10:00:00Z" },
  { id: "s6", smartpos_id: "SH006", client_id: "c6", total_amount: 78.0, sale_date: "2026-04-10T10:00:00Z" },
];

export const mockRoutes: RouteExpense[] = [
  { id: "r1", user_id: "u1", date: "2026-04-14", route_notes: "Centro → Bairro Estrela → Vila Nova", fuel_expense: 45.0, toll_expense: 12.0, created_at: "2026-04-14T07:00:00Z" },
  { id: "r2", user_id: "u1", date: "2026-04-13", route_notes: "Zona Sul → Centro Comercial", fuel_expense: 38.0, toll_expense: 0, created_at: "2026-04-13T07:00:00Z" },
];

// Cross-sell suggestion logic
export function getSuggestedProducts(clientId: string, salesHistory: SaleHistory[], products: Product[]): Product[] {
  const clientSales = salesHistory.filter(s => s.client_id === clientId);
  if (clientSales.length === 0) return products.filter(p => p.is_highlight_of_day);

  // Get all products frequently bought together with products client has purchased
  const suggestedIds = new Set<string>();
  // Since we don't have product IDs in sales, suggest highlights + random products
  products.forEach(p => {
    if (p.is_highlight_of_day) suggestedIds.add(p.id);
    p.frequently_bought_with?.forEach(id => suggestedIds.add(id));
  });

  return products.filter(p => suggestedIds.has(p.id)).slice(0, 4);
}

export function getInactiveClients(clients: Client[], daysThreshold = 30): Client[] {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - daysThreshold);
  return clients.filter(c => {
    if (!c.last_purchase_date) return true;
    return new Date(c.last_purchase_date) < threshold;
  });
}

export function getLowStockProducts(products: Product[], threshold = 10): Product[] {
  return products.filter(p => p.stock_quantity <= threshold);
}
