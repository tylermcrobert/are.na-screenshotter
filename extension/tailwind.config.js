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
          0: "#FFF",
          1: "#F7F7F7",
          2: "#EDEDED",
          3: "#DEDEDE",
          4: "#999",
          5: "#696969",
          6: "#333",
          7: "#000"
        },
        red: {
          1: "#FAF4F3",
          2: "#DFBEBE",
          3: "#B93D3D"
        },
        green: {
          1: "#F4F8F3",
          2: "#B4D6B3",
          3: "#238020"
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
