import { Component } from "react";
import { CartesianGrid, LineChart, XAxis, YAxis, Line } from "recharts";
import RotateLoader from "react-spinners/RotateLoader";
import axios from "axios";
import "../Styles/Graph.css";

class Graph extends Component {
    constructor(props) {
        super(props);
        this.endpoints = {
            "Air Handler (Lasers)": "ah/lasers",
            "Air Handler (SMS)": "ah/sms",
            "Laser Chase": "laser-chase",
            "Honeywell Inputs": "honeywell",
            "SMS Systems Lab": "sms-systems",
            "W Band System": "wband-systems",
            "UHF Lab": "uhf",
            "FIR Lasers": "fir-lasers",
            "CO2 and VOC Sensors": "co2-sensors",
            "ExaGrid Rack": "exagrid",
            "Bistatic Lab": "bistatic",
            "Bruker Lab": "bruker",
            "Mezzanine": "mezzanine",
            "Model Shop": "model-shop",
            "STL Roof": "roof",
            "Server Room Conditions": "server-room/conditions",
            "Server Room UPS": "server-room/ups",
            "Norco": "norco",
            "Morco": "morco",
            "Development Lab Main Room": "dev-lab/main-room",
            "Development Lab Equipment Cage": "dev-lap/equip",
            "Lab AC Voltage Monitor": "lab-ac-voltage/monitor",
            "Lab AC Voltages 1 Hour": "lab-ac-voltage/hour",
            "Lab AC Voltages Major Errors": "lab-ac-voltage/err",
            "Server AC Voltages Monitor": "server-ac-voltage/monitor",
            "Server AC Voltages 1 Hour": "server-ac-voltage/hour",
            "Server AC Voltages Major Errors": "server-ac-voltage/err",
            "STL Conditions Monitor": "conditions-monitor",
        };
        this.colors = [
            "#fc2c03",
            "#fc7703",
            "#fcdb03",
            "#03fc0b",
            "#00ff7b",
            "#00ffbf",
            "#00fff2",
            "#00c3ff",
            "#0084ff",
            "#004cff",
            "#4c00ff",
            "#8400ff",
            "#bb00ff",
            "#800b0b",
            "#bfd14b",
            "#4e9c69",
            "#35876e",
            "#257280",
            "#1b317a",
            "#1f1470",
        ];
        this.state = { 
            apiResponse: "",
            isLoading: false, 
        };
    }

    /** 
     * Function to make an API call to a given endpoint
     * 
     * @param endpoint      a string that represents the endpoint at which the API request will be made 
     */
    getTemperatureData(endpoint) {
        // Display loading animation
        this.setState({
            apiResponse: this.state.apiResponse,
            isLoading: true,
        });

        axios.get(`http://localhost:5000/api/v1/resources/${endpoint}`)
            .then(res => {
                // Store the response data in the application state and hide the loading animation
                this.setState({ 
                    apiResponse: res.data,
                    isLoading: false, 
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    /**
     * Function to parse the temperature data stored within this.state.apiResponse and return an array containing
     * the parsed data (requires calling this.getTemperatureData first)
     * 
     * @returns         an array containing the parsed data 
     */
    parseTemperatureData() {
        let data = [];
        for (let i = 0; i < this.state.apiResponse.length; i++) {
            const currTime = this.state.apiResponse[i]["time"].split(".")[0];
            const currVal = parseFloat(this.state.apiResponse[i]["measure_value::double"]); 
            const currName = this.state.apiResponse[i]["device"];
            let shouldContinue = false;

            for (let j = 0; j < data.length; j++) {
                if (this.timesWithinRange(data[j].name, currTime)) {
                    data[j][currName] = currVal; 
                    shouldContinue = true;
                    break; 
                }
            }
            if (shouldContinue) { continue; }
            
            let currObj = {};
            currObj["name"] = currTime;
            currObj[currName] = currVal;
            data.push(currObj);
        }

        return data;
    }

    /**
     * Function to generate an array of renderable Line components from an array of parsed data 
     * 
     * @param data      an array containing parsed data that will be used to generate the lines (obtained from this.parseTemperatureData) 
     * 
     * @returns         an array of Line components that are renderable by a Rechart-LineChart component 
     */
    generateLines(data) {
        let dataKeys = new Set();
        for (let i = 0; i < data.length; i++) {
            for (const currProp in data[i]) {
                if (currProp === "name") { continue; }
                dataKeys.add(currProp);
            }
        }

        let lines = [];
        let i = 0;
        for (const item of dataKeys) {
            lines.push(
                <Line type="monotone" dataKey={item} stroke={this.colors[i]} dot={false} strokeWidth={3} />
            )
            i++;
        }

        return lines;
    }

    /**
     * Function to determine whether or not two given timestamps are within a given tolerance of one another and should therefore be grouped 
     * into the same x-value on the graph to reduce clutter
     *  
     * @param time1             the first given timestamp (string with format HH:MM:SS) to evaluate 
     * @param time2             the second given timestamp (string with format HH:MM:SS) to evaluate 
     * 
     * @returns                 true if the two timestamps are within the given tolerance (should be grouped); false otherwise 
     */
    timesWithinRange(time1, time2) {
        const tolerance = 30000;
        return Math.abs(this.timeToMilli(time1) - this.timeToMilli(time2)) < tolerance;    
    }

    /**
     * Function to convert a given timestamp into a time in milliseconds 
     * 
     * @param time          the timestamp (string) to convert into milliseconds
     * 
     * @returns             the converted milliseconds value (number)
     */
    timeToMilli(time) {
        const index = time.search(" ") + 1;
        const hours = time.slice(index, index + 2);
        const minutes = time.slice(index + 3, index + 5);
        const seconds = time.slice(index + 6, index + 8);
        return (seconds * 1000) + (minutes * 60000) + (hours * 3600000);
    }

    // Automatically perform an API call when the component first mounts
    componentDidMount() {
        this.getTemperatureData(this.endpoints[this.props.selectedLink]);
        this.props.setNeedAPICall(false);
    }

    // Each time the component updates, check to see if an API call needs to be made and execute it if so
    componentDidUpdate() {
        if (this.props.needAPICall) {
            this.getTemperatureData(this.endpoints[this.props.selectedLink]);
            this.props.setNeedAPICall(false);
        }
    }

    render() {
        const data = this.parseTemperatureData();
        const lines = this.generateLines(data);

        let overlayClass = "graph-overlay";
        if (!this.state.isLoading) { overlayClass += " hidden"; }

        return (
            <div className="graph">
                <LineChart width={1000} height={700} data={data}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid stroke="#ccc" />
                    {lines}
                </LineChart>
                <div className={overlayClass}>
                    <RotateLoader className="loading-icon" loading={true} color="#006EBD" />
                </div>
            </div>
        );
    }
}

export default Graph;
