// LABOD logo: an "L" cut into two slices (stem + amber slash) above a
// heavy wordmark. variant="white" is for use over dark images.
export default function Logo({ variant = "white", className = "h-12" }) {
  const stem = variant === "white" ? "#FFFFFF" : "#1F2A8A";
  const slash = "#FFA800";
  const word = variant === "white" ? "#FFFFFF" : "#1F2A8A";
  const sub = variant === "white" ? "#FFFFFF" : "#C98600";
  return (
    <svg viewBox="0 0 186 150" className={className} role="img" aria-label="LABOD Architecture">
      <polygon points="36,0 76,0 76,58 36,72" fill={stem} />
      <polygon points="36,82 150,40 150,70 36,88" fill={slash} />
      <text x="93" y="122" textAnchor="middle" fontFamily="Inter, sans-serif"
        fontWeight="800" fontSize="38" letterSpacing="1" fill={word}>LABOD</text>
      <text x="93" y="144" textAnchor="middle" fontFamily="Inter, sans-serif"
        fontWeight="600" fontSize="10.5" letterSpacing="5.5" fill={sub}>ARCHITECTURE</text>
    </svg>
  );
}
