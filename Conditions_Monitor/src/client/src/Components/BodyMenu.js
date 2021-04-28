import { Component } from "react";
import "../Styles/BodyMenu.css";

class BodyMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }

    render() {         
        // Parse menu links and store result in format that can be rendered
        let renderableLinks = [];
        this.props.menuLinks.forEach((heading, i) => {
            let currLinks = [];
            heading["links"].forEach((link, j) => {
                currLinks.push(
                    <li className="body-menu-link" onClick={(e) => this.props.handleClick(e, i, j)}>{link}</li>
                );
            });
            renderableLinks.push(
                <div className="body-menu-list-container">
                    <p className="body-menu-list-heading">{heading["heading"]}</p>
                    <ul className="body-menu-list">
                        {currLinks}
                    </ul>
                </div>
            );
        });

        return (
            <div className="body-menu">
                {renderableLinks}
            </div>
        );
    }
}
 
export default BodyMenu;
