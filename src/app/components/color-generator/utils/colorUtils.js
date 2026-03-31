export const generateShades = (hex) => {
  const shades = {};
  const base = hex.replace("#", "");

  for (let i = 1; i <= 9; i++) {
    const opacity = Math.floor((i / 10) * 255)
      .toString(16)
      .padStart(2, "0");

    shades[i * 100] = `#${base}${opacity}`;
  }

  shades[500] = hex;

  return shades;
};
