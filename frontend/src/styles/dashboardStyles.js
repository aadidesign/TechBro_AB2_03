export const glassStyles = {
  background: "rgba(8, 8, 13, 0.75)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
};

export const neonGlow = {
  boxShadow: `
    0 0 5px theme('colors.blue.400'),
    0 0 20px theme('colors.blue.600'),
    inset 0 0 10px rgba(59, 130, 246, 0.2)
  `
};

export const gradientText = {
  backgroundImage: "linear-gradient(135deg, #60A5FA, #8B5CF6)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent"
}; 