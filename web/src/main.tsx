import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
//import App from './App.tsx'
import LoginPage from './pages/login/loginPage.tsx';

let router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />
  },
]);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />,
  </StrictMode>,
)
