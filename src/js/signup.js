function checkConfirmPassword(confirmPassword, password)
{
  if (confirmPassword !== password)
  {
    document.getElementById("registerStatus").innerHTML = "Passwords entered do not match!";
    document.getElementById("registerStatus").style.color = "red";
    return false;
  }

  return true;
}

function checkFullName(name)
{
  "use strict";
  let nameREGEX = /([A-Za-z]{2,} )([A-Za-z]{2,} )?([A-Za-z]{2,})/;
  let maxNameLength = 99;
    
  if (name.length < 1)
  {
    document.getElementById("registerStatus").innerHTML = "Full name is required!";
    document.getElementById("registerStatus").style.color = "red";
    
    return false;
  }

  if (!nameREGEX.test(name))
  {
    document.getElementById("registerStatus").innerHTML = "Please enter a valid full name!";
    document.getElementById("registerStatus").style.color = "red";
    
    return false;
  }

  if (name.length > maxNameLength)
  {
    document.getElementById("registerStatus").innerHTML = "First Name should not exceed 45 characters!";
    document.getElementById("registerStatus").style.color = "red";
    
    return false;
  }

  return true;
}

function checkPassword(password)
{
  "use strict";
  let minPasswordLength = 8;
  
  if (password.length === 0) 
  {
    document.getElementById("registerStatus").innerHTML = "Password is required!";
    document.getElementById("registerStatus").style.color = "red";

    return false;
  }

  if (password.length < minPasswordLength)
  {
    document.getElementById("registerStatus").innerHTML = "Your password must be at least 8 characters long, should not exceed 75 characters!";
    document.getElementById("registerStatus").style.color = "red";

    return false;
  }

  return true;
}

function checkEmail(email)
{
  "use strict";
  let emailREGEX = /^[^\s@]+@[^\s@\d]+\.[^\s@\d]+$/;
  let maxEmailLength= 49;

  if (email.length === 0)
  {
    document.getElementById("registerStatus").innerHTML = "Email is required!";
    document.getElementById("registerStatus").style.color = "red";

    return false;
  }

  if (email.length > maxEmailLength)
  {
    document.getElementById("registerStatus").innerHTML = "Email is too long!<br>Email should not exceed 49 characters!";
    document.getElementById("registerStatus").style.color = "red";
    
    return false;
  }

  if (!emailREGEX.test(email))
  {
    document.getElementById("registerStatus").innerHTML = "Please enter your email address in the following format:<br>mail@example.com";
    document.getElementById("registerStatus").style.color = "red";

    return false;
  }

  return true;
}

// Nifty function that allows for the 'show password'
// button to function by changing the document element type.
function showRegistrationPassword() 
{
  var x = document.getElementById("registerPassword");
  var y = document.getElementById("registerConfirmPassword");

  if (x.type === "password" && y.type === "password")
  {
    x.type = "text";
    y.type = "text";
  } 

  else 
  {
    x.type = "password";
    y.type = "password";
  }
}

function validateInput(fullName, email, password, confirmPassword)
{
    "use strict";

    if (!checkFullName(fullName)) 
      return false;
    if (!checkEmail(email)) 
      return false;
    if (!checkPassword(password)) 
      return false;
    if (!checkConfirmPassword(confirmPassword, password)) 
      return false;
       
    return true;
}

function signup()
{
  "use strict";
  
  var email = document.getElementById("registerEmail").value;
  var firstName = document.getElementById("firstName").value;
  var lastName = document.getElementById("lastName").value;
  var password = document.getElementById("registerPassword").value;
  var confirmPassword = document.getElementById("registerConfirmPassword").value;

  var fullName = firstName.concat(" ", lastName);

  document.getElementById("firstName").innerHTML = "";
  document.getElementById("lastName").innerHTML = "";
  document.getElementById("registerPassword").innerHTML = "";
  document.getElementById("registerConfirmPassword").innerHTML = "";
  document.getElementById("registerEmail").innerHTML = "";

  document.getElementById("firstName").value = "";
  document.getElementById("lastName").value = "";
  document.getElementById("registerPassword").value = "";
  document.getElementById("registerConfirmPassword").value = "";
  document.getElementById("registerEmail").value = "";

  if (validateInput(fullName, email, password, confirmPassword))
  {
    var hashedPassword = md5(password);
    var json = '{"FirstName" : "' + firstName + '", "LastName" : "' + lastName + '", "Email" : "' + email + '", "Password" : "' + hashedPassword + '"}';
    
    var request = new XMLHttpRequest();

    request.open("POST", "http://sunsure-agent.com/API/signup.php", true);
    request.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try 
    {
      request.onreadystatechange = function()
      {
        if (this.readyState == 4 && this.status == 200)
        {    
          var jsonObject = JSON.parse(request.responseText);
          var endpointmsg = jsonObject['msg'];
          console.log(endpointmsg);

          if (endpointmsg === "Agent has been inserted successfully!")
          {
            document.getElementById("registerStatus").innerHTML = "Succesfully Signed Up!";
            document.getElementById("registerStatus").style.color = "green";

            document.getElementById("firstName").value = "";
            document.getElementById("lastName").value = "";
            document.getElementById("registerPassword").value = "";
            document.getElementById("registerConfirmPassword").value = "";
            document.getElementById("registerEmail").value = "";

          }

          if (endpointmsg !== "Agent has been inserted successfully!")
          {
            document.getElementById("registerStatus").innerHTML = "Email already used";
            document.getElementById("registerStatus").style.color = "red"; 
          }
        }
      };

      request.responseType="text";
      console.log(json);
      request.send(json);
      //window.location.href = "login.html";
    }

    catch(error)
    {
      document.getElementById("registerStatus").innerHTML = error.message;
      document.getElementById("registerStatus").style.color = "red";
    }
  }
}