import { Component } from "react";
import "../Styles/BodyContent.css";
import Graph from "./Graph";

class BodyContent extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    render() { 
        return (
            <div className="body-content">
                <h1 className="body-content-header">{this.props.selectedLink}</h1>
                <Graph selectedLink={this.props.selectedLink} needAPICall={this.props.needAPICall} setNeedAPICall={this.props.setNeedAPICall} />
            </div>
        );
    }
}
 
export default BodyContent;
