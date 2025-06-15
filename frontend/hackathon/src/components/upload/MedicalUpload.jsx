import React, { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle, AlertTriangle, XCircle, Activity, Droplets, Shield, Info, TrendingUp, Award, Zap } from 'lucide-react';

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

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getExtractionQualityIcon = (quality) => {
    switch (quality) {
      case 'High':
        return <Award className="w-4 h-4 text-green-600" />;
      case 'Medium':
        return <TrendingUp className="w-4 h-4 text-yellow-600" />;
      default:
        return <Zap className="w-4 h-4 text-red-600" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Enhanced Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-blue-500" />
              Medical Report Analysis
            </h1>
            <p className="text-gray-600 mt-1">File: {data.filename}</p>
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                {getExtractionQualityIcon(data.summary?.extraction_quality)}
                <span className="ml-1">Quality: {data.summary?.extraction_quality || 'Unknown'}</span>
              </div>
              <div className="text-sm text-gray-500">
                Confidence: {Math.round((data.summary?.average_confidence || 0) * 100)}%
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">
              {data.summary?.total_parameters || 0}
            </div>
            <div className="text-sm text-gray-500">Parameters Analyzed</div>
          </div>
        </div>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-lg font-semibold text-gray-900">
                {data.summary?.overall_status || 'Unknown'}
              </div>
              <div className="text-sm text-gray-500">Overall Status</div>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Information */}
      {data.processing_info && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2 text-blue-500" />
            Processing Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="font-medium text-blue-800">Images Processed</div>
              <div className="text-blue-600">{data.processing_info.images_processed}</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="font-medium text-green-800">Text Extractions</div>
              <div className="text-green-600">{data.processing_info.text_extractions}</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="font-medium text-purple-800">Patterns Tried</div>
              <div className="text-purple-600">{data.processing_info.total_patterns_tried}</div>
            </div>
          </div>
        </div>
      )}

      {/* Results by Category */}
      {data.categories && Object.keys(data.categories).map((category, index) => (
        <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              {getCategoryIcon(category)}
              <span className="ml-2">{category}</span>
              <span className="ml-auto text-sm text-gray-500">
                {Object.keys(data.categories[category]).length} parameters
              </span>
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Object.entries(data.categories[category]).map(([paramName, paramData]) => (
                <div key={paramName} className={`p-4 rounded-lg border-2 ${getStatusColor(paramData.status)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{paramName}</h3>
                    <div className="flex items-center space-x-2">
                      {paramData.confidence && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(paramData.confidence)}`}>
                          {Math.round(paramData.confidence * 100)}%
                        </span>
                      )}
                      {getStatusIcon(paramData.status)}
                    </div>
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

      {/* Confidence Scores Summary */}
      {data.confidence_scores && Object.keys(data.confidence_scores).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-blue-500" />
            Extraction Confidence Scores
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(data.confidence_scores).map(([param, confidence]) => (
              <div key={param} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700 truncate">{param}</div>
                <div className={`text-lg font-bold ${
                  confidence >= 0.8 ? 'text-green-600' :
                  confidence >= 0.6 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {Math.round(confidence * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <strong>Important Disclaimer:</strong> This analysis uses advanced OCR and fuzzy matching algorithms but may not be 100% accurate. Results are for informational purposes only and should not replace professional medical advice. Please consult with your healthcare provider for proper interpretation of your medical results and any necessary follow-up care.
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
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      // Basic file validation
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(selectedFile.type)) {
        setError('Please select a valid image file (JPEG, JPG, or PNG)');
        return;
      }

      if (selectedFile.size > maxSize) {
        setError('File size must be less than 10MB');
        return;
      }

      setFile(selectedFile);
      setResults(null);
      setError(null);
    }
  };

  const handleInputChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFileChange(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto p-6">
        {!results ? (
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-10 h-10 text-blue-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Enhanced Medical Report Analyzer
                </h1>
                <p className="text-gray-600 mb-2">
                  Advanced OCR with fuzzy matching and multi-pass processing
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    <span>Enhanced Accuracy</span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 mr-1" />
                    <span>Multi-pass Processing</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>Confidence Scoring</span>
                  </div>
                </div>
              </div>
              
              <div className="max-w-md mx-auto">
                {/* Drag and Drop Area */}
                <div 
                  className={`mb-6 p-8 border-2 border-dashed rounded-lg transition-colors ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Drag and drop your medical report here
                    </p>
                    <p className="text-sm text-gray-500 mb-4">or</p>
                    <label className="cursor-pointer">
                      <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        Browse Files
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleInputChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {file && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center text-blue-800">
                      <FileText className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">{file.name}</span>
                    </div>
                    <div className="text-xs text-blue-600 mt-1 flex items-center justify-between">
                      <span>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      <span>Type: {file.type}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                    disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-4 px-6 rounded-lg 
                    transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 
                    flex items-center justify-center shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing with Enhanced OCR...
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

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <p><strong>Supported Formats:</strong></p>
                  <p>JPG, PNG, JPEG</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Activity className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <p><strong>Max File Size:</strong></p>
                  <p>10MB per file</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <p><strong>Enhanced Features:</strong></p>
                  <p>Multi-pass OCR, Fuzzy matching</p>
                </div>
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
                  <span className="ml-2 text-sm text-gray-500">
                    (Quality: {results.summary?.extraction_quality}, 
                    Confidence: {Math.round((results.summary?.average_confidence || 0) * 100)}%)
                  </span>
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