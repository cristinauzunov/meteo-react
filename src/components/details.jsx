import { useEffect, useState } from "react";
import { Row, Col, Spinner } from "react-bootstrap";

const API_KEY = "020ab2a1b832823290a16a1e2e13391f";

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

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const Details = ({ city, onBack }) => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourly, setHourly] = useState([]);

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
    )
      .then((res) => res.json())
      .then((data) => setWeather(data));

    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`,
    )
      .then((res) => res.json())
      .then((data) => {
        setHourly(data.list.slice(0, 6));
        setForecast(
          data.list.filter((item) => item.dt_txt.includes("12:00:00")),
        );
      });
  }, [city]);

  if (!weather) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Spinner animation="border" variant="light" />
          <p className="text-white mt-3">Cerco "{city}"…</p>
        </div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* Navbar */}
      <div className="d-flex align-items-center justify-content-between px-4 py-3">
        <button className="btn btn-outline-light btn-sm" onClick={onBack}>
          ← Indietro
        </button>
        <span className="text-white fw-bold fs-3">
          {weather.name}, {weather.sys?.country}
        </span>
        <span className="text-white opacity-50 small">{today}</span>
      </div>

      <div
        className="flex-grow-1 d-flex align-items-center px-4"
        style={{ gap: "2rem" }}
      >
        {/*Temperatura + Alba/Tramonto */}
        <div
          className="glass-card rounded-4 p-4 text-white d-flex flex-column justify-content-center"
          style={{ minWidth: 260 }}
        >
          <div style={{ fontSize: "5rem", lineHeight: 1 }}>
            {getEmoji(weather.weather[0].id)}
          </div>
          <div style={{ fontSize: "5rem", fontWeight: 700, lineHeight: 1 }}>
            {Math.round(weather.main.temp)}°C
          </div>
          <p
            className="fst-italic mt-2 fs-5"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            {cap(weather.weather[0].description)}
          </p>
        </div>

        <div
          className="glass-card rounded-4 p-4 text-white flex-grow-1 d-flex flex-column"
          style={{ gap: "1.5rem" }}
        >
          {/* Oggi*/}
          <div>
            <h5 className="fw-bold mb-3">Oggi</h5>
            <div className="d-flex justify-content-center gap-4">
              {hourly.map((h, i) => (
                <div key={h.dt} className="text-center">
                  <p
                    className="small mb-1"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {i === 0
                      ? "Ora"
                      : new Date(h.dt_txt)
                          .getHours()
                          .toString()
                          .padStart(2, "0") + ":00"}
                  </p>
                  <div style={{ fontSize: "1.5rem" }}>
                    {getEmoji(h.weather[0].id)}
                  </div>
                  <p className="fw-bold mb-0">{Math.round(h.main.temp)}°</p>
                </div>
              ))}
            </div>
          </div>

          <hr style={{ borderColor: "rgba(255,255,255,0.15)" }} />

          {/* Dettagli */}
          <div>
            <h5 className="fw-bold mb-3">Dettagli</h5>
            <Row className="g-2 text-white">
              <Col xs={6}>
                <p className="mb-1">
                  💧 Umidità: <strong>{weather.main.humidity}%</strong>
                </p>
              </Col>
              <Col xs={6}>
                <p className="mb-1">
                  🌬️ Vento:{" "}
                  <strong>{Math.round(weather.wind.speed * 3.6)} km/h</strong>
                </p>
              </Col>
              <Col xs={6}>
                <p className="mb-1">
                  🌡️ Percepita:{" "}
                  <strong>{Math.round(weather.main.feels_like)}°C</strong>
                </p>
              </Col>
              <Col xs={6}>
                <p className="mb-1">
                  📊 Pressione: <strong>{weather.main.pressure} hPa</strong>
                </p>
              </Col>
              <Col xs={6}>
                <p className="mb-1">
                  👁️ Visibilità:{" "}
                  <strong>{(weather.visibility / 1000).toFixed(1)} km</strong>
                </p>
              </Col>
              <Col xs={6}>
                <p className="mb-0">
                  🌡 Max / Min:{" "}
                  <strong>
                    {Math.round(weather.main.temp_max)}° /{" "}
                    {Math.round(weather.main.temp_min)}°
                  </strong>
                </p>
              </Col>
            </Row>
          </div>
        </div>
      </div>

      {/* Previsioni 5 giorni */}
      <div className="px-4 pb-4 mt-3">
        <div className="glass-card rounded-4 p-3">
          <Row className="g-0 text-white text-center">
            {forecast.slice(0, 5).map((item) => (
              <Col key={item.dt}>
                <div className="px-2 py-1">
                  <p className="fw-bold mb-1 text-uppercase small">
                    {new Date(item.dt_txt).toLocaleDateString("it-IT", {
                      weekday: "short",
                    })}
                  </p>
                  <p
                    className="small mb-1"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {new Date(item.dt_txt).toLocaleDateString("it-IT", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                  <div style={{ fontSize: "1.8rem" }}>
                    {getEmoji(item.weather[0].id)}
                  </div>
                  <p className="fw-bold fs-5 mb-0">
                    {Math.round(item.main.temp)}°
                  </p>
                  <p
                    className="small fst-italic mb-0"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    {cap(item.weather[0].description)}
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Details;
