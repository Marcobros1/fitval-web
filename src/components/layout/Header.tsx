import { Link, NavLink, useNavigate } from "react-router";
import { useAppDispatch } from "../../app/hooks";
import { api } from "../../app/api";
import { loggedOut } from "../../features/auth/authSlice";
import { useCurrentUser } from "../../features/auth/useCurrentUser";
import styles from "./Header.module.css";

export function Header() {
  const { user } = useCurrentUser();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function logout() {
    dispatch(loggedOut());
    dispatch(api.util.resetApiState()); // olvida el usuario de /me
    navigate("/");
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>
          FitVal
        </Link>
        {/* end: sin él, "Planes" quedaría activo en todas las páginas, porque todas empiezan por "/" */}
        <NavLink to="/" end>
          Planes
        </NavLink>
        <NavLink to="/classes">Clases</NavLink>
        {user?.role === "staff" && <NavLink to="/staff">Panel</NavLink>}
        <span className={styles.spacer} />
        {user ? (
          <>
            <span className={styles.user}>
              {user.email} · {user.role === "staff" ? "staff" : "socio"}
            </span>
            <button type="button" className={styles.logout} onClick={logout}>
              Salir
            </button>
          </>
        ) : (
          <NavLink to="/login">Entrar</NavLink>
        )}
      </nav>
    </header>
  );
}
