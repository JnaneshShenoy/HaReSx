// import React from 'react'; (if you're using React 17 or lower, uncomment this)
import PropTypes from 'prop-types'; // Import PropTypes
import styles from './ImageLoader.module.css'; // Import CSS module for styling

// Component for dynamically loading images based on given name and folder path
const ImageLoader = ({ name, folder = 'src/Imagex' }) => {
  const formattedName = name
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/[^\w-]/g, ''); // Remove non-alphanumeric characters except dashes

  const imagePath = `${folder}/${formattedName}.png`; // Generate the image path

  return (
    <div className={styles.imageContainer}>
      <img src={imagePath} alt={name} className={styles.image} />
      <p className={styles.imageCaption}>{name}</p>
    </div>
  );
};

// Define PropTypes to ensure correct prop types and avoid warnings
ImageLoader.propTypes = {
  name: PropTypes.string.isRequired,  // 'name' must be a string and is required
  folder: PropTypes.string,           // 'folder' must be a string (optional with default value)
};

export default ImageLoader;
