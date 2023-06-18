import React, { useState, useEffect } from "react";
import Subscription from "./Subscription";
import {
  Box,
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Chip,
  Alert,
  Grid,
} from "@mui/material";
import { getOptions, getInterests, subscribe, unsubscribe } from "../api/api";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function Personalization() {
  const [options, setOptions] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [formDisabled, setFormDisabled] = useState(false);
  const [showAlert, setShowAlert] = useState({
    status: "",
    value: "",
  });

  useEffect(() => {
    setFormDisabled(true);
    getOptions()
      .then((res) => {
        console.log(res.data);
        const options = res.data.options;
        setOptions(options);
        setFormDisabled(false);
      })
      .catch((err) => {
        console.log(err);
        setShowAlert({
          status: "error",
          value: "Failed to fetch options",
        });
      });
  }, []);

  const handleSubscribeClick = async (email) => {
    setFormDisabled(true);
    try {
      console.log(selectedInterests);
      let res = await subscribe(
        email,
        selectedInterests
      );
      console.log(res);
      setShowAlert({
        status: "success",
        value: "Successfully subscribed",
      });
    } catch (err) {
      console.log(err.response.data.error);
      setShowAlert({
        status: "error",
        value: `Failed to subscribe: ${err.response.data.error}`,
      });
    } finally {
      setFormDisabled(false);
    }
  };

  const handleUnsubscribeClick = async (email) => {
    // Perform subscription logic here
    setFormDisabled(true);
    console.log(`Unsubscribing email: ${email}`);
    try {
      let res = await unsubscribe(email);
      console.log(res);
      setShowAlert({
        status: "success",
        value: "Successfully unsubscribed",
      });
    } catch (err) {
      console.log(err.response);
      setShowAlert({
        status: "error",
        value: `Failed to unsubscribe: ${err.response.data.error}`,
      });
    } finally {
      setFormDisabled(false);
    }
  };

  const handleFetchClick = async (email) => {
    // Perform subscription logic here
    setFormDisabled(true);
    console.log(`fetching interests for email: ${email}`);
    try {
      let res = await getInterests(email);
      console.log(res.data.interests);
      setSelectedInterests(res.data.interests);
      setShowAlert({
        status: "success",
        value: "Successfully fetched interests",
      });
    } catch (err) {
      console.log(err);
      setShowAlert({
        status: "error",
        value: `Failed to fetch interests: ${err.response.data.error}`,
      });
    } finally {
      setFormDisabled(false);
    }
  };

  const handleInterestsChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedInterests(value);
  };

  return (
    <Grid container justifyContent="center" alignItems="center" spacing={2}>
      <Grid item xs={12}>
        <FormControl sx={{ width: 500 }} disabled={formDisabled}>
          <InputLabel id="multiple-interests-label">Interests</InputLabel>
          <Select
            labelId="multiple-interests-label"
            id="multiple-interests"
            multiple
            value={selectedInterests}
            onChange={handleInterestsChange}
            input={
              <OutlinedInput id="select-multiple-interests" label="Interests" />
            }
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Subscription
          onSubscribe={handleSubscribeClick}
          onUnsubscribe={handleUnsubscribeClick}
          onFetch={handleFetchClick}
          isDisabled={formDisabled}
        />
      </Grid>
      {showAlert.status && (
        <Grid item>
          <Alert severity={showAlert.status}>{showAlert.value}</Alert>
        </Grid>
      )}
    </Grid>
  );
}

export default Personalization;
