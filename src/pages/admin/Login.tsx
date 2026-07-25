import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin.css';
import { Reveal } from '../../components/Reveal';
import { useAuth } from '../../lib/auth';

export function AdminLogin() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate('/admin', { replace: true });
  }, [user, navigate]);

  if (user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error: err } = await signIn(email, password);
    if (err) setError(err);
    setBusy(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Reveal>
          <div className="eyebrow mb-2">Admin</div>
          <h1 className="h1">Iniciar sesión</h1>
        </Reveal>
        <Reveal delay={0.1}>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="login-email" className="font-mono text-[11px] tracking-[0.14em] uppercase text-fg-mute block mb-1.5">
                Correo electrónico
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[var(--line)] bg-transparent rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="font-mono text-[11px] tracking-[0.14em] uppercase text-fg-mute block mb-1.5">
                Contraseña
              </label>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[var(--line)] bg-transparent rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            {error && (
              <div className="text-accent text-sm">{error}</div>
            )}
            <button type="submit" disabled={busy} className="btn terra w-full justify-center">
              {busy ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
