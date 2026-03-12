interface ToggleButtonProps {
  onPress: () => void;
  onToggle: boolean;
}

const ToggleButton = ({ onPress, onToggle }: ToggleButtonProps) => {
  return (
    <button
      className="h-12 bg-black p-2 rounded-md hover:cursor-pointer"
      onClick={onPress}
    >
      {onToggle ? (
        <p className="text-white">Mostrar menos</p>
      ) : (
        <p className="text-white">Mostrar mas</p>
      )}
    </button>
  );
};

export default ToggleButton;
