import LayoutDefault from "../layouts/default/layout-default";
import LayoutProtected from "../layouts/protected/layout-protected";
import StudentHome from "../pages/students/home/home";
import UniversityHome from "../pages/university/home/home";
import UniversitySubjects from "../pages/university/subjects/university-subjects";
import StudentSubjects from "../pages/students/subjects/student-subjects";

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
                        children: [
                            { path: "", element: <StudentHome /> },
                            { path: "mon-hoc", element: <StudentSubjects /> },
                            { path: "subjects", element: <StudentSubjects /> }
                        ]
                    },
                    {
                        path: "nha-truong",
                        children: [
                            { path: "", element: <UniversityHome /> },
                            { path: "mon-hoc", element: <UniversitySubjects /> },
                            { path: "subjects", element: <UniversitySubjects /> }
                        ]
                    },
                    {
                        path: "student",
                        children: [
                            { path: "", element: <StudentHome /> },
                            { path: "dashboard", element: <StudentHome /> },
                            { path: "subjects", element: <StudentSubjects /> },
                            { path: "mon-hoc", element: <StudentSubjects /> }
                        ]
                    },
                    {
                        path: "university",
                        children: [
                            { path: "", element: <UniversityHome /> },
                            { path: "dashboard", element: <UniversityHome /> },
                            { path: "subjects", element: <UniversitySubjects /> },
                            { path: "mon-hoc", element: <UniversitySubjects /> }
                        ]
                    }
                ]
            }
        ]
    }
];
