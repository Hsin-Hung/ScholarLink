import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 1000,
});

export const getOptions = async () => {
  return instance.get("/options");
};

export const getInterests = async (email) => {
  return instance.post(
    "/fetch",
    { email: email },
    { headers: { "Content-Type": "application/json" } }
  );
};

export const subscribe = async (email, interests) => {
  return instance.post(
    "/subscribe",
    {
      email: email,
      interests: interests,
    },
    { headers: { "Content-Type": "application/json" } }
  );
};

export const unsubscribe = async (email) => {
  return instance.post(
    "/unsubscribe",
    {
      email: email,
    },
    { headers: { "Content-Type": "application/json" } }
  );
};
