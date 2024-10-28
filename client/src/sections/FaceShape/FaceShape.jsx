import { useState } from "react";
import axios from "axios";
import styles from "./FaceShape.module.css";

function FaceShape() {
  const [file, setFile] = useState(null); // Holds the uploaded file
  const [error, setError] = useState(""); // Holds error messages
  const [faceShape, setFaceShape] = useState(""); // Holds the detected face shape

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    const isValidType = ["image/jpeg", "image/png"].includes(selectedFile.type);
    const isValidSize = selectedFile.size <= 5 * 1024 * 1024;

    if (!isValidType || !isValidSize) {
      setError("Invalid file. Please upload a JPEG or PNG image under 5MB.");
      setFile(null);
    } else {
      setFile(selectedFile);
      setError("");
    }
  };

  const handleSubmit = () => {
    if (!file) {
      setError("Please upload a valid image before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    axios
      .post("http://localhost:5000/face-shape", formData)
      .then((response) => {
        setFaceShape(response.data.face_shape);
        setError("");
      })
      .catch((error) => {
        // Handle backend-specific error messages
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setError(error.response.data.error); // Display exact backend error
        } else {
          setError("Failed to detect face shape. Please try again.");
        }
      });
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFaceShape(""); // Clear previous result
  };

  return (
    <section id="face-shape" className={styles.container}>
      <div className={styles.uploadContainer}>
        <div className={styles.browseFileContainer}>
          <div className={styles.uploadInfo}>
            <p>Upload your image here</p>
            <p>Supported files: .PNG, .JPEG</p>
            <p>(Max size: 5MB)</p>
          </div>
          <input
            type="file"
            id="browse"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png"
            style={{ display: "none" }} // Hide the default file input
          />
          <label htmlFor="browse" className={styles.browseBtn}>
            Browse file
          </label>
        </div>
      </div>

      {error && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialogBox}>
            <p>{error}</p>
            <button onClick={() => setError("")} className={styles.closeBtn}>
              Close
            </button>
          </div>
        </div>
      )}

      {file && (
        <div className={styles.fileItem}>
          <div className={styles.fileInfo}>
            <p>{file.name}</p>
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className={styles.previewImage}
            />
          </div>
          <button className={styles.rmvBtn} onClick={handleRemoveFile}>
            Remove
          </button>
          <button className={styles.smtBtn} onClick={handleSubmit}>
            Submit
          </button>
        </div>
      )}

      {faceShape && (
        <div className={styles.resultContainer}>
          <h2>Your face shape</h2>
          <div className={styles.faceShapeBox}>{faceShape}</div>
        </div>
      )}
    </section>
  );
}

export default FaceShape;
