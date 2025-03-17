export const typeDefs = `#graphql
  type Admin {
    id: ID!
    fullName: String!
    idCard: String!
    password: String!
  }

  type Product {
    id: ID!
    title: String!
    img: String!
    description: String!
    price: Float!
    category: String!
    stock: Int!
    discount: Float
  }

  type OrderItem {
    productId: ID!
    title: String!
    price: Float!
    originalPrice: Float!
    discount: Float
    quantity: Int!
  }

  type Order {
    id: ID!
    items: [OrderItem!]!
    totalAmount: Float!
    status: String!
    createdAt: String!
    customerName: String
    customerPhone: String
    placeNumber: String
    description: String
  }

  input ProductInput {
    title: String!
    img: String!
    description: String!
    price: Float!
    category: String!
    stock: Int!
    discount: Float
  }

  input AdminInput {
    fullName: String!
    idCard: String!
    password: String!
  }

  input OrderItemInput {
    productId: ID!
    title: String!
    price: Float!
    originalPrice: Float!
    discount: Float
    quantity: Int!
  }

  input OrderInput {
    id: String
    items: [OrderItemInput!]!
    totalAmount: Float!
    customerName: String
    customerPhone: String
    placeNumber: String
    description: String
  }

  type Query {
    admins: [Admin!]!
    admin(id: ID!): Admin
    products: [Product!]!
    product(id: ID!): Product
    productsByCategory(category: String!): [Product!]!
    orders: [Order!]!
    order(id: ID!): Order
  }

  type Mutation {
    addProduct(input: ProductInput!): Product!
    updateProduct(id: ID!, input: ProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
    loginAdmin(idCard: String!, password: String!): Admin
    addAdmin(input: AdminInput!): Admin!
    updateAdmin(id: ID!, input: AdminInput!): Admin!
    deleteAdmin(id: ID!): Boolean!
    createOrder(input: OrderInput!): Order!
    updateOrderStatus(id: ID!, status: String!): Order!
  }
`; 