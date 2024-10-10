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
      <h1>Try out different Hairstyles</h1>
      <p className={styles.paragraph}>
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
        officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde
        omnis iste natus error sit voluptatem accusantium doloremque laudantium,
        totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
        architecto beatae vitae dicta sunt explicabo.
      </p>
      <p className={styles.paragraph}>
        We know you are not bound by anything what so ever, so we have different
        hairstyles for you to try on. You just have to upload your original
        image to the left and the one with your preffered hairstyle to the
        right, so that we can give you the result as to how you will look with
        the hairstyle of your personal choice !!
      </p>
      <button className={styles.button} onClick={handleClick}>
        Try Hairstyles
      </button>
    </div>
    </section>
  );
}

export default HairStyle;
