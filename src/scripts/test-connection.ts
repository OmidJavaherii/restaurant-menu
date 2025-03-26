import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import clientPromise from '../lib/mongodb.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: join(__dirname, '../../.env.local') });

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    const client = await clientPromise;
    const db = client.db();

    // Test 1: Check connection
    console.log('\n1. Testing connection...');
    await db.command({ ping: 1 });
    console.log('✓ Connection successful');

    // Test 2: Check collections
    console.log('\n2. Checking collections...');
    const collections = await db.listCollections().toArray();
    console.log('Found collections:', collections.map(c => c.name));
    console.log('✓ Collections check successful');

    // Test 3: Check products
    console.log('\n3. Testing products collection...');
    const products = await db.collection('products').find({}).toArray();
    console.log(`Found ${products.length} products`);
    console.log('✓ Products check successful');

    // Test 4: Check admins
    console.log('\n4. Testing admins collection...');
    const admins = await db.collection('admins').find({}).toArray();
    console.log(`Found ${admins.length} admins`);
    console.log('✓ Admins check successful');

    // Test 5: Check orders
    console.log('\n5. Testing orders collection...');
    const orders = await db.collection('orders').find({}).toArray();
    console.log(`Found ${orders.length} orders`);
    console.log('✓ Orders check successful');

    // Test 6: Test admin login
    console.log('\n6. Testing admin login...');
    const admin = await db.collection('admins').findOne({
      idCard: 'AD123456',
      password: 'admin123'
    });
    if (admin) {
      console.log('✓ Admin login successful');
      console.log('Admin details:', {
        id: admin._id,
        name: admin.fullName,
        idCard: admin.idCard
      });
    } else {
      console.log('✗ Admin login failed');
    }

    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Error during testing:', error);
    process.exit(1);
  } finally {
    await clientPromise.then(client => client.close());
    process.exit(0);
  }
}

testConnection(); 