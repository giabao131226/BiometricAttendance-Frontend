import LayoutDefault from "../layouts/default/layout-default";
import LayoutProtected from "../layouts/protected/layout-protected";
import StudentHome from "../pages/students/home/home";
import FacultyCreate from "../pages/university/falcuties/faculties-create";
import FacultyManagement from "../pages/university/falcuties/falcuties-manage";
import UniversityHome from "../pages/university/home/home";


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
                        path: "student",
                        element: <StudentHome />
                    },
                    {
                        path: "university",
                        element: <UniversityHome />,
                        children: [
                            {
                                path: "faculties",
                                children: [
                                    {
                                        index: true,
                                        element: <FacultyManagement />
                                    },
                                    {
                                        path: "create",
                                        element: <FacultyCreate />
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
];
