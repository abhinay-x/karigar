import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import pages
import HomePage from './pages/HomePage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import StorefrontPage from './pages/StorefrontPage';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage';
import AddProductPage from './pages/AddProductPage';
import AIAssistantPage from './pages/AIAssistantPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';

// Import components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import { AuthProvider } from './context/AuthContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

// Root layout that ensures AuthProvider runs within Router context
function Root() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { background: '#363636', color: '#fff' },
            }}
          />
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
}

const router = createBrowserRouter(
  [
    {
      element: <Root />,
      children: [
        // Public routes
        { path: '/', element: <HomePage /> },
        { path: '/login', element: <LoginPage /> },
        { path: '/signup', element: <SignupPage /> },

        // Protected routes wrapper
        {
          element: <ProtectedRoute />,
          children: [
            { path: '/onboarding', element: <OnboardingPage /> },
            { path: '/dashboard', element: <DashboardPage /> },
            { path: '/products', element: <ProductsPage /> },
            { path: '/products/new', element: <AddProductPage /> },
            { path: '/storefront', element: <StorefrontPage /> },
            { path: '/profile', element: <ProfilePage /> },
            { path: '/ai-assistant', element: <AIAssistantPage /> },
            { path: '/analytics', element: <AnalyticsPage /> },
          ],
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
