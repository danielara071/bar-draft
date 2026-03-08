import { Routes, Route } from "react-router-dom"
import SportsApi from "./pages/SportsApi"
import Layout from "./layouts/Layout"
import Index from "./pages/Index"
import { Chat } from './components/Chat'

function App() {

  return (
    /*<Routes>
        <Route element={<Layout />}>
        <Route path="/" element={<Index/>} />
        <Route path="/sportsapi" element={<SportsApi/>} />
      </Route>
    </Routes>*/
    <div>
        <Chat />
    </div>

  )
}

export default App;
