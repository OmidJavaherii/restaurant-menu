import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = '/api/graphql';

// GraphQL queries and mutations
const QUERIES = {
  GET_ADMINS: `
    query GetAdmins {
      admins {
        id
        fullName
        idCard
      }
    }
  `,
  GET_ADMIN: `
    query GetAdmin($id: ID!) {
      admin(id: $id) {
        id
        fullName
        idCard
      }
    }
  `,
};

const MUTATIONS = {
  ADD_ADMIN: `
    mutation AddAdmin($input: AdminInput!) {
      addAdmin(input: $input) {
        id
        fullName
        idCard
      }
    }
  `,
  UPDATE_ADMIN: `
    mutation UpdateAdmin($id: ID!, $input: AdminInput!) {
      updateAdmin(id: $id, input: $input) {
        id
        fullName
        idCard
      }
    }
  `,
  DELETE_ADMIN: `
    mutation DeleteAdmin($id: ID!) {
      deleteAdmin(id: $id)
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

export function useAdmins() {
  const queryClient = useQueryClient();

  // Query for getting all admins
  const { data: admins, isLoading } = useQuery({
    queryKey: ['admins'],
    queryFn: () => fetchGraphQL(QUERIES.GET_ADMINS).then(data => data.admins),
  });

  // Query for getting a single admin
  const getAdmin = (id: string) => {
    return useQuery({
      queryKey: ['admin', id],
      queryFn: () => fetchGraphQL(QUERIES.GET_ADMIN, { id }).then(data => data.admin),
    });
  };

  // Mutation for adding an admin
  const addAdmin = useMutation({
    mutationFn: (input: any) => 
      fetchGraphQL(MUTATIONS.ADD_ADMIN, { input }).then(data => data.addAdmin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });

  // Mutation for updating an admin
  const updateAdmin = useMutation({
    mutationFn: ({ id, input }: { id: string; input: any }) =>
      fetchGraphQL(MUTATIONS.UPDATE_ADMIN, { id, input }).then(data => data.updateAdmin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });

  // Mutation for deleting an admin
  const deleteAdmin = useMutation({
    mutationFn: (id: string) =>
      fetchGraphQL(MUTATIONS.DELETE_ADMIN, { id }).then(data => data.deleteAdmin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });

  return {
    admins,
    isLoading,
    getAdmin,
    addAdmin,
    updateAdmin,
    deleteAdmin,
  };
} 