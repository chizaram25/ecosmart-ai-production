"use client";

import React, { useState, useEffect } from 'react';
import {
  Globe, ChevronLeft, Check, Camera, Store,
  ArrowRight, Leaf, Bot, AlertCircle
} from 'lucide-react';

export default function BuildProfilePage() {
  // Form State
  const [operationSize, setOperationSize] = useState('Small team');
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  // Touched State for Error Handling
  const [touched, setTouched] = useState({
    businessName: false,
    description: false,
    whatsapp: false,
  });

  // Validation States
  const [errors, setErrors] = useState({
    businessName: '',
    description: '',
    whatsapp: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);

  // Validation Effect
  useEffect(() => {
    const newErrors = { businessName: '', description: '', whatsapp: '' };
    let isValid = true;

    // Validate Business Name
    if (touched.businessName && businessName.trim().length < 3) {
      newErrors.businessName = 'Business name is required (min 3 characters).';
      isValid = false;
    } else if (businessName.trim().length < 3) {
      isValid = false;
    }

    // Validate Description
    if (touched.description && description.trim().length < 10) {
      newErrors.description = 'Please provide a description (min 10 characters).';
      isValid = false;
    } else if (touched.description && description.length > 200) {
      newErrors.description = 'Description cannot exceed 200 characters.';
      isValid = false;
    } else if (description.trim().length < 10 || description.length > 200) {
      isValid = false;
    }

    // Validate WhatsApp (Optional, but must be valid if entered)
    if (whatsapp.length > 0) {
      const cleanWa = whatsapp.replace(/\D/g, '');
      if (touched.whatsapp && (cleanWa.length < 10 || cleanWa.length > 11)) {
        newErrors.whatsapp = 'Enter a valid 10 or 11-digit phone number.';
        isValid = false;
      } else if (cleanWa.length < 10 || cleanWa.length > 11) {
        isValid = false;
      }
    }

    setErrors(newErrors);
    setIsFormValid(isValid);
  }, [businessName, description, whatsapp, touched]);

  // Handlers
  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setTouched({ businessName: true, description: true, whatsapp: true });
    } else {
      console.log('Proceeding to next step...');
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfc] font-sans text-gray-900 selection:bg-green-100 selection:text-green-900 flex flex-col relative pb-10">

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto flex justify-between items-center px-6 md:px-12 pt-6 pb-4">
        <div className="flex items-center gap-1.5 cursor-pointer">
          <div className="bg-green-50 p-1.5 rounded-full">
            <Leaf className="w-5 h-5 md:w-6 md:h-6 text-[#449339]" />
          </div>
          <div className="text-[17px] md:text-xl tracking-tight">
            <span className="font-bold text-[#449339]">EcoSmart</span>
            <span className="font-bold text-gray-900 ml-0.5">AI</span>
          </div>
        </div>
        <button className="flex items-center gap-1.5 border border-gray-200 rounded-full px-4 py-2 bg-white hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
          <Globe className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-600">English</span>
        </button>
      </header>

      {/* Main Form Area */}
      <main className="flex-grow w-full max-w-3xl mx-auto px-6 md:px-12 pt-4 md:pt-8 flex flex-col">

        {/* Progress Navigation */}
        <div className="w-full mb-8">
          <div className="flex justify-between items-center mb-4">
            <button className="flex items-center gap-1.5 text-[#1b5030] hover:text-[#549B45] font-semibold text-[14px] md:text-[15px] transition-colors cursor-pointer">
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
              Back
            </button>
            <div className="flex items-center gap-1 text-[#549B45] font-medium text-[13px] md:text-[14px]">
              Saved <Check className="w-4 h-4" />
            </div>
          </div>

          {/* Progress Bars */}
          <div className="flex gap-2 w-full mb-2">
            <div className="h-1.5 flex-1 bg-[#549B45] rounded-full"></div>
            <div className="h-1.5 flex-1 bg-gray-200 rounded-full"></div>
            <div className="h-1.5 flex-1 bg-gray-200 rounded-full"></div>
            <div className="h-1.5 flex-1 bg-gray-200 rounded-full"></div>
          </div>
          <div className="flex justify-between text-[11px] md:text-[13px] text-gray-500 font-medium">
            <span>Step 1 of 4</span>
            <span>Build Your Profile</span>
          </div>
        </div>

        {/* Title */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-[28px] md:text-4xl lg:text-[40px] leading-tight font-extrabold text-[#111827] mb-2 md:mb-3">
            Tell Us About Yourself.
          </h1>
          <p className="text-[14px] md:text-base text-gray-500 font-medium">
            This is how people will discover your business when looking for a recycler nearby.
          </p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8 md:gap-10 relative">

          {/* Photo Upload */}
          <div className="flex flex-col items-center justify-center w-full">
            <button type="button" className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 hover:border-[#549B45] hover:bg-[#f1f7ef] transition-colors group cursor-pointer">
              <Camera className="w-6 h-6 md:w-7 md:h-7 text-[#549B45]" />
              <span className="text-[11px] md:text-[12px] font-medium text-gray-500 group-hover:text-[#549B45]">Add Photo</span>
            </button>
            <p className="text-[12px] md:text-[13px] text-gray-400 mt-4 font-medium text-center">
              Optional — profiles with photos get <span className="font-bold text-gray-500">3×</span> more requests.
            </p>
          </div>

          {/* Operation Size */}
          <div>
            <label className="block text-[15px] md:text-[16px] font-bold text-gray-900 mb-1">
              How big is your operation?
            </label>
            <p className="text-[13px] text-gray-500 mb-3">This helps us show you the right features.</p>
            <div className="flex flex-wrap gap-3">
              {['Just me', 'Small team', 'I run a facility'].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setOperationSize(size)}
                  className={`px-5 py-2.5 rounded-full text-[14px] font-semibold transition-all duration-300 border ${
                    operationSize === size
                      ? 'bg-[#549B45] text-white border-[#549B45] shadow-md'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#549B45] hover:bg-[#f1f7ef]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Business Name Field */}
          <div>
            <label className="block text-[13px] md:text-[14px] font-medium text-gray-700 mb-2">Business Name</label>
            <div className={`relative flex items-center border rounded-[1rem] md:rounded-2xl px-4 py-3.5 bg-white transition-colors shadow-sm ${errors.businessName ? 'border-red-400 focus-within:border-red-500' : 'border-gray-200 focus-within:border-[#549B45]'}`}>
              <Store className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                onBlur={() => handleBlur('businessName')}
                placeholder="e.g. Musa Waste Collection, GreenCycle Plant"
                className="w-full outline-none text-[14px] md:text-[15px] text-gray-900 placeholder:text-gray-400 bg-transparent"
              />
              {errors.businessName && <AlertCircle className="w-5 h-5 text-red-500 ml-2 shrink-0 animate-in zoom-in" />}
            </div>
            {errors.businessName ? (
              <p className="text-[12px] text-red-500 mt-2 flex items-center gap-1 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.businessName}
              </p>
            ) : (
              <p className="text-[12px] text-gray-500 mt-2">This is how people search for your business.</p>
            )}
          </div>

          {/* Short Description Field */}
          <div>
            <label className="block text-[13px] md:text-[14px] font-medium text-gray-700 mb-2">Short Description</label>
            <div className={`relative flex flex-col border rounded-[1rem] md:rounded-2xl p-4 bg-white transition-colors shadow-sm ${errors.description ? 'border-red-400 focus-within:border-red-500' : 'border-gray-200 focus-within:border-[#549B45]'}`}>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => handleBlur('description')}
                placeholder="e.g. We collect plastic and aluminium across Kubwa, Abuja. Available Monday to Saturday."
                className="w-full outline-none text-[14px] md:text-[15px] text-gray-900 placeholder:text-gray-400 bg-transparent resize-none min-h-[100px]"
                maxLength={200}
              />
              <div className="flex justify-end w-full mt-2">
                <span className={`text-[11px] md:text-[12px] font-medium ${description.length >= 200 ? 'text-red-500' : 'text-gray-400'}`}>
                  {description.length}/200
                </span>
              </div>
            </div>
            {errors.description && (
              <p className="text-[12px] text-red-500 mt-2 flex items-center gap-1 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.description}
              </p>
            )}
          </div>

          {/* Promotion Banner */}
          <div className="bg-[#eaf4e7] rounded-2xl p-4 md:p-5 flex items-start md:items-center gap-4">
            <div className="mt-0.5 md:mt-0">
              <Leaf className="w-5 h-5 text-[#549B45]" />
            </div>
            <p className="text-[13px] md:text-[14px] text-[#1b5030] leading-snug">
              Recyclers with complete profiles receive <span className="font-bold">5× more pickup requests.</span>
            </p>
          </div>

          {/* WhatsApp Number Field */}
          <div className="mb-4">
            <label className="block text-[13px] md:text-[14px] font-medium text-gray-700 mb-2">
              WhatsApp Number <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <div className={`relative flex items-center border rounded-[1rem] md:rounded-2xl px-4 py-3.5 bg-white transition-colors shadow-sm ${errors.whatsapp ? 'border-red-400 focus-within:border-red-500' : 'border-gray-200 focus-within:border-[#549B45]'}`}>
              <svg className="w-5 h-5 text-[#25D366] mr-3 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                onBlur={() => handleBlur('whatsapp')}
                placeholder="WhatsApp number for household contact"
                className="w-full outline-none text-[14px] md:text-[15px] text-gray-900 placeholder:text-gray-400 bg-transparent"
              />
              {errors.whatsapp && <AlertCircle className="w-5 h-5 text-red-500 ml-2 shrink-0 animate-in zoom-in" />}
            </div>
            {errors.whatsapp ? (
              <p className="text-[12px] text-red-500 mt-2 flex items-center gap-1 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.whatsapp}
              </p>
            ) : (
              <p className="text-[12px] text-gray-500 mt-2">Households may use this to confirm pickups.</p>
            )}
          </div>

          {/* Ask Mina Prompt */}
          <div className="flex items-center gap-4 bg-[#fcfdfc] md:bg-white rounded-full">
            <div className="w-10 h-10 bg-[#eaf4e7] rounded-full flex items-center justify-center relative shadow-sm shrink-0">
               <Bot className="w-6 h-6 text-[#549B45]" />
            </div>
            <div className="flex items-center bg-[#f1f8ee] rounded-full px-4 py-2">
              <span className="text-[13px] md:text-[14px] text-gray-700 font-medium mr-2">Need help filling this in?</span>
              <button type="button" className="text-[13px] md:text-[14px] font-bold text-[#1b5030] hover:text-[#549B45] flex items-center gap-1 transition-colors">
                Ask Mina <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Floating Mina Bot Button */}
          <div className="absolute -bottom-8 right-0 md:-right-8">
            <button type="button" className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.15)] border-2 border-[#549B45] hover:scale-110 transition-transform cursor-pointer group">
              <Bot className="w-6 h-6 text-[#549B45]" />
              <div className="absolute top-0 right-0 bg-[#549B45] p-1 rounded-full border-2 border-white">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-4 rounded-full font-bold text-[15px] md:text-[16px] flex items-center justify-center gap-2 transition-all duration-300 mt-2 ${
              isFormValid
                ? 'bg-[#549B45] text-white shadow-lg shadow-green-900/20 hover:bg-[#458237] hover:-translate-y-0.5 cursor-pointer'
                : 'bg-[#549B45]/50 text-white cursor-not-allowed'
            }`}
          >
            Next: Location & Hours <ArrowRight className="w-5 h-5" />
          </button>

        </form>

        {/* Footer Navigation Tabs */}
        <div className="flex justify-center gap-4 md:gap-8 mt-12 text-[12px] md:text-[14px]">
          <span className="font-bold text-gray-900">Basic Info</span>
          <span className="text-gray-400 font-medium">Location</span>
          <span className="text-gray-400 font-medium">Categories</span>
          <span className="text-gray-400 font-medium">Pricing</span>
        </div>

      </main>
    </div>
  );
}
