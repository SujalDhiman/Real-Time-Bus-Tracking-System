/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'comic-neue': ['Comic Neue', 'sans'],
        'lexend': ['Lexend', 'sans']
      },
      boxShadow: {
        'custom':'6px 6px 6px rgba(0, 0, 0, 0.2), 6px 6px 6px rgba(0, 0, 0, 0.1)',
        'custom2': '4px 10px 0 0 rgba(0, 0, 0, 0.2)'
      },
    },
  },
  plugins: [],
}