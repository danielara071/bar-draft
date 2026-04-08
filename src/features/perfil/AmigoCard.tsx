type AmigoCardProps = {
  username: string;
  avatarUrl: string;
  badgeUrl?: string;
};

export default function AmigoCard({
  username,
  avatarUrl,
  badgeUrl,
}: AmigoCardProps) {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <img
          src={avatarUrl}
          alt={username}
          className="w-10 h-10 rounded-full object-cover"
        />

        <span className="text-sm font-medium text-gray-800">
          @{username}
        </span>
      </div>

      {badgeUrl && (
        <img src={badgeUrl} alt="badge" className="w-6 h-6" />
      )}
    </div>
  );
}