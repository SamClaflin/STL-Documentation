# Conditions Monitor Authentication
## Sam Claflin
### April 30, 2021
<br>

## Objective
Despite the fact that the API has built-in rate limiting that prevents users from making an excessive number of requests, the safety and security of the Conditions Monitor application would be made significantly more robust if a user authentication and user authorization system were implemented. It goes without saying that this is easier said than done, but AWS claims to provide services for doing exactly this type of thing. Ideally, the application's index route ("/") would immediately direct any non-authenticated user to a native UML login screen (this would be the only way to access the web app). Building a login system from scratch would likely be impractical for this application considering the large amount of overhead (and the need for a user database).
<br>

## AWS Cognito 
AWS provides a service known as "Cognito" (detailed [here](https://aws.amazon.com/cognito/)). Cognito is essentially a one-stop-shop for all major login service integrations (i.e. login with Google, login with Facebook, etc.). The login system used by UML is known as "ADFS", or Active Directory Federated Services. While not as trivial to integrate into a web application as Google or Facebook's login system, Cognito still claims to provide fairly extensive support for it. Thankfully, detailed instructions for setting up this integration can be found [here](https://aws.amazon.com/blogs/mobile/building-adfs-federation-for-your-web-app-using-amazon-cognito-user-pools/). 
<br>

## Additional Resources
All notes I took regarding the functionality of authentication/authorization systems can be found at `Conditions_Monitor/notes/Authentication.md`.
