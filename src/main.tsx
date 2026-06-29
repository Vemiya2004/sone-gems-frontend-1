import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl } from "./api-client/custom-fetch";

const baseUrl = import.meta.env.VITE_API_URL || "https://sone-gems-backend.onrender.com";
setBaseUrl(baseUrl);

createRoot(document.getElementById("root")!).render(<App />);
