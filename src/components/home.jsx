import { useState, useEffect } from "react";

const API_KEY = "020ab2a1b832823290a16a1e2e13391f";
const CITIES = ["Roma", "Tokyo", "New York", "London", "Dubai", "Paris"];

const getEmoji = (id) => {
  if (id < 300) return "⛈️";
  if (id < 400) return "🌦️";
  if (id < 500) return "🌧️";
  if (id < 600) return "🌨️";
  if (id < 700) return "❄️";
  if (id === 800) return "☀️";
  if (id <= 804) return "⛅";
  return "🌡️";
};

export default function Home({ onSearch }) {
  const [city, setCity] = useState("");
  const [localWeather, setLocalWeather] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
        .then((res) => res.json())
        .then((data) => setLocalWeather(data));
    });
  }, []);

  const handleSearch = () => {
    if (city.trim()) onSearch(city.trim());
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center px-3" style={{ maxWidth: 500, width: "100%" }}>

        <h1 className="display-3 fw-bold mb-2 text-white">🌤 METEO</h1>
        <p className="mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
          Scopri il meteo di tutto il mondo
        </p>

        {/* Card posizione attuale */}
        {localWeather && (
          <div
            className="glass-card rounded-4 p-3 mb-4 text-white d-flex align-items-center justify-content-between"
            style={{ cursor: "pointer" }}
            onClick={() => onSearch(localWeather.name)}
          >
            <div className="text-start">
              <p className="mb-0 small" style={{ color: "rgba(255,255,255,0.5)" }}>
                📍 La tua posizione
              </p>
              <p className="fw-bold fs-5 mb-0">{localWeather.name}</p>
              <p className="mb-0 small fst-italic" style={{ color: "rgba(255,255,255,0.6)" }}>
                {localWeather.weather[0].description}
              </p>
            </div>
            <div className="text-end">
              <div style={{ fontSize: "2.5rem", lineHeight: 1 }}>
                {getEmoji(localWeather.weather[0].id)}
              </div>
              <p className="fw-bold fs-3 mb-0">{Math.round(localWeather.main.temp)}°</p>
            </div>
          </div>
        )}

        {/* Input ricerca */}
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control bg-secondary text-white border-0"
            placeholder="Cerca una città…"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Cerca
          </button>
        </div>

        {/* città*/}
        <div className="d-flex flex-wrap justify-content-center gap-2">
          {CITIES.map((c) => (
            <button
              key={c}
              className="btn btn-sm rounded-pill city-btn"
              onClick={() => onSearch(c)}
            >
              {c}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}