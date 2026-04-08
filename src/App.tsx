import { Routes, Route } from "react-router-dom";
import SportsApi from "./pages/SportsApi";
import Layout from "./layouts/Layout";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import WatchParty from "./features/watchparty/pages/WatchParty";
import Wordle from "./pages/Wordle";
import Perfil from "./pages/Perfil";
import Ra from "./pages/ra";
import Reels from "./pages/Reels";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<Index />} />
        <Route path="/" element={<Home />} />
        <Route path="/sportsapi" element={<SportsApi />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/WatchParty" element={<WatchParty />} />
        <Route path="/wordle" element={<Wordle />} />
        <Route path="/ra" element={<Ra />} />
        <Route path="/reels" element={<Reels />} />
        <Route path="/perfil" element={<Perfil />} />
      </Route>
    </Routes>
  );
}

export default App;
