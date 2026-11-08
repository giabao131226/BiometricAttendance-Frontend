import {Outlet} from "react-router-dom";

export default function LayoutProtected(){
    return (
        <>
            <Outlet />
        </>
    )
}