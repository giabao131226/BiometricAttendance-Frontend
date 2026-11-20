import { useEffect, useState } from "react";
import {Outlet, useNavigate} from "react-router-dom";
import Loading from "../../components/Loading/loading";

export default function LayoutProtected(){
    const navigate = useNavigate();
    const [isAuthenticated,setIsAuthenticated] = useState(false);
    const [isLoading,setIsLoading] = useState(true);


    useEffect(() => {
        // fetch(``)
        setTimeout(() => {
            console.log("Thực hiện truy vấn tài khoản dựa trên token trong cookie");
            console.log("Truy vấn thành công");
            setIsAuthenticated(true);
            setIsLoading(false);
        },3000)    
    },[])

    return (
        <> 
            {isLoading ? <Loading /> : <></>}
            {isAuthenticated ? <Outlet /> : <></>}
        </>
    )
}