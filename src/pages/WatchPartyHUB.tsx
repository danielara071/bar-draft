// App.tsx — ejemplo de uso
// Asegúrate de tener estas fuentes en tu index.html:
//
// <link rel="preconnect" href="https://fonts.googleapis.com">
// <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
 

import WatchPartyPage from "./WatchPartyHUB/WatchPartyPage";
 
// Tu Navbar ya existe como componente propio; impórtalo y colócalo aquí:
// import Navbar from "./components/Navbar/Navbar";
 
function App() {
  return (
    <>
      {/* <Navbar /> */}
      <WatchPartyPage />
    </>
  );
}
 
export default App;
 