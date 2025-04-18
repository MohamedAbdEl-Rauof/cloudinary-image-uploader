'use client';

import { useState } from 'react';

const Home = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    setLoading(true);

    try {
      const base64Image = await convertToBase64(selectedImage);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Image }),
      });

      const data = await res.json();
      setImageUrl(data.url);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center space-y-5">
        <h2 className="text-2xl font-bold text-gray-800">Upload Image</h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                     file:rounded-full file:border-0 file:text-sm file:font-semibold 
                     file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        <button
          onClick={handleUpload}
          disabled={!selectedImage || loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition ${
            loading || !selectedImage
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Uploading...' : 'Upload Image'}
        </button>

        {imageUrl && (
          <div className="mt-4 border rounded-md p-4 bg-gray-50">
            <img
              src={imageUrl}
              alt="Uploaded"
              className="w-full max-w-xs mx-auto rounded-md mb-2 shadow-md"
            />
            <p className="text-sm break-words text-blue-600 underline">
              <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                {imageUrl}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
