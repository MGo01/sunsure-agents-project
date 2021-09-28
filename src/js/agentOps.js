// Creates a client for a specific user and stores it
// accordingly in the database.
function createPolicyHolder()
{
	console.log("TESTING!");

	let clientFirstName = document.getElementById("clientFirstName").value;
	let clientLastName = document.getElementById("clientLastName").value;

	let clientDateOfBirth = document.getElementById("contactEmail").value;
	let clientSSN = document.getElementById("clientSSN").value;

	let clientPhone = document.getElementById("clientPhone").value;
	let clientAddress = document.getElementById("clientAddress").value;

	let clientSecondLineAddress = document.getElementById("clientSecondLineAddress").value;

	let clientCity = document.getElementById("clientCity").value;
	let clientAddress = document.getElementById("clientAddress").value;

	let clientZIP = document.getElementById("clientZIP").value;
	// let clientState = document.getElementById("statesMenu").value;

	let clientEmail = document.getElementById("clientEmail").value;
	let clientNumOfDependents = document.getElementById("clientNumOfDependents").value;

	let clientNumOfLives = document.getElementById("clientNumOfLives").value;
	// let clientSource = document.getElementById("sourceMenu").value;

	// // Remove any special characters in order to ensure all
	// // numbers are a 10 digit string.
	// clientPhone = clientPhone.replace(/[^\w\s]/gi, '');

	// // This helps to ensure that none of the form
	// // inputs are left blank and only have alphabetical characters.
	// if (!checkFormNames(clientFirstName, clientLastName))
	// 	return;

	// document.getElementById("createClientResult").innerHTML = "";

	// // Package a JSON payload to deliver to the server that contains all
	// // the contact details in order create the contact.
  // var jsonPayload =
  // 	'{"AgentID" : "' + userID + '", "FirstName" : "' + clientFirstName + '", "LastName" : "' + clientLastName + '", "DateOfBirth" : "' + clientDateOfBirth + '", "SSN" : "' + clientSSN + '", "Phone" : "' + clientPhone + '", "Address" : "' + clientAddress + '", "Second_Line_Address" : "' + clientSecondLineAddress + '", "City" : "' + clientCity + '", "ZipCode" : "' + clientZIP + '", "State" : "' + clientState + '", "Email" : "' + clientEmail + '", "NumOfLives" : "' + clientNumOfLives + '", "NumOfDependents" : "' + clientNumOfDependents + '", "PolicyInfoID" : "' + userID + '",  "Source" : "' + clientSource + '"}';
	// var url = urlBase + '/createPolicyHolder.' + extension;
	// var xhr = new XMLHttpRequest();

	// xhr.open("POST", url, true);
	// xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	// // Basic try and catch to ensure that any server code errors are
	// // handled properly.
	// try
	// {
	// 	xhr.send(jsonPayload);
	// }
	// catch(err)
	// {
	// 	document.getElementById("createClientResult").innerHTML = err.message;
	// }
}