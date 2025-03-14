import db from '../data/db.json';

let products = [...db.products];
const admins = [...db.admins];

export const resolvers = {
  Query: {
    admins: () => admins,
    admin: (_: any, { id }: { id: string }) => 
      admins.find(admin => admin.id === parseInt(id)),
    
    products: () => products,
    product: (_: any, { id }: { id: string }) => 
      products.find(product => product.id === parseInt(id)),
    
    productsByCategory: (_: any, { category }: { category: string }) =>
      products.filter(product => product.category === category),
  },

  Mutation: {
    addProduct: (_: any, { input }: { input: any }) => {
      const newProduct = {
        id: products.length + 1,
        ...input,
      };
      products.push(newProduct);
      return newProduct;
    },

    updateProduct: (_: any, { id, input }: { id: string; input: any }) => {
      const index = products.findIndex(product => product.id === parseInt(id));
      if (index === -1) throw new Error('Product not found');

      products[index] = {
        ...products[index],
        ...input,
      };
      return products[index];
    },

    deleteProduct: (_: any, { id }: { id: string }) => {
      const index = products.findIndex(product => product.id === parseInt(id));
      if (index === -1) throw new Error('Product not found');

      products = products.filter(product => product.id !== parseInt(id));
      return true;
    },

    loginAdmin: (_: any, { idCard, password }: { idCard: string; password: string }) => {
      const admin = admins.find(
        admin => admin.idCard === idCard && admin.password === password
      );
      if (!admin) throw new Error('Invalid credentials');
      return admin;
    },
  },
}; 