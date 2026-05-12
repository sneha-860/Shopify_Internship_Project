import React, { useState } from 'react';
import './ImageGallery.css';

// Product image gallery with thumbnail switching
const ImageGallery = ({ images }) => {
  const fallbackImage = 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600';
  const [selectedImage, setSelectedImage] = useState(images?.[0] || fallbackImage);
  const [isFading, setIsFading] = useState(false);

  const handleThumbnailClick = (img) => {
    if (img === selectedImage) return;
    setIsFading(true);
    setTimeout(() => {
      setSelectedImage(img);
      setIsFading(false);
    }, 150);
  };

  const galleryImages = images?.length ? images : [fallbackImage];

  return (
    <div className="image-gallery">
      <div className="main-image-container">
        <img 
          src={selectedImage} 
          alt="Product" 
          className={`main-image ${isFading ? 'fade-out' : 'fade-in'}`}
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
        />
      </div>
      
      {galleryImages.length > 1 && (
        <div className="thumbnails">
          {galleryImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className={`thumbnail ${selectedImage === img ? 'selected' : ''}`}
              onClick={() => handleThumbnailClick(img)}
              onError={(e) => {
                e.target.src = fallbackImage;
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
