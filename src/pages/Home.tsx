import LoggedIn from "../features/home/LoggedIn";
import LoggedOut from "../features/home/LoggedOut";
import AuthErrorCard from "../features/home/AuthErrorCard";
import useAuthErrorNotice from "../shared/hooks/useAuthErrorNotice";
import useSession from "../shared/hooks/useSession";

function Home() {
  const { authMessage, isOpen, close } = useAuthErrorNotice();
  const session = useSession();
  return (
    <>
      {authMessage && isOpen && (
        <AuthErrorCard message={authMessage} onClose={close} />
      )}
      {session ? <LoggedIn /> : <LoggedOut />}
    </>
  );
}

export default Home;
