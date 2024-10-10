import { useState } from "react";
import axios from "axios";
import styles from "./DragDropStyles.module.css";

function DragDrop() {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [gender, setGender] = useState(""); // New state for gender

  // Handle drag and drop state
  const handleDrag = (isActive) => setDragActive(isActive);

  // Handle file drop
  const handleDrop = (event) => {
    event.preventDefault();
    handleFiles(event.dataTransfer.files);
    handleDrag(false);
  };

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

  // Send image and gender data to server
  const sendToServer = (base64Image) => {
    if (!gender) {
      setError("Please select a gender.");
      return;
    }

    axios
      .post("http://localhost:5000/recommend", { image: base64Image, gender })
      .then((response) => setResult(response.data))
      .catch(() => setError("Failed to get recommendation"));
  };

  // Handle file removal
  const handleRemoveFile = () => {
    setFiles([]);
    setResult(null);
  };

  // Close error message
  const handleCloseError = () => setError("");

  // Handle gender selection
  const handleGenderChange = (event) => setGender(event.target.value);

  return (
    <section id="drag-drop" className={styles.container}>
      <div
        className={`${styles.dragDropContainer} ${
          dragActive ? styles.dragActive : ""
        }`}
        onDragEnter={() => handleDrag(true)}
        onDragLeave={() => handleDrag(false)}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        <div className={styles.uploadInfo}>
          <p>Upload your image here</p>
          <p>Supported files: .PNG, .JPEG, .JPG (Max size: 5MB)</p>
        </div>

        {/* Gender Selection */}
        <div className={styles.genderSelection}>
          <label>
            <input
              type="radio"
              value="male"
              checked={gender === "male"}
              onChange={handleGenderChange}
            />
            Male
          </label>
          <label>
            <input
              type="radio"
              value="female"
              checked={gender === "female"}
              onChange={handleGenderChange}
            />
            Female
          </label>
        </div>

        <div className={styles.browseFileContainer}>
          <input
            type="file"
            id="browse"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png"
            multiple
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
                <button onClick={() => processFile(file)}>Submit</button>{" "}
              </div>
            </div>
          ))}
        </div>
      )}

      {result && (
        <div className={styles.resultContainer}>
          <h2>Hairstyle Recommendations</h2>
          <ul>
            {result.hairstyles.map((style, index) => (
              <li key={index}>{style}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default DragDrop;

// import { useState } from "react";
// import axios from "axios";
// import styles from "./DragDropStyles.module.css";

// function DragDrop() {
//   const [files, setFiles] = useState([]);
//   const [dragActive, setDragActive] = useState(false);
//   const [error, setError] = useState(""); // Error state
//   const [result, setResult] = useState(null); // Store result from the server

//   const handleDrag = (isActive) => setDragActive(isActive);

//   const handleDrop = (event) => {
//     event.preventDefault();
//     handleFiles(event.dataTransfer.files);
//     handleDrag(false);
//   };

//   const handleFileChange = (event) => handleFiles(event.target.files);

//   const handleFiles = (incomingFiles) => {
//     if (incomingFiles.length > 1) {
//       setError("Please upload only one image.");
//       return;
//     }

//     const validFiles = [...incomingFiles].filter((file) => {
//       const isValidType = ["image/jpeg", "image/png"].includes(file.type);
//       const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
//       return isValidType && isValidSize;
//     });

//     if (validFiles.length > 0) {
//       setFiles(validFiles);
//       setError(""); // Clear error if a valid file is uploaded
//     } else {
//       setError("Invalid file. Please upload a JPEG or PNG image under 5MB.");
//     }
//   };

//   const processFile = (file) => {
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const base64String = reader.result.split(",")[1]; // Extract base64 data
//       sendToServer(base64String);
//     };
//     reader.readAsDataURL(file); // Read file as base64
//   };

//   const sendToServer = (base64Image) => {
//     axios
//       .post("http://localhost:5000/recommend", { image: base64Image })
//       .then((response) => setResult(response.data)) // Store result
//       .catch(() => setError("Failed to get recommendation")); // Set error on failure
//   };

//   const handleRemoveFile = () => {
//     setFiles([]);
//     setResult(null); // Clear result when file is removed
//   };

//   const handleCloseError = () => setError(""); // Clear error on closing

//   return (
//     <section id="drag-drop" className={styles.container}>
//       <div
//         className={`${styles.dragDropContainer} ${
//           dragActive ? styles.dragActive : ""
//         }`}
//         onDragEnter={() => handleDrag(true)}
//         onDragLeave={() => handleDrag(false)}
//         onDrop={handleDrop}
//         onDragOver={(event) => event.preventDefault()}
//       >
//         <div className={styles.uploadInfo}>
//           <p>Upload your image here</p>
//           <p>Supported files: .PNG, .JPEG, .JPG (Max size: 5MB)</p>
//         </div>
//         <div className={styles.browseFileContainer}>
//           <input
//             type="file"
//             id="browse"
//             onChange={handleFileChange}
//             accept=".jpg,.jpeg,.png"
//             multiple
//           />
//           <label htmlFor="browse" className={styles.browseBtn}>
//             Browse file
//           </label>
//         </div>
//       </div>

//       {/* Error Dialog */}
//       {error && (
//         <div className={styles.dialogOverlay}>
//           <div className={styles.dialogBox}>
//             <p>{error}</p>
//             <button onClick={handleCloseError} className={styles.closeBtn}>
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Uploaded Files */}
//       {files.length > 0 && (
//         <div className={styles.fileList}>
//           {files.map((file, index) => (
//             <div className={styles.fileItem} key={index}>
//               <div className={styles.fileInfo}>
//                 <p>{file.name}</p>
//                 <img
//                   src={URL.createObjectURL(file)}
//                   alt={file.name}
//                   className={styles.previewImage}
//                 />
//               </div>
//               <div className={styles.fileActions}>
//                 <button onClick={() => handleRemoveFile()}>Remove</button>
//                 <button onClick={() => processFile(file)}>Submit</button>{" "}
//                 {/* Submit Button */}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Result */}
//       {result && (
//         <div className={styles.resultContainer}>
//           <h2>Recommendation Result</h2>
//           <p>
//             <strong>Predicted Face Shape:</strong> {result.hairstyle}
//           </p>
//         </div>
//       )}
//     </section>
//   );
// }

// export default DragDrop;
