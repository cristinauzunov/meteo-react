import { useState } from "react";
import Home from "./components/Home";
import Details from "./components/Details";

export default function App() {
  const [city, setCity] = useState(null);

  if (city === null) {
    return <Home onSearch={(c) => setCity(c)} />;
  }

  return <Details city={city} onBack={() => setCity(null)} />;
}