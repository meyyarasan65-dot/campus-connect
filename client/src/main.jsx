import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import './styles/index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents refetching every time you click back into the tab
      staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
      cacheTime: 10 * 60 * 1000, // Keep data in memory for 10 minutes
      retry: 1, // Only retry failed requests once instead of 3 times
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
