const db = require('./db');
const shopsWithItems = require('./data/shopsWithItems');

const seedData = () => {
  const shops = shopsWithItems.shops;

  console.log('🌱 Starting database seed...\n');

  // Counter for tracking completion
  let completed = 0;
  let total = shops.reduce((acc, shop) => acc + 1 + shop.items.length, 0);

  shops.forEach((shop) => {
    const { items, ...shopData } = shop;

    // Insert shop into database
    const shopQuery = `
      INSERT INTO shops 
      (id, name, type, description, address, phone, email, rating, reviews, openingTime, closingTime, deliveryTime, minOrder, deliveryCharge, image, featured) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const shopValues = [
      shopData.id,
      shopData.name,
      shopData.type,
      shopData.description,
      shopData.address,
      shopData.phone,
      shopData.email,
      shopData.rating,
      shopData.reviews,
      shopData.openingTime,
      shopData.closingTime,
      shopData.deliveryTime,
      shopData.minOrder,
      shopData.deliveryCharge,
      shopData.image,
      shopData.featured ? 1 : 0
    ];

    db.query(shopQuery, shopValues, (err, result) => {
      if (err) {
        console.log(`⚠️  Shop "${shopData.name}" - ${err.message}`);
      } else {
        console.log(`✅ Shop inserted: ${shopData.name}`);
      }
      completed++;

      // Insert items for this shop
      items.forEach((item) => {
        const itemQuery = `
          INSERT INTO items 
          (id, shopId, name, category, price, originalPrice, quantity, description, rating, reviews, image, inStock, discount) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const itemValues = [
          item.id,
          item.shopId,
          item.name,
          item.category,
          item.price,
          item.originalPrice,
          item.quantity,
          item.description,
          item.rating,
          item.reviews,
          item.image,
          item.inStock ? 1 : 0,
          item.discount
        ];

        db.query(itemQuery, itemValues, (err, result) => {
          if (err) {
            console.log(`⚠️  Item "${item.name}" - ${err.message}`);
          } else {
            console.log(`  ├─ Item: ${item.name} (₹${item.price})`);
          }
          completed++;

          // Check if all inserts are complete
          if (completed === total) {
            console.log(`\n🎉 Database seed completed!`);
            console.log(`📊 Inserted ${shops.length} shops and ${completed - shops.length} items`);
            process.exit(0);
          }
        });
      });
    });
  });

  // Timeout safety
  setTimeout(() => {
    console.log('\n⏱️  Seed operation timed out');
    process.exit(1);
  }, 30000);
};

// Run seed
seedData();
