import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

const STORAGE_KEY = 'kala_ai_token';
const USER_STORAGE_KEY = 'kala_ai_user';

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE = (import.meta?.env?.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
  
  // Check for demo mode
  const isDemoMode = new URLSearchParams(window.location.search).get('demo') === 'true' || 
                     localStorage.getItem('demo_mode') === 'true';
  
  const [token, setToken] = useState(() => {
    if (isDemoMode) return 'demo-token';
    return localStorage.getItem(STORAGE_KEY);
  });
  
  const [user, setUser] = useState(() => {
    if (isDemoMode) {
      return {
        name: 'Rajesh Kumar',
        email: 'demo@kalaai.com',
        craft: 'pottery',
        location: 'Jaipur, Rajasthan',
        isDemo: true
      };
    }
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (token && saved) {
      try { return JSON.parse(saved); } catch { /* noop */ }
    }
    return token ? { name: 'Artisan' } : null;
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_KEY, token);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [token]);

  useEffect(() => {
    // Keep profile in localStorage (non-demo only)
    if (user && !user.isDemo) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
  }, [user]);

  // Auto-enable demo mode if demo=true in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'true') {
      localStorage.setItem('demo_mode', 'true');
      if (!token) {
        setToken('demo-token');
        setUser({
          name: 'Rajesh Kumar',
          email: 'demo@kalaai.com',
          craft: 'pottery',
          location: 'Jaipur, Rajasthan',
          isDemo: true
        });
      }
    }
  }, [location.search]);

  const signup = async (userData) => {
    setLoading(true);
    try {
      // Map frontend form to backend expected payload
      const { name, email, password, craftType, location, experience, phone } = userData;

      const { state, district, village } = parseLocation(location);
      const payload = {
        personalInfo: {
          name,
          email,
          phone: normalizeIndianPhone(phone),
          location: {
            state,
            district,
            village
          }
        },
        password,
        craftDetails: {
          primaryCraft: mapCraftType(craftType),
          experience: mapExperience(experience)
        }
      };

      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok || !json?.success) {
        const msg = json?.message || 'Failed to create account';
        throw new Error(msg);
      }

      const { token: apiToken, refreshToken, artisan } = json.data || {};
      if (!apiToken || !artisan) throw new Error('Invalid signup response');

      setToken(apiToken);
      setUser(artisan);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(artisan));

      // Optionally store refresh token in memory/localStorage if needed
      // localStorage.setItem('kala_ai_refresh', refreshToken);

      navigate('/onboarding', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password, redirect }) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        const msg = json?.message || 'Login failed';
        throw new Error(msg);
      }

      const { token: apiToken, refreshToken, artisan } = json.data || {};
      if (!apiToken || !artisan) throw new Error('Invalid login response');

      setToken(apiToken);
      setUser(artisan);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(artisan));

      // Redirect to the requested page or dashboard
      const params = new URLSearchParams(location.search);
      const redirectTo = redirect || params.get('redirect') || '/dashboard';
      navigate(redirectTo, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('demo_mode');
    localStorage.removeItem(USER_STORAGE_KEY);
    navigate('/', { replace: true });
  };

  const enableDemoMode = () => {
    localStorage.setItem('demo_mode', 'true');
    setToken('demo-token');
    setUser({
      name: 'Rajesh Kumar',
      email: 'demo@kalaai.com',
      craft: 'pottery',
      location: 'Jaipur, Rajasthan',
      isDemo: true
    });
    navigate('/dashboard', { replace: true });
  };

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated: Boolean(token),
    loading,
    login,
    logout,
    signup,
    enableDemoMode,
    isDemoMode: user?.isDemo || false,
    updateProfile: (updates) => {
      setUser((prev) => {
        const merged = { ...prev, ...updates, isDemo: false };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(merged));
        return merged;
      });
    }
  }), [token, user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};

// -------- Helpers (private to this module) ---------
function mapCraftType(craftType) {
  if (!craftType) return 'other';
  const map = {
    'Pottery & Ceramics': 'pottery',
    'Textiles & Fabrics': 'textiles',
    'Jewelry & Accessories': 'jewelry',
    'Woodwork': 'woodwork',
    'Metalwork': 'metalwork',
    'Bamboo & Cane': 'other',
    'Leather Goods': 'leather',
    'Home Decor': 'other',
    'Other': 'other'
  };
  return map[craftType] || 'other';
}

function mapExperience(exp) {
  if (typeof exp === 'number') return exp;
  switch (exp) {
    case '0-2': return 1;
    case '2-5': return 3;
    case '5-10': return 7;
    case '10-20': return 15;
    case '20+': return 25;
    default: return 0;
  }
}

function parseLocation(input) {
  if (!input) {
    return { state: 'Unknown', district: 'Unknown', village: 'Unknown' };
  }
  // Expecting formats like "City, State" or "Village, District, State"
  const parts = input.split(',').map(s => s.trim()).filter(Boolean);
  if (parts.length >= 3) {
    const [village, district, state] = parts.slice(-3);
    return { village, district, state };
  }
  if (parts.length === 2) {
    const [village, state] = parts;
    // If district missing, set same as village as a fallback
    return { village, district: village, state };
  }
  // Fallback: put everything into village, defaults for others
  return { village: parts[0] || 'Unknown', district: parts[0] || 'Unknown', state: 'Unknown' };
}

function normalizeIndianPhone(phone) {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  // Keep last 10 digits assuming Indian mobile
  return digits.slice(-10);
}
