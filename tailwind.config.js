/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,vue}"],
  theme: {
    extend: {
      colors: {
        primary: "#010101",
        secondary: "#060606",
        accent: "#5A5F73",
        slate: "#2F2F2F",
        grill: "#2c303a",
        lead: "#444857",
        smoke: "#2C303A"
      },
      fontFamily: {
        sans: ["Open Sans", "sans-serif"]
      }
    }
  },
  plugins: []
}
