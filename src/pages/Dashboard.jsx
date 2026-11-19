import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, ScanFace, Fingerprint, History, 
    Search, Bell, LogOut, CheckCircle, AlertTriangle, Clock 
} from 'lucide-react';
import '../styles/VelzonLayout.css';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            // Dữ liệu giả lập tạm thời nếu chưa bật backend để bạn test giao diện ngay
            setUser({ fullName: 'Hoàng Vũ', studentId: '66CNTT2' });
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="layout-wrapper">
            <aside className="sidebar">
                <div className="sidebar-brand">
                    BIOMETRIC<span style={{ color: '#0ab39c' }}>SYS</span>
                </div>

                <div className="sidebar-menu">
                    <div className="menu-title">MENU CHÍNH</div>
                    <div 
                        className={`menu-item ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <LayoutDashboard size={18} />
                        <span>Tổng quan điểm danh</span>
                    </div>

                    <div className="menu-title">SINH TRẮC HỌC</div>
                    <div 
                        className={`menu-item ${activeTab === 'face' ? 'active' : ''}`}
                        onClick={() => setActiveTab('face')}
                    >
                        <ScanFace size={18} />
                        <span>Nhận diện Khuôn mặt</span>
                    </div>
                    <div 
                        className={`menu-item ${activeTab === 'finger' ? 'active' : ''}`}
                        onClick={() => setActiveTab('finger')}
                    >
                        <Fingerprint size={18} />
                        <span>Dữ liệu Vân tay</span>
                    </div>
                    <div 
                        className={`menu-item ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        <History size={18} />
                        <span>Lịch sử chuyên cần</span>
                    </div>

                    <div className="menu-title">TÀI KHOẢN</div>
                    <div className="menu-item" onClick={handleLogout} style={{ color: '#f06548' }}>
                        <LogOut size={18} />
                        <span>Đăng xuất</span>
                    </div>
                </div>
            </aside>

            <div className="main-content-wrapper">
                <header className="topbar">
                    <div className="search-box">
                        <Search size={16} />
                        <input type="text" placeholder="Tìm kiếm môn học, mã lớp..." />
                    </div>

                    <div className="topbar-right">
                        <Bell size={20} color="#495057" style={{ cursor: 'pointer' }} />
                        
                        <div className="user-profile-box">
                            <div className="user-avatar">
                                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'SV'}
                            </div>
                            <div className="user-info">
                                <h6>{user.fullName}</h6>
                                <span>MSV: {user.studentId || '66CNTT2'}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="page-content">
                    <div className="page-title-box">
                        <h4>BẢNG ĐIỀU KHIỂN SINH VIÊN</h4>
                        <div className="breadcrumb">Hệ thống &gt; Tổng quan</div>
                    </div>

                    <div className="alert-banner-velzon">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <AlertTriangle size={18} />
                            <span>
                                <strong>Lưu ý sinh trắc học:</strong> Vui lòng đảm bảo đã quét đủ mẫu vân tay và khuôn mặt tại thiết bị hệ thống.
                            </span>
                        </div>
                    </div>

                    <div className="kpi-grid">
                        <div className="kpi-card">
                            <div className="kpi-info">
                                <p>Tỷ Lệ Chuyên Cần</p>
                                <h3>95.5%</h3>
                                <span className="kpi-badge badge-up">+2.5% so với kỳ trước</span>
                            </div>
                            <div className="kpi-icon bg-purple">
                                <CheckCircle size={22} />
                            </div>
                        </div>

                        <div className="kpi-card">
                            <div className="kpi-info">
                                <p>Số Buổi Đã Điểm Danh</p>
                                <h3>42 / 44</h3>
                                <span className="kpi-badge badge-up">Học kỳ I - 2026</span>
                            </div>
                            <div className="kpi-icon bg-green">
                                <Clock size={22} />
                            </div>
                        </div>

                        <div className="kpi-card">
                            <div className="kpi-info">
                                <p>Dữ Liệu Khuôn Mặt</p>
                                <h3>Đã Đăng Ký</h3>
                                <span className="kpi-badge badge-up">Vector 128-D sẵn sàng</span>
                            </div>
                            <div className="kpi-icon bg-yellow">
                                <ScanFace size={22} />
                            </div>
                        </div>

                        <div className="kpi-card">
                            <div className="kpi-info">
                                <p>Mẫu Vân Tay (ESP32)</p>
                                <h3>ID #104</h3>
                                <span className="kpi-badge badge-warn">Đã đồng bộ cảm biến</span>
                            </div>
                            <div className="kpi-icon bg-red">
                                <Fingerprint size={22} />
                            </div>
                        </div>
                    </div>

                    <div className="data-card">
                        <div className="data-card-header">
                            <h5 style={{ fontSize: '15px', color: '#495057' }}>Nhật Ký Điểm Danh Gần Nhất</h5>
                        </div>

                        <table className="velzon-table">
                            <thead>
                                <tr>
                                    <th>Môn Học</th>
                                    <th>Thời Gian Quét</th>
                                    <th>Phương Thức Xác Thực</th>
                                    <th>Độ Chính Xác AI</th>
                                    <th>Trạng Thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Công nghệ Phần mềm</strong></td>
                                    <td>18/11/2026 - 07:02:15</td>
                                    <td>Khuôn mặt + Vân tay</td>
                                    <td>99.2%</td>
                                    <td><span className="kpi-badge badge-up">Đúng giờ</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Hệ quản trị Cơ sở dữ liệu</strong></td>
                                    <td>16/11/2026 - 09:35:10</td>
                                    <td>Nhận diện Khuôn mặt</td>
                                    <td>98.7%</td>
                                    <td><span className="kpi-badge badge-up">Đúng giờ</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Mạng máy tính</strong></td>
                                    <td>14/11/2026 - 13:18:40</td>
                                    <td>Cảm biến Vân tay</td>
                                    <td>100%</td>
                                    <td><span className="kpi-badge badge-warn">Đi muộn 3 phút</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}