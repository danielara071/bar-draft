import type { WatchPartyCodeInputProps } from "../interfaces/index.interfaces";
import { useWatchPartyCode } from "../hooks/useWatchPartyCode";

export default function WatchPartyCodeInput({ onJoin }: WatchPartyCodeInputProps) {
  const { code, refs, isComplete, handleChange, handleKeyDown, handlePaste, handleJoin } =
    useWatchPartyCode(onJoin);

  return (
    <div className="wp-code">
      <p className="wp-code__label">¿Tienes un Código?</p>
      <div className="wp-code__row">
        <div className="wp-code__inputs">
          {[0, 1, 2].map((i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              className="wp-code__box"
              maxLength={1}
              value={code[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              inputMode="text"
              autoComplete="off"
            />
          ))}
          <span className="wp-code__sep">—</span>
          {[3, 4, 5, 6].map((i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              className="wp-code__box"
              maxLength={1}
              value={code[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              inputMode="text"
              autoComplete="off"
            />
          ))}
        </div>
        <button className="wp-code__btn" onClick={handleJoin} disabled={!isComplete}>
          Unirme →
        </button>
      </div>
    </div>
  );
}
