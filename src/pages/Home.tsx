import LoggedIn from '../features/home/LoggedIn';
import LoggedOut from '../features/home/LoggedOut';
import { useSession } from "../shared/hooks/useSession"


function Home() {
    const session = useSession();
    return (
        <>
            {session ? <LoggedIn /> : <LoggedOut />}
        </>
    ) 
}

export default Home;