import { useMutation } from '@tanstack/react-query';
import { create } from 'zustand';

const API_URL = '/api/graphql';

interface AuthStore {
  admin: any | null;
  setAdmin: (admin: any | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  admin: null,
  setAdmin: (admin) => set({ admin }),
}));

const LOGIN_MUTATION = `
  mutation LoginAdmin($idCard: String!, $password: String!) {
    loginAdmin(idCard: $idCard, password: $password) {
      id
      fullName
      idCard
    }
  }
`;

export function useAuth() {
  const { admin, setAdmin } = useAuthStore();

  const login = useMutation({
    mutationFn: async ({ idCard, password }: { idCard: string; password: string }) => {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: LOGIN_MUTATION,
          variables: { idCard, password },
        }),
      });

      const { data, errors } = await response.json();
      if (errors) throw new Error(errors[0].message);
      
      const loggedInAdmin = data.loginAdmin;
      setAdmin(loggedInAdmin);
      return loggedInAdmin;
    },
  });

  const logout = () => {
    setAdmin(null);
  };

  return {
    admin,
    login,
    logout,
    isAuthenticated: !!admin,
  };
} 