import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'

console.log("Vite Environment:", import.meta.env);

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error("Root element not found");

  createRoot(rootElement).render(
    <StrictMode>
      <AuthProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </AuthProvider>
    </StrictMode>,
  );
} catch (e) {
  console.error("CRASH DURING RENDER:", e);
  document.body.innerHTML = `<h1 style="color:red; padding: 20px;">Error Fatal: ${(e as Error).message}</h1>`;
}