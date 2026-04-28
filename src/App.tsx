import { Routes, Route } from "react-router-dom";
import SportsApi from "./pages/SportsApi";
import Layout from "./layouts/Layout";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import WatchParty from "./pages/WatchParty";
import WatchPartyHUB from "./pages/WatchPartyHUB/pages/WatchPartyPage";
import Wordle from "./pages/Wordle";
import Perfil from "./pages/Perfil";
import Amigo from "./pages/Amigo";
import Reels from "./pages/Reels"
import Home from "./pages/Home";
import Tienda from "./pages/Tienda"
import GestionarAmigos from "./pages/GestionarAmigos"
import Ra from "./pages/ra";
import Callback from "./auth/Callback";
import Estadisticas from "./pages/Estadisticas";


function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<Index />} />
        <Route path="/" element={<Home />} />
        <Route path="/sportsapi" element={<SportsApi />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/watchParty/:code" element={<WatchParty />} />
        <Route path="/watchPartyHUB" element={<WatchPartyHUB />} />
        <Route path="/wordle" element={<Wordle />} />
        <Route path="/ra" element={<Ra />} />
        <Route path="/reels" element={<Reels />} />
        <Route path="/tienda" element={<Tienda />} />
        <Route path="/reels/:id" element={<Reels />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/amigo" element={<Amigo />} />
        <Route path="/gestionarAmigos" element={<GestionarAmigos />} />
        <Route path="/auth/callback" element={<Callback />} />
        <Route path="/estadisticas" element={<Estadisticas />} />
      </Route>
    </Routes>
  );
}

export default App;
