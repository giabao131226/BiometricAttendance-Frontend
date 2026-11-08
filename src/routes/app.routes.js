import LayoutDefault from "../layouts/default/layout-default";
import LayoutProtected from "../layouts/protected/layout-protected";
import StudentHome from "../pages/students/home/home";


export const routes = [
    {
        path: "/",
        element: <LayoutProtected />,
        children: [
            {
                path: "",
                element: <LayoutDefault />,
                children: [
                    {
                        path: "sinh-vien",
                        element: <StudentHome />
                    }
                ]
            }
        ]
    }
];
