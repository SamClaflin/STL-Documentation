import { Component } from "react";
import "../Styles/Body.css";
import blurredImage from "../assets/blurred_image.jpg";
import BodyMenu from "./BodyMenu";
import BodyContent from "./BodyContent";

class Body extends Component {
    constructor(props) {
        super(props);
        this.menuLinks = [ 
            {
                heading: "STL Main Laboratory",
                links: [
                    "Air Handler (Lasers)",
                    "Air Handler (SMS)",
                    "Laser Chase",
                    "Honeywell Inputs",
                    "SMS Systems Lab",
                    "W Band System",
                    "UHF Lab",
                    "FIR Lasers",
                    "CO2 and VOC Sensors",
                    "ExaGrid Rack",
                ]
            },
            {
                heading: "Auxilary Laboratories and Facilities",
                links: [
                    "Bistatic Lab",
                    "Bruker Lab",
                    "Mezzanine",
                    "Model Shop",
                    "STL Roof",
                ]
            },
            {
                heading: "Server Room",
                links: [
                    "Server Room Conditions",
                    "Server Room UPS",
                    "Norco",
                    "Morco",
                ]
            },
            {
                heading: "Development Lab",
                links: [
                    "Development Lab Main Room",
                    "Development Lab Equipment Cage",
                ]
            },
            {
                heading: "Lab Voltages",
                links: [
                    "Lab AC Voltage Monitor",
                    "Lab AC Voltages 1 Hour",
                    "Lab AC Voltages Major Errors",
                    "Server AC Voltages Monitor",
                    "Server AC Voltages 1 Hour",
                    "Server AC Voltages Major Errors",
                ]
            },
            {
                heading: "Monitor Front Panels",
                links: [
                    "STL Conditions Monitor",
                ]
            }
        ]
        this.state = { 
            selectedLink: this.menuLinks[0]["links"][0],
            needAPICall: false, 
        };
    }

    handleMenuClick(e, i, j) {
        this.setState({
            selectedLink: this.menuLinks[i]["links"][j],
            needAPICall: true,
        });
    }

    setNeedAPICall(val) {
        this.setState({
            selectedLink: this.state.selectedLink,
            needAPICall: val,
        });
    }

    render() {
        return (
            <div className="body">
                <div className="blurred-container">
                    <img className="blurred-image" src={blurredImage} alt="Blurred Background"></img>
                    <div className="blurred-text-box">
                        <p className="blurred-text">Conditions</p>
                    </div>
                </div>
                <div className="body-main">
                    <BodyMenu handleClick={this.handleMenuClick.bind(this)} menuLinks={this.menuLinks} />
                    <BodyContent selectedLink={this.state.selectedLink} needAPICall={this.state.needAPICall} setNeedAPICall={this.setNeedAPICall.bind(this)} />
                </div>
            </div>
        );
    }
}
 
export default Body;
