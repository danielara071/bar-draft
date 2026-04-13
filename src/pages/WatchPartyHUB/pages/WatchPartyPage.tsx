import { useState } from "react";
import useSession from "../../../features/WatchParty/Hooks/SessionLogic";
import type { WatchPartyMatch } from "../interfaces/index.interfaces";
import { useFriendWatchParties } from "../hooks/useFriendWatchParties";
import { usePublicWatchParties } from "../hooks/usePublicWatchParties";
import WatchPartyHero from "../components/WatchPartyHero";
import WatchPartyUpcoming from "../components/WatchPartyUpcoming";
import WatchPartyCodeInput from "../components/WatchPartyCodeInput";
import WatchPartyGrid from "../components/WatchPartyGrid";
import WatchPartyModal from "../components/WatchPartyModal";
import WatchPartyJoinModal from "../components/WatchPartyJoinModal";

export default function WatchPartyPage() {
  const session = useSession();
  const userId = session?.user?.id;

  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [selectedMatch, setSelectedMatch] = useState<WatchPartyMatch | null>(null);

  const { parties: friendParties, isLoading: friendsLoading } =
    useFriendWatchParties(userId);

  const { parties: publicParties, isLoading: publicLoading } =
    usePublicWatchParties();

  const handleCardClick = (match: WatchPartyMatch): void => {
    setSelectedMatch(match);
  };

  return (
    <div className="wp-page">
      <WatchPartyHero onCreateParty={() => setCreateModalOpen(true)} />

      <div className="wp-page__body">
        <WatchPartyUpcoming
          parties={friendParties}
          onCardClick={handleCardClick}
          onAddClick={() => setCreateModalOpen(true)}
          isLoading={friendsLoading}
        />

        <WatchPartyCodeInput />

        <WatchPartyGrid
          title="En Vivo"
          matches={publicParties}
          onCardClick={handleCardClick}
          isLoading={publicLoading}
        />
      </div>

      <WatchPartyModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      <WatchPartyJoinModal
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
      />
    </div>
  );
}