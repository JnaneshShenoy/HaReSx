import { useNavigate } from "react-router-dom";
import styles from "./ProjectsStyles.module.css";
import spectralsentinel from "../../assets/spectralsentinel.png";
import LexiQuest from "../../assets/LexiQuest.png";
import InMaS from "../../assets/InMaS.png";
import TaMar from "../../assets/TaMar.png";

function Features() {
  const navigate = useNavigate();

  const goToFaceShape = () => navigate("face-shape");
  const goToHairstyles = () => navigate("/product-page");
  const goToHairstyleTransfer = () => navigate("/hairstyle-page");
  const goToFrameStyle = () => navigate("frame-style");

  return (
    <section id="Features" className={styles.container}>
      <h1 className="sectionTitle">Features</h1>
      <div className={styles.projectsContainer}>
        <div className={styles.projectCard} onClick={goToFaceShape}>
          <img src={spectralsentinel} alt="Face Shape" />
          <h3>Face Shape</h3>
          <p>Face shape detector</p>
        </div>

        <div className={styles.projectCard} onClick={goToHairstyles}>
          <img src={LexiQuest} alt="Hairstyles" />
          <h3>Hairstyles</h3>
          <p>Hairstyle Recommender</p>
        </div>

        <div className={styles.projectCard} onClick={goToHairstyleTransfer}>
          <img src={InMaS} alt="Hairstyle Transfer" />
          <h3>Hair Transfer</h3>
          <p>Hairstyle GAN</p>
        </div>

        <div className={styles.projectCard} onClick={goToFrameStyle}>
          <img src={TaMar} alt="Frame Style" />
          <h3>Frame Style</h3>
          <p>Frame recommender</p>
        </div>
      </div>
    </section>
  );
}

export default Features;
