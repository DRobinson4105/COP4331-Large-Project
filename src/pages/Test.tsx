import React, { useState } from 'react';

const UploadImage: React.FC = () => {
const baseUrl = process.env.NODE_ENV === 'production' 
    ? import.meta.env.VITE_API_URL
    : 'http://localhost:3000';

function buildPath(route: string) : string {  
    return baseUrl + "/api/" + route;
}
  const [file, setFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return;

    console.log(file)

    const reader = new FileReader();
    reader.onloadend = async () => {
        if (typeof reader.result === 'string') {
            const base64Image = reader.result?.split(',')[1];
            const formData = {
                'image': base64Image,
                'name': 'Test',
                'desc': 'Test',
                'calories': 1,
                'fat': 1,
                'carbs': 1,
                'protein': 1,
                'authorId': "6724e84caf5041d082f98234",
                'instructions': ["1"],
                'ingredients': ["1"]
            }
        
            try {
                var response = await fetch(
                    buildPath('recipe/create'),
                    {method:'POST',body:JSON.stringify(formData),headers:{'Content-Type': 'application/json'}}
                );
                alert('Image uploaded successfully');
        
                var res = JSON.parse(await response.text())
        
                var response2 = await fetch(
                    buildPath('recipe/get'),
                    {method:'POST',body:JSON.stringify({ id: res.id}),headers:{'Content-Type': 'application/json'}}
                );
        
                var res2 = JSON.parse(await response2.text())
                console.log(res2)
            
            setUploadedImage(res2.image); 
            } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
            }
        }
    }

    reader.readAsDataURL(file)
    
  };

  return (
    <div>
      <h1>Upload Image</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>

      {uploadedImage && (
        <div>
          <h2>Uploaded Image:</h2>
          <img src={uploadedImage} alt="Uploaded" style={{ width: '200px', height: 'auto' }} />
        </div>
      )}
    </div>
  );
};

export default UploadImage;
