import React, { useState } from 'react';
import Header from '../header/Header';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './ContactPage.css';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const ContactPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  const mapContainerStyle = {
    width: '100%',
    height: '100%'
  };

  const center = {
    lat: 38.3191, // IYTE'nin koordinatları
    lng: 26.6397
  };

  const options = {
    disableDefaultUI: true,
    zoomControl: true,
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:info@iyte.edu.tr';
  };

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  // Google Maps API anahtarı olmadığında gösterilecek yedek içerik
  const renderFallbackMap = () => (
    <div className="fallback-map">
      <p>Harita yüklenemiyor. Adresimiz:</p>
      <p>Gülbahçe Kampüsü 35430 Urla İzmir Türkiye</p>
      <a 
        href="https://www.google.com/maps?q=38.3191,26.6397" 
        target="_blank" 
        rel="noopener noreferrer"
        className="view-on-maps"
      >
        Google Maps'te Görüntüle
      </a>
    </div>
  );

  return (
    <div>
      <Header />
      <div className="contact-container">
        <div className="contact-info">
          <h1 className="contact-title">İletişim</h1>
          <div className="contact-details">
            <div className="contact-item">
              <FaMapMarkerAlt />
              <span>Gülbahçe Kampüsü 35430 Urla İzmir Türkiye</span>
            </div>
            <div className="contact-item">
              <FaPhone />
              <span>+90 232 750 60 00</span>
            </div>
            <div className="contact-item email-item" onClick={handleEmailClick}>
              <FaEnvelope className="email-icon" />
              <span>info@iyte.edu.tr</span>
            </div>
          </div>
        </div>
        <div className="map-container">
          {process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? (
            <LoadScript 
              googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
              onLoad={() => setIsLoading(false)}
            >
              {isLoading && (
                <div className="map-loading">
                  <p>Harita yükleniyor...</p>
                </div>
              )}
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={15}
                options={options}
                onLoad={handleLoadComplete}
              >
                <Marker position={center} />
              </GoogleMap>
            </LoadScript>
          ) : (
            renderFallbackMap()
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
