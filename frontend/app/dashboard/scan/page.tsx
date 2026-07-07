"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Scan, Recycle, Lightbulb, Check, Camera, ArrowLeft } from "lucide-react";
import { wasteApi } from "@/lib/api";
import type { WasteScanResult } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { translateText } from "@/lib/translator"; 

const langCodeMap: Record<string, string> = {
  French: "fr",
  Hausa: "ha",
  Yoruba: "yo",
  Igbo: "ig",
  English: "en",
};

export default function ScannerPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Our traffic light to prevent the race condition
  const startingRef = useRef(false);

  const { t, currentLang } = useLanguage(); 
  
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<WasteScanResult | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const processAndTranslateResult = async (data: WasteScanResult) => {
    const targetCode = langCodeMap[currentLang] || "en";
    if (targetCode === "en") {
      setResult(data);
      return;
    }
    try {
      const [translatedType, translatedCategory, translatedGuidance, translatedTip] = await Promise.all([
        translateText(data.wasteType, targetCode),
        translateText(data.category, targetCode),
        translateText(data.disposalGuidance, targetCode),
        translateText(data.ecoTip, targetCode)
      ]);
      data.wasteType = translatedType;
      data.category = translatedCategory;
      data.disposalGuidance = translatedGuidance;
      data.ecoTip = translatedTip;
      setResult(data);
    } catch (err) {
      console.error("Translation failed", err);
      setResult(data);
    }
  };

  const startCamera = async () => {
    if (startingRef.current || streamRef.current) return;
    
    startingRef.current = true;
    try {
      setError("");
      try {
        const constraints = isTouchDevice 
          ? { video: { facingMode: { ideal: "environment" } }, audio: false }
          : { video: { facingMode: "user" }, audio: false };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraReady(true);
      } catch (specificErr) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraReady(true);
      }
    } catch (err: any) {
      console.error("Camera error details:", err);
      setError(`Camera Error: Please check permissions or hardware.`);
    } finally {
      startingRef.current = false;
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
    startingRef.current = false;
  };

  useEffect(() => {
    setHydrated(true);
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const processStoredImage = useCallback(async () => {
    const storedImage = localStorage.getItem("scannedImage");
    const source = localStorage.getItem("scanSource");
    if (storedImage && source === "upload") {
      localStorage.removeItem("scannedImage");
      localStorage.removeItem("scanSource");
      setCapturedImage(storedImage);
      setScanning(true);
      try {
        const data = await wasteApi.scan({ imageBase64: storedImage });
        await processAndTranslateResult(data);
      } catch (err: any) {
        setError(err.message || "Failed to analyze.");
      } finally {
        setScanning(false);
      }
      return true;
    }
    return false;
  }, [currentLang]);

  const processManualText = useCallback(async () => {
    const manualText = localStorage.getItem("manualWasteType");
    const source = localStorage.getItem("scanSource");
    if (manualText && source === "manual") {
      localStorage.removeItem("manualWasteType");
      localStorage.removeItem("scanSource");
      setScanning(true);
      try {
        const data = await wasteApi.scan({ text: manualText });
        await processAndTranslateResult(data);
      } catch (err: any) {
        setError(err.message || "Failed to analyze.");
      } finally {
        setScanning(false);
      }
      return true;
    }
    return false;
  }, [currentLang]);

  useEffect(() => {
    if (!hydrated) return;
    Promise.all([processStoredImage(), processManualText()]).then(([hadImage, hadText]) => {
      if (!hadImage && !hadText) {
        startCamera();
      }
    });
    return () => stopCamera();
  }, [hydrated, processStoredImage, processManualText]);

  useEffect(() => {
    if (videoRef.current && streamRef.current && !videoRef.current.srcObject) {
      videoRef.current.srcObject = streamRef.current;
    }
  });

  if (!hydrated) return null;

  const captureAndScan = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || scanning) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    ctx.drawImage(video, 0, 0);
    const imageBase64 = canvas.toDataURL("image/jpeg", 0.8);

    setCapturedImage(imageBase64);
    stopCamera();
    setScanning(true);
    setError("");

    try {
      const data = await wasteApi.scan({ imageBase64 });
      await processAndTranslateResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to analyze waste.");
      setCapturedImage(null);
      startCamera();
    } finally {
      setScanning(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const imgData = reader.result as string;
      setCapturedImage(imgData);
      stopCamera();
      setScanning(true);
      setError("");
      
      try {
        const data = await wasteApi.scan({ imageBase64: imgData });
        await processAndTranslateResult(data);
      } catch (err: any) {
        setError(err.message || "Failed to analyze.");
        setCapturedImage(null);
        startCamera();
      } finally {
        setScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const resetScan = () => {
    setResult(null);
    setCapturedImage(null);
    setScanning(false);
    setError("");
    setCameraReady(false);
    startCamera();
  };
  
  if (scanning) {
    return (
      <div className="flex min-h-screen flex-col bg-black">
        {capturedImage && (
          <img src={capturedImage} alt="Captured" className="absolute inset-0 h-full w-full object-contain opacity-50" />
        )}
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-5 text-white">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#5d9d35] border-t-transparent" />
            <p className="text-lg font-semibold">{t("scanner.analyzing") || "Analyzing your waste..."}</p>
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="flex min-h-screen flex-col bg-black">
        {capturedImage && (
          <img src={capturedImage} alt="Scanned waste" className="absolute inset-0 h-full w-full object-contain opacity-20" />
        )}
        <div className="relative z-10 flex flex-1 flex-col justify-end">
          <div className="w-full animate-slide-up rounded-t-[32px] bg-white pb-8 pt-5 shadow-2xl">
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-slate-300" />
            <div className="flex items-start justify-between px-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-slate-900">{result.wasteType}</h2>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${result.recyclable ? "bg-[#5d9d35]" : "bg-slate-400"}`}>
                    <Check className="h-6 w-6 text-white" />
                  </div>
                </div>
                <span className="mt-2 inline-block rounded-full bg-[#edf5ee] px-3.5 py-1 text-sm font-medium capitalize text-[#2f7d32]">{result.category}</span>
                <span className={`ml-2 inline-block rounded-full px-3.5 py-1 text-sm font-medium ${result.recyclable ? "bg-[#e5f4e8] text-[#22b455]" : "bg-[#fee7e7] text-red-500"}`}>
                  {result.recyclable ? (t("scanner.recyclable") || "Recyclable") : (t("scanner.notRecyclable") || "Not Recyclable")}
                </span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 px-6">
              <div className="rounded-2xl bg-[#d8ecd8] px-4 py-3.5">
                <p className="text-xs font-medium text-[#246c3b]/70">{t("scanner.estimatedValue") || "Estimated Value"}</p>
                <p className="mt-1 text-xl font-bold text-[#1e6a35]">₦{result.estimatedValue.min} – ₦{result.estimatedValue.max}</p>
              </div>
              <div className="rounded-2xl bg-[#eef1f3] px-4 py-3.5">
                <p className="text-xs font-medium text-slate-500">{t("scanner.confidence") || "Confidence"}</p>
                <p className="mt-1 text-xl font-bold text-slate-900">{Math.round(result.confidence)}%</p>
                <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200">
                  <div className="h-1.5 rounded-full bg-[#5d9d35]" style={{ width: `${result.confidence}%` }} />
                </div>
              </div>
            </div>
            <div className="mx-6 mt-3 flex gap-3 rounded-2xl bg-white p-4 ring-1 ring-black/5">
              <Recycle className="mt-0.5 h-5 w-5 shrink-0 text-[#5c9d35]" />
              <p className="text-sm leading-relaxed text-slate-600">{result.disposalGuidance}</p>
            </div>
            <div className="mx-6 mt-2 flex gap-3 rounded-2xl bg-[#dff0e2] p-4">
              <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-[#1da1f2]" />
              <p className="text-sm leading-relaxed text-slate-600">{result.ecoTip}</p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 px-6">
              <button onClick={() => router.push(`/dashboard/recyclers?waste=${encodeURIComponent(result.wasteType)}`)} className="flex items-center justify-center gap-2 rounded-2xl bg-[#5d9d35] py-3.5 font-semibold text-white">
                <Recycle className="h-5 w-5" /> {t("scanner.findRecycler") || "Find Recycler"}
              </button>
              <button onClick={resetScan} className="flex items-center justify-center gap-2 rounded-2xl border-2 border-[#2f7d32] py-3.5 font-semibold text-[#5d9d35]">
                <Camera className="h-5 w-5" /> {t("scanner.scanAgain") || "Scan Again"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-8 text-center">
        <p className="text-lg text-red-400">{error}</p>
        <div className="flex gap-3 mt-4">
          <button onClick={() => { setError(""); startCamera(); }} className="rounded-full bg-white px-6 py-3 font-semibold text-black">
            {t("scanner.retryCamera") || "Retry Camera"}
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white">
            {t("scanner.uploadImage") || "Upload Image"}
          </button>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <canvas ref={canvasRef} className="hidden" />
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

      <div className="z-20 flex items-center justify-between px-3 py-2">
        <button onClick={() => router.push("/dashboard")} className="text-white/70 hover:text-white">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button onClick={() => fileInputRef.current?.click()} className="rounded-full bg-white/10 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
          {t("common.upload") || "Upload Image"}
        </button>
      </div>

      <div className="relative aspect-3/4 w-full max-w-xl mx-auto flex-1 overflow-hidden bg-black">
        <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />

        {!cameraReady && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div className="flex flex-col items-center gap-3 text-white">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#5d9d35] border-t-transparent" />
              <p className="text-xs text-white/60">{t("scanner.startingCamera") || "Starting camera..."}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center py-4">
        <button onClick={captureAndScan} className="flex h-14 w-14 items-center justify-center rounded-full bg-[#5d9d35] shadow-[0_0_25px_rgba(93,157,53,0.4)] disabled:opacity-50" disabled={!cameraReady}>
          <Scan className="h-7 w-7 text-white" />
        </button>
      </div>
    </div>
  );
}