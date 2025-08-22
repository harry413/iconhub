import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";
import './index.css'
import App from './App.jsx'
import LoadingScreen from "./components/LoadingScreen";


createRoot(document.getElementById('root')).render(
  <StrictMode>
        <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <AuthProvider>
          <App /> 
        </AuthProvider>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
