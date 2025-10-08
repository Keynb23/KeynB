// BackgroundIcons.jsx
export const BgIcons = () => {
  // Automatically import all SVGs from /assets/Cred
  const icons = Object.values(
    import.meta.glob("../assets/Cred/*.svg", { eager: true, as: "url" })
  );

  const count = 20;

  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const icon = icons[i % icons.length];
        const top = Math.random() * 90;
        const left = Math.random() * 90;
        const rotation = Math.random() * 360;
        const delay = Math.random() * 20; // random start offset
        const duration = 15 + Math.random() * 15; // between 15–30s
        const size = 40 + Math.random() * 80; // 40–120px

        return (
          <img
            key={i}
            src={icon}
            alt={`icon-${i}`}
            className="bg-icon"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotate(${rotation}deg)`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
    </>
  );
};
