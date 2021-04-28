import "../Styles/Footer.css";
import logoGray from "../assets/uml_logo_gray.png";

const Footer = () => {
    return (
        <div className="footer">
            <div className="footer-text-box">
                <img className="footer-image" src={logoGray} alt="UML Logo"></img>
                <p className="footer-text">Submillimeter-Wave Technology Laboratory: 175 Cabot Street, Suite 130, Lowell, Massachusetts 01854.</p>
                <p className="footer-text">Phone: (978) 934-1300, Fax: (978) 452-3333, <a href="mailto:Jason_Dickinson@uml.edu">Contact Us</a></p>
            </div>
        </div>
    );
}
 
export default Footer;
