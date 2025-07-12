module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pop: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#4f46e5',
        dark: '#1e1b4b',
        light: '#f8fafc',
      },
    },
  },
  plugins: [],
}