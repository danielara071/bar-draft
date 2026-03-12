import { Routes, Route } from "react-router-dom"
import SportsApi from "./pages/SportsApi"
import Layout from "./layouts/Layout"
import Index from "./pages/Index"
import Chat from "./pages/Chat"
import WatchParty from "./pages/WatchParty";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Index />} />
        <Route path="/sportsapi" element={<SportsApi />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/WatchParty" element={<WatchParty />} />
      </Route>
    </Routes>
  );
}

export default App;
