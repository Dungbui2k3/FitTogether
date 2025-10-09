// src/components/Field/LocationMap.tsx
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface Props {
  address: string;
}

const LocationMap = ({ address }: Props) => {
  const [coords, setCoords] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!address) return;

    const fetchCoords = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            address
          )}`
        );
        const data = await res.json();
        if (data.length > 0) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          console.warn("Không tìm thấy địa chỉ:", address);
          // fallback: Hồ Chí Minh
          setCoords([10.762622, 106.660172]);
        }
      } catch (err) {
        console.error("Lỗi khi fetch tọa độ:", err);
      }
    };

    fetchCoords();
  }, [address]);

  const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [30, 30],
  });

  if (!coords) return <p>Đang tải bản đồ...</p>;

  return (
    <MapContainer
      center={coords}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: "300px", width: "100%", borderRadius: "10px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={coords} icon={customIcon}>
        <Popup>{address}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default LocationMap;
