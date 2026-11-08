
import {
    Menu,
    Search,
    ShoppingBag,
    Maximize2,
    Moon,
    Bell,
    LayoutGrid
} from "lucide-react";
import "./header.css";

function Header({ onToggleSidebar }) {
    return (

        <header className="home-navbar">
            <div className="home-navbar-left">
                <button
                    className="home-menu-toggle"
                    onClick={onToggleSidebar}
                >
                    <Menu size={20} />
                </button>

                <div className="home-search-box">
                    <Search className="home-search-icon" size={16} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="home-search-input"
                    />
                </div>
            </div>
            <div className="home-navbar-right">
                <img
                    src="https://flagcdn.com/w40/us.png"
                    alt="US Flag"
                    className="home-flag-icon"
                />

                <button className="home-icon-btn">
                    <LayoutGrid size={18} />
                </button>

                <button className="home-icon-btn">
                    <ShoppingBag size={18} />
                    <span className="home-icon-badge home-icon-badge-blue">5</span>
                </button>

                <button className="home-icon-btn">
                    <Maximize2 size={18} />
                </button>

                <button className="home-icon-btn">
                    <Moon size={18} />
                </button>

                <button className="home-icon-btn">
                    <Bell size={18} />
                    <span className="home-icon-badge home-icon-badge-red">3</span>
                </button>

                <div className="home-profile-section">
                    <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                        alt="Anna Adame"
                        className="home-profile-avatar"
                    />

                    <div className="home-profile-info">
                        <span className="home-profile-name">Anna Adame</span>
                        <span className="home-profile-role">Founder</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;