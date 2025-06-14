import { analyzeTest } from "@/lib/api";
import { ref, uploadBytes } from "firebase/storage";

export default function MedicalUpload() {
  const handleUpload = async (file) => {
    // 1. Upload to Firebase Storage
    const storageRef = ref(storage, `reports/${file.name}`);
    await uploadBytes(storageRef, file);
    
    // 2. Call AI API
    const res = await analyzeTest({ Hb: 9.5 }); // Mock data
    console.log(res.data.risk); // "Anemia"
  };

  return <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />;
}