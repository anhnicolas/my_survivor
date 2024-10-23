import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from 'react-i18next';
import L from 'leaflet';

const MapPanner = ({ selectedPosition }) => {
  const map = useMap();

  if (selectedPosition) {
    map.setView(selectedPosition, 13, { animate: true });
  }

  return null;
};

const customIcon = L.icon({
  iconUrl: '/pin.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const EventsMap = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setError(t("missingToken"));
        return;
      }
      try {
        const response = await fetch('https://survivor-api.poulpitos.fr/api/events', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          const formattedEvents = data.map(event => ({
            id: event.id,
            name: event.name,
            address: event.locationName,
            latitude: parseFloat(event.locationX),
            longitude: parseFloat(event.locationY),
            date: event.date,
            maxParticipants: event.maxParticipants,
          }));
          setEvents(formattedEvents);
        } else {
          const errorData = await response.json();
          setError(`${t('fetchEventsError')}: ${errorData.error}`);
        }
      } catch (error) {
        console.error(t('unexpectedError'), error);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (latitude, longitude) => {
    setSelectedPosition([latitude, longitude]);
  };

  return (
    <div className="flex h-[700px]">
      <div className="flex-1 relative z-0">
        <MapContainer center={[50.6366, 3.0636]} zoom={13} className="h-full w-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {events.map((event) => (
            <Marker key={event.id} position={[event.latitude, event.longitude]} icon={customIcon}>
              <Popup>
                <strong>{event.name}</strong> <br />
                {event.address} <br />
                <em>{t('date')}: {new Date(event.date).toLocaleDateString()}</em> <br />
                {t('participants')}: {event.maxParticipants}
              </Popup>
            </Marker>
          ))}
          {selectedPosition && <MapPanner selectedPosition={selectedPosition} />}
        </MapContainer>
      </div>

      <div className="w-[300px] p-5 overflow-y-auto shadow-sm rounded-md bg-white">
        <h2 className="mb-4 text-lg font-bold text-gray-700">{t('eventDetails')}</h2>
        <ul>
          {events.map((event) => (
            <li
              key={event.id}
              className="mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100"
              onClick={() => handleEventClick(event.latitude, event.longitude)}
            >
              <strong className="text-gray-800 text-lg">{event.name}</strong>
              <p className="text-gray-600 mt-1">
                {event.address} <br />
                <span className="italic">{t('date')}: {new Date(event.date).toLocaleDateString()}</span> <br />
                {t('participants')}: {event.maxParticipants}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventsMap;
