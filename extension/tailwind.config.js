/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./**/*.tsx"],
  plugins: [],
  theme: {
    extend: {
      colors: {
        gray: {
          0: "var(--color-gray-0)",
          1: "var(--color-gray-1)",
          2: "var(--color-gray-2)",
          3: "var(--color-gray-3)",
          4: "var(--color-gray-4)",
          5: "var(--color-gray-5)",
          6: "var(--color-gray-6)",
          7: "var(--color-gray-7)"
        },
        red: {
          1: "var(--color-red-1)",
          2: "var(--color-red-2)",
          3: "var(--color-red-3)"
        },
        green: {
          1: "var(--color-green-1)",
          2: "var(--color-green-2)",
          3: "var(--color-green-3)"
        },

        status: {
          1: "var(--color-status-1)",
          2: "var(--color-status-2)",
          3: "var(--color-status-3)"
        }
        // blue: {
        //   1: "#EBECF7",
        //   2: "#3D46C2",
        //   3: "#00075F"
        // },
      }
    }
  }
}
