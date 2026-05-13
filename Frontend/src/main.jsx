import { StrictMode } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import store from './redux/store';
import { hydrateAuth } from './redux/features/auth/authSlice';
import './index.css'
import App from './App.jsx'

// Ping the backend to verify database connectivity on app load
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

fetch(`${API_BASE_URL}/health`)
  .then((res) => res.json())
  .then((data) => {
    if (data.database === 'connected') {
      console.log('[Health] Database connection: OK', data);
    } else {
      console.warn('[Health] Database connection: UNAVAILABLE', data);
    }
  })
  .catch((err) => {
    console.error('[Health] Could not reach backend:', err);
  });

// Rehydrate auth state from localStorage on app boot
store.dispatch(hydrateAuth());

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
