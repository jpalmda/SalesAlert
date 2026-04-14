
-- Add price and margin to products
ALTER TABLE public.products
  ADD COLUMN unit_price numeric NOT NULL DEFAULT 0,
  ADD COLUMN profit_margin numeric NOT NULL DEFAULT 0;

-- Add address fields to clients
ALTER TABLE public.clients
  ADD COLUMN address text,
  ADD COLUMN neighborhood text,
  ADD COLUMN city text,
  ADD COLUMN state text,
  ADD COLUMN zip_code text;

-- Create sales_goals table
CREATE TABLE public.sales_goals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  month integer NOT NULL CHECK (month >= 1 AND month <= 12),
  year integer NOT NULL,
  target_amount numeric NOT NULL DEFAULT 0,
  achieved_amount numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, month, year)
);

ALTER TABLE public.sales_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own goals"
  ON public.sales_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Gestors can read all goals"
  ON public.sales_goals FOR SELECT
  USING (has_role(auth.uid(), 'gestor'::app_role));

CREATE POLICY "Gestors can insert goals"
  ON public.sales_goals FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'gestor'::app_role));

CREATE POLICY "Gestors can update goals"
  ON public.sales_goals FOR UPDATE
  USING (has_role(auth.uid(), 'gestor'::app_role));

CREATE POLICY "Users can update own achieved amount"
  ON public.sales_goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Gestors can delete goals"
  ON public.sales_goals FOR DELETE
  USING (has_role(auth.uid(), 'gestor'::app_role));

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_sales_goals_updated_at
  BEFORE UPDATE ON public.sales_goals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
