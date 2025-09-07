const { MedusaApp } = require('@medusajs/framework');

async function updatePricesFromMetadata() {
  const medusa = await MedusaApp({
    // Your Medusa configuration
  });

  try {
    // Get all products with metadata
    const { products } = await medusa.query(`
      SELECT p.id, p.metadata, pv.id as variant_id 
      FROM product p 
      JOIN product_variant pv ON p.id = pv.product_id 
      WHERE p.metadata->>'original_price' IS NOT NULL
    `);

    console.log(`Found ${products.length} products with original prices`);

    // Get India region
    const region = await medusa.query(`
      SELECT id FROM region WHERE name = 'India'
    `).then(result => result[0]);

    if (!region) {
      throw new Error('India region not found');
    }

    // Create/update prices
    for (const product of products) {
      const originalPrice = parseInt(product.metadata.original_price);
      
      await medusa.query(`
        INSERT INTO money_amount (currency_code, amount, variant_id, region_id) 
        VALUES ('inr', $1, $2, $3)
        ON CONFLICT (variant_id, region_id, currency_code) 
        DO UPDATE SET amount = EXCLUDED.amount
      `, [originalPrice * 100, product.variant_id, region.id]); // Medusa stores prices in cents

      console.log(`Updated price for product ${product.id}: ₹${originalPrice}`);
    }

    console.log('All prices updated successfully!');
  } catch (error) {
    console.error('Error updating prices:', error);
  }
}

updatePricesFromMetadata();