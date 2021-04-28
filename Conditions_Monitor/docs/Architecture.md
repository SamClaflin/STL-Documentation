# Conditions Monitor Architecture
## Sam Claflin
### April 26, 2021
<br>

## Languages/Frameworks
The Conditions Monitor application uses a simple but modern technology stack to perform all tasks. For simplicity, I'll categorize these technologies by "Frontend" and "Backend".

| Tech | Frontend | Backend |
| --- | --- | --- |
| Language | JavaScript | JavaScript |
| Frameworks/Libraries | React.js (state management, client-side rendering), Recharts (simple graph creation), Axios (REST API requests) ReactSpinners (animated loading spinners) | Express.js (main backend web framework; routing), AWS SDK (allows for AWS database querying), Dotenv (loads values in .env file into environment variables), Helmet (application security) | 
<br>
JavaScript is used on both the frontend and the backend in order to simplify the codebase and allow for easier communication between the two pieces of software (backend JavaScript enabled via Node.js and Express.js)
<br>

## Project Structure
The entire Conditions Monitor project is split into two subapplications: the *Client* (frontend) and the *API* (backend).
<br>
**Client**:
```
client/
|
|___public/
|	|
|	|___index.html
|	|
|	|___manifest.json
|	|
|	|___robots.txt
|	|
|	|___favicon.ico
|
|___src/
|	|
|	|___assets/
|	|	|...
|	|
|	|___Components/
|	|	|...
|	|
|	|___Styles/
|	|	|...
|	|
|	|___App.js
|	|
|	|___index.js
|	|
|	|___index.css
|
|___node_modules/
|	|...
|
|___package.json
|
|___package-lock.json
```
<br>
There's a lot to unpack here, so let's look at it step by step:
<br>

- **public**: Contains basic website essentials. In general, this shouldn't need to be changed.
	- the only HTML file
	- the application icon 
	- specification for PWAs
	<br>
	
- **src**: Contains all the code for the application; this essentially follows the exact standard for React.js application structure.
	- **assets**: Directory containing all images used in the application
	- **Components**: Directory containing all custom React.js components (i.e. Nav Bar, Footer, Graph, Body, etc.)
	- **Styles**: Directory containing all individual CSS files that each correspond to a single component
	- **App.js**: The main JavaScript file that specifies which components will be implemented in the actual application and in what order
	- **index.js**: The JavaScript file that receives the main App component and renders it within the `index.html` file (shouldn't need to be changed)
	- **index.css**: The main CSS file that contains global application styling rules and, more importantly, all CSS variables used throughout the application (these variables can be used in any CSS file without any include statements since the variables are specified in the root of the application; simply call `property: var(--var-name`)
	<br>
	
- **node_modules**: Contains all third-party dependencies for the project (**IMPORTANT**: if creating a new Git repository for this project, remember to add `node_modules/` to the gitignore)
- **package.json**: Contains all information regarding project structure, dependencies, and run scripts (auto-generated)
- **package-lock.json**: Similar to `package.json`, but is specifically intended for locking each project dependency at the version at which it was installed (auto-generated) 
<br>

**API**:

```
api/
|
|___node_modules/
|	|...
|
|___api.js
|
|___routes.js
|
|___query.js
|
|___package.json
|
|___package-lock.json
```
<br>

- **node_modules, package.json, package-lock.json**: Same as client
- **api.js**: The main JavaScript file that's actually executed when running the application (responsible for creating and Express.js instance and running it on a given port) 
- **routes.js**: The JavaScript file responsible for dynamically creating all of the routes at which API requests will be made (each route corresponds with a single device grouping)
- **query.js**: The JavaScript file responsible for connecting to the desired AWS database and performing a query