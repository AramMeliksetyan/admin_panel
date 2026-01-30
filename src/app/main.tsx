import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import "./styles/index.css";
import App from "./App.tsx";
import { store } from "@/shared/lib/store";
import { TranslationProvider } from "@/shared/context/TranslationContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <TranslationProvider>
          <App />
        </TranslationProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
