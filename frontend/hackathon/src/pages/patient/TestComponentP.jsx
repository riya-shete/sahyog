import React from 'react'
import MedicalUpload from '../../components/upload/MedicalUpload';

const TestComponentP = () => {
  return (
    <div className="patient-upload-container">
      <h1 className="text-2xl font-bold mb-6">Medical Report Analysis</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <MedicalUpload />
      </div>
    </div>
  );
};

export default TestComponentP;
