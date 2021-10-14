var userID = -1;
var FirstName = '';
var LastName = '';
var Email = '';

function login()
{   
  "use strict";

	var loginEmail = document.getElementById("email").value;
	var password = document.getElementById("password").value;

	document.getElementById("logstatus").innerHTML = "";

	if (checkEmaillog(loginEmail) && checkPasswordlog(password))
  {
		var loginPassword = md5(password);
		
		var jsonPayload = '{"Email" : "' + loginEmail + '", "Password" : "' + loginPassword + '"}';

    var request = new XMLHttpRequest();
    request.open("POST", "http://sunsure-agent.com/API/login.php", true);
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

          if (endpointmsg === "Email or password is incorrect")
          {
            var error = endpointmsg;
            document.getElementById("logstatus").innerHTML = error;
            document.getElementById("logstatus").style.color = "red";
          }

          else
          {
            userID = jsonObject.ID;
            FirstName = jsonObject.FirstName;
            LastName = jsonObject.LastName;
            Email = jsonObject.Email;

            saveCookie();
            window.location.href = "landing.html";
          }
        }
      };

      request.send(jsonPayload);
    }

    catch(err)
    {
      document.getElementById("logstatus").innerHTML = err.message;
    }

    localStorage.setItem("loggedIn", "true");
	}
}

function doLogout()
{
	userID = -1;
	FirstName = "";
  LastName = "";
  Email = "";
	deleteAllCookies();
	localStorage.clear();
	window.location.href = "index.html";
}

function saveCookie()
{
	var minutes = 40;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "FirstName=" + FirstName + ",LastName=" + LastName + ",userID=" + userID + ",expires=" + date.toGMTString();
}

function deleteAllCookies() 
{
	var cookies = document.cookie.split(";");

	for (var i = 0; i < cookies.length; i++) 
  {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
	}
}

// Provides a means to save data to display
// the user's first name in the landing page.
function readCookie()
{
	userID = -1;
	var data = document.cookie;
	var splits = data.split(",");

  for (var i = 0; i < splits.length; i++)
	{
		var thisOne = splits[i].trim();
    var tokens = thisOne.split("=");

		if (tokens[0] == "FirstName")
		{
			FirstName = tokens[1];
		}

    else if (tokens[0] == "LastName")
		{
			LastName = tokens[1];
		}

		else if (tokens[0] == "userID")
		{
			userID = parseInt( tokens[1].trim() );
		}

    else if (tokens[0] == "Email")
    {
      Email = tokens[1];
    }
	}

	if (userID < 0)
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Welcome " + FirstName + " " + LastName;
	}
}

function checkEmaillog(email)
{
  "use strict";
  var emailREGEX = /^[^\s@]+@[^\s@\d]+\.[^\s@\d]+$/;
  
  if (email.length > 50)
  {
      document.getElementById("logstatus").innerHTML = "Email is too long!<br>Email should not exceed 45 characters!";
      document.getElementById("logstatus").style.color = "red";
      return false;
  }

  if (email.length === 0)
  {
      document.getElementById("logstatus").innerHTML = "Email is required!";
      document.getElementById("logstatus").style.color = "red";
      return false;
  }

  if (!emailREGEX.test(email))
  {
      document.getElementById("logstatus").innerHTML = "Please enter your email address in format:<br>mail@example.com";
      document.getElementById("logstatus").style.color = "red";
      return false;
  }

  return true;
}


function checkPasswordlog(password)
{
  "use strict";

  if (password.length === 0) 
  {
    document.getElementById("logstatus").innerHTML = "Password is required!";
    document.getElementById("logstatus").style.color = "red";
    return true;
  }

  if (password.length < 5)
  {
    document.getElementById("logstatus").innerHTML = "Your password must be at least 5 characters long, should not exceed 45 characters!";
    document.getElementById("logstatus").style.color = "red";
    return true;
  }

  return true;
}

function sendResetCode()
{
  var email = document.getElementById("resetEmail").value;

  document.getElementById("resetResult").innerHTML = "";

  var json = '{"Email" : "' + email + '"}';
  var successMessage = "Successfully sent email: " + email;
  
  var request = new XMLHttpRequest();
  request.open("POST", "http://sunsure-agent.com/API/sendResetMail.php", true);

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

        if (endpointmsg === "Email sent")
        {
          document.getElementById("resetResult").innerHTML = successMessage; 
        }

        else if (endpointmsg !== "Email sent")
        {
          document.getElementById("resetResult").innerHTML = "Email not found"; 
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
    document.getElementById("resetResult").innerHTML = error.message;
    document.getElementById("resetResult").style.color = "red";
  }
}

function resetPassword()
{
  var resetCode = document.getElementById("resPassCode").value;
  var newPassword = document.getElementById("resNewPass").value;
  var confirmNewPassword = document.getElementById("ConfirmResNewPass").value;
  
  if (checkNewPassword(confirmNewPassword, newPassword))
  {
    document.getElementById("emailcodeRes").innerHTML = "";

    var hashedNewPassword = md5(newPassword);

    var json = '{"resetToken" : "' + resetCode + '", "newPassword" : "' + hashedNewPassword + '"}';
    var successMessage = "Successfully reset password";
    
    var request = new XMLHttpRequest();
    request.open("POST", "http://sunsure-agent.com/API/reset_pass.php", true);

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

          if (endpointmsg === "Password has been reset")
          {
            document.getElementById("resPassStatus").innerHTML = successMessage; 
          }

          else if (endpointmsg !== "Password has been reset")
          {
            document.getElementById("resPassStatus").innerHTML = "Token may have expired"; 
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
      document.getElementById("resPassStatus").innerHTML = error.message;
      document.getElementById("resPassStatus").style.color = "red";
    }
  }

  else
  {
    ;
  }
}

function confirmCode()
{
  var emailCode = document.getElementById("confCode").value;
  document.getElementById("confCode").innerHTML = "";

  var json = '{"emailToken" : "' + emailCode + '"}';
  var successMessage = "Successfully verified User" ;
  
  var request = new XMLHttpRequest();

  request.open("POST", "http://sunsure-agent.com/API/confirmEmail.php", true);
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

          if (endpointmsg === "User has been verified")
          {
              document.getElementById("confStatus").innerHTML = successMessage; 
          }

          else if (endpointmsg !== "User has not been verified")
          {
              document.getElementById("confStatus").innerHTML = "Token may have expired"; 
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

// Nifty function that allows for the 'show password'
// button to function by changing the document element type.
function showLoginPassword() 
{
  var x = document.getElementById("password");

  if (x.type === "password") 
    x.type = "text";
  else 
    x.type = "password";
}