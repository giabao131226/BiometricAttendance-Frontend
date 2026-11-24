import "./loading.css";
import { GraduationCap } from "lucide-react";

const Loading = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-logo">
          <GraduationCap size={30} color="#ffffff" />
        </div>

        <h2>BioAttend</h2>

        <p>Đang xác thực tài khoản của bạn...</p>

        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default Loading;
