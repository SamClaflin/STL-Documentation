const getAllRows = require("./query");
const express = require("express");
const router = express.Router();
const baseRoute = "/api/v1/resources";
const baseQuery = 'SELECT * FROM "Iot-Test"."TestTable"';
const rateLimit = 10000; // Milliseconds
let states = {};
let numRequests = 0;
const endpoints = {
    "all": baseQuery,
    "ah/lasers": genQueryString("ah-lasers"),
    "ah/sms": genQueryString("ah-sms"),
    "laser-chase": genQueryString("laser-chase"),
    "honeywell": genQueryString("honeywell"),
    "sms-systems": genQueryString("sms-systems"),
    "wband-systems": genQueryString("wband-systems"),
    "uhf": genQueryString("uhf"),
    "fir-lasers": genQueryString("fir-lasers"),
    "co2-sensors": genQueryString("co2-sensors"),
    "exagrid": genQueryString("exagrid"),
    "bistatic": genQueryString("bistatic"),
    "bruker": genQueryString("bruker"),
    "mezzanine": genQueryString("mezzanine"),
    "model-shop": genQueryString("model-shop"),
    "roof": genQueryString("roof"),
    "server-room/conditions": genQueryString("server-room-conditions"),
    "server-room/ups": genQueryString("server-room-ups"),
    "norco": genQueryString("norco"),
    "morco": genQueryString("morco"),
    "dev-lab/main-room": genQueryString("dev-lab-main-room"),
    "dev-lab/equip": genQueryString("dev-lab-equip"),
    "lab-ac-voltage/monitor": genQueryString("lab-ac-voltage-monitor"),
    "lab-ac-voltage/hour": genQueryString("lab-ac-voltage-hour"),
    "lab-ac-voltage/err": genQueryString("lab-ac-voltage-err"),
    "server-ac-voltage/monitor": genQueryString("server-ac-voltage-monitor"),
    "server-ac-voltage/hour": genQueryString("server-ac-voltage-hour"),
    "server-ac-voltage/err": genQueryString("server-ac-voltage-err"),
    "conditions-monitor": genQueryString("conditions-monitor"),
};

/**
 * Function to generate an executable query string for a given device group 
 * @param deviceGroup       a string that represents the device group in the AWS Timestream DB
 * 
 * @returns                 the complete, executable query string 
 */
function genQueryString(deviceGroup) {
    return `${baseQuery} WHERE device_group = \'${deviceGroup}\'`;
}

/**
 * Function to perform an AWS query given a route and query string 
 *  
 * @param route             a string that represents the desired endpoint at which to perform the query 
 * @param queryString       a string that represents the AWS Timestream query to perform 
 * @param res               a response object obtained from the Express.js "get" function signature 
 */
function performQuery(route, queryString, res) {
    let currCall = dateToMilli(new Date());

    // Check to see if enough time has elapsed between requests (or it's the initial request)
    if (numRequests === 0 || currCall - states[route].lastCall > rateLimit) {
        // Retrieve data from Timestream database 
        states[route].data = [];

        // Perform AWS Timestream query
        getAllRows(queryString)
            .then(response => {
                response.Rows.forEach(row => {
                    let currObj = {};
                    row.Data.forEach((data, index) => {
                        currObj[response.ColumnInfo[index].Name] = data.ScalarValue;
                    });
                    states[route].data.push(currObj);
                });
                if (response.NextToken) {
                    getAllRows(query, response.NextToken);
                }

                // Send the data in JSON format and store the current time in seconds of the API call
                res.json(states[route].data);
                states[route].lastCall = currCall;
            })
            .catch(err => {
                console.log(`Error while querying: ${err}`);
            });
    } else {
        // If the user attempts to exceed the API rate limit, just return the previously stored
        //  state insetad of making another API call
        res.json(states[route].data);
    }

    numRequests++;
}

function dateToMilli(date) {
    return date.getHours() * 3600000 + date.getMinutes() * 60000 + date.getSeconds() * 1000 + date.getMilliseconds();
}

// Dynamically add all desired routes and initialize individual states 
for (const [endpoint, queryString] of Object.entries(endpoints)) {
    const currRoute = `${baseRoute}/${endpoint}`; 
    router.get(currRoute, (req, res) => {
        performQuery(currRoute, queryString, res);
    });

    states[currRoute] = {
        lastCall: dateToMilli(new Date()),
        data: [],
    }
}

module.exports = router;
