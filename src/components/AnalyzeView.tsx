import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Camera, 
  X, 
  Sparkles, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  Loader2, 
  Image as ImageIcon,
  MapPin,
  Tag,
  FileText,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';
import { FOOD_SAMPLES, FOOD_CATEGORIES } from '../data/foodSamples.js';
import { AnalysisInput, FoodLensAnalysis } from '../types.js';
import { api } from '../lib/api.js';

interface AnalyzeViewProps {
  onAnalysisComplete: (analysis: FoodLensAnalysis) => void;
  preselectedCategory?: string;
}

export const AnalyzeView: React.FC<AnalyzeViewProps> = ({
  onAnalysisComplete,
  preselectedCategory
}) => {
  const { t } = useLanguage();

  // Image State
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);

  // Camera State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Optional Context Inputs
  const [foodName, setFoodName] = useState('');
  const [location, setLocation] = useState('');
  const [foodType, setFoodType] = useState(preselectedCategory || 'Restaurant food');
  const [userNote, setUserNote] = useState('');

  // Analysis / Multi-stage Loading State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const stages = [
    'Checking image quality & format...',
    'Identifying food category & items...',
    'Examining visible hygiene indicators...',
    'Assessing serving condition & presentation...',
    'Fusing contextual information with food knowledge...',
    'Preparing your food insight...',
  ];

  // Stop camera when unmounting
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setErrorMessage(null);
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Unsupported file format. Please upload JPG, PNG, or WEBP images.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage('File size exceeds 20MB. Please choose a smaller food image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageBase64(reader.result as string);
      setImageFileName(file.name);
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Preset sample picker handler
  const handleSelectSample = async (sample: typeof FOOD_SAMPLES[0]) => {
    stopCamera();
    setErrorMessage(null);
    setFoodName(sample.name);
    setLocation(sample.location);
    setFoodType(sample.foodType);
    setUserNote(sample.note);
    setImageFileName(`${sample.name}.jpg`);

    // Fetch sample image as base64 to ensure instant server-side processing
    try {
      const response = await fetch(sample.imageUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      // Fallback: direct url
      setImageBase64(sample.imageUrl);
    }
  };

  // Camera capture controls
  const startCamera = async () => {
    setCameraError(null);
    setImageBase64(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Unable to access camera. Please check permissions or upload an image instead.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setImageBase64(dataUrl);
      setImageFileName('Captured_Food.jpg');
      stopCamera();
    }
  };

  const handleRemoveImage = () => {
    setImageBase64(null);
    setImageFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleStartAnalysis = async () => {
    if (!imageBase64) return;
    setIsAnalyzing(true);
    setErrorMessage(null);
    setCurrentStageIndex(0);

    // Multi-stage progress simulation while real API runs
    const stageInterval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < stages.length - 1) return prev + 1;
        return prev;
      });
    }, 700);

    try {
      const payload: AnalysisInput = {
        imageBase64,
        foodName: foodName.trim() || undefined,
        location: location.trim() || undefined,
        foodType: foodType.trim() || undefined,
        userNote: userNote.trim() || undefined,
      };

      const result = await api.analyzeFood(payload, true);
      clearInterval(stageInterval);
      onAnalysisComplete(result.analysis);
    } catch (err: any) {
      clearInterval(stageInterval);
      setErrorMessage(err.message || 'Analysis could not be completed. Please try again.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs uppercase font-bold tracking-widest text-[#114232]">
          Visual Food Assessment
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1C1E1D] mt-2">
          {t('bringIntoFocus')}
        </h1>
        <p className="text-sm text-[#6E8576] mt-3">
          Upload an image of street food, home dishes, restaurant dining, or beverages to receive an AI-assisted visual report.
        </p>
      </div>

      {/* Preset Quick Samples */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-[#2C302E] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Or test instantly with a curated food sample:</span>
          </span>
          <span className="text-[11px] text-[#8A9A86]">1-Click load</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {FOOD_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#E8E4DC] hover:border-[#114232]/50 hover:bg-[#FAF8F5] transition-all text-left shadow-2xs group"
            >
              <img
                src={sample.imageUrl}
                alt={sample.name}
                className="w-10 h-10 rounded-lg object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-[#1C1E1D] truncate group-hover:text-[#114232]">
                  {sample.name}
                </p>
                <p className="text-[10px] text-[#8A9A86] truncate">{sample.foodType}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <div className="flex-1">
            <p className="font-semibold">Notice</p>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Main Grid: Left Upload/Preview | Right Contextual Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Area */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-[#E8E4DC] rounded-3xl p-6 luxury-shadow">
            {/* Live Camera View */}
            {isCameraActive ? (
              <div className="space-y-4">
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-4">
                    <button
                      id="camera-take-photo-btn"
                      onClick={capturePhoto}
                      className="w-14 h-14 rounded-full bg-white border-4 border-[#114232] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
                      aria-label="Take food snapshot"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#114232]" />
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-4 py-2 rounded-full bg-black/60 text-white text-xs font-semibold backdrop-blur-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[#6E8576] text-center">
                  Position your food in good lighting and tap the shutter button.
                </p>
              </div>
            ) : imageBase64 ? (
              /* Image Preview Card */
              <div className="space-y-4">
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#E8E4DC]">
                  <img
                    src={imageBase64}
                    alt="Selected food preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    id="remove-image-btn"
                    onClick={handleRemoveImage}
                    disabled={isAnalyzing}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-[#1C1E1D] hover:bg-white hover:text-red-600 transition-colors shadow-xs"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1 rounded-full">
                    {imageFileName || 'Selected Food Image'}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#6E8576] pt-1">
                  <span>Image ready for inspection</span>
                  <button
                    onClick={handleRemoveImage}
                    className="text-[#114232] font-semibold hover:underline"
                  >
                    Choose another
                  </button>
                </div>
              </div>
            ) : (
              /* Upload / Drag-and-Drop Area */
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${
                  dragActive
                    ? 'border-[#114232] bg-[#FAF8F5]'
                    : 'border-[#E8E4DC] hover:border-[#114232]/40 bg-[#FAF8F5]/60'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="food-image-input"
                />

                <div className="w-16 h-16 rounded-full bg-white border border-[#E8E4DC] flex items-center justify-center mx-auto mb-4 text-[#114232] shadow-xs">
                  <Upload className="w-6 h-6" />
                </div>

                <h3 className="font-editorial text-xl font-medium text-[#1C1E1D]">
                  Drag and drop your food photo here
                </h3>
                <p className="text-xs text-[#6E8576] mt-1.5 mb-6 max-w-sm mx-auto">
                  Supports JPG, PNG, WEBP up to 20MB. Clear natural lighting provides the most reliable visual cues.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 rounded-full bg-[#114232] text-white text-xs font-semibold hover:bg-[#0E3B2C] transition-colors shadow-xs"
                  >
                    Browse Files
                  </button>

                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-5 py-2.5 rounded-full border border-[#E8E4DC] bg-white text-[#2C302E] text-xs font-semibold hover:border-[#114232]/40 transition-colors flex items-center gap-2 shadow-2xs"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#114232]" />
                    <span>Use Camera</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Optional Context Inputs & Multi-stage Action */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="bg-white border border-[#E8E4DC] rounded-3xl p-6 luxury-shadow space-y-5">
            <div>
              <span className="text-[11px] uppercase font-bold tracking-widest text-[#114232]">
                Context Enrichment (Optional)
              </span>
              <h3 className="font-editorial text-xl font-medium text-[#1C1E1D] mt-1">
                Help the AI understand your meal
              </h3>
              <p className="text-xs text-[#6E8576] mt-1">
                Context grounds the visual assessment in real culinary and hygiene expectations.
              </p>
            </div>

            {/* Food Name */}
            <div>
              <label className="block text-xs font-semibold text-[#2C302E] mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#6E8576]" />
                <span>Food Name</span>
              </label>
              <input
                id="context-input-name"
                type="text"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="e.g., Chicken biryani, Jigarthanda, Pani puri"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] text-xs text-[#1C1E1D] focus:outline-none focus:ring-2 focus:ring-[#114232]/20 focus:border-[#114232]"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-[#2C302E] mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#6E8576]" />
                <span>Location / City / Area</span>
              </label>
              <input
                id="context-input-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Chennai, Madurai, T Nagar Market"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] text-xs text-[#1C1E1D] focus:outline-none focus:ring-2 focus:ring-[#114232]/20 focus:border-[#114232]"
              />
            </div>

            {/* Food Category / Type */}
            <div>
              <label className="block text-xs font-semibold text-[#2C302E] mb-1.5">
                Food Category
              </label>
              <select
                id="context-input-type"
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] text-xs text-[#1C1E1D] focus:outline-none focus:ring-2 focus:ring-[#114232]/20 focus:border-[#114232]"
              >
                {FOOD_CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Additional Note */}
            <div>
              <label className="block text-xs font-semibold text-[#2C302E] mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#6E8576]" />
                <span>Observation or Note</span>
              </label>
              <textarea
                id="context-input-note"
                rows={3}
                value={userNote}
                onChange={(e) => setUserNote(e.target.value)}
                placeholder="e.g., Bought from street cart, served hot, notice slightly open sauce bowl"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] text-xs text-[#1C1E1D] focus:outline-none focus:ring-2 focus:ring-[#114232]/20 focus:border-[#114232] resize-none"
              />
            </div>
          </div>

          {/* Action / Multi-stage Loading UI */}
          <div className="mt-6">
            {isAnalyzing ? (
              <div 
                id="multi-stage-progress-card"
                className="bg-white border border-[#E8E4DC] rounded-3xl p-6 luxury-shadow space-y-4 animate-in fade-in"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#114232]/10 flex items-center justify-center text-[#114232]">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#6E8576]">
                      Stage {currentStageIndex + 1} of {stages.length}
                    </span>
                    <h4 className="text-sm font-semibold text-[#1C1E1D]">
                      {stages[currentStageIndex]}
                    </h4>
                  </div>
                </div>

                {/* Progress bar line */}
                <div className="w-full h-1.5 bg-[#F5F2EB] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#114232] transition-all duration-500 rounded-full"
                    style={{ width: `${((currentStageIndex + 1) / stages.length) * 100}%` }}
                  />
                </div>

                <div className="space-y-1.5 pt-1">
                  {stages.map((stage, idx) => (
                    <div 
                      key={idx}
                      className={`flex items-center gap-2 text-[11px] transition-colors ${
                        idx < currentStageIndex 
                          ? 'text-[#114232] font-medium' 
                          : idx === currentStageIndex 
                          ? 'text-[#1C1E1D] font-semibold' 
                          : 'text-[#8A9A86]/60'
                      }`}
                    >
                      {idx < currentStageIndex ? (
                        <Check className="w-3 h-3 text-[#114232]" />
                      ) : idx === currentStageIndex ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#114232] animate-pulse ml-0.5 mr-1" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#E8E4DC] ml-0.5 mr-1" />
                      )}
                      <span>{stage}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <button
                id="submit-analysis-btn"
                onClick={handleStartAnalysis}
                disabled={!imageBase64}
                className="w-full py-4 px-6 rounded-2xl bg-[#114232] text-white text-sm font-semibold tracking-wide hover:bg-[#0E3B2C] transition-all shadow-xs luxury-card-hover flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Analyze food now</span>
                <ArrowRight className="w-4 h-4 text-[#E8DFD0]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
