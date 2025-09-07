const fetch = require('node-fetch');

async function testProducts() {
  try {
    // Test store API
    const response = await fetch('http://localhost:9000/store/products', {
      headers: {
        'x-publishable-api-key': 'pk_a7fc7b2d6a0e0751c18e4ab6b373ef81c96bf066254c3c8e7c6a3df2ff678adc'
      }
    });
    
    const data = await response.json();
    console.log('Store API Response:');
    console.log(`- Total products: ${data.products?.length || 0}`);
    console.log(`- Response keys: ${Object.keys(data)}`);
    
    if (data.products && data.products.length > 0) {
      const firstProduct = data.products[0];
      console.log('\nFirst product:');
      console.log(`- Title: ${firstProduct.title}`);
      console.log(`- Status: ${firstProduct.status}`);
      console.log(`- Variants: ${firstProduct.variants?.length || 0}`);
      
      if (firstProduct.variants && firstProduct.variants.length > 0) {
        const firstVariant = firstProduct.variants[0];
        console.log(`- First variant calculated_price: ${JSON.stringify(firstVariant.calculated_price, null, 2)}`);
      }
    }
    
    // Test regions
    const regionsResponse = await fetch('http://localhost:9000/store/regions', {
      headers: {
        'x-publishable-api-key': 'pk_a7fc7b2d6a0e0751c18e4ab6b373ef81c96bf066254c3c8e7c6a3df2ff678adc'
      }
    });
    
    const regionsData = await regionsResponse.json();
    console.log('\nRegions API Response:');
    console.log(`- Total regions: ${regionsData.regions?.length || 0}`);
    if (regionsData.regions && regionsData.regions.length > 0) {
      console.log(`- First region: ${regionsData.regions[0].name} (${regionsData.regions[0].currency_code})`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testProducts();