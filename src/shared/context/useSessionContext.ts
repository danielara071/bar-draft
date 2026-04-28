import { useContext } from "react";
import { SessionContext } from "./SessionContext";

export const useSessionContext = () => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSessionContext must be used within a SessionProvider");
  }

  return context;
};