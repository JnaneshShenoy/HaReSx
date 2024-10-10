// import React from "react";
import Navbar from "../Navbar/Navbar";
import Hero from "../Hero/Hero";
import styles from "./HeroWithNavbar.module.css";

function HeroWithNavbar() {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <Hero />
    </div>
  );
}

export default HeroWithNavbar;
