import "./App.css";
import Header from "./components/Header";
import Personalization from "./components/Personalization";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <Header />
        <Personalization />
      </div>
    </ThemeProvider>
  );
}

export default App;
