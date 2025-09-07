-- Complete Medusa v2 Pricing Fix for INR

-- Step 1: Create price sets for variants that don't have them
INSERT INTO price_set (id, created_at, updated_at)
SELECT 
    'pset_' || replace(gen_random_uuid()::text, '-', '') as id,
    NOW() as created_at,
    NOW() as updated_at
FROM product_variant pv
WHERE NOT EXISTS (
    SELECT 1 FROM product_variant_price_set pvps WHERE pvps.variant_id = pv.id
);

-- Step 2: Link variants to price sets
INSERT INTO product_variant_price_set (variant_id, price_set_id, created_at, updated_at)
SELECT 
    pv.id as variant_id,
    ps.id as price_set_id,
    NOW() as created_at,
    NOW() as updated_at
FROM product_variant pv
CROSS JOIN LATERAL (
    SELECT id FROM price_set 
    WHERE NOT EXISTS (SELECT 1 FROM product_variant_price_set WHERE price_set_id = price_set.id)
    LIMIT 1
) ps
WHERE NOT EXISTS (
    SELECT 1 FROM product_variant_price_set pvps WHERE pvps.variant_id = pv.id
);

-- Step 3: Add INR prices based on original_price metadata
INSERT INTO price (id, amount, currency_code, price_set_id, created_at, updated_at)
SELECT 
    'price_' || replace(gen_random_uuid()::text, '-', '') as id,
    (p.metadata->>'original_price')::integer * 100 as amount, -- Convert to cents
    'inr' as currency_code,
    ps.id as price_set_id,
    NOW() as created_at,
    NOW() as updated_at
FROM product p
JOIN product_variant pv ON p.id = pv.product_id
JOIN product_variant_price_set pvps ON pv.id = pvps.variant_id
JOIN price_set ps ON pvps.price_set_id = ps.id
WHERE p.metadata->>'original_price' IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM price pr 
    WHERE pr.price_set_id = ps.id AND pr.currency_code = 'inr'
)
ON CONFLICT DO NOTHING;

-- Step 4: Verify pricing setup
SELECT 
    p.title,
    pv.title as variant_title,
    pr.amount / 100 as price_inr,
    pr.currency_code,
    p.metadata->>'original_price' as metadata_price
FROM product p
JOIN product_variant pv ON p.id = pv.product_id
LEFT JOIN product_variant_price_set pvps ON pv.id = pvps.variant_id
LEFT JOIN price_set ps ON pvps.price_set_id = ps.id
LEFT JOIN price pr ON ps.id = pr.price_set_id AND pr.currency_code = 'inr'
ORDER BY p.title
LIMIT 10;