import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import './AddClient.css';
import DashboardHeader from '../pages/DashboardHeader';

const ip = import.meta.env.VITE_IP_ADDRESS;
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_PLATFORM_API;

const AddClient: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
          setError(t('Error getting location'));
        }
      );
    } else {
      setError(t('Geolocation is not supported by this browser.'));
    }
  }, [t]);

  useEffect(() => {
    const loadGoogleMapsApi = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.google && window.google.maps) {
          resolve();
        } else {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}`;
          script.defer = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Google Maps API'));
          document.head.appendChild(script);
        }
      });
    };

    loadGoogleMapsApi()
      .then(() => {
        if (mapRef.current) {
          const map = new window.google.maps.Map(mapRef.current, {
            center: location ? { lat: location.lat, lng: location.lng } : { lat: -34.397, lng: 150.644 },
            zoom: 18,
          });

          if (location) {
            new window.google.maps.Marker({
              position: location,
              map,
            });
          }

          map.addListener('click', (e: google.maps.MapMouseEvent) => {
            setLocation({ lat: e.latLng?.lat() || 0, lng: e.latLng?.lng() || 0 });
            new window.google.maps.Marker({
              position: { lat: e.latLng?.lat() || 0, lng: e.latLng?.lng() || 0 },
              map,
            });
          });
        }
      })
      .catch((error) => {
        console.error(error);
        setError(t('Failed to load Google Maps API'));
      });
  }, [location, googleMapsApiKey, t]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!location) {
      setError(t('Location not available'));
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error(t('Token not found'));
      }

      await axios.post(
        `https://${ip}/api/client`,
        {
          name,
          phone,
          clientLocation: {
            latitude: location.lat,
            longitude: location.lng,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setName('');
      setPhone('');
      setError(null);
      setSuccess(t('Client successfully added!'));

      setTimeout(() => {
        setSuccess(null);
        navigate('/locations');
      }, 5000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message || t('An error occurred'));
      } else {
        setError(t('An error occurred'));
      }
      console.error('Error adding client:', error);
    }
  };

  return (
    <div>
      <DashboardHeader />
      <div className="add-client-container">
        <h3>{t('Add Client')}</h3>
        {error && <p className="error">{error}</p>}
        {success && <div className="success-popup">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">{t('name')}</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="phone">{t('phone number')}</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div ref={mapRef} style={{ height: '400px', width: '100%' }} />
          <button className="btn" type="submit">{t('Add Client')}</button>
        </form>
      </div>
    </div>
  );
};

export default AddClient;
