import React from 'react';
import { useFileStore } from '../store/photos';

const FileList: React.FC = () => {
  const { files } = useFileStore();

  return (
    <div>
      <h2>Uploaded Files</h2>
      <ul>
        {files.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
