-- Fix Medusa v2 Pricing for INR
-- Medusa v2 uses price_set and price tables

-- 1. Update region currency to INR
UPDATE region SET currency_code = 'inr' WHERE name = 'India';

-- 2. Check current pricing structure
SELECT 
    p.title,
    pv.title as variant_title,
    ps.id as price_set_id,
    pr.amount,
    pr.currency_code
FROM product p
JOIN product_variant pv ON p.id = pv.product_id
LEFT JOIN product_variant_price_set pvps ON pv.id = pvps.variant_id
LEFT JOIN price_set ps ON pvps.price_set_id = ps.id
LEFT JOIN price pr ON ps.id = pr.price_set_id
WHERE p.title LIKE '%Adhesive%'
LIMIT 5;