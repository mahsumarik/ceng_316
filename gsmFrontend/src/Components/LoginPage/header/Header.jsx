import { useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "../../../assets/iyteLogo.png";

function Header() {
  const navigate = useNavigate();

  const handleHomeClick = () => navigate("/");
  const handleAboutClick = () => navigate("/about");
  const handleContactClick = () => navigate("/contact");

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-center">
          <div className="logo-title-container">
            <img
              src={logo || "/placeholder.svg"}
              alt="IYTE Logo"
              className="header-logo"
            />
            <div className="header-titles">
              <h1 className="header-title">GRADUATION MANAGEMENT SYSTEM</h1>
              <p className="header-subtitle">İzmir Institute of Technology</p>
            </div>
          </div>
        </div>

        <div className="nav-buttons">
          <button className="nav-button" onClick={handleHomeClick}>
            Home
          </button>
          <button className="nav-button" onClick={handleAboutClick}>
            About
          </button>
          <button className="nav-button" onClick={handleContactClick}>
            Contact
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
