import React, { useState } from "react";
import { Button, ButtonGroup, TextField, Grid } from "@mui/material";

function Subscription({ onSubscribe, onUnsubscribe, onFetch, isDisabled }) {
  const [email, setEmail] = useState("");
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <Grid container spacing={3} alignItems="center" justifyContent="center">
      <Grid item>
        <TextField
          required
          id="email-required"
          label="Email"
          sx={{
            width: 250,
          }}
          variant="outlined"
          color="primary"
          type="email"
          placeholder="Enter your email"
          value={email}
          disabled={isDisabled}
          onChange={handleEmailChange}
        />
      </Grid>
      <Grid item>
        <ButtonGroup
          variant="outlined"
          aria-label="outlined primary button group"
          disabled={isDisabled}
        >
          <Button color="warning" onClick={() => onSubscribe(email)}>
            Subscribe
          </Button>
          <Button onClick={() => onFetch(email)}>Fetch</Button>
          <Button onClick={() => onUnsubscribe(email)}>Unsubscribe</Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
}

export default Subscription;
