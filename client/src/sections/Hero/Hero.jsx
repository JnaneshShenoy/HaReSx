import { useNavigate } from "react-router-dom";
import { useTheme } from "../../common/ThemeContext";
import styles from "./HeroStyles.module.css";
import haircut from "../../assets/haircut-jim-carrey.mp4";
import sun from "../../assets/sun.svg";
import moon from "../../assets/moon.svg";

function Hero() {
  const { theme, toggleTheme } = useTheme();

  const themeIcon = theme === "light" ? sun : moon;

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/product-page");
  };

  return (
    <section id="hero" className={styles.container}>
      <div className={styles.colorModeContainer}>
        <video
          src={haircut}
          className={styles.hero}
          alt="Hairstyle video"
          autoPlay
          loop
          muted
        />
        <img
          className={styles.colorMode}
          src={themeIcon}
          alt="Color mode icon"
          onClick={toggleTheme}
        />
      </div>
      <div className={styles.info}>
        <h1>HaReS</h1>
        <h2>
          Hairstyle <br />
          Recommendation <br/>
          System
        </h2>
        <p className={styles.description}>
          Find the perfect Hairstyle that suits your face shape.
          <br />
          {/* Powered by AI */}
        </p>

        <button className="hover" onClick={handleClick}>
          Try it
        </button>
      </div>
    </section>
  );
}

export default Hero;

// import { useState } from "react";
// import styles from "./HeroStyles.module.css";
// import jnx from "../../assets/jnx.png";
// import heroImg from "../../assets/hero-img.png";
// // import haircut from "../../assets/haircut-jim-carrey.mp4"
// import sun from "../../assets/sun.svg";
// import moon from "../../assets/moon.svg";
// import { useNavigate } from "react-router-dom";
// import { useTheme } from "../../common/ThemeContext";

// function Hero() {
//   const { theme, toggleTheme } = useTheme();
//   const [imageSrc, setImageSrc] = useState(jnx);

//   const handleImageClick = () => {
//     setImageSrc((prevImageSrc) => (prevImageSrc === heroImg ? jnx : heroImg));
//   };

//   const themeIcon = theme === "light" ? sun : moon;

//   const navigate = useNavigate();

//   const handleClick = () => {
//     navigate("/product-page");
//   };

//   return (
//     <section id="hero" className={styles.container}>
//       <div className={styles.colorModeContainer}>
//         <img
//           src={imageSrc}
//           className={styles.hero}
//           alt="Hairstyles GIF"
//           onClick={handleImageClick}
//         />
//         <img
//           className={styles.colorMode}
//           src={themeIcon}
//           alt="Color mode icon"
//           onClick={toggleTheme}
//         />
//       </div>
//       <div className={styles.info}>
//         <h1>HaReS</h1>
//         <h2>Hairstyle <br/>Recommender</h2>
//         <p className={styles.description}>
//           Find the perfect Hairstyle that suits your face shape.
//           <br />
//           Powered by AI
//         </p>

//         <button className="hover" onClick={handleClick}>
//           Try it
//         </button>
//       </div>
//     </section>
//   );
// }

// export default Hero;
