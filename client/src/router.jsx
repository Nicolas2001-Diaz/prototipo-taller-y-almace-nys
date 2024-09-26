import { Navigate, createHashRouter } from "react-router-dom";

import DefaultLayout from "./components/layouts/DefaultLayout/DefaultLayout";

import Inventario from "./views/Inventario/Inventario";

const router = createHashRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "/inventario",
                element: <Navigate to="/" />
            },
            {
                path: "/",
                element: <Inventario />
            }
        ]
    }
]);

export default router;