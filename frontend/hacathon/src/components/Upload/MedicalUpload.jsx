import { useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";

export default function MedicalUpload() {
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    setIsLoading(true);
    try {
      // 1. Upload to Firebase Storage
      const storageRef = ref(storage, `reports/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      
      // 2. Get public URL
      const url = await getDownloadURL(storageRef);
      setDownloadUrl(url);
      console.log("File URL:", url);
      
      // 3. Send to backend
      await sendToBackend(url);
      
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendToBackend = async (fileUrl) => {
    try {
      const response = await fetch('http://localhost:8000/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl })
      });
      
      const result = await response.json();
      console.log("Analysis result:", result);
      alert(`Diagnosis: ${result.riskAssessment}`);
      
    } catch (error) {
      console.error("Backend error:", error);
      alert("Analysis failed. Please try again.");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Upload Medical Report</h2>
      <input 
        type="file" 
        accept="image/*,.pdf"
        onChange={(e) => handleFileUpload(e.target.files[0])}
        disabled={isLoading}
      />
      {isLoading && <p>Uploading and analyzing...</p>}
      {downloadUrl && (
        <div style={{ marginTop: '10px' }}>
          <a href={downloadUrl} target="_blank" rel="noreferrer">
            View Uploaded Report
          </a>
        </div>
      )}
    </div>
  );
}