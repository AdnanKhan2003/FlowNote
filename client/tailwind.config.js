export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
        },
        bg: "var(--bg)",
        "card-bg": "var(--card-bg)",
        text: {
          DEFAULT: "var(--text)",
          muted: "var(--text-muted)",
        },
        accent: "var(--accent)",
        danger: "var(--danger)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, var(--primary), var(--accent))',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
