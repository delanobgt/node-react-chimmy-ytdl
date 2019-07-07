import axios from "axios";

axios.defaults.timeout = 60 * 4 * 1000;

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_YOUTUBE_API_BASE_URL ||
    window.location.origin}/youtube`
});

export const validateUrl = async url => {
  const response = await instance.post("/validateUrl", { url });
  return response.data;
};

export const getBasicInfo = async url => {
  const response = await instance.post("/basicInfo", { url });
  return response.data;
};

export const sendShareLinkEmail = async ({ videoUrl, videoName, email }) => {
  const response = await instance.post("/sendShareLinkEmail", {
    videoUrl,
    videoName,
    email
  });
  return response.data;
};
