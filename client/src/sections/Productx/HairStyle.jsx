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
          Ever wonder what you would look like with a different hairstyle?
          <br />
          Now, you can easily try out new looks without ever needing to cut or
          style your hair! Our system helps you see what you would look like
          with a brand-new hairstyle in just a few steps.
        </p>
        <p className={styles.paragraph}>
          How Does It Work? We use a special kind of computer program called CNN
          (Convolutional Neural Network). It is a tool that helps computers look
          at pictures and recognize patterns—like the shape of your face or how
          your hair flows. Do not worry about the science part, we have made it
          super easy to use! Just upload a picture of yourself, and our system
          will show you what you would look like with that new look.
        </p>
        <button className={styles.button} onClick={handleClick}>
          Try Hairstyles
        </button>
      </div>
    </section>
  );
}

export default HairStyle;
