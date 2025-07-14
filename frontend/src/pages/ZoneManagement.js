import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import socket from '../utils/socket';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const ZoneManagement = () => {
  const [zones, setZones] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    colorCode: '#44ff44',
    boundary: [],
  });

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await api.get('/zones');
        setZones(response.data);
      } catch (err) {
        console.error('Failed to fetch zones:', err);
      }
    };
    fetchZones();

    socket.connect();
    socket.on('populationUpdate', ({ zoneId, currentPopulation }) => {
      setZones((prevZones) =>
        prevZones.map((zone) =>
          zone.id === zoneId ? { ...zone, currentPopulation } : zone
        )
      );
    });

    return () => socket.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/zones', formData);
      setZones([...zones, response.data]);
      setFormData({ name: '', capacity: '', colorCode: '#44ff44', boundary: [] });
    } catch (err) {
      console.error('Failed to create zone:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">Zone Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Capacity</label>
              <input
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Color Code</label>
              <input
                name="colorCode"
                type="color"
                value={formData.colorCode}
                onChange={handleChange}
                className="mt-1 block w-full h-10 border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Create Zone
            </button>
          </form>
        </div>
        <div>
          <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '400px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {zones.map((zone) => (
              zone.boundary && (
                <Polygon
                  key={zone.id}
                  positions={zone.boundary.coordinates.map(([lng, lat]) => [lat, lng])}
                  pathOptions={{ color: zone.colorCode }}
                >
                  <Popup>
                    {zone.name}: {zone.currentPopulation}/{zone.capacity}
                  </Popup>
                </Polygon>
              )
            ))}
          </MapContainer>
          <div className="mt-4">
            {zones.map((zone) => (
              <div key={zone.id} className="p-2 border-b">
                <p>{zone.name}: {zone.currentPopulation}/{zone.capacity}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoneManagement;