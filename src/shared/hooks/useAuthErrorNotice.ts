import { useMemo, useState } from "react";

const parseAuthErrorMessage = () => {
  if (typeof window === "undefined") return null;

  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const errorDescription =
    searchParams.get("error_description") ??
    hashParams.get("error_description") ??
    searchParams.get("error");

  return errorDescription
    ? decodeURIComponent(errorDescription.replace(/\+/g, " "))
    : null;
};

const useAuthErrorNotice = () => {
  const authMessage = useMemo(() => parseAuthErrorMessage(), []);
  const [isOpen, setIsOpen] = useState(Boolean(authMessage));

  return {
    authMessage,
    isOpen,
    close: () => setIsOpen(false),
  };
};

export default useAuthErrorNotice;
