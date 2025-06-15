import React, { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle, AlertTriangle, XCircle, Activity, Droplets, Shield } from 'lucide-react';

const MedicalResultsDisplay = ({ data }) => {
  if (!data || data.status !== 'success') {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center text-red-800">
          <XCircle className="w-5 h-5 mr-2" />
          <span>No results to display or analysis failed</span>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Normal':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'High':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'Low':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Normal':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'High':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'Low':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Blood Counts':
        return <Droplets className="w-5 h-5 text-red-500" />;
      case 'Red Cell Indices':
        return <Activity className="w-5 h-5 text-blue-500" />;
      case 'Differential Count':
        return <Shield className="w-5 h-5 text-purple-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-blue-500" />
              Medical Report Analysis
            </h1>
            <p className="text-gray-600 mt-1">File: {data.filename}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">
              {data.summary?.total_parameters || 0}
            </div>
            <div className="text-sm text-gray-500">Parameters Analyzed</div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-lg font-semibold text-gray-900">
                {data.summary?.report_type || 'Medical Report'}
              </div>
              <div className="text-sm text-gray-500">Report Type</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-lg font-semibold text-gray-900">
                {(data.summary?.total_parameters || 0) - (data.summary?.abnormal_parameters || 0)}
              </div>
              <div className="text-sm text-gray-500">Normal Parameters</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <div className="text-lg font-semibold text-gray-900">
                {data.summary?.abnormal_parameters || 0}
              </div>
              <div className="text-sm text-gray-500">Abnormal Parameters</div>
            </div>
          </div>
        </div>
      </div>

      {/* Results by Category */}
      {data.categories && Object.keys(data.categories).map((category, index) => (
        <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              {getCategoryIcon(category)}
              <span className="ml-2">{category}</span>
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Object.entries(data.categories[category]).map(([paramName, paramData]) => (
                <div key={paramName} className={`p-4 rounded-lg border-2 ${getStatusColor(paramData.status)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{paramName}</h3>
                    {getStatusIcon(paramData.status)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Value:</span>
                      <span className="font-bold text-lg">
                        {paramData.value} {paramData.unit}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Normal Range:</span>
                      <span className="text-sm">
                        {paramData.normal_range} {paramData.unit}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        paramData.status === 'Normal' ? 'bg-green-100 text-green-800' :
                        paramData.status === 'High' ? 'bg-red-100 text-red-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {paramData.status}
                      </span>
                    </div>
                    
                    {paramData.interpretation && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Interpretation:</strong> {paramData.interpretation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <strong>Important Disclaimer:</strong> This analysis is for informational purposes only and should not replace professional medical advice. Please consult with your healthcare provider for proper interpretation of your medical results and any necessary follow-up care.
          </div>
        </div>
      </div>
    </div>
  );
};

const MedicalUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResults(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/analyze-report', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Server error: ${response.status} - ${errorData.detail || 'Unknown error'}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error('Upload failed:', err);
      setError(`Upload failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto p-6">
        {!results ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Medical Report Analyzer
              </h1>
              <p className="text-gray-600 mb-8">
                Upload your medical report image for instant analysis
              </p>
              
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Report Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                      border border-gray-300 rounded-lg p-2"
                  />
                </div>

                {file && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center text-blue-800">
                      <FileText className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">{file.name}</span>
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                )}

                <button
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
                    text-white font-semibold py-3 px-6 rounded-lg transition-colors
                    flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Analyze Report
                    </>
                  )}
                </button>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center text-red-800">
                      <XCircle className="w-5 h-5 mr-2" />
                      <span className="text-sm">{error}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 text-xs text-gray-500">
                <p>Supported formats: JPG, PNG, JPEG</p>
                <p>Maximum file size: 10MB</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-green-700">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Analysis completed successfully!</span>
                </div>
                <button
                  onClick={resetUpload}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Upload New Report
                </button>
              </div>
            </div>
            
            <MedicalResultsDisplay data={results} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalUpload;