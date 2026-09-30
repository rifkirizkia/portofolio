module.exports = {
  content: ["./index.html", "./js/**/*.js"],
        darkMode: 'class',
        theme: {
          extend: {
            colors: { 
                primary: "#0A192F", 
                secondary: "var(--color-secondary)",
                "dark-bg": "#0B192C",
                "dark-surface": "#112240",
            },
            borderRadius: {
              none: "0px",
              sm: "4px",
              DEFAULT: "8px",
              md: "12px",
              lg: "16px",
              xl: "20px",
              "2xl": "24px",
              "3xl": "32px",
              full: "9999px",
              button: "8px",
            },
            boxShadow: {
              'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
              'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
            }
          },
        },
      };
