-- Fix Medusa Pricing for INR
-- Run this after updating region currency to INR in admin

-- 1. Update region currency to INR
UPDATE region SET currency_code = 'inr' WHERE name = 'India';

-- 2. Insert prices for all variants based on original_price metadata
INSERT INTO money_amount (currency_code, amount, variant_id, region_id, created_at, updated_at)
SELECT 
    'inr' as currency_code,
    (p.metadata->>'original_price')::integer * 100 as amount, -- Convert to cents
    pv.id as variant_id,
    r.id as region_id,
    NOW() as created_at,
    NOW() as updated_at
FROM product p
JOIN product_variant pv ON p.id = pv.product_id
JOIN region r ON r.name = 'India'
WHERE p.metadata->>'original_price' IS NOT NULL
ON CONFLICT (variant_id, region_id, currency_code, price_list_id) 
DO UPDATE SET 
    amount = EXCLUDED.amount,
    updated_at = NOW();

-- 3. Verify the updates
SELECT 
    p.title,
    pv.title as variant_title,
    ma.amount / 100 as price_inr,
    ma.currency_code
FROM product p
JOIN product_variant pv ON p.id = pv.product_id
LEFT JOIN money_amount ma ON pv.id = ma.variant_id AND ma.currency_code = 'inr'
ORDER BY p.title
LIMIT 10;