import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

//now make it atomically send the authentication token every time it sends a request

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
  return response;
},

async (error)=>{
    const originalRequest= error.config

    //handle unauthorized request

    if(error.response?.status === 401 && !originalRequest._retry)
    {
        originalRequest._retry = true



        try{

        }catch(refresh)
        {

        }






    }
}

);
