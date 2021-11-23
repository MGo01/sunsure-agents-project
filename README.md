# Sunsure Agents Web Application

## Overview
This is a web application for general purposes to be used by Sunsure agents to add, edit, delete, and search for client information. It primarily
serves to provide agents with the ability to insert, update and search for policyholders. In addition to this, agents are able to insert
dependent and policy information without having to worry about placing it elsewhere. Agents should expect regular bug fixes and releases
to help improve the overall user interface and experience. 

## Get Started

In order to get started, you will need the following,

- A valid Sunsure email
- An internet browser application such as 
  - Opera
  - Safari
  - Internet Explorer
  - Microsoft Edge
  - Google Chrome
  - Mozilla Firefox
 
 *Please note that the browsers that are best suited for an optimal user experience are Google Chrome, Microsoft Edge, Safari, and Mozilla Firefox.*

### Signing Up

1. Navigate to the [Sunsure Agents website](https://sunsure-agent.com/)
   - Once you have clicked on the link you should see a page that appears like the image below:

![Example of the Login Page Part 1](/media/img/tutorial/sunsure_login_part1.PNG?raw=true "Landing Page")


In order to sign up, you must navigate to the registration page by clicking on [Create New Account](https://sunsure-agent.com/register.html)

You should see a page that is similar to the image below:

![Example of the Registration Page Part 1](/media/img/tutorial/sunsure_signup_part1.PNG?raw=true "Registration Page Part 1")

From here you should be able to type in your personal details and then click on "Register" in order to complete signing up like so:

![Example of the Registration Page Part 2](/media/img/tutorial/sunsure_signup_part2.PNG?raw=true "Registration Page Part 2")

Once you have successfully signed up for your account, you should check your email for a verification email. 

### Verification

If the sign up was successful you will see an email from an account named, "SA-bot-2021" with the following content:

![Example of Verification Email](/media/img/tutorial/sunsure_verify_email_example.PNG?raw=true "Verification Email Example")

Make sure to follow the instructions provided in the email by copy and pasting the confirmation code into the verification form like so:

![Example of Verification Page Part 1](/media/img/tutorial/sunsure_verification.PNG?raw=true "Verification Page Part 1")

Please note that it is normal for the code to default to a series of dots, this is done to provide additional security for the website.

![Example of Verification Page Part 2](/media/img/tutorial/sunsure_verification_part2.PNG?raw=true "Verification Page Part 2")

Once you click on "Confirm" you should see a message pop up with the following, "Successfully verified User". After this you can click on "Return to Login" to be brought back to the login page.

### Logging in

Once you have sucessfully signed up for your account and verified your email address, you can now login into the page
by navigating to the [Login Page](https://sunsure-agent.com/) of the website and entering your newly created credentials.

![Example of Login Page Part 2](/media/img/tutorial/sunsure_login_part2.PNG?raw=true "Login Page Part 2")

### Resetting Your Password

In the case that something went wrong when typing in your password in the sign up form, you can always reset your password by doing the following steps:

1. Navigate to the [Login Page](https://sunsure-agent.com/) of the website and click on "Forgot Password?"

![Example of Login Page Part 3](/media/img/tutorial/sunsure_login_part3.png?raw=true "Reset Password Part 1")

2. Type in your email for the account you're trying to access

![Example of Reset Form Part 1](/media/img/tutorial/sunsure_reset_pw_form.PNG?raw=true "Reset Password Part 2")

![Example of Reset Form Part 2](/media/img/tutorial/sunsure_reset_pw_form_part2.PNG?raw=true "Reset Password Part 3")

3. Once a notifcation pops up saying the following, "Successfully sent email to: example@gmail.com", go to your email inbox and look for an email from
   an account named "SA-bot-2021". The email should be titled "Sunsure Agent Reset Password" and its contents should like the image below:
   
![Example of Reset Form Part 3](/media/img/tutorial/sunsure_password_email.PNG?raw=true "Reset Password Part 3")

![Example of Reset Form Part 4](/media/img/tutorial/sunsure_reset_pw.PNG?raw=true "Reset Password Part 4")

## Application Features

The Sunsure Agents web application currently has three primary functions which include the following:
  - Inserting Policyholder Information
  - Updating Policyholder Information
  - Searching Policyholder Information

![Example of Landing Page](/media/img/tutorial/sunsure_landing.PNG?raw=true "Landing Page")

### Inserting Policyholder Information

Inserting policyholder information can easily be done by clicking on the "Add Client" button in the top right corner of the web page. Once clicked a form will pop up on the user's screen, here the user can enter information and choose between clearing the whole form or adding the client. Be sure to double check information before clicking on "Create Client"!

![Example of Create Client](/media/img/tutorial/sunsure_add_client_form.PNG?raw=true "Create Client")

### Updating Policyholder Information

In the case that a user didn't enter the correct policyholder information for one of their clients they can easily update this information by searching for the policyholder in the table and then clicking on "Update" under the actions column of the policyholder table for the client row they would like to update.

Here the user will be greeted with yet another form that will contain the corresponding information for the client row that was selected.

The user should also be aware that updating the dependent information for a client will depend on three cases.

- Case 1: The Dependent Information needs to be cleared
  - If the user would like to clear the pre-existing dependent information for a client they can enter a *0* for the Number of Dependents field.
- Case 2: The Dependent Information needs to be updated
  - If the user would like to update their client's dependent information they can enter a new number for the Number of Depedents field and enter dependent data as normal. As a slight warning, the user should have the old dependent information on hand or saved elsewhere as entering a value will clear the old dependent information and replace it with whatever the user has entered in the dependent information forms.
 - Case 3: The Dependent Information needs to be left unchanged
  - If the user would like to ensure that the client's dependent information is not altered when updating the client, all the user needs to do is leave the Number of Dependents field *emtpy*. By default, the update form will leave the Number of Dependents field empty so the user does not need to clear it every time they update a client.

Please note that a user does *NOT* need to enter all the old information of a client in order to update the client. 

For instance, if a user would only like to update the first and last name of a client then they *only need to enter data into the First Name and Last Name fields* and then click "Update". Upon clicking on update, the update function will take care of handling the data so that only the fields that had data entered into them are updated. 

![Example of Updating Client](/media/img/tutorial/sunsure_update_client.PNG?raw=true "Update Client")

### Searching for a Policyholder

Searching for a Policyholder is very straightforward, all that needs to be done is to type a query into the search bar and the user can either hit the "enter" key on their keyboard or click on the "Search" button.

In addition to this, searching for a policyholder based on *only* the following fields is supported:
  - First Name
  - Last Name
  - Email
  - Phone Number

Additional fields may be supported in future releases/updates.

Please note that the search query will perform a partial search, meaning that if one types in "Mar" into the search bar then the search function will look for any policyholder with "Mar" in their first name, last name, or email. 

![Example of Searching Client](/media/img/tutorial/sunsure_search_pt1.PNG?raw=true "Search Client Part 1")

![Example of Searching Client](/media/img/tutorial/sunsure_search_pt2.PNG?raw=true "Search Client Part 2")

# Error Messages

## Create/Update Client Form Errors

| Error Message                                           | Reason for Error                                                                                              |
|:--------------------------------------------------------|:--------------------------------------------------------------------------------------------------------------|
| Data Value Error: Negative values are not allowed       | A negative value was entered into the number of dependents field.                                             |
| Either First Name or Last Name field is empty.          | The user entered either an empty first name or an empty last name.                                            |
| First name/Last name must have alphabet characters only | The user likely entered non-alphabetical characters like numbers, '!", '/', etc.                              |
| Invalid Date: Please choose a date between the years 1900 and 2021 | A date was chosen that was either before the year 1900 or in the future for a date of birth field  | 
| Invalid date: Dates before 1900 are not allowed         | A date was chosen before the year 1900 for an effective date field in the policy information form             | 
| Data Field Missing: Some Field cannot be empty.         | A required field was left empty in the form.                                                                  |
| Primary Policy Holder has already been inserted         | A policyholder with identical information has already been inserted by the user or another user/agent.        |
| Policy Information has already been inserted.           | The entered policy information for the policyholder to be inserted already exists.                            |

## Show Detail Form Errors

| Error Message                                           | Reason for Error                                                                               |
|:--------------------------------------------------------|:-----------------------------------------------------------------------------------------------|
| This policy has no dependents                           | The selected policyholder by the user does not have any corresponding dependent data.          |
| This policy has no policy information.                  | The selected policyholder by the user does not have any corresponding policy information data. |

## Search Errors

| Error Message                              | Reason for Error                                                              |
| -------------------------------------------|-------------------------------------------------------------------------------|
| No valid Primary PolicyHolders were found  | The user has likely entered an query that could not be found in the database. Queries such as "*John* *Doe*" should be split                                                  into a separate search for John or Doe but not both.                           |


## Signup Errors

| Error Message                                           | Reason for Error                                                                                                |
|:--------------------------------------------------------|:----------------------------------------------------------------------------------------------------------------|
| Full name is required!                                  | The combined character length of both the first name and last name is less than one character.                  |
| Please enter a valid full name!                         | Either the first name or last name contains some non alphabetical characters.                                   |
| First/Last Name should not exceed 45 characters!        | The user likely entered a name that contains more than 100 characters.                                          |
| Password is required!                                   | Password was left empty in the Password field.                                                                  | 
| Your password must be at least 8 characters long        | For securiy reasons, passwords are required to be longer than 8 characters, so the user password is too short.  |
| Email is required!                                      | Email was left empty in the Email field.                                                                        |
| Email is too long!                                      | Email is likely longer than 50 characters long.                                                                 |

## Verification/Reset Password Errors

| Error Message                     | Reason for Error                                                                                                                   |
| ----------------------------------|------------------------------------------------------------------------------------------------------------------------------------| 
| Reset key is not correct.         | Password confirmation code is likely no longer valid. User likely needs to resend an email to their corresponding email account    |
| Email not found                   | User has entered an email that has not yet been registered with the application.                                                   |
| Confirmation code may be invalid  | Confirmation code may not have been generated properly. User likely needs to resend an email to their corresponding email account  |

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
