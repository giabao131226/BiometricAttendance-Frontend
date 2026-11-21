import LayoutDefault from "../layouts/default/layout-default";
import LayoutProtected from "../layouts/protected/layout-protected";
import StudentHome from "../pages/students/home/home";
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
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
