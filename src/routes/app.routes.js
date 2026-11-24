import LayoutDefault from "../layouts/default/layout-default";
import LayoutProtected from "../layouts/protected/layout-protected";
import StudentHome from "../pages/students/home/home";
import UniversityHome from "../pages/university/home/home";
import MajorManagement from "../pages/university/majors/majors-manage";
import MajorCreate from "../pages/university/majors/majors-create";
import MajorEdit from "../pages/university/majors/majors-edit";

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
            children: [
              { index: true, element: <UniversityHome /> },
              {
                path: "majors",
                children: [
                  { index: true, element: <MajorManagement /> },
                  { path: "create", element: <MajorCreate /> },
                  { path: "edit/:id", element: <MajorEdit /> },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
