export const Decoys = () => {
  const count = 10;

  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const top = Math.random() * 90;  // random between 0–90%
        const left = Math.random() * 90; // random between 0–90%

        return (
          <div
            key={i}
            className="decoys"
            style={{ top: `${top}%`, left: `${left}%` }}
          />
        );
      })}
    </>
  );
};
