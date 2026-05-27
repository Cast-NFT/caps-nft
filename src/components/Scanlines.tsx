export function Scanlines() {
  return (
    <>
      {/* Horizontal scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-[9998] opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-[9997]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgba(7,6,10,0.8) 100%)",
        }}
      />
    </>
  );
}
