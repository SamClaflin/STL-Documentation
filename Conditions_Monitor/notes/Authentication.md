# Authentication
## ADFS
- *ADFS*: Active Directory Federated Services 
- used by UML for authentication 
- federated identity management solution
- provides single sign on (SSO) for web apps
- sends a *claim* to a web app on behalf of Active Directory (AD)
<br>

## AWS Cognito + ADFS
1. Log into AWS and navigate to Cognito
2. Create a new user pool
3. Navigate to `App clients` and create a new app (leave defaults)
4. Store the generated client ID for the newly created application
5. Create a domain prefix
6. Navigate to `App client settings` and change the `Callback URL(s)` and `Sign out URL(s)` to match the chosen redirect URI for the provided login link
7. Navigate to `Identity providers` and select `SAML`
8. Obtain `Identifier URI` by copying the `User Pool ID` and prefixing it with `uml:amazon:cognito:sp:`
9. Obtain logout URI by copying the login URL and replacing `login` with `logout`
<br>

## JSON Web Tokens (JWTs)
- used for **AUTHORIZATION**, NOT **AUTHENTICATION**
	- *authentication*: validating a user's identity
	- *authorization*: allowing a user to access certain features given that they've been *authenticated*
- authorization is typically implemented using *sessions*
	- a *session ID* is sent to the server using cookies 
	- this session ID indicates that the user is in fact the one that was previously authenticated
- JWT is an alternative approach to sessions that does not *necessarily* require browser cookies to function
- sessions vs JWTs:
	- initial step is the same (client sends a POST request to the server with credentials to get authenticated)
	- in session-based implementations, the server would store the authenticated user's new session in server memory and respond with that session's ID in the form of a cookie
	- in JWT-base implementations, the browser responds with a JWT specific to the authenticated user containing a secret 
	- this key is encoded and serialized with its own secret key so that the server knows it's legitimate
	- **primary difference**: nothing is stored on the server (no information regarding the user)
	- the browser can choose to store the JWT however it wants (ex. cookie storage, in which case, it would work very similarly to sessions)
	- whenever the client sends a request to the server, it includes the JWT that it received from the server
	- despite the fact that the server is storing nothing in memory, it's able to validate the JWT due to the fact that it signed it with its own secret
- one of the advantages of JWTs is that, since the server doesn't store any information about them in memory (and, therefore, never needs to perform any look-ups when clients make requests), the same JWT can be used across multiple servers with no issue
- this poses a serious problem for session-based authorization methods since only one server contains information regarding the existence of a session
- JWT construction:
	- contains 3 distinct parts:	
		1. **Header**: the information regarding the algorithm that will be used to encode/decode the JWT
		2. **Payload**: all the information that's being stored in the token
		3. **Verify Signature**: allows the server to verify that the token hasn't been tampered with since its initial distribution 
	- encoding:
		- long, alphanumeric string split into 3 distinct parts (1 for each distinct part of the JWT)
		- each part is separated by a period 
		- the header is encoded as the first part of the string simply as base-64