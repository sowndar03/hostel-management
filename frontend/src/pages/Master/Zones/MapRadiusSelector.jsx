import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';

function MapRadiusSelector({ area, onChange, lat, lng, radius: initialRadius = 500, readOnly = false }) {
    const [position, setPosition] = useState([lat || 10.9094, lng || 78.3665]);
    const [radius, setRadius] = useState(initialRadius);

    useEffect(() => {
        if (lat && lng) {
            setPosition([lat, lng]);
        }
    }, [lat, lng]);

    useEffect(() => {
        setRadius(initialRadius);
    }, [initialRadius]);

    useEffect(() => {
        if (!area || (lat && lng)) return; 

        const fetchCoordinates = async () => {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(area)}`
                );
                const data = await res.json();
                if (data.length > 0) {
                    const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
                    setPosition([coords.lat, coords.lng]);
                    onChange && onChange({ lat: coords.lat, lng: coords.lng, radius });
                }
            } catch (err) {
                console.error('Error fetching coordinates:', err);
            }
        };

        fetchCoordinates();
    }, [area, lat, lng]);

    const MapClick = () => {
        useMapEvents({
            click(e) {
                if (readOnly) return;
                const { lat, lng } = e.latlng;
                setPosition([lat, lng]);
                onChange && onChange({ lat, lng, radius });
            }
        });
        return null;
    };

    const RecenterOnPosition = ({ center }) => {
        const map = useMap();
        useEffect(() => {
            map.setView(center);
        }, [center, map]);
        return null;
    };

    useEffect(() => {
        if (!onChange) return;
        onChange({ lat: position[0], lng: position[1], radius });
    }, [position, radius]);

    return (
        <div className="w-full" style={{ height: '360px' }}>
            <div className="h-full w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm relative">
                <MapContainer
                    center={position}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                    dragging={!readOnly}
                    scrollWheelZoom={!readOnly}
                    doubleClickZoom={!readOnly}
                    zoomControl={!readOnly}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={position} />
                    <Circle center={position} radius={radius} pathOptions={{ color: '#6366F1', fillOpacity: 0.15 }} />
                    <RecenterOnPosition center={position} />
                    {!readOnly && <MapClick />}
                </MapContainer>
            </div>
        </div>
    );
}

export default MapRadiusSelector;
