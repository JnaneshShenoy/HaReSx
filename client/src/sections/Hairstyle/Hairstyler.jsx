import { useState } from "react";
import styles from "./Hairstyler.module.css";

function Hairstyler() {
  const [userImage, setUserImage] = useState(null);
  const [referenceImage, setReferenceImage] = useState(null);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [error, setError] = useState(""); // Error message state

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

      if (type === "user") setUserImage(file);
      else if (type === "reference") setReferenceImage(file);

      setError("");
    }
  };

  const handleRemoveFile = (type) => {
    if (type === "user") setUserImage(null);
    else if (type === "reference") setReferenceImage(null);
  };

  const handleSubmit = async () => {
    if (!userImage || !referenceImage) {
      setError("Please upload both images before submitting.");
      return;
    }
    setError("");

    const formData = new FormData();
    formData.append("userImage", userImage);
    formData.append("referenceImage", referenceImage);

    try {
      const response = await fetch("http://localhost:5000/hair-transfer", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        return;
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedResult(imageUrl);
    } catch (err) {
      setError("Error while generating hairstyle. Please try again.");
    }
  };

  return (
    <section id="hairstyler" className={styles.container}>
      <h2 className={styles.title}>Hairstyle Try-On</h2>

      <div className={styles.uploadSection}>
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

      {error && (
        <div className={styles.errorMessage}>
          <p>{error}</p>
          <button onClick={() => setError("")}>Close</button>
        </div>
      )}

      <div className={styles.submitContainer}>
        <button onClick={handleSubmit} className={styles.submitBtn}>
          Submit
        </button>
      </div>

      {generatedResult && (
        <div className={styles.resultSection}>
          <h3>Your New Look</h3>
          <img
            src={generatedResult}
            alt="Generated Result"
            className={styles.resultImage}
          />
        </div>
      )}
    </section>
  );
}

export default Hairstyler;
