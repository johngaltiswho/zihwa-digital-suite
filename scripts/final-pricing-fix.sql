-- Final Medusa v2 Pricing Fix - Create price sets for variants without prices

-- First, let's add missing price sets and link them
WITH variants_needing_prices AS (
    SELECT pv.id as variant_id
    FROM product_variant pv
    WHERE NOT EXISTS (
        SELECT 1 FROM product_variant_price_set pvps WHERE pvps.variant_id = pv.id
    )
),
new_price_sets AS (
    INSERT INTO price_set (id, created_at, updated_at)
    SELECT 
        'pset_' || substr(md5(random()::text || clock_timestamp()::text), 1, 26) as id,
        NOW() as created_at,
        NOW() as updated_at
    FROM variants_needing_prices
    RETURNING id
),
price_set_assignments AS (
    SELECT 
        vnp.variant_id,
        nps.id as price_set_id,
        'pvps_' || substr(md5(random()::text || vnp.variant_id::text), 1, 26) as pvps_id,
        row_number() OVER () as rn
    FROM variants_needing_prices vnp
    CROSS JOIN (SELECT id, row_number() OVER () as rn FROM new_price_sets) nps
    WHERE vnp.rn = nps.rn OR (vnp.rn IS NULL AND nps.rn = 1)
)
INSERT INTO product_variant_price_set (id, variant_id, price_set_id, created_at, updated_at)
SELECT 
    pvps_id,
    variant_id,
    price_set_id,
    NOW(),
    NOW()
FROM price_set_assignments;

-- Now add INR prices based on metadata
INSERT INTO price (id, amount, currency_code, price_set_id, created_at, updated_at)
SELECT 
    'price_' || substr(md5(random()::text || p.id::text), 1, 26) as id,
    (p.metadata->>'original_price')::integer * 100 as amount,
    'inr' as currency_code,
    ps.id as price_set_id,
    NOW() as created_at,
    NOW() as updated_at
FROM product p
JOIN product_variant pv ON p.id = pv.product_id
JOIN product_variant_price_set pvps ON pv.id = pvps.variant_id
JOIN price_set ps ON pvps.price_set_id = ps.id
WHERE p.metadata->>'original_price' IS NOT NULL
AND p.metadata->>'original_price' != '0'
AND p.metadata->>'original_price' != ''
AND NOT EXISTS (
    SELECT 1 FROM price pr 
    WHERE pr.price_set_id = ps.id AND pr.currency_code = 'inr'
);