import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { qrCodeService } from "@/services/api/qrCodeService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";

const BulkImportPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [mapping, setMapping] = useState({});
  const [qrType, setQrType] = useState('url');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [step, setStep] = useState(1); // 1: Upload, 2: Map, 3: Preview, 4: Generate

  const qrTypes = [
    { value: 'url', label: 'URL', icon: 'Link', description: 'Generate QR codes for URLs' },
    { value: 'text', label: 'Text', icon: 'Type', description: 'Generate QR codes for plain text' },
    { value: 'vcard', label: 'vCard', icon: 'User', description: 'Generate QR codes for contact cards' },
    { value: 'wifi', label: 'WiFi', icon: 'Wifi', description: 'Generate QR codes for WiFi credentials' }
  ];

  const fieldMappings = {
    url: [
      { key: 'url', label: 'URL', required: true, description: 'The website URL' }
    ],
    text: [
      { key: 'text', label: 'Text Content', required: true, description: 'The text to encode' }
    ],
    vcard: [
      { key: 'firstName', label: 'First Name', required: true, description: 'Contact first name' },
      { key: 'lastName', label: 'Last Name', required: false, description: 'Contact last name' },
      { key: 'phone', label: 'Phone', required: false, description: 'Phone number' },
      { key: 'email', label: 'Email', required: false, description: 'Email address' },
      { key: 'company', label: 'Company', required: false, description: 'Company name' },
      { key: 'title', label: 'Job Title', required: false, description: 'Job title' }
    ],
    wifi: [
      { key: 'ssid', label: 'Network Name (SSID)', required: true, description: 'WiFi network name' },
      { key: 'password', label: 'Password', required: false, description: 'WiFi password' },
      { key: 'security', label: 'Security Type', required: false, description: 'WPA, WEP, or nopass' }
    ]
  };

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return { headers: [], data: [] };

    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(value => value.trim().replace(/"/g, ''));
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });

    return { headers, data };
  };

  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.toLowerCase().endsWith('.csv')) {
      toast.error('Please upload a valid CSV file');
      return;
    }

    setFile(uploadedFile);
    setIsProcessing(true);

    try {
      const text = await uploadedFile.text();
      const { headers, data } = parseCSV(text);
      
      if (data.length === 0) {
        toast.error('CSV file appears to be empty or invalid');
        return;
      }

      setHeaders(headers);
      setCsvData(data);
      setStep(2);
      toast.success(`Successfully parsed ${data.length} rows from CSV`);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast.error('Error parsing CSV file. Please check the format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMappingChange = (field, csvColumn) => {
    setMapping(prev => ({
      ...prev,
      [field]: csvColumn
    }));
  };

  const validateMapping = () => {
    const requiredFields = fieldMappings[qrType].filter(field => field.required);
    const missingFields = requiredFields.filter(field => !mapping[field.key]);
    
    if (missingFields.length > 0) {
      toast.error(`Please map required fields: ${missingFields.map(f => f.label).join(', ')}`);
      return false;
    }
    
    return true;
  };

  const generateQRContent = (row, type) => {
    switch (type) {
      case 'url':
        return { url: row[mapping.url] || '' };
      case 'text':
        return { text: row[mapping.text] || '' };
      case 'vcard':
        return {
          firstName: row[mapping.firstName] || '',
          lastName: row[mapping.lastName] || '',
          phone: row[mapping.phone] || '',
          email: row[mapping.email] || '',
          company: row[mapping.company] || '',
          title: row[mapping.title] || ''
        };
      case 'wifi':
        return {
          ssid: row[mapping.ssid] || '',
          password: row[mapping.password] || '',
          security: row[mapping.security] || 'WPA'
        };
      default:
        return {};
    }
  };

  const handlePreview = () => {
    if (!validateMapping()) return;
    setStep(3);
  };

  const handleBulkGenerate = async () => {
    if (!validateMapping()) return;

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const qrCodes = csvData.map((row, index) => ({
        type: qrType,
        content: generateQRContent(row, qrType),
        name: `Bulk Import ${index + 1}`,
        isDynamic: false
      }));

      // Generate QR codes in batches
      const batchSize = 5;
      const generatedCodes = [];
      
      for (let i = 0; i < qrCodes.length; i += batchSize) {
        const batch = qrCodes.slice(i, i + batchSize);
        const results = await Promise.all(
          batch.map(qrCode => qrCodeService.create(qrCode))
        );
        generatedCodes.push(...results);
        setGenerationProgress(Math.round(((i + batch.length) / qrCodes.length) * 100));
        
        // Small delay to prevent overwhelming
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      toast.success(`Successfully generated ${generatedCodes.length} QR codes!`);
      navigate('/library');
    } catch (error) {
      console.error('Error generating QR codes:', error);
      toast.error('Error generating QR codes. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleReset = () => {
    setFile(null);
    setCsvData([]);
    setHeaders([]);
    setMapping({});
    setStep(1);
    setGenerationProgress(0);
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Zap" className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Generating QR Codes</h3>
            <p className="text-gray-600">Please wait while we create your QR codes...</p>
          </div>
          
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <motion.div
                className="bg-gradient-to-r from-primary-600 to-primary-700 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${generationProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">{generationProgress}% complete</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulk QR Code Import</h1>
            <p className="text-lg text-gray-600">Upload a CSV file to generate multiple QR codes at once</p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Back to Create
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {[
            { num: 1, title: "Upload CSV", icon: "Upload" },
            { num: 2, title: "Map Fields", icon: "Settings" },
            { num: 3, title: "Preview", icon: "Eye" },
            { num: 4, title: "Generate", icon: "Zap" }
          ].map((stepItem, index) => (
            <div key={stepItem.num} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                step >= stepItem.num 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                <ApperIcon name={stepItem.icon} className="w-5 h-5" />
              </div>
              <span className={`ml-2 text-sm font-medium ${
                step >= stepItem.num ? 'text-primary-600' : 'text-gray-500'
              }`}>
                {stepItem.title}
              </span>
              {index < 3 && (
                <div className={`w-12 h-0.5 mx-4 ${
                  step > stepItem.num ? 'bg-primary-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Upload CSV */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ApperIcon name="Upload" className="w-10 h-10 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your CSV File</h2>
              <p className="text-gray-600">Select a CSV file containing the data for your QR codes</p>
            </div>

            <div className="max-w-md mx-auto">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ApperIcon name="FileText" className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">CSV files only</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileUpload}
                  disabled={isProcessing}
                />
              </label>

              {isProcessing && (
                <div className="mt-4 text-center">
                  <Loading />
                  <p className="text-sm text-gray-600 mt-2">Processing CSV file...</p>
                </div>
              )}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">CSV Format Requirements:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• First row should contain column headers</li>
                <li>• Use commas to separate values</li>
                <li>• Enclose text with commas in quotes</li>
                <li>• Maximum 1000 rows per file</li>
              </ul>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Step 2: Map Fields */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Select QR Code Type & Map Fields</h2>
            
            {/* QR Type Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">QR Code Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {qrTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => {
                      setQrType(type.value);
                      setMapping({});
                    }}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      qrType === type.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <ApperIcon name={type.icon} className={`w-6 h-6 mb-2 ${
                      qrType === type.value ? 'text-primary-600' : 'text-gray-600'
                    }`} />
                    <div className="font-medium text-gray-900">{type.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Field Mapping */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Map CSV Columns to QR Fields</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fieldMappings[qrType].map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <select
                      value={mapping[field.key] || ''}
                      onChange={(e) => handleMappingChange(field.key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">-- Select CSV Column --</option>
                      {headers.map((header) => (
                        <option key={header} value={header}>{header}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500">{field.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="secondary" onClick={handleReset}>
                <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
                Start Over
              </Button>
              <Button onClick={handlePreview}>
                Preview Data
                <ApperIcon name="Eye" className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Step 3: Preview */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Preview QR Code Data</h2>
            
            <div className="mb-4 p-4 bg-green-50 rounded-lg">
              <p className="text-green-800">
                <strong>{csvData.length}</strong> QR codes will be generated as <strong>{qrTypes.find(t => t.value === qrType)?.label}</strong> type
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                    {fieldMappings[qrType].map((field) => (
                      <th key={field.key} className="border border-gray-300 px-4 py-2 text-left">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(0, 10).map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                      {fieldMappings[qrType].map((field) => (
                        <td key={field.key} className="border border-gray-300 px-4 py-2">
                          {mapping[field.key] ? row[mapping[field.key]] || '-' : '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {csvData.length > 10 && (
              <p className="text-sm text-gray-600 mt-4">
                Showing first 10 rows. Total: {csvData.length} rows
              </p>
            )}

            <div className="flex justify-between mt-8">
              <Button variant="secondary" onClick={() => setStep(2)}>
                <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
                Back to Mapping
              </Button>
              <Button onClick={handleBulkGenerate}>
                <ApperIcon name="Zap" className="w-4 h-4 mr-2" />
                Generate {csvData.length} QR Codes
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default BulkImportPage;