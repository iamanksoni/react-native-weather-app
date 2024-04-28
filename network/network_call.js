import axiosInstance from "./axios_instance";

axiosInstance.interceptors.request.use(
  function (config) {
    console.log("Request URL:", config.url);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const searchLocation = async (query) => {
  try {
    var respone = await axiosInstance.get(`v1/search.json`, {
      params: {
        q: query,
        key: "c1a3f0ca5588442bb0092317242804",
      },
    });
    return respone;
  } catch (error) {
    throw error;
  }``
};

const fetchForecast = async (latitude, longitude, days) => {
    try {
      var respone = await axiosInstance.get(`v1/forecast.json`, {
        params: {
          q: `${latitude},${longitude}`,
          days: days,
          key: "c1a3f0ca5588442bb0092317242804",
        },
      });
      return respone;
    } catch (error) {
      throw error;
    }
  };



export { searchLocation, fetchForecast };
