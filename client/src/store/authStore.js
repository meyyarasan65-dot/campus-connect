import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useAuthStore = create(
  devtools(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isInitialized: false,

      setAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),
      
      clearAuth: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),
        
      setInitialized: (status) => 
        set({ isInitialized: status }),
    }),
    { name: 'AuthStore' }
  )
);
