import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import clientPromise from '../lib/mongodb.js';
import db from '../data/db.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: join(__dirname, '../../.env.local') });

async function migrateData() {
  try {
    console.log('Starting data migration...');
    const client = await clientPromise;
    const database = client.db();

    // Clear existing collections
    console.log('Clearing existing collections...');
    await Promise.all([
      database.collection('products').deleteMany({}),
      database.collection('admins').deleteMany({}),
      database.collection('orders').deleteMany({})
    ]);

    // Migrate products
    if (db.products && db.products.length > 0) {
      console.log(`Migrating ${db.products.length} products...`);
      const result = await database.collection('products').insertMany(db.products);
      console.log(`Successfully migrated ${result.insertedCount} products`);
    }

    // Migrate admins
    if (db.admins && db.admins.length > 0) {
      console.log(`Migrating ${db.admins.length} admins...`);
      const result = await database.collection('admins').insertMany(db.admins);
      console.log(`Successfully migrated ${result.insertedCount} admins`);
    }

    // Migrate orders
    if (db.orders && db.orders.length > 0) {
      console.log(`Migrating ${db.orders.length} orders...`);
      const result = await database.collection('orders').insertMany(db.orders);
      console.log(`Successfully migrated ${result.insertedCount} orders`);
    }

    console.log('Data migration completed successfully');
  } catch (error) {
    console.error('Error migrating data:', error);
    process.exit(1);
  } finally {
    await clientPromise.then(client => client.close());
    process.exit(0);
  }
}

migrateData(); 