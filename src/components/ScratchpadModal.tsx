import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, RotateCcw, Trash2, Edit3, Eraser, Sparkles } from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface ScratchpadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLORS = [
  { label: 'しろ', value: '#FFFFFF', bg: 'bg-white' },
  { label: 'きいろ', value: '#FDE047', bg: 'bg-yellow-300' },
  { label: 'ピンク', value: '#F472B6', bg: 'bg-pink-400' },
  { label: 'みずいろ', value: '#38BDF8', bg: 'bg-sky-400' },
  { label: 'みどり', value: '#4ADE80', bg: 'bg-green-400' },
  { label: 'オレンジ', value: '#FB923C', bg: 'bg-orange-400' },
];

export const ScratchpadModal: React.FC<ScratchpadModalProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentColor, setCurrentColor] = useState<string>('#FFFFFF');
  const [lineWidth, setLineWidth] = useState<number>(4);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // Canvas history for undo
  const historyRef = useRef<ImageData[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    // Initialize canvas
    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      // Blackboard background
      ctx.fillStyle = '#1e293b'; // slate-800 blackboard
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Save initial blank state
      try {
        const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        historyRef.current = [initialData];
      } catch (e) {
        console.warn('Canvas initial state error:', e);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = isEraser ? lineWidth * 3 : lineWidth;
    ctx.strokeStyle = isEraser ? '#1e293b' : currentColor;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.closePath();

    try {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      historyRef.current.push(data);
      if (historyRef.current.length > 20) {
        historyRef.current.shift();
      }
    } catch (e) {
      console.warn('Canvas history error:', e);
    }
  };

  const handleClear = () => {
    soundEffects.playPop();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, rect.width, rect.height);
  };

  const handleUndo = () => {
    soundEffects.playPop();
    const canvas = canvasRef.current;
    if (!canvas || historyRef.current.length <= 1) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    historyRef.current.pop(); // remove current
    const previous = historyRef.current[historyRef.current.length - 1];
    if (previous) {
      ctx.putImageData(previous, 0, 0);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl h-[85vh] bg-amber-900 rounded-3xl p-4 shadow-2xl border-4 border-amber-950 flex flex-col overflow-hidden"
          >
            {/* Wooden Chalkboard Frame Header */}
            <div className="flex items-center justify-between pb-3 px-2 text-amber-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🖍️</span>
                <h3 className="font-bold text-lg md:text-xl tracking-wider">
                  ひらめき こくばん（メモ・けいさん・おえかき）
                </h3>
              </div>

              <button
                id="close-scratchpad-btn"
                type="button"
                onClick={() => {
                  soundEffects.playPop();
                  onClose();
                }}
                className="p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full transition active:scale-95 shadow-md"
                aria-label="とじる"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Blackboard Canvas */}
            <div className="relative flex-1 bg-slate-800 rounded-2xl overflow-hidden shadow-inner border-2 border-slate-700 cursor-crosshair touch-none">
              <canvas
                id="scratchpad-canvas"
                ref={canvasRef}
                className="w-full h-full block"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>

            {/* Toolbar Bottom */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-3 px-2">
              {/* Color choices */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-200 font-bold hidden sm:inline">チョークのいろ:</span>
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => {
                      soundEffects.playPop();
                      setCurrentColor(c.value);
                      setIsEraser(false);
                    }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${c.bg} border-2 transition transform active:scale-90 ${
                      !isEraser && currentColor === c.value
                        ? 'border-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                    title={c.label}
                  />
                ))}
              </div>

              {/* Tools: Pen, Eraser, Width */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playPop();
                    setIsEraser(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition ${
                    !isEraser ? 'bg-amber-400 text-amber-950 shadow-md' : 'bg-amber-800 text-amber-200 hover:bg-amber-700'
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  <span>チョーク</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playPop();
                    setIsEraser(true);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition ${
                    isEraser ? 'bg-amber-400 text-amber-950 shadow-md' : 'bg-amber-800 text-amber-200 hover:bg-amber-700'
                  }`}
                >
                  <Eraser className="w-4 h-4" />
                  <span>けしゴム</span>
                </button>

                {/* Line width slider */}
                <div className="flex items-center gap-1 bg-amber-950/60 px-3 py-1 rounded-xl text-amber-200">
                  <span className="text-xs">太さ</span>
                  <input
                    type="range"
                    min="2"
                    max="14"
                    value={lineWidth}
                    onChange={(e) => setLineWidth(Number(e.target.value))}
                    className="w-16 sm:w-20 accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* Undo */}
                <button
                  type="button"
                  onClick={handleUndo}
                  className="p-2 bg-amber-800 hover:bg-amber-700 text-amber-100 rounded-xl transition active:scale-95"
                  title="ひとつもどす"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Clear all */}
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center gap-1 px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-bold text-xs sm:text-sm transition active:scale-95 shadow"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">ぜんぶ消す</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
