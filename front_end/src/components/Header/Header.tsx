import { Link, useLocation } from "react-router-dom";

import { HeaderProps } from "../../@types/Layout";
import "./Header.css";

function Header(props: HeaderProps) {
  const currentPath = useLocation().pathname;

  let signingIn = "",
    creatingAccount = "",
    home = "",
    listingApplications = "";

  switch (currentPath) {
    case "/": {
      signingIn = "pressed-path";
      home = "pressed-path";
      break;
    }
    case "/create-account": {
      creatingAccount = "pressed-path";
      break;
    }
    case "/list-applications": {
      listingApplications = "pressed-path";
      break;
    }
  }

  if (!props.signedIn)
    return (
      <div className="header-container">
        <div className="header-title">Recruitment Application</div>
        <div className="header-paths">
          <Link to="/" className="App-link">
            <div className={`${signingIn}`}>Login</div>
          </Link>
          <Link to="/create-account" className="App-link">
            <div className={`${creatingAccount}`}>Create Account</div>
          </Link>
        </div>
      </div>
    );
  else if (props.signedIn && props.isApplicant)
    return (
      <div className="header-container">
        <div className="header-title">Recruitment Application</div>
        <div className="header-paths">
          <Link to="/" className="App-link">
            <div className={`${home}`}>Home</div>
          </Link>
        </div>
      </div>
    );
  else if (props.signedIn && !props.isApplicant)
    return (
      <div className="header-container">
        <div className="header-title">Recruitment Application</div>
        <div className="header-paths">
          <Link to="/" className="App-link">
            <div className={`${home}`}>Home</div>
          </Link>
          <Link to="/list-applications" className="App-link">
            <div className={`${listingApplications}`}>List Applications</div>
          </Link>
        </div>
      </div>
    );
}

export default Header;
