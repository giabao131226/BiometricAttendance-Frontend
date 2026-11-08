
import {
    Activity,
    ChevronDown,
    ChevronRight,
    LayoutGrid,
    Layers
} from "lucide-react";
import "./sidebar.css"

export default function Sidebar({ isCollapsed, isMobileOpen }) {
    return (
        <aside className={`home-sidebar ${isCollapsed ? "home-sidebar-mini" : ""} ${isMobileOpen ? "home-sidebar-open" : ""}`}>
            <div className="home-sidebar-header">
                <span className="home-logo-text">VELZON</span>
            </div>

            <nav className="home-sidebar-nav">
                <div className="home-section-title">Menu</div>

                <div className="home-nav-item home-active">
                    <div className="home-nav-item-left">
                        <Activity size={18} />
                        <span>Dashboards</span>
                    </div>
                    <ChevronDown size={16} />
                </div>

                <div className="home-nav-subitem home-active">
                    <span>Analytics</span>
                </div>
                <div className="home-nav-subitem">
                    <span>CRM</span>
                </div>
                <div className="home-nav-subitem">
                    <span>Ecommerce</span>
                </div>
                <div className="home-nav-subitem">
                    <span>Crypto</span>
                </div>
                <div className="home-nav-subitem">
                    <span>Projects</span>
                </div>
                <div className="home-nav-subitem">
                    <span>NFT</span>
                </div>
                <div className="home-nav-subitem">
                    <span>Job</span>
                </div>
                <div className="home-nav-subitem">
                    <span>Blog</span>
                    <span className="home-badge home-badge-green">New</span>
                </div>

                <div className="home-nav-item">
                    <div className="home-nav-item-left">
                        <LayoutGrid size={18} />
                        <span>Apps</span>
                    </div>
                    <ChevronRight size={16} />
                </div>

                <div className="home-nav-item">
                    <div className="home-nav-item-left">
                        <Layers size={18} />
                        <span>Layouts</span>
                    </div>
                    <span className="home-badge home-badge-orange">Hot</span>
                </div>

                <div className="home-section-title">Pages</div>
            </nav>
        </aside>
    );
}
