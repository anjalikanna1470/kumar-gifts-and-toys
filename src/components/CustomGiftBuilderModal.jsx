import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Sparkles, Image as ImageIcon, Type, Sliders, CheckCircle2, RotateCw } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CustomGiftBuilderModal({ product, isOpen, onClose }) {
  const { addToCart } = useCart();
  const canvasRef = useRef(null);

  // Customization State
  const [customText, setCustomText] = useState('Happy Birthday ❤️');
  const [fontStyle, setFontStyle] = useState('serif'); // serif, sans, cursive, bold
  const [textColor, setTextColor] = useState('#e11d48');
  const [uploadedImage, setUploadedImage] = useState(null); // base64 or URL
  const [imageScale, setImageScale] = useState(1);
  const [imagePos, setImagePos] = useState({ x: 0, y: 0 });
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || null);

  // Default sample image if user hasn't uploaded one
  const samplePhoto = '/images/custom_mug.png';

  useEffect(() => {
    if (!product) return;
    if (product.variants?.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  // Render Canvas Live Preview
  useEffect(() => {
    if (!isOpen || !product) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw Mockup Background Base (Mug, Pillow, Frame)
    const baseImage = new Image();
    const bgSrc = product.customization_type === 'pillow' 
      ? '/images/custom_pillow.png' 
      : product.customization_type === 'frame'
      ? '/images/photo_frame.png'
      : '/images/custom_mug.png';

    baseImage.src = bgSrc;
    baseImage.onload = () => {
      // 1. Draw base product
      ctx.drawImage(baseImage, 0, 0, width, height);

      // 2. Overlay Customer Uploaded Photo
      const userPhoto = new Image();
      userPhoto.src = uploadedImage || baseImage.src;
      userPhoto.onload = () => {
        ctx.save();

        // Clipping area based on product type
        ctx.beginPath();
        if (product.customization_type === 'pillow') {
          // Heart shape clip area
          ctx.arc(width / 2 - 35, height / 2 - 20, 45, 0, Math.PI * 2);
          ctx.arc(width / 2 + 35, height / 2 - 20, 45, 0, Math.PI * 2);
        } else if (product.customization_type === 'frame') {
          // Rectangular frame clip
          ctx.rect(width * 0.25, height * 0.25, width * 0.5, height * 0.45);
        } else {
          // Mug printable area clip
          ctx.roundRect(width * 0.28, height * 0.28, width * 0.44, height * 0.42, 10);
        }
        ctx.clip();

        // Draw photo with scale & pan
        const photoWidth = (width * 0.44) * imageScale;
        const photoHeight = (height * 0.42) * imageScale;
        const posX = (width / 2 - photoWidth / 2) + imagePos.x;
        const posY = (height / 2 - photoHeight / 2) + imagePos.y;

        ctx.drawImage(userPhoto, posX, posY, photoWidth, photoHeight);
        ctx.restore();

        // 3. Render Custom Text Overlay
        if (customText) {
          ctx.save();
          ctx.fillStyle = textColor;
          ctx.textAlign = 'center';

          let fontName = 'Playfair Display, serif';
          if (fontStyle === 'sans') fontName = 'Plus Jakarta Sans, sans-serif';
          if (fontStyle === 'cursive') fontName = 'cursive, Georgia';
          if (fontStyle === 'bold') fontName = 'Impact, sans-serif';

          ctx.font = `bold 16px ${fontName}`;
          
          // Draw text background pill for contrast
          const textY = height * 0.78;
          ctx.shadowColor = 'rgba(0,0,0,0.5)';
          ctx.shadowBlur = 4;
          ctx.fillText(customText, width / 2, textY);
          ctx.restore();
        }
      };
    };
  }, [isOpen, product, uploadedImage, customText, fontStyle, textColor, imageScale, imagePos]);

  if (!isOpen || !product) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = () => {
    const customizationData = {
      customText,
      fontStyle,
      textColor,
      uploadedImageUrl: uploadedImage || '/images/custom_mug.png',
      specialInstructions,
    };

    addToCart(product, 1, selectedVariant, customizationData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-rose-100 dark:border-slate-700 my-8">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 dark:from-slate-800 dark:to-slate-800 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-600 animate-pulse" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              Live Customizer — {product.title}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          
          {/* Left Column: Live Canvas Preview */}
          <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-700">
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Real-Time Live Preview
            </span>

            <div className="relative w-full max-w-[320px] aspect-square bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-inner flex items-center justify-center border border-slate-200 dark:border-slate-700">
              <canvas
                ref={canvasRef}
                width={320}
                height={320}
                className="w-full h-full object-contain cursor-move"
              />
            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3 text-center">
              Preview updates live as you upload photo & enter custom message. Our Ongole shop artisans will refine the final layout before printing!
            </p>
          </div>

          {/* Right Column: Customization Controls */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            
            {/* Step 1: Upload Photo */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-rose-500" /> 1. Upload Your Photo
              </label>
              
              <div className="flex items-center gap-3">
                <label className="flex-1 border-2 border-dashed border-rose-300 dark:border-rose-800/60 hover:border-rose-500 rounded-xl p-3 text-center cursor-pointer bg-rose-50/40 dark:bg-slate-900/40 transition-colors">
                  <Upload className="w-5 h-5 text-rose-500 mx-auto mb-1" />
                  <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 block">
                    Choose Photo from Device
                  </span>
                  <span className="text-[10px] text-slate-400 block">JPEG, PNG, WebP (Max 10MB)</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              {/* Image scale slider */}
              {uploadedImage && (
                <div className="flex items-center gap-2 text-xs pt-1">
                  <Sliders className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500">Zoom:</span>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={imageScale}
                    onChange={(e) => setImageScale(parseFloat(e.target.value))}
                    className="w-full accent-rose-600"
                  />
                </div>
              )}
            </div>

            {/* Step 2: Custom Text */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Type className="w-4 h-4 text-amber-500" /> 2. Enter Custom Text / Message
              </label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g. Happy Birthday Anjali ❤️"
                maxLength={40}
                className="w-full px-3 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-600 dark:bg-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />

              {/* Font Style & Color Selector */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">Font Style</span>
                  <select
                    value={fontStyle}
                    onChange={(e) => setFontStyle(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                  >
                    <option value="serif">Classic Serif</option>
                    <option value="sans">Modern Sans</option>
                    <option value="cursive">Romantic Script</option>
                    <option value="bold">Bold Impact</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">Text Color</span>
                  <div className="flex items-center gap-1.5">
                    {['#e11d48', '#d97706', '#000000', '#ffffff', '#1e3a8a', '#16a34a'].map(c => (
                      <button
                        key={c}
                        onClick={() => setTextColor(c)}
                        className={`w-6 h-6 rounded-full border border-slate-300 transition-transform ${textColor === c ? 'scale-125 ring-2 ring-rose-500' : ''}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Variants (if available) */}
            {product.variants?.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                  Select Variant
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id || v.variant_value}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        selectedVariant?.variant_value === v.variant_value
                          ? 'border-rose-600 bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                          : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {v.variant_value} {v.extra_price > 0 ? `(+₹${v.extra_price})` : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Special Instructions */}
            <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-700">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Special Instructions for Store Artisan (Optional)
              </label>
              <textarea
                rows={2}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Please print text in red font on the back side of mug."
                className="w-full text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 block">Total Price:</span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">
              ₹{(product.discount_price || product.price) + (selectedVariant?.extra_price || 0)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleAddToCart}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 shadow-md shadow-rose-500/20 flex items-center gap-2 active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" /> Add Customized Gift to Cart
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
