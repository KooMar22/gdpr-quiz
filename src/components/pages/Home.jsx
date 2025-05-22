import { Link } from "react-router-dom";
import "../../styles/Home.css";

const Home = () => {
    return (
      <div className="home">
        <div className="home-text">
          <h1 className="home-title">GDPR Kviz</h1>
          <p>
            Dobrodošli u GDPR kviz! Ovdje možete testirati svoje znanje o Općoj
            uredbi o zaštiti podataka (GDPR).
          </p>
          <p>
            Kviz je nastao povodom obilježavanja 7. obljetnice potpune primjene
            GDPR-a.
          </p>
          <p>
            Radi se o amaterskom projektu isključivo jednog pravnika koji se
            bavi zaštitom osobnih podataka i tehnološki je entuzijast.
          </p>
          <p>
            Za rješavanje kviza ne treba vam puno znanja već samo dobre volje i
            malo zdrave logike i istraživanja.
          </p>
          <p>Kliknite na gumb ispod da biste započeli kviz.</p>
          <Link to="/quiz" className="btn" id="start-btn">Započni kviz</Link>
        </div>
        <img src="https://media.licdn.com/dms/image/v2/D4E10AQEDdkT0_KX5Iw/image-shrink_1280/B4EZaLWE2rHIAM-/0/1746094542600?e=2147483647&v=beta&t=dVsbbTwetdfAYo4kTN4wBGWreMDsIzQwhgJtTlHdBFs" alt="GDPR Cake Image"/>
      </div>
    );
}

export default Home;