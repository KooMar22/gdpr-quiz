import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="home">
            <h1 className="home__title">GDPR Kviz</h1>
            <p>Dobrodošli u GDPR kviz! Ovdje možete testirati svoje znanje o Općoj uredbi o zaštiti podataka (GDPR).</p>
            <p>Kliknite na gumb ispod da biste započeli kviz.</p>
            <button className="btn" id="start-btn">
                <Link to="/quiz">Započni kviz</Link>
            </button>
        </div>
    )
}

export default Home;