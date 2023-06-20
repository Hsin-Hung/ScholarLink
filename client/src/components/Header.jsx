import React from "react";
import { Typography, Box } from "@mui/material";

function Header() {
  return (
    <Box m={2} pt={5}>
      <Typography variant="h1" gutterBottom align="center">
        ScholarLink
      </Typography>
    </Box>
  );
}

export default Header;
