import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useLazyGetMeQuery } from "../../app/api";
import { useAppDispatch } from "../../app/hooks";
import { getErrorMessage } from "../../app/apiError";
import { loggedIn } from "./authSlice";
import { login } from "./authService";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [getMe] = useLazyGetMeQuery();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // Sin llamar a la API: si falta algo, se avisa aquí
    if (!email.trim() || !password) {
      setError("Escribe el correo y la contraseña.");
      return;
    }

    setSending(true);
    try {
      const token = await login(email, password);
      dispatch(loggedIn(token));

      // El login solo da el token: el rol se pide después a /me
      const user = await getMe(token).unwrap();
      const from: string = location.state?.from ?? (user.role === "staff" ? "/staff" : "/classes");
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : getErrorMessage(err));
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Entrar</h1>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <label htmlFor="email">Correo</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="username"
      />
      <label htmlFor="password">Contraseña</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      <button type="submit" disabled={sending}>
        {sending ? "Entrando..." : "Entrar"}
      </button>
      <p>
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </form>
  );
}
