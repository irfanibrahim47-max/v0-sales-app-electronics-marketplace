/*
  # Fix Security Issues

  1. Add indexes for all unindexed foreign keys to improve query performance
  2. Fix RLS policies to use (select auth.uid()) instead of auth.uid() directly
  3. Consolidate multiple permissive SELECT policies on orders and shop_products
  4. Fix function search_path to be immutable (set search_path = '')

  Tables affected:
  - addresses, cart, flash_deals, messages, notifications, order_tracking,
    orders, price_alerts, products, reviews, search_history, shop_documents,
    shop_products, shops, wishlist

  Functions affected:
  - handle_new_user, generate_order_number, track_order_status, update_shop_rating
*/

-- ============================================================
-- 1. ADD INDEXES FOR UNINDEXED FOREIGN KEYS
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses (user_id);
CREATE INDEX IF NOT EXISTS idx_cart_shop_product_id ON public.cart (shop_product_id);
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON public.cart (user_id);
CREATE INDEX IF NOT EXISTS idx_flash_deals_shop_product_id ON public.flash_deals (shop_product_id);
CREATE INDEX IF NOT EXISTS idx_messages_customer_id ON public.messages (customer_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages (sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_shop_id ON public.messages (shop_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_order_tracking_order_id ON public.order_tracking (order_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders (customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_shop_id ON public.orders (shop_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_product_id ON public.price_alerts (product_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_user_id ON public.price_alerts (user_id);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON public.products (brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products (category_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON public.reviews (customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_order_id ON public.reviews (order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews (product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_shop_id ON public.reviews (shop_id);
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON public.search_history (user_id);
CREATE INDEX IF NOT EXISTS idx_shop_documents_shop_id ON public.shop_documents (shop_id);
CREATE INDEX IF NOT EXISTS idx_shop_products_product_id ON public.shop_products (product_id);
CREATE INDEX IF NOT EXISTS idx_shop_products_shop_id ON public.shop_products (shop_id);
CREATE INDEX IF NOT EXISTS idx_shops_owner_id ON public.shops (owner_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_product_id ON public.wishlist (product_id);

-- ============================================================
-- 2. FIX RLS POLICIES: use (select auth.uid()) for performance
-- ============================================================

-- profiles
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

-- shops
DROP POLICY IF EXISTS "Vendors can insert shop" ON public.shops;
DROP POLICY IF EXISTS "Owners can update shop" ON public.shops;

CREATE POLICY "Vendors can insert shop"
  ON public.shops FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = owner_id);

CREATE POLICY "Owners can update shop"
  ON public.shops FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = owner_id)
  WITH CHECK ((select auth.uid()) = owner_id);

-- shop_documents
DROP POLICY IF EXISTS "Owner can manage documents" ON public.shop_documents;

CREATE POLICY "Owner can manage documents"
  ON public.shop_documents FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = shop_documents.shop_id
      AND shops.owner_id = (select auth.uid())
    )
  );

-- products
DROP POLICY IF EXISTS "Vendors can insert products" ON public.products;

CREATE POLICY "Vendors can insert products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.owner_id = (select auth.uid())
    )
  );

-- shop_products: fix the manage policy and consolidate SELECT policies
DROP POLICY IF EXISTS "Shop owners manage listings" ON public.shop_products;
DROP POLICY IF EXISTS "Anyone can read shop products" ON public.shop_products;

CREATE POLICY "Anyone can read shop products"
  ON public.shop_products FOR SELECT
  USING (true);

CREATE POLICY "Shop owners manage listings"
  ON public.shop_products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = shop_products.shop_id
      AND shops.owner_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = shop_products.shop_id
      AND shops.owner_id = (select auth.uid())
    )
  );

-- cart
DROP POLICY IF EXISTS "Users manage own cart" ON public.cart;

CREATE POLICY "Users manage own cart"
  ON public.cart FOR ALL
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- addresses
DROP POLICY IF EXISTS "Users manage own addresses" ON public.addresses;

CREATE POLICY "Users manage own addresses"
  ON public.addresses FOR ALL
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- orders: consolidate two SELECT policies into one and fix auth calls
DROP POLICY IF EXISTS "Customers see own orders" ON public.orders;
DROP POLICY IF EXISTS "Vendors see shop orders" ON public.orders;
DROP POLICY IF EXISTS "Customers create orders" ON public.orders;
DROP POLICY IF EXISTS "Vendors update order status" ON public.orders;

CREATE POLICY "Users see relevant orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = customer_id
    OR EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = orders.shop_id
      AND shops.owner_id = (select auth.uid())
    )
  );

CREATE POLICY "Customers create orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = customer_id);

CREATE POLICY "Vendors update order status"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = orders.shop_id
      AND shops.owner_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = orders.shop_id
      AND shops.owner_id = (select auth.uid())
    )
  );

-- order_tracking
DROP POLICY IF EXISTS "Order parties can see tracking" ON public.order_tracking;

CREATE POLICY "Order parties can see tracking"
  ON public.order_tracking FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_tracking.order_id
      AND (
        orders.customer_id = (select auth.uid())
        OR EXISTS (
          SELECT 1 FROM public.shops
          WHERE shops.id = orders.shop_id
          AND shops.owner_id = (select auth.uid())
        )
      )
    )
  );

-- messages
DROP POLICY IF EXISTS "Parties can read messages" ON public.messages;
DROP POLICY IF EXISTS "Authenticated users send messages" ON public.messages;

CREATE POLICY "Parties can read messages"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = customer_id
    OR (select auth.uid()) = sender_id
    OR EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = messages.shop_id
      AND shops.owner_id = (select auth.uid())
    )
  );

CREATE POLICY "Authenticated users send messages"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = sender_id);

-- reviews
DROP POLICY IF EXISTS "Customers write reviews" ON public.reviews;

CREATE POLICY "Customers write reviews"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = customer_id);

-- wishlist
DROP POLICY IF EXISTS "Users manage wishlist" ON public.wishlist;

CREATE POLICY "Users manage wishlist"
  ON public.wishlist FOR ALL
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- price_alerts
DROP POLICY IF EXISTS "Users manage alerts" ON public.price_alerts;

CREATE POLICY "Users manage alerts"
  ON public.price_alerts FOR ALL
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- notifications
DROP POLICY IF EXISTS "Users see own notifications" ON public.notifications;

CREATE POLICY "Users see own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- search_history
DROP POLICY IF EXISTS "Users manage search history" ON public.search_history;

CREATE POLICY "Users manage search history"
  ON public.search_history FOR ALL
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- ============================================================
-- 3. FIX FUNCTION SEARCH PATHS (set search_path = '')
-- ============================================================

ALTER FUNCTION public.handle_new_user() SET search_path = '';
ALTER FUNCTION public.generate_order_number() SET search_path = '';
ALTER FUNCTION public.track_order_status() SET search_path = '';
ALTER FUNCTION public.update_shop_rating() SET search_path = '';
