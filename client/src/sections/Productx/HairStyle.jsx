import { useNavigate } from "react-router-dom";
import styles from "./HairStyle.module.css";

function HairStyle() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/hairstyle-page");
  };

  return (
    <section id="Hairx">
      <div className={styles.container}>
        <h1>AI - Hairstyler</h1>
        <p className={styles.paragraph}>
          Ever wondered what you’d look like with a different hairstyle?
          <br />
          Now, you can try out new looks without cutting or styling your hair!
          Our system lets you explore brand-new hairstyles in just a few simple
          steps.
        </p>

        <p className={styles.paragraph}>
          <strong>How Does It Work?</strong>
          <br />
          We use a Convolutional Neural Network (CNN), a powerful tool that
          helps computers analyze images and recognize patterns—like the shape
          of your face and the way your hair flows. Its super easy to use! Just
          upload a picture of yourself and a reference image with the hairstyle
          you want to try. In seconds, our system will show you how you wouldd
          look with your chosen style.
        </p>

        <p className={styles.paragraph}>
          Right now, our system works best with mens hairstyles, but dont worry,
          ladies—we are actively working to support more styles for you soon!
          Stay tuned for exciting new features and updates.
        </p>

        <button className={styles.button} onClick={handleClick}>
          Try Hairstyles
        </button>
      </div>
    </section>
  );
}

export default HairStyle;
