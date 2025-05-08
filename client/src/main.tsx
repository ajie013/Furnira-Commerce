import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import App from './App.tsx'
import { Toaster } from 'react-hot-toast';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 

const queryClient = new QueryClient()

ModuleRegistry.registerModules([AllCommunityModule]);

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    
    <App />
    <Toaster />
  </QueryClientProvider>,
)
