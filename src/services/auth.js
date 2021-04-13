import axios from "axios";
import { endpoint, handleError } from "config";

export const instanceAxios = axios.create({
  baseURL: endpoint,
});

instanceAxios.interceptors.request.use(
  async (config) => {
    // console.log("req config", config);
    var Auth = true;
    if (config.url.match(/login|check/g)) {
      //api -> without token
      Auth = false;
    }
    const value = await localStorage.getItem("token");
    const token = JSON.parse(value);
    config.headers = {
      ...(Auth ? { Authorization: `Bearer ${token}` } : {}),
      Accept: "application/json",
    };
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

instanceAxios.interceptors.response.use(
  (response) => {
    // console.log("response", response);
    return response;
  },
  (error) => handleError(error)
);

export const Login = (username, password) => {
  return instanceAxios
    .get("/login", {
      params: {
        username,
        password,
      },
    })
    .catch((error) => ({ error }));
};

export const checkToken = (token) => {
  return instanceAxios
    .get("/check", {
      params: {
        token,
      },
    })
    .catch((error) => ({ error }));
};
