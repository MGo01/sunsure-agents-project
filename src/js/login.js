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
          var jsonObj = JSON.parse(request.responseText);

          if (jsonObj.Users === 0)
          {
            var error = jsonObj.error;
            document.getElementById("logstatus").innerHTML = error;
          }

          else
          {
            userID = jsonObj.User_level;
            FirstName = jsonObj.FirstName;
            FirstName = jsonObj.LastName;
            Email = jsonObj.Email;

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

function logout()
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
	document.cookie = "ID=" + userID + ";expires=" + date.toGMTString();
	document.cookie = "FirstName=" + FirstName + ";expires=" + date.toGMTString();
	document.cookie = "LastName=" + LastName + ";expires=" + date.toGMTString();
	document.cookie = "Email=" + Email + ";expires=" + date.toGMTString();
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

function readCookie()
{
	var data = document.cookie;
	var splits = data.split(";");
	
  for(var i = 0; i < splits.length; i++)
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");

		if (tokens[0] == "customer_id")
		{
			customer_id = parseInt( tokens[1].trim() );
		}
	}

	if( customer_id < 0 )
	{
		window.location.href = "../index.html";
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
  var email = document.getElementById("emailcodeRes").value;

  document.getElementById("emailcodeRes").innerHTML = "";

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
          document.getElementById("resCodeStatus").innerHTML = successMessage; 
        }

        else if (endpointmsg !== "Email sent")
        {
          document.getElementById("resCodeStatus").innerHTML = "Email not found"; 
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
    document.getElementById("resCodeStatus").innerHTML = error.message;
    document.getElementById("resCodeStatus").style.color = "red";
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