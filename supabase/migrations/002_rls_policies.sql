-- Row Level Security Policies
-- V1: Secure all tables with appropriate policies

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE opening_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user has specific role
CREATE OR REPLACE FUNCTION has_role(required_role user_role)
RETURNS BOOLEAN AS $$
DECLARE
  user_role_val user_role;
BEGIN
  SELECT role INTO user_role_val
  FROM admin_profiles
  WHERE user_id = auth.uid();

  IF user_role_val IS NULL THEN
    RETURN FALSE;
  END IF;

  -- ADMIN > MANAGER > STAFF
  CASE required_role
    WHEN 'STAFF' THEN RETURN user_role_val IN ('ADMIN', 'MANAGER', 'STAFF');
    WHEN 'MANAGER' THEN RETURN user_role_val IN ('ADMIN', 'MANAGER');
    WHEN 'ADMIN' THEN RETURN user_role_val = 'ADMIN';
    ELSE RETURN FALSE;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PUBLIC ACCESS POLICIES (anon key)
-- ============================================

-- Categories: public can read active categories
CREATE POLICY "Public can view active categories"
ON categories FOR SELECT
TO anon, authenticated
USING (active = true);

-- Products: public can view active (non-deleted) products
CREATE POLICY "Public can view active products"
ON products FOR SELECT
TO anon, authenticated
USING (deleted_at IS NULL);

-- Product images: public can view images of active products
CREATE POLICY "Public can view product images"
ON product_images FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM products
    WHERE products.id = product_images.product_id
    AND products.deleted_at IS NULL
  )
);

-- Promotions: public can view active promotions within date range
CREATE POLICY "Public can view active promotions"
ON promotions FOR SELECT
TO anon, authenticated
USING (
  active = true
  AND start_date <= now()
  AND end_date >= now()
);

-- Promotion products: public can view for active promotions
CREATE POLICY "Public can view promotion products"
ON promotion_products FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM promotions
    WHERE promotions.id = promotion_products.promotion_id
    AND promotions.active = true
    AND promotions.start_date <= now()
    AND promotions.end_date >= now()
  )
);

-- Shop settings: public can view (singleton)
CREATE POLICY "Public can view shop settings"
ON shop_settings FOR SELECT
TO anon, authenticated
USING (true);

-- Opening hours: public can view
CREATE POLICY "Public can view opening hours"
ON opening_hours FOR SELECT
TO anon, authenticated
USING (true);

-- Analytics: public can insert (for tracking)
CREATE POLICY "Public can insert analytics events"
ON analytics_events FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- ============================================
-- ADMIN ACCESS POLICIES (authenticated + admin role)
-- ============================================

-- Categories: admins have full access
CREATE POLICY "Admins can manage categories"
ON categories FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Products: admins have full access
CREATE POLICY "Admins can manage products"
ON products FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Product images: admins have full access
CREATE POLICY "Admins can manage product images"
ON product_images FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Promotions: admins have full access
CREATE POLICY "Admins can manage promotions"
ON promotions FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Promotion products: admins have full access
CREATE POLICY "Admins can manage promotion products"
ON promotion_products FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Shop settings: admins have full access
CREATE POLICY "Admins can manage shop settings"
ON shop_settings FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Opening hours: admins have full access
CREATE POLICY "Admins can manage opening hours"
ON opening_hours FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Admin profiles: users can view their own profile, admins can manage all
CREATE POLICY "Users can view own admin profile"
ON admin_profiles FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Admins can manage admin profiles"
ON admin_profiles FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Analytics: admins can read all
CREATE POLICY "Admins can view analytics"
ON analytics_events FOR SELECT
TO authenticated
USING (is_admin());