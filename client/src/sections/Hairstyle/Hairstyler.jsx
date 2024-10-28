import { useState } from "react";
import styles from "./Hairstyler.module.css";

function Hairstyler() {
  const [userImage, setUserImage] = useState(null);
  const [referenceImage, setReferenceImage] = useState(null);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [retainHairColor, setRetainHairColor] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Spinner state

  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const isValidType = ["image/jpeg", "image/png"].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024;

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
    setIsLoading(true); // Show spinner on submit

    const formData = new FormData();
    formData.append("userImage", userImage);
    formData.append("referenceImage", referenceImage);
    formData.append("retainHairColor", retainHairColor);

    try {
      const response = await fetch("http://localhost:5000/hair-transfer", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        setIsLoading(false); // Hide spinner on error
        return;
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedResult(imageUrl);
    } catch (err) {
      setError("Error while generating hairstyle. Please try again.");
    }
    setIsLoading(false); // Hide spinner after API response
  };

  return (
    <section id="hairstyler" className={styles.container}>
      <h2 className={styles.title}>Hairstyle Try-On</h2>

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
              <button
                className={styles.rmvBtn}
                onClick={() => handleRemoveFile("user")}
              >
                Remove
              </button>
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
              <div className={styles.imageWrapper}>
                <img
                  src={URL.createObjectURL(referenceImage)}
                  alt="Reference"
                  className={styles.previewImage}
                />
                <button
                  className={styles.rmvBtn}
                  onClick={() => handleRemoveFile("reference")}
                >
                  Remove
                </button>
              </div>
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
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={retainHairColor}
            onChange={(e) => setRetainHairColor(e.target.checked)}
          />
          Retain my hair color
        </label>
        <button onClick={handleSubmit} className={styles.submitBtn}>
          Submit
        </button>
      </div>

      {isLoading ? (
        <div className={styles.spinner} /> // Spinner for API call
      ) : (
        generatedResult && (
          <div className={styles.resultSection}>
            <h3>Your New Look</h3>
            <img
              src={generatedResult}
              alt="Generated Result"
              className={styles.resultImage}
            />
            <a
              href={generatedResult}
              download="new-look.png"
              className={styles.downloadBtn}
            >
              Download
            </a>
          </div>
        )
      )}
    </section>
  );
}

export default Hairstyler;
