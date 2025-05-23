import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <h1 className="title">GDPR Kviz</h1>
      <nav className="navbar">
        <ul className="navbar-list">
          <li>
            <Link to="/">Početna</Link>
          </li>
          <li>
            <Link to="/quiz">Kviz</Link>
          </li>
          <li>
            <Link to="/statistics">Statistika</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;