import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = '/api/graphql';

// GraphQL queries and mutations
const QUERIES = {
  GET_PRODUCTS: `
    query GetProducts {
      products {
        id
        title
        img
        description
        price
        category
        stock
        discount
      }
    }
  `,
  GET_PRODUCT: `
    query GetProduct($id: ID!) {
      product(id: $id) {
        id
        title
        img
        description
        price
        category
        stock
        discount
      }
    }
  `,
};

const MUTATIONS = {
  ADD_PRODUCT: `
    mutation AddProduct($input: ProductInput!) {
      addProduct(input: $input) {
        id
        title
        img
        description
        price
        category
        stock
        discount
      }
    }
  `,
  UPDATE_PRODUCT: `
    mutation UpdateProduct($id: ID!, $input: ProductInput!) {
      updateProduct(id: $id, input: $input) {
        id
        title
        img
        description
        price
        category
        stock
        discount
      }
    }
  `,
  DELETE_PRODUCT: `
    mutation DeleteProduct($id: ID!) {
      deleteProduct(id: $id)
    }
  `,
};

// GraphQL fetcher function
const fetchGraphQL = async (query: string, variables = {}) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const { data, errors } = await response.json();
  if (errors) throw new Error(errors[0].message);
  return data;
};

export function useProducts() {
  const queryClient = useQueryClient();

  // Query for getting all products
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchGraphQL(QUERIES.GET_PRODUCTS).then(data => data.products),
  });

  // Query for getting a single product
  const getProduct = (id: string) => {
    return useQuery({
      queryKey: ['product', id],
      queryFn: () => fetchGraphQL(QUERIES.GET_PRODUCT, { id }).then(data => data.product),
    });
  };

  // Mutation for adding a product
  const addProduct = useMutation({
    mutationFn: (input: any) => 
      fetchGraphQL(MUTATIONS.ADD_PRODUCT, { input }).then(data => data.addProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  // Mutation for updating a product
  const updateProduct = useMutation({
    mutationFn: ({ id, input }: { id: string; input: any }) =>
      fetchGraphQL(MUTATIONS.UPDATE_PRODUCT, { id, input }).then(data => data.updateProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  // Mutation for deleting a product
  const deleteProduct = useMutation({
    mutationFn: (id: string) =>
      fetchGraphQL(MUTATIONS.DELETE_PRODUCT, { id }).then(data => data.deleteProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    products,
    isLoading,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
  };
} 