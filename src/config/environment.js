const environment = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api",

  appName: import.meta.env.VITE_APP_NAME || "Pooja Fashion Shop",

  environment: import.meta.env.MODE || "development",
};

export default environment;
