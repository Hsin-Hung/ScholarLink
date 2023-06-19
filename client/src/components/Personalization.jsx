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
        const options = res.data.options;
        setOptions(options);
      })
      .catch((err) => {
        setShowAlert({
          status: "error",
          value: `Failed to fetch options: ${err.message}`,
        });
      })
      .finally(() => {
        setFormDisabled(false);
      });
  }, []);

  const handleSubscribeClick = async (email) => {
    setFormDisabled(true);
    try {
      await subscribe(email, selectedInterests);
      setShowAlert({
        status: "success",
        value: "Successfully subscribed",
      });
    } catch (err) {
      let errResponse = err.message;
      if (err.hasOwnProperty("response")) {
        errResponse = err.response.data.error;
      }
      setShowAlert({
        status: "error",
        value: `Failed to subscribe: ${errResponse}`,
      });
    } finally {
      setFormDisabled(false);
    }
  };

  const handleUnsubscribeClick = async (email) => {
    // Perform subscription logic here
    setFormDisabled(true);
    try {
      await unsubscribe(email);
      setShowAlert({
        status: "success",
        value: "Successfully unsubscribed",
      });
    } catch (err) {
      let errResponse = err.message;
      if (err.hasOwnProperty("response")) {
        errResponse = err.response.data.error;
      }
      setShowAlert({
        status: "error",
        value: `Failed to unsubscribe: ${errResponse}`,
      });
    } finally {
      setFormDisabled(false);
    }
  };

  const handleFetchClick = async (email) => {
    // Perform subscription logic here
    setFormDisabled(true);
    try {
      let res = await getInterests(email);
      setSelectedInterests(res.data.interests);
      setShowAlert({
        status: "success",
        value: "Successfully fetched interests",
      });
    } catch (err) {
      let errResponse = err.message;
      if (err.hasOwnProperty("response")) {
        errResponse = err.response.data.error;
      }
      setShowAlert({
        status: "error",
        value: `Failed to fetch interests: ${errResponse}`,
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
      <Grid item>
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
