// Description.tsx
import React from 'react';
import "../index.css";

interface DescriptionProps {
  description: string;
}

const Description: React.FC<DescriptionProps> = ({ description }) => {
  return (
    <div className="description">
      {description}
    </div>
  );
};

export default Description;
