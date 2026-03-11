import { useEffect } from "react";

const WatchParty = () => {
  // Check if we have token_hash in URL (magic link callback)
  const params = new URLSearchParams(window.location.search);
  const token_hash = params.get("token_hash");
  const type = params.get("type");
  if (token_hash) {
    // Verify the OTP token
    supabase.auth
      .verifyOtp({
        token_hash,
        type: type || "email",
      })
      .then(({ error }) => {
        if (error) {
          setAuthError(error.message);
        } else {
          setAuthSuccess(true);
          // Clear URL params
          window.history.replaceState({}, document.title, "/");
        }
        setVerifying(false);
      });
  }
  // Check for existing session using getClaims
  supabase.auth.getClaims().then(({ data: { claims } }) => {
    setClaims(claims);
  });

  return (
    <div className="w-full flex h-screen justify-center items-center p-4">
      <div className="border border-gray-700 max-w-6xl w-full min-h-150 rounded-lg">
        {/* Header */}
        <div className="flex justify-between h-20 border-b border-gray-700">
          <div className="p-4">
            <p className="text-gray-700">Sesión iniciada como nombre...</p>
            <p className="text-gray-700 italic text-sm">4 usuarios en línea</p>
          </div>
          <button className="m-2 sm:mr-4">Cerrar Sesión</button>
        </div>
        {/* Main Chat */}
        <div></div>
        {/* Message Input */}
        <form className="flex flex-col sm:flex-row p-4 border-t broder-gray-700">
          <input
            type="text"
            placeholder="Participa en el chat!"
            className="p-2 w-full bg-[#00000040] rounded-lg"
          />
          <button className="mt-4 sm:mt-0 sm:ml-8 text-black bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-lg">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default WatchParty;
