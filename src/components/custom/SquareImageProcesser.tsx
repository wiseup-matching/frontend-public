import React, { useState, useCallback, useId } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { Button } from '@/components/ui/button';

interface SquareImageProcesserProps {
  /** Button label shown before an image is chosen. */
  label?: string;
  /** Called with the square‑cropped image as a File once the user clicks “Save”. */
  onCropped: (file: File) => void;
  /** Optional URL to an already‑stored image (for edit flows). */
  initialUrl?: string | null;
}

const SquareImageUploader: React.FC<SquareImageProcesserProps> = ({
  label = 'Choose image',
  onCropped,
  initialUrl = null,
}) => {
  const inputId = useId();
  const changeId = `${inputId}-change`;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl);
  const [showCropper, setShowCropper] = useState(false);

  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setPreviewUrl(reader.result as string);
      setShowCropper(true);
    });
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_croppedArea: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener('load', () => resolve(img));
      img.addEventListener('error', () => reject(new Error('Failed to load image')));
      img.setAttribute('crossOrigin', 'anonymous'); // to avoid CORS issues
      img.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
    const img = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Canvas 2D context not available');

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      img,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    );

    return new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          throw new Error('Canvas is empty');
        }
      }, 'image/jpeg');
    });
  };

  const handleSave = async () => {
    if (!selectedFile || !previewUrl || !croppedAreaPixels) return;

    try {
      const blob = await getCroppedImg(previewUrl, croppedAreaPixels);
      const file = new File([blob], selectedFile.name, { type: 'image/jpeg' });
      onCropped(file);
      setSelectedFile(file);

      setShowCropper(false);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
      // Keep thumbnail preview
      setPreviewUrl(URL.createObjectURL(file));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {!previewUrl && (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={onSelectFile}
            id={inputId}
            className="hidden"
          />
          <label htmlFor={inputId}>
            <Button asChild>
              <span>{label}</span>
            </Button>
          </label>
        </>
      )}

      {previewUrl && !showCropper && (
        <div className="space-y-2">
          <img src={previewUrl} alt="Preview" className="h-24 w-24 object-cover rounded border" />
          <div className="flex gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              id={changeId}
              className="hidden"
            />
            <label htmlFor={changeId}>
              <Button variant="secondary" size="sm" asChild>
                <span>Change</span>
              </Button>
            </label>
          </div>
        </div>
      )}

      {showCropper && previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded shadow-lg w-full max-w-md p-4">
            <div className="relative h-64 bg-gray-900">
              <Cropper
                image={previewUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* Zoom range */}
            <div className="flex items-center gap-2 my-4">
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowCropper(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  void handleSave();
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SquareImageUploader;
