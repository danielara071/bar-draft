import { Routes, Route } from "react-router-dom";
import SportsApi from "./pages/SportsApi";
import Layout from "./layouts/Layout";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import WatchParty from "./pages/WatchParty";
import WatchPartyHUB from "./pages/WatchPartyHUB/pages/WatchPartyPage";
import Wordle from "./pages/Wordle";
import Perfil from "./pages/Perfil";
import Ra from "./pages/ra";
import Reels from "./pages/Reels";
import Home from "./pages/Home";
import Tienda from "./pages/Tienda";
import NewUserWelcome from "./pages/NewUserWelcome";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Index />} />
      <Route path="/bienvenida" element={<NewUserWelcome />} />
      <Route element={<Layout />}>
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
      </Route>
    </Routes>
  );
}

export default App;
