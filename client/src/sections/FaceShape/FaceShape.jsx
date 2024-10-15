import { useState } from "react";
import axios from "axios";
import styles from "./FaceShape.module.css";

function FaceShape() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  // Handle file drop
  const handleFileChange = (event) => handleFiles(event.target.files);

  // Handle file validation
  const handleFiles = (incomingFiles) => {
    if (incomingFiles.length > 1) {
      setError("Please upload only one image.");
      return;
    }

    const validFiles = [...incomingFiles].filter((file) => {
      const isValidType = ["image/jpeg", "image/png"].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024;
      return isValidType && isValidSize;
    });

    if (validFiles.length > 0) {
      setFiles(validFiles);
      setError("");
    } else {
      setError("Invalid file. Please upload a JPEG or PNG image under 5MB.");
    }
  };

  // Process file for submission
  const processFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1];
      sendToServer(base64String);
    };
    reader.readAsDataURL(file);
  };

  // Send image to server for face shape detection
  const sendToServer = (base64Image) => {
    axios
      .post("http://localhost:5000/face-shape", { image: base64Image })
      .then((response) => setResult(response.data))
      .catch(() => setError("Failed to detect face shape"));
  };

  // Handle file removal
  const handleRemoveFile = () => {
    setFiles([]);
    setResult(null);
  };

  // Close error message
  const handleCloseError = () => setError("");

  return (
    <section id="face-shape" className={styles.container}>
      <div className={styles.uploadContainer}>
        <div className={styles.browseFileContainer}>
          <div className={styles.uploadInfo}>
            <p>Upload your image here</p>
            <p>Supported files: .PNG, .JPEG, .JPG</p>
            <p>(Max size: 5MB)</p>
          </div>
          <br/>
          <input
            type="file"
            id="browse"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png"
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
            <button onClick={handleCloseError} className={styles.closeBtn}>
              Close
            </button>
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className={styles.fileList}>
          {files.map((file, index) => (
            <div className={styles.fileItem} key={index}>
              <div className={styles.fileInfo}>
                <p>{file.name}</p>
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className={styles.previewImage}
                />
              </div>
              <div className={styles.fileActions}>
                <button onClick={() => handleRemoveFile()}>Remove</button>
                <button onClick={() => processFile(file)}>Submit</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {result && (
        <div className={styles.resultContainer}>
          <h2>Your face shape:</h2>
          <div className={styles.faceShapeBox}>{result.faceShape}</div>
        </div>
      )}
    </section>
  );
}

export default FaceShape;
