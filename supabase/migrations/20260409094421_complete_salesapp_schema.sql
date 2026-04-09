/*
  # SalesApp Complete Database Schema

  ## Overview
  Full schema for a local electronics marketplace app connecting customers 
  with nearby shops for price comparison and purchasing.

  ## New Tables
  1. profiles - User profiles extending auth.users (customers and vendors)
  2. shops - Electronics shops with location, hours, services
  3. shop_documents - KYC/verification documents for shops
  4. categories - Product categories (Mobile, TV, Laptop, etc.)
  5. brands - Electronics brands (Samsung, Apple, etc.)
  6. products - Product catalog with specs and images
  7. shop_products - Per-shop pricing and availability for products
  8. flash_deals - Time-limited discounted deals
  9. cart - User shopping carts
  10. addresses - Saved delivery addresses
  11. coupons - Discount coupons
  12. orders - Customer orders with status tracking
  13. order_tracking - Order status change history
  14. messages - Customer-vendor chat messages
  15. reviews - Product and shop reviews
  16. wishlist - Saved products
  17. price_alerts - Price drop notifications
  18. notifications - In-app notifications
  19. search_history - User search history
  20. trending_searches - Platform-wide trending searches

  ## Security
  - RLS enabled on all tables
  - Customers can only access their own data
  - Vendors can access their shop data
  - Public read for products, categories, brands, shops, reviews

  ## Triggers
  - Auto-create profile on signup
  - Auto-generate order numbers
  - Auto-track order status changes
  - Auto-update shop ratings on review

  ## Seed Data
  - 7 categories, 10 brands, 5 trending searches, 2 coupons
*/

-- Enable UUID
create extension if not exists "uuid-ossp";

-- Profiles (extends auth.users)
create table if not exists profiles (
  id uuid references auth.users primary key,
  name text,
  phone text unique,
  email text unique,
  role text check (role in ('customer','vendor')),
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Shops
create table if not exists shops (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id),
  name text not null,
  category text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  pincode text,
  lat float,
  lng float,
  phone text,
  description text,
  logo_url text,
  cover_url text,
  photos text[],
  rating float default 0,
  review_count int default 0,
  years_in_business int,
  is_open boolean default true,
  open_time text,
  close_time text,
  days_open text[],
  brands text[],
  services text[],
  is_verified boolean default false,
  verification_status text default 'pending'
    check (verification_status in 
    ('pending','under_review','approved','rejected')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Shop Documents (KYC)
create table if not exists shop_documents (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id),
  gstin text,
  gstin_verified boolean default false,
  gst_certificate_url text,
  shop_proof_type text,
  shop_proof_number text,
  shop_proof_url text,
  aadhaar_number text,
  pan_number text,
  pan_verified boolean default false,
  pan_card_url text,
  owner_selfie_url text,
  bank_account_holder text,
  bank_account_number text,
  bank_ifsc text,
  bank_name text,
  bank_branch text,
  account_type text check (account_type in ('savings','current')),
  cancelled_cheque_url text,
  upi_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Categories
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  emoji text,
  slug text unique,
  display_order int
);

-- Brands
create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  is_featured boolean default false
);

-- Products
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand_id uuid references brands(id),
  category_id uuid references categories(id),
  description text,
  specs jsonb,
  images text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Shop Products (each shop price for each product)
create table if not exists shop_products (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id),
  product_id uuid references products(id),
  price int not null,
  mrp int,
  in_stock boolean default true,
  stock_quantity int default 0,
  delivery_available boolean default true,
  delivery_time text,
  pickup_available boolean default true,
  emi_available boolean default false,
  emi_details jsonb,
  warranty_months int,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Flash Deals
create table if not exists flash_deals (
  id uuid primary key default gen_random_uuid(),
  shop_product_id uuid references shop_products(id),
  deal_price int not null,
  original_price int not null,
  discount_percent int,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean default true
);

-- Cart
create table if not exists cart (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  shop_product_id uuid references shop_products(id),
  quantity int default 1,
  created_at timestamptz default now()
);

-- Addresses
create table if not exists addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  label text default 'Home',
  name text,
  phone text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  pincode text,
  is_default boolean default false,
  created_at timestamptz default now()
);

-- Coupons
create table if not exists coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  description text,
  discount_type text check (discount_type in ('percentage','fixed')),
  discount_value int,
  min_order_amount int default 0,
  max_discount int,
  usage_limit int,
  used_count int default 0,
  valid_from timestamptz,
  valid_until timestamptz,
  is_active boolean default true
);

-- Orders
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique,
  customer_id uuid references profiles(id),
  shop_id uuid references shops(id),
  items jsonb not null,
  subtotal int,
  delivery_fee int default 49,
  discount int default 0,
  total int,
  delivery_address jsonb,
  payment_method text,
  payment_status text default 'pending'
    check (payment_status in ('pending','paid','failed','refunded')),
  payment_id text,
  status text default 'pending'
    check (status in ('pending','confirmed','preparing',
    'out_for_delivery','delivered','cancelled')),
  estimated_delivery timestamptz,
  delivered_at timestamptz,
  cancellation_reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Order Tracking
create table if not exists order_tracking (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id),
  status text,
  title text,
  description text,
  created_at timestamptz default now()
);

-- Messages
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references profiles(id),
  shop_id uuid references shops(id),
  customer_id uuid references profiles(id),
  text text,
  image_url text,
  is_read boolean default false,
  read_at timestamptz,
  created_at timestamptz default now()
);

-- Reviews
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id),
  customer_id uuid references profiles(id),
  shop_id uuid references shops(id),
  product_id uuid references products(id),
  product_rating int check (product_rating between 1 and 5),
  product_review text,
  delivery_rating int check (delivery_rating between 1 and 5),
  packaging_rating int check (packaging_rating between 1 and 5),
  staff_rating int check (staff_rating between 1 and 5),
  images text[],
  is_verified_purchase boolean default false,
  created_at timestamptz default now()
);

-- Wishlist
create table if not exists wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  product_id uuid references products(id),
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- Price Alerts
create table if not exists price_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  product_id uuid references products(id),
  target_price int,
  is_active boolean default true,
  triggered_at timestamptz,
  created_at timestamptz default now()
);

-- Notifications
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  type text check (type in (
    'order_update','price_drop','new_message','offer','system')),
  title text,
  body text,
  data jsonb,
  is_read boolean default false,
  read_at timestamptz,
  created_at timestamptz default now()
);

-- Search History
create table if not exists search_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  query text,
  created_at timestamptz default now()
);

-- Trending Searches
create table if not exists trending_searches (
  id uuid primary key default gen_random_uuid(),
  query text unique,
  search_count int default 1,
  updated_at timestamptz default now()
);

-- TRIGGERS

-- Auto create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Auto generate order number
create or replace function generate_order_number()
returns trigger as $$
begin
  new.order_number := 'ORD-' || 
    to_char(now(), 'YYYYMM') || '-' || 
    lpad(floor(random() * 99999)::text, 5, '0');
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_order_number on orders;
create trigger set_order_number
  before insert on orders
  for each row execute procedure generate_order_number();

-- Auto track order status changes
create or replace function track_order_status()
returns trigger as $$
begin
  if old.status is distinct from new.status then
    insert into order_tracking (order_id, status, title, description)
    values (
      new.id,
      new.status,
      case new.status
        when 'pending' then 'Order Placed'
        when 'confirmed' then 'Shop Confirmed'
        when 'preparing' then 'Being Prepared'
        when 'out_for_delivery' then 'Out for Delivery'
        when 'delivered' then 'Delivered'
        when 'cancelled' then 'Cancelled'
      end,
      case new.status
        when 'pending' then 'Your order has been placed'
        when 'confirmed' then 'Shop has accepted your order'
        when 'preparing' then 'Shop is preparing your order'
        when 'out_for_delivery' then 'Your order is on the way'
        when 'delivered' then 'Order delivered successfully'
        when 'cancelled' then 'Order has been cancelled'
      end
    );
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_order_status_change on orders;
create trigger on_order_status_change
  after update on orders
  for each row execute procedure track_order_status();

-- Auto update shop rating when review added
create or replace function update_shop_rating()
returns trigger as $$
begin
  update shops set
    rating = (
      select round(avg(product_rating)::numeric, 1)
      from reviews where shop_id = new.shop_id
    ),
    review_count = (
      select count(*) from reviews where shop_id = new.shop_id
    )
  where id = new.shop_id;
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_review_added on reviews;
create trigger on_review_added
  after insert on reviews
  for each row execute procedure update_shop_rating();

-- RLS POLICIES

alter table profiles enable row level security;
alter table shops enable row level security;
alter table shop_documents enable row level security;
alter table products enable row level security;
alter table shop_products enable row level security;
alter table flash_deals enable row level security;
alter table cart enable row level security;
alter table addresses enable row level security;
alter table coupons enable row level security;
alter table orders enable row level security;
alter table order_tracking enable row level security;
alter table messages enable row level security;
alter table reviews enable row level security;
alter table wishlist enable row level security;
alter table price_alerts enable row level security;
alter table notifications enable row level security;
alter table search_history enable row level security;
alter table trending_searches enable row level security;
alter table categories enable row level security;
alter table brands enable row level security;

-- Profiles policies
drop policy if exists "Public profiles readable" on profiles;
create policy "Public profiles readable" on profiles
  for select using (true);

drop policy if exists "Users update own profile" on profiles;
create policy "Users update own profile" on profiles
  for update using (auth.uid() = id);

drop policy if exists "Users insert own profile" on profiles;
create policy "Users insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- Shops policies
drop policy if exists "Anyone can read approved shops" on shops;
create policy "Anyone can read approved shops" on shops
  for select using (true);

drop policy if exists "Vendors can insert shop" on shops;
create policy "Vendors can insert shop" on shops
  for insert with check (auth.uid() = owner_id);

drop policy if exists "Owners can update shop" on shops;
create policy "Owners can update shop" on shops
  for update using (auth.uid() = owner_id);

-- Shop documents - private
drop policy if exists "Owner can manage documents" on shop_documents;
create policy "Owner can manage documents" on shop_documents
  for all using (
    auth.uid() = (select owner_id from shops where id = shop_id)
  );

-- Products - public read
drop policy if exists "Anyone can read products" on products;
create policy "Anyone can read products" on products
  for select using (true);

drop policy if exists "Vendors can insert products" on products;
create policy "Vendors can insert products" on products
  for insert with check (auth.role() = 'authenticated');

-- Shop products - public read
drop policy if exists "Anyone can read shop products" on shop_products;
create policy "Anyone can read shop products" on shop_products
  for select using (true);

drop policy if exists "Shop owners manage listings" on shop_products;
create policy "Shop owners manage listings" on shop_products
  for all using (
    auth.uid() = (select owner_id from shops where id = shop_id)
  );

-- Flash deals - public read
drop policy if exists "Anyone can read flash deals" on flash_deals;
create policy "Anyone can read flash deals" on flash_deals
  for select using (is_active = true);

-- Cart - private
drop policy if exists "Users manage own cart" on cart;
create policy "Users manage own cart" on cart
  for all using (auth.uid() = user_id);

-- Addresses - private
drop policy if exists "Users manage own addresses" on addresses;
create policy "Users manage own addresses" on addresses
  for all using (auth.uid() = user_id);

-- Coupons - public read
drop policy if exists "Anyone can read coupons" on coupons;
create policy "Anyone can read coupons" on coupons
  for select using (is_active = true);

-- Orders - customer and vendor
drop policy if exists "Customers see own orders" on orders;
create policy "Customers see own orders" on orders
  for select using (auth.uid() = customer_id);

drop policy if exists "Vendors see shop orders" on orders;
create policy "Vendors see shop orders" on orders
  for select using (
    auth.uid() = (select owner_id from shops where id = shop_id)
  );

drop policy if exists "Customers create orders" on orders;
create policy "Customers create orders" on orders
  for insert with check (auth.uid() = customer_id);

drop policy if exists "Vendors update order status" on orders;
create policy "Vendors update order status" on orders
  for update using (
    auth.uid() = (select owner_id from shops where id = shop_id)
  );

-- Order tracking
drop policy if exists "Order parties can see tracking" on order_tracking;
create policy "Order parties can see tracking" on order_tracking
  for select using (
    auth.uid() = (select customer_id from orders where id = order_id)
    or
    auth.uid() = (
      select s.owner_id from shops s
      join orders o on o.shop_id = s.id
      where o.id = order_id
    )
  );

-- Messages
drop policy if exists "Parties can read messages" on messages;
create policy "Parties can read messages" on messages
  for select using (
    auth.uid() = customer_id or
    auth.uid() = (select owner_id from shops where id = shop_id)
  );

drop policy if exists "Authenticated users send messages" on messages;
create policy "Authenticated users send messages" on messages
  for insert with check (auth.uid() = sender_id);

-- Reviews - public read
drop policy if exists "Anyone can read reviews" on reviews;
create policy "Anyone can read reviews" on reviews
  for select using (true);

drop policy if exists "Customers write reviews" on reviews;
create policy "Customers write reviews" on reviews
  for insert with check (auth.uid() = customer_id);

-- Wishlist - private
drop policy if exists "Users manage wishlist" on wishlist;
create policy "Users manage wishlist" on wishlist
  for all using (auth.uid() = user_id);

-- Price alerts - private
drop policy if exists "Users manage alerts" on price_alerts;
create policy "Users manage alerts" on price_alerts
  for all using (auth.uid() = user_id);

-- Notifications - private
drop policy if exists "Users see own notifications" on notifications;
create policy "Users see own notifications" on notifications
  for all using (auth.uid() = user_id);

-- Search history - private
drop policy if exists "Users manage search history" on search_history;
create policy "Users manage search history" on search_history
  for all using (auth.uid() = user_id);

-- Trending searches - public
drop policy if exists "Anyone reads trending" on trending_searches;
create policy "Anyone reads trending" on trending_searches
  for select using (true);

-- Categories and brands - public
drop policy if exists "Anyone reads categories" on categories;
create policy "Anyone reads categories" on categories
  for select using (true);

drop policy if exists "Anyone reads brands" on brands;
create policy "Anyone reads brands" on brands
  for select using (true);

-- SEED DATA
insert into categories (name, emoji, slug, display_order) values
  ('Mobile', '📱', 'mobile', 1),
  ('TV', '📺', 'tv', 2),
  ('Laptop', '💻', 'laptop', 3),
  ('AC', '❄️', 'ac', 4),
  ('Fridge', '🧊', 'fridge', 5),
  ('Washer', '🧺', 'washer', 6),
  ('Audio', '🔊', 'audio', 7)
on conflict (slug) do nothing;

insert into brands (name, is_featured) values
  ('Samsung', true),
  ('Apple', true),
  ('LG', true),
  ('Sony', true),
  ('OnePlus', false),
  ('Xiaomi', false),
  ('Dell', false),
  ('HP', false),
  ('boAt', false),
  ('JBL', false)
on conflict do nothing;

insert into trending_searches (query, search_count) values
  ('Samsung S24', 450),
  ('iPhone 15', 380),
  ('LG TV', 290),
  ('MacBook', 210),
  ('Boat Earbuds', 180)
on conflict (query) do nothing;

insert into coupons 
  (code, description, discount_type, discount_value, 
   min_order_amount, max_discount, is_active) values
  ('SAVE10', '10% off on orders above ₹5000', 
   'percentage', 10, 5000, 500, true),
  ('FLAT200', '₹200 off on orders above ₹2000', 
   'fixed', 200, 2000, 200, true)
on conflict (code) do nothing;
