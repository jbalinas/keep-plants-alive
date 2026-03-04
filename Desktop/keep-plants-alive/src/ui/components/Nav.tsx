import { NavLink } from 'react-router-dom';
import styles from './Nav.module.css';

export default function Nav() {
  return (
    <header className={styles.header} role="banner">
      <a href="#main-content" className={styles.skipLink}>Skip to content</a>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.brand} aria-label="Keep Plants Alive — home">
          <span className={styles.brandLeaf} aria-hidden="true">🌿</span>
          <span>Keep Plants Alive</span>
        </NavLink>
        <nav aria-label="Main navigation">
          <ul className={styles.navList} role="list">
            <li>
              <NavLink to="/" end className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                Today
              </NavLink>
            </li>
            <li>
              <NavLink to="/plants" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                Plants
              </NavLink>
            </li>
            <li>
              <NavLink to="/add" className={({ isActive }) => isActive ? `${styles.linkCta} ${styles.active}` : styles.linkCta}>
                + Add
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
