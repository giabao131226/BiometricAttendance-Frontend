import { useRoutes } from "react-router-dom";
import { routes } from "./app.routes";

export default function AllRoute(){
    const allRoute = useRoutes(routes);
    return (
        <>
            {allRoute}
        </>
    )
}