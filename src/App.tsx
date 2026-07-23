import { lazy, Suspense, useEffect, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { AuthProvider, ProtectedRoute } from './lib/auth';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import type { Theme } from './lib/types';

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const ONGs = lazy(() => import('./pages/ONGs').then(m => ({ default: m.ONGs })));
const History = lazy(() => import('./pages/History').then(m => ({ default: m.History })));
const Archive = lazy(() => import('./pages/Archive').then(m => ({ default: m.Archive })));
const Voces = lazy(() => import('./pages/Voces').then(m => ({ default: m.Voces })));
const Genero = lazy(() => import('./pages/Genero').then(m => ({ default: m.Genero })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));
const AdminLogin = lazy(() => import('./pages/admin/Login').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.AdminDashboard })));
const AdminProjectForm = lazy(() => import('./pages/admin/ProjectForm').then(m => ({ default: m.AdminProjectForm })));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

interface AppLayoutProps {
  theme: Theme;
  toggleTheme: () => void;
}

function AppLayout({ theme, toggleTheme }: AppLayoutProps) {
  return (
    <>
      <Nav theme={theme} toggleTheme={toggleTheme} />
      <main id="main-content"><Outlet /></main>
      <Footer />
    </>
  );
}

export function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const a = document.documentElement.getAttribute('data-theme');
    return a === 'dark' || a === 'light' ? a : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('cdr-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.body.classList.add('grain');
  }, []);

  useEffect(() => {
    document.documentElement.dataset.mounted = 'true';
    const tid = setTimeout(() => {
      const sh = document.getElementById('static-hero');
      if (sh) sh.remove();
    }, 400);
    return () => clearTimeout(tid);
  }, []);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <SpeedInsights />
          <Analytics />
          <Suspense fallback={<div style={{ height: '100vh' }} />}>
            <Routes>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route element={<AppLayout theme={theme} toggleTheme={toggleTheme} />}>
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/projects/new" element={<ProtectedRoute><AdminProjectForm /></ProtectedRoute>} />
                <Route path="/admin/projects/:id/edit" element={<ProtectedRoute><AdminProjectForm /></ProtectedRoute>} />
                <Route index element={<Home />} />
                <Route path="historia" element={<History />} />
                <Route path="ongs" element={<ONGs />} />
                <Route path="genero" element={<Genero />} />
                <Route path="voces" element={<Voces />} />
                <Route path="archivo" element={<Archive />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
