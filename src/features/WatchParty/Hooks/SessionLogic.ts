import { useSessionContext } from "../../../shared/context/useSessionContext";

const useSession = () => {
  return useSessionContext().session;
};

export default useSession;