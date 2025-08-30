import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import "@mantine/core/styles.css";
import '@mantine/dates/styles.css';
import "dayjs/locale/pt-br"
import { MantineProvider } from "@mantine/core";
import { ToastContainer } from "react-toastify";
import { DatesProvider } from "@mantine/dates";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <MantineProvider withGlobalClasses>
        <DatesProvider settings={{ locale: "pt-br" }}>
          <App />
        </DatesProvider>
      </MantineProvider>
      <ToastContainer/>
    </Provider>
  </StrictMode>
);
