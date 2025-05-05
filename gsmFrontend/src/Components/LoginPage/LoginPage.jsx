import Header from './header/Header'; // Eğer Header 'header' adlı alt klasörde ise
import LoginSignup from './loginSignupForm/LoginSignup'; // LoginSignup component import
import "./LoginPage.css";

function LoginPage() {
  return (
    <div className="login-page">
      <Header /> {/* Include the Header */}
      <LoginSignup /> {/* Include the LoginSignup */}
      {/* <Footer /> Include the Footer */}
    </div>
  );
}

export default LoginPage;
