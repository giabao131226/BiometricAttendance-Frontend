import LayoutDefault from "../layouts/default/layout-default";
import LayoutProtected from "../layouts/protected/layout-protected";
import StudentHome from "../pages/students/home/home";
<<<<<<< Updated upstream
=======
import MajorCreate from "../pages/university/majors/majors-create";
import MajorEdit from "../pages/university/majors/majors-edit";
import MajorManagement from "../pages/university/majors/majors-manage";
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                    {
                        path: "sinh-vien",
                        element: <StudentHome />
                    },
                    {
                        path: "nha-truong",
                        element: <UniversityHome />
                    }
                ]
            }
        ]
    }
=======
                  {
                    index: true,
                    element: <MajorManagement />,
                  },
                  {
                    path: "create",
                    element: <MajorCreate />,
                  },
                  {
                    path: "edit/:id",
                    element: <MajorEdit />,
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
>>>>>>> Stashed changes
];
