import { createBrowserRouter } from "react-router-dom"
import LoginForm from "@/components/auth/LoginForm"
import App from "@/App";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
    {
        element: <ProtectedRoute><App /></ProtectedRoute>,
        path: "/",
    },
    {
        path: "/login",
        element: <LoginForm />,
    },
])

export default router;
