import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
const supabaseUrl = 'https://ahroejvzmollzbhwnuei.supabase.co'
const supabaseAnonKey = 'sb_publishable_-CkVF-rLxdVMMixMdOrSAQ_5POndYu1'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
