# Conditions Monitor Implementation
## Sam Claflin
### April 26, 2021
<br>

## Client
### Foundation
The foundation of the client was created using a popular, Facebook-maintained npm package called `create-react-app`. This package automatically generates a new React.js project with a given name; this is important because there's a large quantity of Webpack boiler plate and other dependency management problems that would be a nightmare to handle independently every time.  

### Component Layout 
As mentioned in the Architecture page of the documentation, the client only contains a single HTML file (`index.html`, located in `client/public`) since React.js is responsible for rendering all of the JavaScript components and inserting them into the route of this document. Currently, the main page consists of 3 primary components: `Nav`, `Body`, and `Footer`. Within the `Body` component, there are two sub components: `BodyMenu` and `BodyContent`. The former encapsulates the link menu on the left side of the page while the latter encapsulates the larger portion of the body (the heading and the graph). Finally, `BodyContent` contains the `Graph` sub component. This may seem like a lot, but each component is simply a method of further breaking up the HTML of the document into small, logical units that are much easier to understand, maintain, and extend (even if you aren't too familiar with React).

### Creating New Components
Creating new components is thankfully a simple task. Create a new JavaScript file in the `client/src/Components` directory and copy and paste the following:
```javascript
// MyComponentName.js

import { Component } from "react";

export default class MyComponentName {
	constructor(props) {
		super(props);
		this.state = { };
	} 
	
	render() {
		return (
			<div></div>
		);
	}
}
```
You can find the documentation for React.js [here](https://reactjs.org/docs/getting-started.html); I refrained from using any advanced features in order to keep the project as simple as possible, so only introductory knowledge should be required. 

**IMPORTANT**: each time you make a new component, remember to actually render it inside of the desired parent component. If the component is top-level, it should be rendered inside of the `App` component:

```JavaScript
// App.js

import Nav from "./Components/Nav";
import Body from "./Components/Body";
import Footer from "./Components/Footer";
import MyComponentName from "./Components/MyComponentName"; // <- Your component (assuming the file is named MyComponentName.js)

function App() {
  return (
    <div className="App">
      <Nav />
      <Body />
      <Footer />
	  <MyComponentName /> 
    </div>
  );
}

export default App;
```
The inclusion of components in other, non top-level files is identical (see `Body.js` for a few examples).

**IMPORTANT**: Components will be rendered on the page *in the order that they're listed* in the body of another component (in the `App` component from the example above, the HTML will be sorted from `Nav` -> `MyComponentName`).

### Styling Components
Currently, all styling within the client is done in vanilla CSS to continue the mantra of "keeping it simple". If you're familiar with CSS as it's typically applied to standard HTML, you'll have no problem understanding the pre-existing CSS or writing custom 
CSS. However, given that this is a React.js application, there are two essential differences that must be considered:
1. The HTML-like language defined in React components (JSX) expects the classes of tags to be specified with the `className` keyword instead of the `class` keyword:
	```html
	<div className="my-class"></div> <!-- Correct -->
	<div class="my-class"></div> <!-- Incorrect -->
	```
	<br>
	
2. CSS files are typically created for each individual component (although they don't have to be) and any component containing HTML elements that are styled by a particular CSS file **MUST IMPORT THAT CSS FILE** at the top of the module:
	```javascript
	// MyComponentName.js
	
	import { Component } from "react";
	import "../Styles/MyComponentName.css"; // <- THIS IS REQUIRED
	
	...
	```
	**IMPORTANT**: with the (bizarre) way that JavaScript imports work, you don't need to specify the file extension when importing a JavaScript (`.js`) file, but you **must** with all non-JS files (hence the `.css` file extension in the example above).

### API Calls
At the heart of the client-side of the Conditions Monitor is its ability to communicate with the API. Currently, API calls are only explicitly made by the `Graph` component (see `Graph::getTemperatureData` in `Graph.js`).  Upon reviewing this method, you'll notice that the `Axios` library is being used to execute a simple `GET` request to the API. The interesting portion here is the exact URL that the request is being sent to `http://localhost:5000/api/v1/resources/${endpoint}`. Considering the fact that the Conditions Monitor app is not yet hosted, all testing was done by running both the client and API on `localhost`, which is reflected in this URL.

**IMPORTANT**: the *initial* portion of this URL will need to be changed once the application is hosted. For example, if the URL for the API is `https://heroku-stl-api.com`, this will need to be reflected in the client by replacing the current URL with `https://heroku-stl-api.com/api/v1/resources/${endpoint}`.

After a response has been received from the API, this response is stored in the `state` of the application (a React concept) so that the `Graph` component can be constantly populated with data without having to make tons of API requests. 

Finally, the question remains: "When are API calls actually made?" One of the biggest considerations when designing and building this application was limiting the overall number of API calls made in order to minimize AWS costs incrued from querying the database. Therefore, there are only two scenarios in which API calls are invoked:
1. Upon initial page load (reflected in the `ComponentDidMount` method within the `Graph` component). Don't worry, rapidly refreshing the page *will* result in calls being continuously made, but the API has a built-in rate limiting feature that prevents rapid calls from actually invoking database queries (this will be further detailed in the API section of this document).
2. Whenever any of the links on the left side of the page are clicked by the user (even the link corresponding with the currently selected device group). Just like with rapidly refreshing the page, rapidly clicking these links will invoke API calls, but these calls will be rendered useless by the rate limiting feature of the API.

### Graph Rendering
Rendering/animating the graph is done entirely with a small, React-based library called Recharts. All methods pertaining to parsing data received from the API and storing this data in the graph are defined in the `Graph` component. The sequence of operations for populating the graph is as follows (**occurs every time the `Graph` component is rendered**):
1. Parse the data stored in the `Graph` component state (`Graph::parseTemperatureData`)
2. Use the parsed data returned from the previous step to generate each renderable dataset (`Graph::generateLines`); this returns an array of `Line` components (defined in Recharts library) that can be directly rendered within the `LineChart` component
3. Render the generated `Line` components

### Adding Device Groups
It goes without saying that the given device groups that the user is able to select from will be a constantly changing entity– this totally depends on the needs and wants of STL! Knowing this, the Client, API, and communication between the two was designed to be as simple and error-resistant as possible when extending them. The process for adding a new device group that can be queried is as follows:
1. Navigate to the `client/src/Components/Graph.js` file
2. In the `constructor` of this component, locate definition the `endpoints` member variable (a JavaScript object that represents a standard hashmap)
3. Add a new entry into the `endpoints` object in the following format: 
	```javascript
	// client/src/Components/Graph.js
	
	this.endpoints = {
		// pre-existing endpoints
		
		"Your Endpoint Display Name": "your-endpoint-url-format",
	}; 
	```
	**IMPORTANT**: The "key" portion of this entry (`"Your Endpoint Display Name"`) represents the text that will actually be displayed on the left side of the webpage and can, therefore, be whatever you want it to be. However, the "value" portion of this entry (`"your-endpoint-url-format"`) represents the string that will be inserted into the URL at which the API request will be made. For example, the URL derived from this entry will appear in the following way:
	`http://localhost:5000/api/v1/resources/your-endpoint-url-format`
	Predictably, this means that the API will also need to be updated to support this newly added endpoint (detailed in the following steps).
4. Navigate to the `api/routes.js` file
5. In the global constant `endpoints` object (near the top of the file), add a new entry in the following format:
	```javascript
	// api/routes.js
	
	const endpoints = {
		// pre-existing endpoints
		
		"your-endpoint-url-format": genQueryString("your-endpoint-url-format"),
	};
	```
	**IMPORTANT**: the "key" portion of this entry (`"your-endpoint-url-format"`) represents the *exact* URL endpoint at which requests will be made while the "value" portion of this entry represents the *string that will be used to query the AWS database* (SQL-type query). As a result, you **must** ensure the following when adding endpoints:
	1. The "key" portion in the `api::endpoints` object **must** match the corresponding "value" portion in the `Graph::endpoints` object (this is because both of these values represent the *exact* endpoint at which requests will be made).	
	2. The "value" portion in the `api::endpoints` object **must** represent the *exact* string that will be used to query the AWS database that corresponds with *that endpoint's device group*. To make this easy, the `api::genQueryString` function can be used to construct a properly formatted query string using a given device group. This also implies that the string provided to this function **directly represents one of the device groups present in the AWS database**.
	

### Complete Example
Assuming that the target device group (as it appears in the database) is `"your-device-group"`:
		
```javascript
// client/src/Components/Graph.js

this.endpoints = {
	// pre-existing endpoints
	"Your Device Group": "your-device-group",
};	
```

```javascript
// api/routes.js

const endpoints = {
	// pre-existing endpoints
	"your-device-group": genQueryString("your-device-group");
};
```
		
<br>

## API