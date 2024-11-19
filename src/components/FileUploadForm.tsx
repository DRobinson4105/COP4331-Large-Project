import React, { FC } from 'react';
import { Button } from '@mui/material';

interface FileUploadFormProps {
  handleImageUpload: (event: React.FormEvent<HTMLFormElement>) => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadForm: FC<FileUploadFormProps> = ({ handleImageUpload, handleFileChange }) => {
  return (
    <form
      onSubmit={handleImageUpload}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem'}}
    >
        <label htmlFor="file-upload">
            <Button
            variant="contained"
            color="primary"
            component="span"
            style={{ textTransform: 'none', width: '200px' }}
            >
            Select Profile Picture
            </Button>
        </label>
        <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            aria-label="Profile Picture"
        />
        <Button
            type="submit"
            variant="contained"
            color="secondary"
            style={{ textTransform: 'none', backgroundColor: '#8bc34a', width: '200px' }}
        >
            Upload
        </Button>
    </form>
  );
};

export default FileUploadForm;