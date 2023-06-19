import Header from "./components/Header";
import Personalization from "./components/Personalization";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#282c34",
    },
  },
  typography: {
    h1: {
      fontWeight: 700,
      fontSize: 60,
      fontFamily: "serif",
      color: "white",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Header />
      <Personalization />
    </ThemeProvider>
  );
}

export default App;
