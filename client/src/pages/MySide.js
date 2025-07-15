import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MySide() {
  const [file, setFile] = useState(null);
  const [pictures, setPictures] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  }

  const getPictures = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not logged in');
        return;
      }

      console.log('Fetching pictures with token:', token.substring(0, 10) + '...');
      const response = await axios.get('http://localhost:4000/api/pictures', {
        headers: {
          'x-access-token': token
        }
      });
      console.log('Get pictures response:', response.data);
      
      if (response.data && response.data.success && response.data.pictures) {
        // Map pictures to remove the path field since we don't need it
        const formattedPictures = response.data.pictures.map(picture => ({
          ...picture,
          // Use filename for display
          filename: picture.filename
        }));
        setPictures(formattedPictures);
      } else {
        setPictures([]);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to fetch pictures:", err);
      const errorMessage = err.response?.data?.error || err.response?.data?.details || 'An error occurred while fetching pictures.';
      setError(errorMessage);
      console.error('Full error details:', err.response?.data);
    }
  }

  const uploadPicture = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not logged in');
        return;
      }

      console.log('Uploading file:', file.name);
      const response = await axios.post('http://localhost:4000/api/upload-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-access-token': token
        }
      });
      
      if (response.data.success) {
        getPictures(); // Fetch pictures after successful upload
        setSuccess(response.data.message);
        setError(null);
        console.log("File uploaded successfully:", response.data);
      } else {
        const errorMessage = response.data?.error || response.data?.details || 'An error occurred while uploading the file';
        setError(errorMessage);
      }
    } catch (err) {
      setSuccess(false);
      const errorMessage = err.response?.data?.error || err.response?.data?.details || 'An error occurred while uploading the file.';
      setError(errorMessage);
      console.error("File upload failed:", err);
      console.error('Full error details:', err.response?.data);
    }
  }

  const deletePicture = async (id) => {
    if (!window.confirm('Are you sure you want to delete this picture?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not logged in');
        return;
      }

      const response = await axios.delete(`http://localhost:4000/api/delete-picture/${encodeURIComponent(id)}`, {
        headers: {
          'x-access-token': token
        }
      });

      if (response.data.success) {
        getPictures(); // Refresh pictures after successful deletion
        setSuccess(response.data.message);
        setError(null);
      } else {
        setError(response.data.error || 'Failed to delete picture');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete picture');
      console.error('Delete error:', err);
    }
  }

  useEffect(() => {
    getPictures(); // Fetch pictures when the component mounts
  }, []);

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="text-white p-20 mb-0 border-b border-cyan-800 flex items-center gap-4 w-full justify-center shadow-lg">
        <h2 className="text-6xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500 font-[Orbitron]">
          Picture Heaven
        </h2>
      </div>
  
      <main className="flex flex-col gap-12 p-6 ">
        <div className="flex flex-col gap-4 ">
          <h1 className="text-2xl font-semibold">
            Image library
          </h1>
  
          {success ? <p className='bg-gradient-to-r from-emerald-400 to-cyan-400 text-white py-2 px-4 rounded-xl'>{success}</p> : null}
          {error ? <p className='bg-gradient-to-r from-red-400 to-pink-400 text-white py-2 px-4 rounded-xl'>{error}</p> : null}
          <input className='' type="file" name="image" onChange={handleFileChange} />
          <button onClick={uploadPicture} className="bg-gradient-to-r from-indigo-400 to-cyan-400 text-white px-4 py-2 rounded-xl hover:from-indigo-500 hover:to-cyan-500 transition duration-300 w-[20rem]">
            Upload
          </button>
  
        </div>
        <div className="grid md:grid-cols-4 gap-6 grid-cols-2">
          {pictures.map((picture) => (
            <div key={picture.id} className="relative">
              <img
                src={`http://localhost:4000/${picture.filePath}`}
                alt={picture.filename}
                className="w-full h-auto rounded-lg border-2 border-cyan-500 shadow-lg hover:shadow-xl transition-shadow duration-300 object-cover max-h-[25rem] max-w-[25rem] mx-auto
                           max-sm:w-42 max-sm:h-64"
              />
              <button
                onClick={() => deletePicture(picture.id)}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600 transition-colors"
                title="Delete picture"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}