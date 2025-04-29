import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { appStore } from "./app/store";
import { Toaster } from "./components/ui/sonner";
import { useLoadUserQuery } from "./features/api/authApi";
import { Loader } from "lucide-react";
import { FadeLoader } from "react-spinners";

const Custom = ({ children }) => {
  const { isLoading } = useLoadUserQuery();
  return (
    <>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#141414]">
          <Loader className="animate-spin h-16 w-16 text-blue-600 " />
          <p className="mt-2 text-lg font-semibold text-gray-100">
            Loading, Please wait..
          </p>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={appStore}>
      <Custom>
        <App />
        <Toaster />
      </Custom>
    </Provider>
  </StrictMode>
);
