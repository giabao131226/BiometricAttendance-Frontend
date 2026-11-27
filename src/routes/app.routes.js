
import LayoutDefault from "../layouts/default/layout-default";
import LayoutProtected from "../layouts/protected/layout-protected";
import StudentHome from "../pages/students/home/home";
import DepartmentCreate from "../pages/university/departments/department-create";
import DepartmentEdit from "../pages/university/departments/department-edit";
import DepartmentManagement from "../pages/university/departments/department-manage";
import FacultyCreate from "../pages/university/falcuties/faculties-create";
import FacultyEdit from "../pages/university/falcuties/faculties-edit";
import FacultyManagement from "../pages/university/falcuties/falcuties-manage";
import UniversityHome from "../pages/university/home/home";
import MajorCreate from "../pages/university/majors/majors-create";
import MajorEdit from "../pages/university/majors/majors-edit";
import MajorManagement from "../pages/university/majors/majors-manage";
import SubjectCreate from "../pages/university/subjects/subject-create";
import SubjectEdit from "../pages/university/subjects/subject-edit";
import SubjectManagement from "../pages/university/subjects/subject-manage";

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
                    index: true,
                    element: <MajorManagement />
                  },
                  {
                    path: "create",
                    element: <MajorCreate />
                  },
                  {
                    path: "edit/:id",
                    element: <MajorEdit />
                  }
                ],
              },
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
                  },
                  {
                    path: "edit/:id",
                    element: <FacultyEdit />
                  }
                ]
              },
              {
                path: "departments",
                children: [
                  {
                    index: true,
                    element: <DepartmentManagement />
                  },
                  {
                    path: "create",
                    element: <DepartmentCreate />
                  },
                  {
                    path: "edit/:id",
                    element: <DepartmentEdit />
                  }
                ]
              },
              {
                path: "subjects",
                children: [
                  {
                    index: true,
                    element: <SubjectManagement />
                  },
                  {
                    path: "create",
                    element: <SubjectCreate />
                  },
                  {
                    path: "edit/:id",
                    element: <SubjectEdit />
                  }
                ]
              }
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
