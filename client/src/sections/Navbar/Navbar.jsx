// import React from 'react';
import styles from './NavbarStyles.module.css';

function Navbar() {
  return (
    <nav className={styles.container}>
      <div className={styles.logo}>
        <a href="#">HaReS</a>
      </div>
      <ul className={styles.navLinks}>
        <li>
          <a href="#Hairx">Hairx</a>
        </li>
        <li>
          <a href="#Features">Features</a>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;