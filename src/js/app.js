// Anna Malaj, Matthew Gomez
// COP 4331, Spring 2021
// 2/16/2021

// Global variables that allow for easy access
// across the program.
var urlBase = 'http://sunsure-agent.com/API';
var extension = 'php';

// These variables are especially useful in order
// to perform CRUD operations
// var userId = 0;
// var firstName = "";
// var lastName = "";
// var updateFlag = false;

// JQuery function inspired and modified by https://www.youtube.com/watch?v=DzXmAKdEYIs
// to allow for easier row insertion into the UI data table.
function addRow(obj)
{
	// Check for any empty fields in the Policyholder
	// object and replace it with "N/A"
	for (var key in obj)
		if (obj[key] === "")
			obj[key] = "N/A";

	var row = `<tr scope="row" class="test-row-${obj.PolicyID}">
								<td id="PolicyID-${obj.PolicyID}" class="d-none" data-testid="${obj.PolicyID}">${obj.PolicyID}</td>
								<td id="firstName-${obj.PolicyID}" data-testid="${obj.PolicyID}">${obj.FirstName}</td>
								<td id="lastName-${obj.PolicyID}" data-testid="${obj.PolicyID}">${obj.LastName}</td>
								<td id="email-${obj.PolicyID}" data-testid="${obj.PolicyID}">${obj.DateOfBirth}</td>

								<td id="SSN-${obj.PolicyID}" data-testid="${obj.PolicyID}">${obj.SSN}</td>
								<td id="Phone-${obj.PolicyID}" data-testid="${obj.PolicyID}">${obj.Phone}</td>
								<td id="Address-${obj.PolicyID}" data-testid="${obj.PolicyID}">${obj.Address}</td>
								<td id="Second_Line_Address-${obj.PolicyID}" data-testid="${obj.PolicyID}">${obj.Second_Line_Address}</td>

								<td id="City-${obj.PolicyID}" data-testid="${obj.PolicyID}">${obj.City}</td>
								<td id="ZipCode-${obj.PolicyID}" data-testid="${obj.PolicyID}">${obj.ZipCode}</td>
								<td id="State-${obj.PolicyID}" data-testid="${obj.PolicyID}">${obj.State}</td>
								<td id="Email-${obj.PolicyID}" data-testid="${obj.PolicyID}">${obj.Email}</td>

								<td id="NumOfLives-${obj.PolicyID}" data-testid="${obj.PolicyID}">${obj.NumOfLives}</td>
								<td id="NumOfDependents-${obj.PolicyID}" data-testid="${obj.PolicyID}">${obj.NumOfDependents}</td>
								<td id="Source-${obj.PolicyID}" data-testid="${obj.PolicyID}">${obj.Source}</td>
								
								<td>
									<button class="btn btn-sm btn-info" data-testid="${obj.PolicyID}"  id="save-${obj.PolicyID}" data-toggle="modal" data-target="#updateContactModal">Update</button>
									<button class="btn btn-sm btn-danger" data-testid=${obj.PolicyID} id="delete-${obj.PolicyID}" >Delete</button>
								</td>
							</tr>`

	$('#tests-table').append(row)

	// Creates buttons for deleting and updating
	// a contact based on the their respective row.
	$(`#delete-${obj.PolicyID}`).on('click', deleteTest)
	$(`#save-${obj.PolicyID}`).on('click', saveUpdate)

}

// Helps to streamline the process of displaying the table in the
// landing page by receiving a JSON array as the parameter and
// adding each row to the table based on the array elements (contacts).
function displayClientsTable()
{
	// Package a JSON payload to deliver to the DisplayTable Endpoint with
	// the UserID in order to display their contacts.
  var jsonPayload =
  	'{"AgentID" : "' + userID + '"}';
	var url = urlBase + '/displayClientTables.' + extension;
	var xhr = new XMLHttpRequest();

	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	// Basic try and catch to ensure that any server code errors are
	// handled properly.
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
				console.log("Success in displayTable()");
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log("Failure in displayTable()");
	}

	var results = JSON.parse(xhr.responseText);
	var clientList = results['results'];
	console.log(clientList);

	// For each contact in the JSON array, the contact's
	// information will be added to the table.
	for (var i in clientList)
  {
  	addRow(clientList[i]);
  }
}

// JQuery function inspired and modified by https://www.youtube.com/watch?v=DzXmAKdEYIs
// that links the update button in each row to the Update endpoint.
function saveUpdate()
{
	var testid = $(this).data('testid');
	var saveBtn = $(`#save-${testid}`);
	var row = $(`.test-row-${testid}`);

	if (updateFlag == false)
		testID = testid;

	// We only want to update and send JSON to the Update Endpoint once
	// the modal has been displayed.
	if (updateFlag)
	{
		var updateFirstName = document.getElementById("updateFirstName").value;
		var updateLastName = document.getElementById("updateLastName").value;
		var updateEmail = document.getElementById("updateEmail").value;
		var updatePhone = document.getElementById("updatePhone").value;

		updateFlag = false;
		updateContact(updateFirstName, updateLastName, updateEmail, updatePhone, testID);
	}

	updateFlag = true;
}

// JQuery function inspired and modified by https://www.youtube.com/watch?v=DzXmAKdEYIs
// that links the update button in each row to the Delete endpoint.
function deleteTest()
{
	var testid = $(this).data('testid')
	var row = $(`.test-row-${testid}`)

	deleteClient(testid);

	row.remove()
}

// Creates a client for a specific user and stores it
// accordingly in the database.
function createPolicyHolder()
{
	console.log("TESTING!");

	var clientFirstName = document.getElementById("clientFirstName").value;
	var clientLastName = document.getElementById("clientLastName").value;

	var clientDateOfBirth = document.getElementById("clientEmail").value;
	var clientSSN = document.getElementById("clientSSN").value;

	var clientPhone = document.getElementById("clientPhone").value;
	var clientAddress = document.getElementById("clientAddress").value;

	var clientSecondLineAddress = document.getElementById("clientSecondLineAddress").value;

	var clientCity = document.getElementById("clientCity").value;
	var clientAddress = document.getElementById("clientAddress").value;

	var clientZIP = document.getElementById("clientZIP").value;
	let clientState = document.getElementById("statesMenu").value;

	var clientEmail = document.getElementById("clientEmail").value;
	var clientNumOfDependents = document.getElementById("clientNumOfDependents").value;

	var clientNumOfLives = document.getElementById("clientNumOfLives").value;
	var clientSource = document.getElementById("sourceMenu").value;

	// Remove any special characters in order to ensure all
	// numbers are a 10 digit string.
	clientPhone = clientPhone.replace(/[^\w\s]/gi, '');

	// This helps to ensure that none of the form
	// inputs are left blank and only have alphabetical characters.
	if (!checkFormNames(clientFirstName, clientLastName))
		return;

	document.getElementById("createClientResult").innerHTML = "";

	// Package a JSON payload to deliver to the server that contains all
	// the contact details in order create the contact.
  var jsonPayload = {
		"AgentID": userID,
		"FirstName": clientFirstName,
		"LastName" : clientLastName,
		"DateOfBirth": clientDateOfBirth,
		"SSN": clientSSN,
		"Phone": clientPhone,
		"Address": clientAddress,
		"Second_Line_Address": clientSecondLineAddress,
		"City": clientCity,
		"ZipCode": clientZIP,
		"State": clientState,
		"Email": clientEmail,
		"NumOfLives": clientNumOfLives,
		"NumOfDependents": clientNumOfDependents,
		"PolicyInfoID": userID,
		"Source": clientSource
	};

	jsonString = JSON.stringify(jsonPayload);

	// '{"AgentID" : ' + userID + ', "FirstName" : "' + clientFirstName + '", "LastName" : "' + clientLastName + '", "DateOfBirth" : "' + clientDateOfBirth + '", "SSN" : "' + clientSSN + '", "Phone" : "' + clientPhone + '", "Address" : "' + clientAddress + '", "Second_Line_Address" : "' + clientSecondLineAddress + '", "City" : "' + clientCity + '", "ZipCode" : "' + clientZIP + '", "State" : "' + clientState + '", "Email" : "' + clientEmail + '", "NumOfLives" : ' + clientNumOfLives + ', "NumOfDependents" : ' + clientNumOfDependents + ', "PolicyInfoID" : "' + userID + '",  "Source" : "' + clientSource + '"}';

	var url = "http://sunsure-agent.com/API/createPolicyHolder.php";
	var xhr = new XMLHttpRequest();

	xhr.open('POST', url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	xhr.onreadystatechange = function () 
	{
		if (xhr.readyState === 4 && xhr.status === 200) 
		{
			var res = JSON.parse(xhr.response);
			console.log(res);
		}
	};

	xhr.send(jsonString);
}

// Deletes a contact based on their ID.
function deleteClient(clientID)
{
	var xhr = new XMLHttpRequest();
	var newUrl = 'http://sunsure-agent.com/API/deletePolicyHolder.php';

	// Package a JSON payload to deliver to the server that contains all
	// the contact's ID in order delete the contact.
	var jsonPayload =
	'{"PolicyID" : "' + clientID + '"}';

	xhr.open("DELETE", newUrl, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	// Basic try and catch to ensure that any server code errors are
	// handled properly.
	try
	{
		xhr.onreadystatechange = function()
		{
			// If successful there is no need to display a change.
			if (this.readyState == 4 && this.status == 200)
			{
				;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("deleteResult").innerHTML = err.message;
	}
}

// Updates a Contact's information based on their ID.
function updateContact(updateFirstName, updateLastName, updateEmail, updatePhone, testid)
{
	// This helps to ensure that none of the form
	// inputs are left blank.
	if (!checkFormNames(updateFirstName, updateLastName))
		return;

 	// Remove any special characters in order to ensure all
	// numbers are a 10 digit string.
	updatePhone = updatePhone.replace(/[^\w\s]/gi, '');

	document.getElementById("updateResult").innerHTML = "";

	// Package a JSON payload to deliver to the server that contains all
	// the contact information in order update the contact.
  var jsonPayload =
  	'{"ID" : "' + testid + '", "UserID" : "' + userId + '", "FirstName" : "' + updateFirstName + '", "LastName" : "' + updateLastName + '", "Email" : "' + updateEmail + '", "Phone" : "' + updatePhone + '"}';
	var url = urlBase + '/Update.' + extension;
	var xhr = new XMLHttpRequest();

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	// Basic try and catch to ensure that any server code errors are
	// handled properly.
	try
	{
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("updateResult").innerHTML = err.message;
	}
}

// Searches for a user's contacts based on the userID.
function searchContacts()
{
	// Collects data from the search bar in the landing page.
	let search = document.getElementById("contactsInput").value;
	let clientsList = "";

	// Clears the table to allow for the construction of a new table
	// based on the search results.
  $("#clientsTable tbody tr").remove();

	// Package a JSON payload to deliver to the Search Endpoint with
	// the UserID in order to display the contacts based on the search input.
	var jsonPayload = '{"UserID" : "' + userId + '", "Input" : "' + search + '"}';
	var url = urlBase + '/searchPolicyHolder.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	// Basic try and catch to ensure that any server code errors are
	// handled properly.
	try
	{
		xhr.send(jsonPayload);
    clientsList = JSON.parse(xhr.responseText);
  }

	catch(err)
	{
		document.getElementById("contactsTable").innerHTML = err.message;
	}

	// For each contact in the JSON array, the contact's
	// information will be added to the table.
 	for (var i in clientsList)
  {
  	addRow(clientsList[i]);
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

// Nifty function that allows for the 'show password'
// button to function by changing the document element type.
function showRegistrationPassword()
{
  var x = document.getElementById("registerPassword");

  if (x.type === "password")
    x.type = "text";
  else
    x.type = "password";
}

// Checks the first and last name of a given user input to ensure
// that only alphabetical characters are allowed to be inserted into the database.
function checkFormNames(firstName, lastName)
{
  var isAlpha = function(ch)
  {
    return typeof ch === "string" && ch.length === 1 && (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z");
  }

  for (var i = 0; i < firstName.length; i++) 
	{
    if (!isAlpha(firstName[i])) 
		{
      document.getElementById("registerResult").innerHTML = 'First name must have alphabet characters only';

      return false;
    }
  }

  for (var j = 0; j < lastName.length; j++) 
	{
    if (!isAlpha(lastName[j])) 
		{
      document.getElementById("registerResult").innerHTML = 'Last name must have alphabet characters only';

      return false;
    }
	}

  return true;
}