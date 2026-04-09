import { supabase } from './supabase'

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order')
  if (error) throw error
  return data
}

export async function getBrands() {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('name')
  if (error) throw error
  return data
}

export async function getShops() {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('verification_status', 'approved')
  if (error) throw error
  return data
}

export async function getShopById(id: string) {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function getProducts(filters?: {
  category?: string
  search?: string
  brand?: string
}) {
  let query = supabase
    .from('products')
    .select(`
      *,
      brands(name),
      categories(name, emoji),
      shop_products(price, shop_id, in_stock)
    `)

  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`)
  }
  if (filters?.category) {
    query = query.eq('categories.slug', filters.category)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      brands(name),
      categories(name, emoji),
      shop_products(
        id, price, mrp, in_stock,
        delivery_available, delivery_time,
        emi_available, warranty_months,
        shops(id, name, rating, address_line1, city)
      )
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function getFlashDeals() {
  const { data, error } = await supabase
    .from('flash_deals')
    .select(`
      *,
      shop_products(
        price,
        products(name, images)
      )
    `)
    .eq('is_active', true)
    .gt('ends_at', new Date().toISOString())
  if (error) throw error
  return data
}

export async function getCart(userId: string) {
  const { data, error } = await supabase
    .from('cart')
    .select(`
      *,
      shop_products(
        id, price,
        products(name, images),
        shops(id, name)
      )
    `)
    .eq('user_id', userId)
  if (error) throw error
  return data
}

export async function addToCart(
  userId: string,
  shopProductId: string,
  quantity: number = 1
) {
  const { data, error } = await supabase
    .from('cart')
    .upsert({
      user_id: userId,
      shop_product_id: shopProductId,
      quantity
    })
  if (error) throw error
  return data
}

export async function removeFromCart(cartId: string) {
  const { error } = await supabase
    .from('cart')
    .delete()
    .eq('id', cartId)
  if (error) throw error
}

export async function updateCartQuantity(cartId: string, quantity: number) {
  const { error } = await supabase
    .from('cart')
    .update({ quantity })
    .eq('id', cartId)
  if (error) throw error
}

export async function createOrder(orderData: {
  customerId: string
  shopId: string
  items: any[]
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
  deliveryAddress: any
  paymentMethod: string
}) {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      customer_id: orderData.customerId,
      shop_id: orderData.shopId,
      items: orderData.items,
      subtotal: orderData.subtotal,
      delivery_fee: orderData.deliveryFee,
      discount: orderData.discount,
      total: orderData.total,
      delivery_address: orderData.deliveryAddress,
      payment_method: orderData.paymentMethod,
      status: 'pending'
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getOrderById(orderId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_tracking(*),
      shops(name, phone)
    `)
    .eq('id', orderId)
    .single()
  if (error) throw error
  return data
}

export async function getMessages(shopId: string, customerId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('shop_id', shopId)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function sendMessage(
  senderId: string,
  shopId: string,
  customerId: string,
  text: string
) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: senderId,
      shop_id: shopId,
      customer_id: customerId,
      text
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getWishlist(userId: string) {
  const { data, error } = await supabase
    .from('wishlist')
    .select(`
      *,
      products(
        id, name, images,
        shop_products(price)
      )
    `)
    .eq('user_id', userId)
  if (error) throw error
  return data
}

export async function addToWishlist(userId: string, productId: string) {
  const { error } = await supabase
    .from('wishlist')
    .insert({ user_id: userId, product_id: productId })
  if (error) throw error
}

export async function removeFromWishlist(userId: string, productId: string) {
  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId)
  if (error) throw error
}

export async function getReviews(shopId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      profiles(name, avatar_url)
    `)
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function markNotificationRead(id: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function searchProducts(query: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      brands(name),
      shop_products(price, in_stock)
    `)
    .ilike('name', `%${query}%`)
  if (error) throw error
  return data
}

export async function getTrendingSearches() {
  const { data, error } = await supabase
    .from('trending_searches')
    .select('query')
    .order('search_count', { ascending: false })
    .limit(6)
  if (error) throw error
  return data
}

export async function getAddresses(userId: string) {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
  if (error) throw error
  return data
}

export async function saveAddress(userId: string, address: any) {
  const { data, error } = await supabase
    .from('addresses')
    .insert({ user_id: userId, ...address })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function validateCoupon(code: string, orderAmount: number) {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .maybeSingle()
  if (error || !data) return null
  if (data.min_order_amount > orderAmount) return null
  return data
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function updateProfile(userId: string, updates: any) {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
  if (error) throw error
}
