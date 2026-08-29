-- Seed Data for Local Shop Platform
-- V1: Realistic categories and products

-- Insert categories
INSERT INTO categories (name, slug, description, sort_order, active) VALUES
  ('Kitchen', 'kitchen', 'Cooking, dining, and kitchen essentials', 1, true),
  ('Cleaning', 'cleaning', 'Household cleaning products and supplies', 2, true),
  ('Bathroom', 'bathroom', 'Bathroom essentials and personal care', 3, true),
  ('Laundry', 'laundry', 'Laundry and clothing care products', 4, true),
  ('Home', 'home', 'General home decor and accessories', 5, true),
  ('Storage', 'storage', 'Organization and storage solutions', 6, true),
  ('Personal Care', 'personal-care', 'Personal hygiene and care products', 7, true),
  ('Other', 'other', 'Miscellaneous household items', 8, true)
ON CONFLICT (slug) DO NOTHING;

-- Get category IDs for product insertion
DO $$
DECLARE
  kitchen_id UUID;
  cleaning_id UUID;
  bathroom_id UUID;
  laundry_id UUID;
  home_id UUID;
  storage_id UUID;
  personal_care_id UUID;
  other_id UUID;
BEGIN
  SELECT id INTO kitchen_id FROM categories WHERE slug = 'kitchen';
  SELECT id INTO cleaning_id FROM categories WHERE slug = 'cleaning';
  SELECT id INTO bathroom_id FROM categories WHERE slug = 'bathroom';
  SELECT id INTO laundry_id FROM categories WHERE slug = 'laundry';
  SELECT id INTO home_id FROM categories WHERE slug = 'home';
  SELECT id INTO storage_id FROM categories WHERE slug = 'storage';
  SELECT id INTO personal_care_id FROM categories WHERE slug = 'personal-care';
  SELECT id INTO other_id FROM categories WHERE slug = 'other';

  -- Insert products with realistic prices (in cents)
  INSERT INTO products (title, slug, description, price_cents, availability, category_id, brand, sku, dimensions, is_featured, is_new_arrival) VALUES
    -- Kitchen
    ('Ceramic Mug', 'ceramic-mug', 'Classic white ceramic mug, 350ml capacity. Perfect for coffee or tea.', 899, 'AVAILABLE', kitchen_id, 'HomeEssentials', 'MUG-CER-001', '{"width": 8, "height": 10, "depth": 8, "unit": "cm"}', true, true),
    ('Glass Teacup Set', 'glass-teacup-set', 'Set of 2 double-wall glass teacups, 200ml each. Keeps tea hot longer.', 1599, 'AVAILABLE', kitchen_id, 'TeaTime', 'TEA-GLS-002', '{"width": 7, "height": 9, "depth": 7, "unit": "cm"}', true, false),
    ('Stainless Steel Teapot', 'stainless-steel-teapot', '1L stainless steel teapot with built-in infuser. Modern design.', 2499, 'AVAILABLE', kitchen_id, 'BrewMaster', 'TEA-SS-003', '{"width": 15, "height": 18, "depth": 12, "unit": "cm"}', false, true),
    ('Plastic Food Container Set', 'plastic-food-container-set', 'Set of 4 BPA-free food containers with snap-lock lids. Various sizes.', 1299, 'AVAILABLE', kitchen_id, 'FreshKeep', 'CON-PL-004', '{"width": 20, "height": 8, "depth": 15, "unit": "cm"}', true, false),
    ('Ceramic Plate Set', 'ceramic-plate-set', 'Set of 4 dinner plates, 26cm diameter. Microwave and dishwasher safe.', 1899, 'AVAILABLE', kitchen_id, 'DineWell', 'PLT-CER-005', '{"width": 26, "height": 2, "depth": 26, "unit": "cm"}', false, false),
    ('Ceramic Bowl Set', 'ceramic-bowl-set', 'Set of 4 soup/cereal bowls, 16cm diameter. Matching plate set available.', 1499, 'AVAILABLE', kitchen_id, 'DineWell', 'BWL-CER-006', '{"width": 16, "height": 5, "depth": 16, "unit": "cm"}', false, true),
    ('Kitchen Towel Set', 'kitchen-towel-set', 'Pack of 3 cotton kitchen towels, assorted colors. Highly absorbent.', 799, 'AVAILABLE', kitchen_id, 'HomeEssentials', 'TWL-KIT-007', '{"width": 50, "height": 70, "depth": 0, "unit": "cm"}', false, false),

    -- Cleaning
    ('Dishwashing Liquid', 'dishwashing-liquid', 'Concentrated dishwashing liquid, 500ml. Cuts through grease effectively.', 499, 'AVAILABLE', cleaning_id, 'CleanPro', 'CLN-DSH-001', '{"width": 7, "height": 20, "depth": 5, "unit": "cm"}', true, false),
    ('All-Purpose Cleaner', 'all-purpose-cleaner', 'Multi-surface cleaner spray, 750ml. Safe for most surfaces.', 599, 'AVAILABLE', cleaning_id, 'CleanPro', 'CLN-APC-002', '{"width": 8, "height": 25, "depth": 6, "unit": "cm"}', false, true),
    ('Cleaning Wipes', 'cleaning-wipes', 'Antibacterial cleaning wipes, pack of 80. Convenient for quick cleanups.', 399, 'AVAILABLE', cleaning_id, 'WipeFresh', 'CLN-WIP-003', '{"width": 18, "height": 12, "depth": 4, "unit": "cm"}', true, false),
    ('Glass Cleaner', 'glass-cleaner', 'Streak-free glass and window cleaner, 500ml spray.', 449, 'AVAILABLE', cleaning_id, 'CleanPro', 'CLN-GLS-004', '{"width": 7, "height": 20, "depth": 5, "unit": "cm"}', false, false),
    ('Floor Cleaner', 'floor-cleaner', 'Concentrated floor cleaner, 1L. Suitable for tile, wood, and laminate.', 699, 'AVAILABLE', cleaning_id, 'CleanPro', 'CLN-FLR-005', '{"width": 10, "height": 28, "depth": 6, "unit": "cm"}', false, false),

    -- Bathroom
    ('Liquid Hand Soap', 'liquid-hand-soap', 'Moisturizing liquid hand soap, 300ml pump bottle. Gentle formula.', 399, 'AVAILABLE', bathroom_id, 'PureCare', 'BTH-SOAP-001', '{"width": 6, "height": 18, "depth": 6, "unit": "cm"}', true, true),
    ('Bath Towel', 'bath-towel', 'Large bath towel, 70x140cm. 100% cotton, ultra-soft and absorbent.', 1299, 'AVAILABLE', bathroom_id, 'ComfortHome', 'BTH-TWL-002', '{"width": 70, "height": 140, "depth": 0, "unit": "cm"}', false, false),
    ('Hand Towel Set', 'hand-towel-set', 'Set of 2 hand towels, 50x90cm. Matching bath towel available.', 699, 'AVAILABLE', bathroom_id, 'ComfortHome', 'BTH-HND-003', '{"width": 50, "height": 90, "depth": 0, "unit": "cm"}', false, true),
    ('Toilet Paper', 'toilet-paper', 'Premium 3-ply toilet paper, 12 rolls. Soft and strong.', 799, 'AVAILABLE', bathroom_id, 'SoftTouch', 'BTH-TP-004', '{"width": 10, "height": 10, "depth": 10, "unit": "cm"}', true, false),
    ('Tissue Box', 'tissue-box', 'Facial tissues, 3-ply, 100 pulls. Decorative box design.', 299, 'AVAILABLE', bathroom_id, 'SoftTouch', 'BTH-TIS-005', '{"width": 22, "height": 12, "depth": 7, "unit": "cm"}', false, false),

    -- Laundry
    ('Clothes Pegs', 'clothes-pegs', 'Pack of 20 durable plastic clothes pegs. UV resistant.', 299, 'AVAILABLE', laundry_id, 'HomeEssentials', 'LND-PEG-001', '{"width": 9, "height": 3, "depth": 2, "unit": "cm"}', false, false),
    ('Laundry Basket', 'laundry-basket', 'Large woven laundry basket with handles, 60L capacity.', 1499, 'AVAILABLE', laundry_id, 'OrganizeIt', 'LND-BSK-002', '{"width": 45, "height": 55, "depth": 35, "unit": "cm"}', false, true),
    ('Detergent Liquid', 'detergent-liquid', 'Concentrated laundry detergent, 2L. For 40 washes.', 899, 'AVAILABLE', laundry_id, 'CleanPro', 'LND-DET-003', '{"width": 12, "height": 30, "depth": 8, "unit": "cm"}', true, false),

    -- Home
    ('Decorative Vase', 'decorative-vase', 'Ceramic decorative vase, 25cm tall. Modern minimalist design.', 1899, 'AVAILABLE', home_id, 'ArtisanHome', 'HME-VAS-001', '{"width": 15, "height": 25, "depth": 15, "unit": "cm"}', true, true),
    ('Photo Frame Set', 'photo-frame-set', 'Set of 3 wooden photo frames: 10x15, 13x18, 15x20cm.', 999, 'AVAILABLE', home_id, 'MemoryLane', 'HME-FRM-002', '{"width": 20, "height": 25, "depth": 2, "unit": "cm"}', false, false),
    ('Scented Candle', 'scented-candle', 'Soy wax scented candle, 200g. Lavender & vanilla scent. 40h burn time.', 699, 'AVAILABLE', home_id, 'AromaHome', 'HME-CND-003', '{"width": 8, "height": 10, "depth": 8, "unit": "cm"}', false, true),

    -- Storage
    ('Storage Box Set', 'storage-box-set', 'Set of 3 fabric storage boxes with lids, 30x30x30cm each. Foldable.', 1199, 'AVAILABLE', storage_id, 'OrganizeIt', 'STR-BOX-001', '{"width": 30, "height": 30, "depth": 30, "unit": "cm"}', true, false),
    ('Plastic Storage Bin', 'plastic-storage-bin', 'Clear plastic storage bin with lid, 45L. Stackable design.', 899, 'AVAILABLE', storage_id, 'OrganizeIt', 'STR-BIN-002', '{"width": 40, "height": 30, "depth": 30, "unit": "cm"}', false, false),
    ('Hanging Organizer', 'hanging-organizer', '6-pocket hanging organizer for closet or door. Breathable fabric.', 599, 'AVAILABLE', storage_id, 'OrganizeIt', 'STR-HNG-003', '{"width": 35, "height": 90, "depth": 2, "unit": "cm"}', false, true),

    -- Personal Care
    ('Toothbrush Set', 'toothbrush-set', 'Pack of 4 soft-bristle toothbrushes. Assorted colors.', 299, 'AVAILABLE', personal_care_id, 'PureCare', 'PC-TBR-001', '{"width": 2, "height": 19, "depth": 1, "unit": "cm"}', false, false),
    ('Shampoo Bottle', 'shampoo-bottle', 'Moisturizing shampoo, 400ml. Suitable for all hair types.', 599, 'AVAILABLE', personal_care_id, 'PureCare', 'PC-SHP-002', '{"width": 7, "height": 20, "depth": 5, "unit": "cm"}', false, true),
    ('Body Lotion', 'body-lotion', 'Hydrating body lotion, 300ml pump. Non-greasy formula.', 499, 'AVAILABLE', personal_care_id, 'PureCare', 'PC-LTN-003', '{"width": 6, "height": 18, "depth": 6, "unit": "cm"}', false, false),

    -- Other
    ('Ashtray', 'ashtray', 'Metal ashtray with lid, windproof design. Brushed stainless steel.', 499, 'AVAILABLE', other_id, 'HomeEssentials', 'OTH-ASH-001', '{"width": 10, "height": 4, "depth": 10, "unit": "cm"}', false, false),
    ('Umbrella', 'umbrella', 'Compact folding umbrella, 10 ribs. Wind-resistant frame.', 1299, 'AVAILABLE', other_id, 'RainGuard', 'OTH-UMB-002', '{"width": 5, "height": 28, "depth": 5, "unit": "cm"}', false, true)
  ON CONFLICT (slug) DO NOTHING;
END $$;

-- Insert shop settings (singleton)
INSERT INTO shop_settings (id, name, description, address, phone, whatsapp, email, latitude, longitude, google_maps_url)
VALUES (
  1,
  'Local Shop',
  'Your neighborhood shop for everyday household essentials. Quality products at fair prices since 1995.',
  '123 Main Street, Downtown, City 12345',
  '+1 (555) 123-4567',
  '+15551234567',
  'hello@localshop.example',
  40.7128,
  -74.0060,
  'https://maps.google.com/?q=123+Main+Street+Downtown+City'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  whatsapp = EXCLUDED.whatsapp,
  email = EXCLUDED.email,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  google_maps_url = EXCLUDED.google_maps_url;

-- Insert opening hours (0 = Sunday, 6 = Saturday)
INSERT INTO opening_hours (day_of_week, is_open, open_time, close_time) VALUES
  (0, false, NULL, NULL), -- Sunday closed
  (1, true, '09:00', '19:00'),  -- Monday
  (2, true, '09:00', '19:00'),  -- Tuesday
  (3, true, '09:00', '19:00'),  -- Wednesday
  (4, true, '09:00', '19:00'),  -- Thursday
  (5, true, '09:00', '20:00'),  -- Friday
  (6, true, '09:00', '17:00')   -- Saturday
ON CONFLICT (day_of_week) DO UPDATE SET
  is_open = EXCLUDED.is_open,
  open_time = EXCLUDED.open_time,
  close_time = EXCLUDED.close_time;

-- Insert sample promotions
DO $$
DECLARE
  promo_id UUID;
  ceramic_mug_id UUID;
  glass_teacup_id UUID;
  dishwashing_id UUID;
  hand_soap_id UUID;
  vase_id UUID;
BEGIN
  SELECT id INTO ceramic_mug_id FROM products WHERE slug = 'ceramic-mug';
  SELECT id INTO glass_teacup_id FROM products WHERE slug = 'glass-teacup-set';
  SELECT id INTO dishwashing_id FROM products WHERE slug = 'dishwashing-liquid';
  SELECT id INTO hand_soap_id FROM products WHERE slug = 'liquid-hand-soap';
  SELECT id INTO vase_id FROM products WHERE slug = 'decorative-vase';

  -- Kitchen promotion
  INSERT INTO promotions (title, description, promotional_price_cents, start_date, end_date, active)
  VALUES ('Kitchen Essentials Sale', 'Save on selected kitchen items this week!', 0, now() - interval '2 days', now() + interval '5 days', true)
  RETURNING id INTO promo_id;

  INSERT INTO promotion_products (promotion_id, product_id) VALUES
    (promo_id, ceramic_mug_id),
    (promo_id, glass_teacup_id)
  ON CONFLICT DO NOTHING;

  -- Update promotional prices for products in this promotion
  UPDATE products SET promotional_price_cents = 699 WHERE id = ceramic_mug_id;
  UPDATE products SET promotional_price_cents = 1299 WHERE id = glass_teacup_id;

  -- Cleaning promotion
  INSERT INTO promotions (title, description, promotional_price_cents, start_date, end_date, active)
  VALUES ('Cleaning Week', 'Stock up on cleaning supplies at reduced prices.', 0, now() - interval '1 day', now() + interval '6 days', true)
  RETURNING id INTO promo_id;

  INSERT INTO promotion_products (promotion_id, product_id) VALUES
    (promo_id, dishwashing_id),
    (promo_id, hand_soap_id)
  ON CONFLICT DO NOTHING;

  UPDATE products SET promotional_price_cents = 399 WHERE id = dishwashing_id;
  UPDATE products SET promotional_price_cents = 299 WHERE id = hand_soap_id;

  -- Home decor promotion
  INSERT INTO promotions (title, description, promotional_price_cents, start_date, end_date, active)
  VALUES ('Home Decor Special', 'Beautiful decor pieces for your home.', 0, now(), now() + interval '10 days', true)
  RETURNING id INTO promo_id;

  INSERT INTO promotion_products (promotion_id, product_id) VALUES
    (promo_id, vase_id)
  ON CONFLICT DO NOTHING;

  UPDATE products SET promotional_price_cents = 1499 WHERE id = vase_id;
END $$;