interface PreviewThumbnailProps {
  source: string;
}

const PreviewThumbnail = ({ source }: PreviewThumbnailProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-md shadow-black group cursor-pointer h-80 w-60">
      <img src={source} className="h-full w-full object-cover"></img>
    </div>
  );
};

export default PreviewThumbnail;
