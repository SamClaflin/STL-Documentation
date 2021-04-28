# Conditions Monitor Installation
## Sam Claflin
### April 26, 2021
<br>

## Prerequisites
1. Ensure that both Node.js and npm are installed on your machine
2. For the backend to make requests, ensure that the AWS-CLI is installed on your machine
<br>

## Instructions
---
1. Clone the enclosing GitHub repository to the desired location on your machine
2. From the command-line, navigate into the `Conditions_Monitor/src` directory
3. Navigate into the `api` directory and type `npm install`
4. Navigate into the client directory and type `npm install`
<br>

## IMPORTANT: AWS-CLI Setup
---
After installing the AWS-CLI on your machine:
1. Create the following file: `Conditions_Monitor/src/api/.env`; this is where the private AWS tokens will be stored (**MAKE SURE TO ADD .env TO ANY .gitignore FILES**) 
2. Within this new `.env` file, copy and paste the following:
	```bash
		AWS_REGION="us-east-1"
		AWS_ACCESS_KEY_ID=""
		AWS_SECRET_ACCESS_KEY=""
	```
3. The `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` fields are specific to the AWS administrator account that has access to the desired database; perform the following steps to obtain them:
	1. Sign into the AWS Management Console and open the IAM console [here](https://console.aws.amazon.com/iam/) 
	2. In the navigation pane, select **Users**
	3. Choose the name of the user whose access keys you want to create, then choose the **Security Credentials** tab
	4. In the **Access Keys** section, choose **Create Access Key**
	5. Download the access key and secret key by selecting **Download .csv File**
		- **IMPORTANT**: You will lose access to both keys after the dialog box closes, so make sure to store them in a secure location. In the event that you lose access to them, you can simply generate new ones.
	6. Copy the `access key ID` and `secret access key` into the corresponding fields in the `.env` file 
4. After completing these steps, the backend should be able to successfully connect to your AWS database
	
<br>

## Running
---
To run either the API or the Client, navigate into its respective directory (AFTER completing and the prerequisites and running `npm install`) and type `npm start`
