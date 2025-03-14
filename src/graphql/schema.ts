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
  }

  input ProductInput {
    title: String!
    img: String!
    description: String!
    price: Float!
    category: String!
  }

  type Query {
    admins: [Admin!]!
    admin(id: ID!): Admin
    products: [Product!]!
    product(id: ID!): Product
    productsByCategory(category: String!): [Product!]!
  }

  type Mutation {
    addProduct(input: ProductInput!): Product!
    updateProduct(id: ID!, input: ProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
    loginAdmin(idCard: String!, password: String!): Admin
  }
`; 