import { Component } from "react";
import "../Styles/Nav.css";
import logo from "../assets/uml_logo.png";

class Nav extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return (
            <div className="nav">
                <div className="logo">
                    <img className="logo-image" src={logo} alt="UML Logo"></img> 
                </div>
            </div>
        );
    }
}
 
export default Nav;
