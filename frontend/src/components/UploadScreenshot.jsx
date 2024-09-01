'use client';

import { useState } from 'react';
import axios from 'axios';

const UploadScreenshot = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null); // State to store image preview URL
    const [message, setMessage] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        // Create a preview URL for the selected image
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(null);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedFile) {
<<<<<<< HEAD
            setMessage('Please select a file to upload.');
=======
            setMessage('Please select a file before uploading.');
>>>>>>> 86f6172d4d8f73035dddba90f13dc2d16e7a0f72
            return;
        }

        const formData = new FormData();
        formData.append('screenshot', selectedFile);

        try {
            const response = await axios.post('/api/imageAnalysis', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data.message);
            setPreviewUrl(null); // Clear preview after upload
            setSelectedFile(null); // Clear file after upload
        } catch (error) {
            setMessage('Failed to upload screenshot. Please try again.');
        }
    };

    return (
        <div className='min-h-screen w-full flex flex-col space-y-4 justify-center items-center'>
            <h2 className='text-6xl'>Upload Screenshot for <span className='text-green-600'>Verification</span></h2>

            <form onSubmit={handleSubmit} className='flex flex-col space-y-3 items-center justify-center w-full'>
                <div className="flex items-center justify-center w-[50%]">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <input 
                            id="dropzone-file" 
                            type="file" 
                            className="hidden" 
                            onChange={handleFileChange} 
                            accept="image/png, image/jpeg, image/jpg, image/gif, image/svg" 
                        />
                    </label>
                </div>
                <button type="submit" className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md">Upload</button>
            </form>

            {previewUrl && (
                <div className='mt-4'>
                    <p className='text-lg mb-2'>Preview:</p>
                    <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover rounded-md border border-gray-300" />
                </div>
            )}

            {message && <p className="mt-4 text-lg text-green-600">{message}</p>}
        </div>
    );
};

export default UploadScreenshot;
