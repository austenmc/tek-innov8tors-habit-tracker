/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind v4 requires specifying which files contain Tailwind classes
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
