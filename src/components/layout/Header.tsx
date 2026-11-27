import { Link, NavLink } from "react-router";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>
          FitVal
        </Link>
        {/* end: sin Ã©l, "Planes" quedarÃ­a activo en todas las pÃ¡ginas, porque todas empiezan por "/" */}
        <NavLink to="/" end>
          Planes
        </NavLink>
        <NavLink to="/classes">Clases</NavLink>
        <span className={styles.spacer} />
        <NavLink to="/login">Entrar</NavLink>
      </nav>
    </header>
  );
}
