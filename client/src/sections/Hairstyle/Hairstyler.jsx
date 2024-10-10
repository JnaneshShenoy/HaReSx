import { useState } from "react";
import styles from "./Hairstyler.module.css";

function Hairstyler() {
  const [userImage, setUserImage] = useState(null);
  const [referenceImage, setReferenceImage] = useState(null);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [error, setError] = useState(""); // Error message state

  // Handle file changes for both user and reference images
  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const isValidType = ["image/jpeg", "image/png"].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit

      if (!isValidType) {
        setError("Unsupported file type. Please upload JPEG or PNG.");
        return;
      }
      if (!isValidSize) {
        setError("File size exceeds 5MB. Please upload a smaller file.");
        return;
      }

      // Set file to respective state
      if (type === "user") {
        setUserImage(file);
      } else if (type === "reference") {
        setReferenceImage(file);
      }
      setError("");
    }
  };

  // Remove file handlers
  const handleRemoveFile = (type) => {
    if (type === "user") setUserImage(null);
    else if (type === "reference") setReferenceImage(null);
  };

  // Simulate result generation
  const handleSubmit = () => {
    if (!userImage || !referenceImage) {
      setError("Please upload both images before submitting.");
      return;
    }
    setError("");
    // Simulating generated result with user's image (placeholder logic)
    setGeneratedResult(userImage); // In real scenario, replace this with result from server
  };

  return (
    <section id="hairstyler" className={styles.container}>
      <h2>Hairstyle Try-On</h2>

      <div className={styles.uploadSection}>
        {/* User Image Upload */}
        <div className={styles.uploadContainer}>
          <p>Upload your image</p>
          <label className={styles.uploadLabel}>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(event) => handleFileChange(event, "user")}
            />
            <span>Choose File</span>
          </label>
          {userImage && (
            <div className={styles.previewContainer}>
              <p>{userImage.name}</p>
              <img
                src={URL.createObjectURL(userImage)}
                alt="User"
                className={styles.previewImage}
              />
              <button onClick={() => handleRemoveFile("user")}>Remove</button>
            </div>
          )}
        </div>

        {/* Reference Image Upload */}
        <div className={styles.uploadContainer}>
          <p>Upload reference image</p>
          <label className={styles.uploadLabel}>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(event) => handleFileChange(event, "reference")}
            />
            <span>Choose File</span>
          </label>
          {referenceImage && (
            <div className={styles.previewContainer}>
              <p>{referenceImage.name}</p>
              <img
                src={URL.createObjectURL(referenceImage)}
                alt="Reference"
                className={styles.previewImage}
              />
              <button onClick={() => handleRemoveFile("reference")}>
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className={styles.errorMessage}>
          <p>{error}</p>
          <button onClick={() => setError("")}>Close</button>
        </div>
      )}

      {/* Submit Button */}
      <div className={styles.submitContainer}>
        <button onClick={handleSubmit} className={styles.submitBtn}>
          Submit
        </button>
      </div>

      {generatedResult && (
        <div className={styles.resultSection}>
          <h3>Your New Look</h3>
          <img
            src={URL.createObjectURL(generatedResult)}
            alt="Generated Result"
            className={styles.resultImage}
          />
        </div>
      )}
    </section>
  );
}

export default Hairstyler;
