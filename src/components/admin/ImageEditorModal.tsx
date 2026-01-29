"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Minus, Plus, RotateCcw, RotateCw, FlipHorizontal, Info } from "lucide-react";

interface ImageEditorModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  initialZoom: number;
  initialRotation: number;
  initialFlipH: boolean;
  onClose: () => void;
  onApply: (zoom: number, rotation: number, flipH: boolean) => void;
}

export default function ImageEditorModal({
  isOpen,
  imageUrl,
  initialZoom,
  initialRotation,
  initialFlipH,
  onClose,
  onApply,
}: ImageEditorModalProps) {
  const [zoom, setZoom] = useState(initialZoom);
  const [rotation, setRotation] = useState(initialRotation);
  const [flipH, setFlipH] = useState(initialFlipH);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setZoom(initialZoom);
      setRotation(initialRotation);
      setFlipH(initialFlipH);
    }
  }, [isOpen, initialZoom, initialRotation, initialFlipH]);

  if (!isOpen || !imageUrl) return null;

  const handleZoomChange = (delta: number) => {
    setZoom((prev) => Math.max(10, Math.min(200, prev + delta)));
  };

  const handleRotationChange = (delta: number) => {
    setRotation((prev) => {
      const newVal = prev + delta;
      if (newVal > 180) return -180 + (newVal - 180);
      if (newVal < -180) return 180 + (newVal + 180);
      return newVal;
    });
  };

  const handleReset = () => {
    setZoom(100);
    setRotation(0);
    setFlipH(false);
  };

  const handleFlip = () => {
    setFlipH((prev) => !prev);
  };

  const handleApply = async () => {
    setIsProcessing(true);
    await onApply(zoom, rotation, flipH);
    setIsProcessing(false);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/70 pt-16"
      onClick={onClose}
    >
      <div
        className="flex flex-col rounded-xl2 bg-white w-[700px] max-h-[calc(100vh-120px)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border-empty">
          <h2 className="text-[22px] font-bold font-bricolage text-text-primary">
            Editar Imagen
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg2 bg-border-empty transition-colors hover:bg-text-tertiary"
          >
            <X size={18} className="text-text-primary" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-5 p-6 overflow-y-auto flex-1">
          {/* Canvas Area */}
          <div className="relative w-full h-[400px] rounded-lg2 bg-card border-2 border-border-empty overflow-hidden">
            {/* Image with transform */}
            <div
              className="absolute left-1/2 top-1/2 max-w-[90%] max-h-[90%]"
              style={{
                transform: `translate(-50%, -50%) scale(${zoom / 100}) rotate(${rotation}deg) scaleX(${flipH ? -1 : 1})`,
                transition: "transform 0.2s ease-out",
              }}
            >
              <Image
                src={imageUrl}
                alt="Preview"
                width={300}
                height={300}
                className="object-contain rounded-sm2"
                unoptimized
              />
            </div>

            {/* Grid overlay lines */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/30" />
              <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/30" />
              <div className="absolute top-1/3 left-0 right-0 h-px bg-white/30" />
              <div className="absolute top-2/3 left-0 right-0 h-px bg-white/30" />
            </div>
          </div>

          {/* Zoom Control */}
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between w-full">
              <span className="text-[13px] font-semibold font-dm-sans text-text-primary">
                Zoom
              </span>
              <span className="text-[13px] font-semibold font-dm-sans text-text-tertiary">
                {zoom}%
              </span>
            </div>
            <div className="flex items-center gap-3 w-full h-10">
              <button
                onClick={() => handleZoomChange(-10)}
                className="flex items-center justify-center w-8 h-8 rounded-lg2 bg-card transition-colors hover:bg-border-empty"
              >
                <Minus size={16} className="text-text-primary" />
              </button>

              <div className="flex-1 relative h-1.5 rounded-sm bg-border-empty">
                <div
                  className="absolute left-0 top-0 h-full rounded-sm bg-coral-500"
                  style={{ width: `${((zoom - 10) / 190) * 100}%` }}
                />
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-coral-500 border-[3px] border-white shadow-sm pointer-events-none"
                  style={{ left: `calc(${((zoom - 10) / 190) * 100}% - 10px)` }}
                />
              </div>

              <button
                onClick={() => handleZoomChange(10)}
                className="flex items-center justify-center w-8 h-8 rounded-lg2 bg-card transition-colors hover:bg-border-empty"
              >
                <Plus size={16} className="text-text-primary" />
              </button>
            </div>
          </div>

          {/* Rotation Control */}
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between w-full">
              <span className="text-[13px] font-semibold font-dm-sans text-text-primary">
                Rotacion
              </span>
              <span className="text-[13px] font-semibold font-dm-sans text-text-tertiary">
                {rotation}°
              </span>
            </div>
            <div className="flex items-center gap-3 w-full h-10">
              <button
                onClick={() => handleRotationChange(-15)}
                className="flex items-center justify-center w-8 h-8 rounded-lg2 bg-card transition-colors hover:bg-border-empty"
              >
                <RotateCcw size={16} className="text-text-primary" />
              </button>

              <div className="flex-1 relative h-1.5 rounded-sm bg-border-empty">
                <div
                  className="absolute left-0 top-0 h-full rounded-sm bg-coral-500"
                  style={{ width: `${((rotation + 180) / 360) * 100}%` }}
                />
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-coral-500 border-[3px] border-white shadow-sm pointer-events-none"
                  style={{ left: `calc(${((rotation + 180) / 360) * 100}% - 10px)` }}
                />
              </div>

              <button
                onClick={() => handleRotationChange(15)}
                className="flex items-center justify-center w-8 h-8 rounded-lg2 bg-card transition-colors hover:bg-border-empty"
              >
                <RotateCw size={16} className="text-text-primary" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-2 w-full">
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-1.5 rounded-lg2 bg-card px-5 py-2.5 transition-colors hover:bg-border-empty"
            >
              <RotateCcw size={16} className="text-text-primary" />
              <span className="text-[13px] font-semibold font-dm-sans text-text-primary">
                Restablecer
              </span>
            </button>
            <button
              onClick={handleFlip}
              className={`flex items-center justify-center gap-1.5 rounded-lg2 px-5 py-2.5 transition-colors ${
                flipH ? "bg-coral-500 text-white" : "bg-card hover:bg-border-empty"
              }`}
            >
              <FlipHorizontal size={16} className={flipH ? "text-white" : "text-text-primary"} />
              <span className={`text-[13px] font-semibold font-dm-sans ${flipH ? "text-white" : "text-text-primary"}`}>
                Voltear
              </span>
            </button>
          </div>

          {/* Help Text */}
          <div className="flex items-center gap-2 rounded-sm2 bg-[#E3F2FD] p-3 w-full">
            <Info size={16} className="text-[#1976D2] shrink-0" />
            <span className="text-xs font-dm-sans text-[#1976D2]">
              Usa los controles para ajustar zoom, rotacion y voltear la imagen. Los cambios se aplicaran al guardar.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-border-empty shrink-0">
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg2 border border-border-empty px-6 py-3 transition-colors hover:bg-card"
          >
            <span className="text-sm font-semibold font-dm-sans text-text-primary">
              Cancelar
            </span>
          </button>
          <button
            onClick={handleApply}
            disabled={isProcessing}
            className="flex items-center justify-center rounded-lg2 bg-coral-500 px-6 py-3 transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <span className="text-sm font-semibold font-dm-sans text-white">
                Aplicar Cambios
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
