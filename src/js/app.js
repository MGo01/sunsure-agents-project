// Anna Malaj, Matthew Gomez
// COP 4331, Spring 2021
// 2/16/2021

// Global variables that allow for easy access
// across the program.
var urlBase = 'http://sunsure-agent.com/API';
var extension = 'php';
var globalPolicyID = -1;

// These variables are especially useful in order
// to perform CRUD operations
// var userId = 0;
// var firstName = "";
// var lastName = "";
var updateFlag = false;

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

								<td id="NumOfDependents-${obj.PolicyID}" data-testid="${obj.PolicyID}">${obj.NumOfDependents}</td>
								<td id="Source-${obj.PolicyID}" data-testid="${obj.PolicyID}">${obj.Source}</td>
								
								<td>
									<button class="btn btn-sm btn-info" data-testid="${obj.PolicyID}"  id="save-${obj.PolicyID}" data-toggle="modal" data-target="#updateClientModal">Update</button>
									<button class="btn btn-sm btn-info" data-testid="${obj.PolicyID}"  id="show-${obj.PolicyID}" data-toggle="modal" data-target="#showDetailsModal">Show Details</button>
									<button class="btn btn-sm btn-danger" data-testid=${obj.PolicyID} id="delete-${obj.PolicyID}" >Delete</button>
								</td>
							</tr>`

	$('#tests-table').append(row)

	// Creates buttons for deleting and updating
	// a contact based on the their respective row.
	$(`#delete-${obj.PolicyID}`).on('click', deleteTest)
	$(`#save-${obj.PolicyID}`).on('click', saveUpdate)
	$(`#show-${obj.PolicyID}`).on('click', fillShowDetailsForm)

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

// Massive WIP
function createAClient() 
{
	$("#createClientModal").on("submit", function (event) {
			var formData = $(this).serialize();
			event.preventDefault();
			let dependentsArray = getDependentsArray(formData.NumOfDependents);

			$.ajax({
					url: "http://sunsure-agent.com/API/createPolicyHolder.php",
					type: "POST",
					data: formData,
					async: false,
					success: function (result) {
							console.log(result)
					}
			});
	})
}

function getDependentsArray(clientNumOfDependents)
{
	var dependentsArray = [];

	for (var i = 0; i < clientNumOfDependents; i++)
	{
		// Depending on the number of dependents
		// these strings will pull the right data accordingly.
		var FNameString = "dependent-input-FirstName" + i;
		var LNameString = "dependent-input-LastName" + i;
		var DOBString = "dependent-input-DOB" + i;
		var SSNString = "dependent-input-SSN" + i;

		var dependentFirstName = document.getElementById(FNameString).value;
		var dependentLastName = document.getElementById(LNameString).value;
		var dependentDOB = document.getElementById(DOBString).value;
		var dependentSSN = document.getElementById(SSNString).value;

		// Remove any dashes and replace them with a forward slash.
		dependentDOB = dependentDOB.replace(/[---]+/gi, '/');

		// This helps to ensure that none of the form
		// inputs are left blank and only have alphabetical characters.
		if (!checkFormNames(dependentFirstName, dependentLastName))
			return;

		// Create JSON for each dependent to later
		// store in dependentsArray.
		var dependentObj = 
		{
			"FirstName": dependentFirstName,
			"LastName": dependentLastName,
			"DateOfBirth": dependentDOB,
			"SSN": dependentSSN,
			"DependentID": globalPolicyID
		};

		dependentJSON = JSON.stringify(dependentObj);

		dependentsArray.push(dependentJSON);
	}

	return dependentsArray;
}

function insertPolicyInfo()
{
	var policyType = document.getElementById("createPolicyType").value;
	var ancillaryType = document.getElementById("createAncillaryType").value;

	var effectiveDate = document.getElementById("createEffectiveDate").value;
	var carrier = document.getElementById("createCarrier").value;
	var notes = document.getElementById("createNotes").value;

	var ambassador = document.getElementById("createClientAmbassador").value;
	var applicationID = document.getElementById("createAppID").value;

	effectiveDate = effectiveDate.replace(/[---]+/gi, '/');

	// Package a JSON payload to deliver to the server that contains all
	// the contact details in order create the contact.
  var jsonPayload = {
		"ApplicationID": applicationID,
		"PolicyType": policyType,
		"AncillaryType" : ancillaryType,
		"Carrier": carrier,
		"EffectiveDate": effectiveDate,
		"AmbassadorName": ambassador,
		"Notes": notes,
		"PolicyInfoID": globalPolicyID,
	};

	jsonString = JSON.stringify(jsonPayload);

	var url = "http://sunsure-agent.com/API/insertPolicyInfo.php";
	var xhr = new XMLHttpRequest();

	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try 
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{    
				var jsonObject = JSON.parse(xhr.responseText);
				var endpointmsg = jsonObject['msg'];
				console.log(endpointmsg);

				if (endpointmsg === "Successfully inserted Policy Information")
				{
					console.log(endpointmsg);
					document.getElementById("createClientResult").innerHTML = endpointmsg;
					document.getElementById("createClientResult").style.color = "green";
				}

				else if (endpointmsg === "Policy Information has already been inserted.")
				{
					console.log(endpointmsg);
					document.getElementById("createClientResult").innerHTML = endpointmsg;
					document.getElementById("createClientResult").style.color = "red";
				}
			}
		};

		console.log(jsonString);
		xhr.send(jsonString);
	}
	
	catch(error)
	{
		console.log(error.message);
		document.getElementById("createClientResult").innerHTML = error.message;
		document.getElementById("createClientResult").style.color = "red";
	}
}

// CURRENT WIP
function fillShowDetailsForm()
{
	var policyID = $(this).data('testid');
	var numOfDependents = $(this).NumOfDependents;

	var url = "http://sunsure-agent.com/API/getPolicyInformation.php";
	var xhr = new XMLHttpRequest();

	var applicationID;
	var policyType;
	var ancillaryType;
	
	var carrier;
	var effectiveDate;
	var ambassadorName; 
	var notes;

		// Package a JSON payload to deliver to the server that contains all
	// the contact details in order create the contact.
  var jsonPayload = {
		"PolicyInfoID": policyID
	};

	jsonString = JSON.stringify(jsonPayload);

	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try 
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{    
				var jsonObject = JSON.parse(xhr.responseText);
				var endpointmsg = jsonObject['msg'];
				console.log(endpointmsg);

				if (endpointmsg === "Policy Information associated with given ID does not exist.")
				{
					console.log("Unable to load policy information");
					document.getElementById("showDetailsResult").innerHTML = endpointmsg;	
					document.getElementById("showDetailsResult").style.color = "red";
				}

				else
				{
					applicationID = jsonObject.ApplicationID;
					policyType = jsonObject.PolicyType;
					ancillaryType = jsonObject.AncillaryType;
					
					carrier = jsonObject.Carrier;
					effectiveDate = jsonObject.EffectiveDate;
					ambassadorName = jsonObject.AmbassadorName;
					notes = jsonObject.Notes; 
				}
			}
		};

		console.log(jsonString);
		xhr.send(jsonString);
	}
	
	catch(error)
	{
		console.log(error.message);
		document.getElementById("createClientResult").innerHTML = error.message;
		document.getElementById("createClientResult").style.color = "red";
	}

	// Load the Policy Information Form
	document.getElementById("showDetailsPolicyType").innerHTML = "" + policyType;
	document.getElementById("showDetailsAncillaryType").innerHTML = "" + ancillaryType;

	document.getElementById("showDetailsCarrier").innerHTML = "" + carrier;
	document.getElementById("showDetailsAmbassador").innerHTML = "" + ambassadorName;
	document.getElementById("showDetailsAppID").innerHTML = "" + applicationID;
	document.getElementById("showDetailsNotes").innerHTML = "" + notes;

	// Load in Dependents Forms
	// for (let i = 0; i < numOfDependents; i++)
	// {
	// 	// Depending on the number of dependents
	// 	// these strings will pull the right data accordingly.
	// 	var FNameString = "dependent-input-FirstName" + i;
	// 	var LNameString = "dependent-input-LastName" + i;
	// 	var DOBString = "dependent-input-DOB" + i;
	// 	var SSNString = "dependent-input-SSN" + i;

	// 	document.getElementById(FNameString).innerHTML = "";
	// 	document.getElementById(LNameString).innerHTML = "";
	// 	document.getElementById(DOBString).innerHTML = "";
	// 	document.getElementById(SSNString).innerHTML = "";
	// }
}

function clearModalForm(numOfDependents)
{
	// Clear the Client Information Form
	document.getElementById("clientFirstName").innerHTML = "";
	document.getElementById("clientLastName").innerHTML = "";

	document.getElementById("clientSSN").innerHTML = "";

	document.getElementById("clientPhone").innerHTML = "";
	document.getElementById("clientAddress").innerHTML = "";

	document.getElementById("clientSecondLineAddress").innerHTML = "";

	document.getElementById("clientCity").innerHTML = "";
	document.getElementById("clientAddress").innerHTML = "";

	document.getElementById("clientZIP").innerHTML = "";

	document.getElementById("clientEmail").innerHTML = "";
	document.getElementById("clientNumOfDependents").innerHTML = "";

	// Clear the Policy Information Form
	document.getElementById("createPolicyType").innerHTML = "";
	document.getElementById("createAncillaryType").innerHTML = "";

	document.getElementById("createNotes").innerHTML = "";

	document.getElementById("createClientAmbassador").innerHTML = "";
	document.getElementById("createAppID").innerHTML = "";

	for (let i = 0; i < numOfDependents; i++)
	{
		// Depending on the number of dependents
		// these strings will pull the right data accordingly.
		var FNameString = "dependent-input-FirstName" + i;
		var LNameString = "dependent-input-LastName" + i;
		var DOBString = "dependent-input-DOB" + i;
		var SSNString = "dependent-input-SSN" + i;

		document.getElementById(FNameString).innerHTML = "";
		document.getElementById(LNameString).innerHTML = "";
		document.getElementById(DOBString).innerHTML = "";
		document.getElementById(SSNString).innerHTML = "";
	}
}

// Creates a client for a specific user and stores it
// accordingly in the database.
function createPolicyHolder()
{
	var clientFirstName = document.getElementById("clientFirstName").value;
	var clientLastName = document.getElementById("clientLastName").value;

	var clientDateOfBirth = document.getElementById("clientDateOfBirth").value;
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

	var clientSource = document.getElementById("sourceMenu").value;

	// Remove any special characters in order to ensure all
	// numbers are a 10 digit string.
	clientPhone = clientPhone.replace(/[^\w\s]/gi, '');

	// Remove any dashes and replace them with a forward slash.
	clientDateOfBirth = clientDateOfBirth.replace(/[---]+/gi, '/');

	// This helps to ensure that none of the form
	// inputs are left blank and only have alphabetical characters.
	if (!checkFormNames(clientFirstName, clientLastName))
		return;
	
	// if (checkRequiredFields(clientFirstName, clientLastName, clientDateOfBirth,
	// 												clientAddress, clientCity))
	// 	return;

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
		"NumOfDependents": clientNumOfDependents,
		"PolicyInfoID": userID,
		"Source": clientSource
	};

	jsonString = JSON.stringify(jsonPayload);

	var url = "http://sunsure-agent.com/API/createPolicyHolder.php";
	var xhr = new XMLHttpRequest();

	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try 
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{    
				var jsonObject = JSON.parse(xhr.responseText);
				var endpointmsg = jsonObject['msg'];
				console.log(endpointmsg);

				if (endpointmsg === "Primary Policy Holder has already been inserted")
				{
					console.log("Client insertion was not successful!");
					document.getElementById("createClientResult").innerHTML = endpointmsg;
					
					document.getElementById("createClientResult").style.color = "red";
				}

				else
				{
					console.log(endpointmsg);
					globalPolicyID = endpointmsg;

					// Retrieve and generate an array based on
					// the dependents forms
					let dependentsArray = getDependentsArray(clientNumOfDependents);

					insertPolicyInfo();
          insertDependents(dependentsArray);
					clearModalForm();  
				}
			}
		};

		console.log(jsonString);
		xhr.send(jsonString);
	}
	
	catch(error)
	{
		console.log(error.message);
		document.getElementById("createClientResult").innerHTML = error.message;
		document.getElementById("createClientResult").style.color = "red";
	}
}

// Receieves dependentsArray as a parameter
// and inserts all dependents using a Promise call
function insertDependents(dependentsArray)
{
	async function postData(data) 
	{
		url = 'http://68.183.97.82/API/createDependent.php';
		// Default options are marked with *
		const response = await fetch(url, {
			method: 'POST',
			mode: 'cors', 
			cache: 'no-cache', 
			credentials: 'same-origin', 
			headers: {
				'Content-Type': 'application/json'
				
			},
			redirect: 'follow', 
			referrerPolicy: 'no-referrer', 
			body: data
		});

		// Parses JSON response into native JavaScript objects
		return response.json();
	}

	let promiseArray = [];

	for(let i = 0; i < dependentsArray.length; i++)
		promiseArray.push(postData(dependentsArray[i]))

	Promise.all(promiseArray)
	.then(values => values.map(value => console.log(value.url + " ==> " + value.status)))
	.catch(err=>console.log(err))

	console.log(dependentsArray);
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
function searchClients()
{
	// Collects data from the search bar in the landing page.
	let search = document.getElementById("clientsInput").value;

	// Clears the table to allow for the construction of a new table
	// based on the search results.
  $("#clientsTable tbody tr").remove();

	// Package a JSON payload to deliver to the Search Endpoint with
	// the UserID in order to display the contacts based on the search input.
	var jsonPayload = '{"AgentID" : "' + userID + '", "Input" : "' + search + '"}';
	var url = urlBase + '/searchPolicyHolder.' + extension;

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
			{    
				jsonObject = JSON.parse(xhr.responseText);
				var clientsList = jsonObject['results'];
				console.log(clientsList);

				if (clientsList === "No valid Primary PolicyHolders were found")
				{
					document.getElementById("clientsTable").innerHTML = clientsList;
					document.getElementById("clientsTable").style.color = "red";
				}

				else
				{
					// For each client in the JSON array, the client's
					// information will be added to the table.
					for (var i in clientsList)
						addRow(clientsList[i]);

				}
			}
		};

		console.log(jsonPayload);
		xhr.send(jsonPayload);
	}
	
	catch(error)
	{
		console.log(error.message);
		document.getElementById("clientsTable").innerHTML = error.message;
		document.getElementById("clientsTable").style.color = "red";
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

// Check fields and sanitize inputs
// in case of any anomalies.
function checkRequiredFields(firstName, lastName, dateOfBirth, address, city)
{
	fullName = firstName + " " + lastName;

	return true;
}