
import LayoutDefault from "../layouts/default/layout-default";
import LayoutProtected from "../layouts/protected/layout-protected";
import StudentHome from "../pages/students/home/home";
import FacultyCreate from "../pages/university/falcuties/faculties-create";
import FacultyEdit from "../pages/university/falcuties/faculties-edit";
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
            element: <StudentHome />,
          },
          {
            path: "university",
            element: <UniversityHome />,
            children: [
              {
                path: "majors",
                children: [
                  {
                    path: "sinh-vien",
                    element: <StudentHome />,
                  },
                  {
                    path: "nha-truong",
                    element: <UniversityHome />,
                  },
                  {
                    path: "faculties",
                    children: [
                      {
                        index: true,
                        element: <FacultyManagement />,
                      },
                      {
                        path: "create",
                        element: <FacultyCreate />,
                      },
                      {
                        path: "edit/:id",
                        element: <FacultyEdit />,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/auth",
    children: [
      {
        path: "login",
      },
    ],
  },
];
