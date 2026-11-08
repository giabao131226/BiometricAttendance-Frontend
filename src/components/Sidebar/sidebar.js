import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    ChevronDown,
    ChevronRight,
    LayoutDashboard,
    Building2,
    Plus,
    Network,
    UserCog,
    ChartNoAxesCombined
} from "lucide-react";
import "./sidebar.css";

export default function Sidebar({ role, isCollapsed, isMobileOpen }) {
    const [openMenus, setOpenMenus] = useState({
        faculties: true
    });

    const roleConfig = {
        student: [
            {
                label: "Tổng quan",
                link: "/student/dashboard",
                icon: LayoutDashboard
            }
        ],
        teacher: [
            {
                label: "Tổng quan",
                link: "/teacher/dashboard",
                icon: LayoutDashboard
            }
        ],
        university: [
            {
                label: "Tổng quan",
                link: "/university/dashboard",
                icon: LayoutDashboard
            },
            {
                label: "Quản lý khoa",
                key: "faculties",
                icon: Building2,
                children: [
                    {
                        label: "Danh sách khoa",
                        link: "/university/faculties",
                        icon: Building2
                    },
                    {
                        label: "Quản lý bộ môn",
                        link: "/university/departments",
                        icon: Network
                    },
                    {
                        label: "Phân công trưởng khoa",
                        link: "/university/faculties/assign-dean",
                        icon: UserCog
                    },
                    {
                        label: "Thống kê khoa",
                        link: "/university/faculties/statistics",
                        icon: ChartNoAxesCombined
                    }
                ]
            }
        ]
    };
    role = "university";
    const menuItems = roleConfig[role] || [];

    const handleToggleMenu = (key) => {
        setOpenMenus(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <aside className={`home-sidebar ${isCollapsed ? "home-sidebar-mini" : ""} ${isMobileOpen ? "home-sidebar-open" : ""}`}>
            <div className="home-sidebar-header">
                <span className="home-logo-text">VELZON</span>
            </div>

            <nav className="home-sidebar-nav">
                <div className="home-section-title">Menu</div>

                {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    const hasChildren = item.children?.length > 0;
                    const isOpen = openMenus[item.key];

                    return (
                        <div className="home-nav-group" key={item.key || index}>
                            {hasChildren ? (
                                <div
                                    className={`home-nav-item ${isOpen ? "home-active" : ""}`}
                                    onClick={() => handleToggleMenu(item.key)}
                                >
                                    <div className="home-nav-item-left">
                                        <Icon size={18} />
                                        <span>{item.label}</span>
                                    </div>

                                    {!isCollapsed && (
                                        isOpen
                                            ? <ChevronDown size={16} />
                                            : <ChevronRight size={16} />
                                    )}
                                </div>
                            ) : (
                                <NavLink
                                    to={item.link}
                                    className={({ isActive }) =>
                                        `home-nav-item ${isActive ? "home-active" : ""}`
                                    }
                                >
                                    <div className="home-nav-item-left">
                                        <Icon size={18} />
                                        <span>{item.label}</span>
                                    </div>
                                </NavLink>
                            )}

                            {hasChildren && isOpen && !isCollapsed && (
                                <div className="home-nav-children">
                                    {item.children.map((child, childIndex) => {
                                        const ChildIcon = child.icon;

                                        return (
                                            <NavLink
                                                to={child.link}
                                                key={childIndex}
                                                className={({ isActive }) =>
                                                    `home-nav-subitem ${isActive ? "home-active" : ""}`
                                                }
                                            >
                                                {ChildIcon && <ChildIcon size={16} />}
                                                <span>{child.label}</span>
                                            </NavLink>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
}