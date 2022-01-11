// Anna Malaj, Matthew Gomez
// Fall 2021

// Global variables that allow for easy access
// across the program.
var urlBase = 'https://sunsure-agent.com/API';
var extension = 'php';

// These variables are especially useful in order
// to perform CRUD operations
var globalUpdateID = -1;
var globalPolicyID = -1;
var globalClientFName = "";
var globalClientLName = "";

// JQuery function inspired and modified by https://www.youtube.com/watch?v=DzXmAKdEYIs
// to allow for easier row insertion into the UI data table.
function addRow(obj)
{
	for (let key in obj)
	{
		// Check for any empty fields in the Policyholder
		// object and replace it with "N/A"
		if (obj[key] === "")
		{
			obj[key] = "N/A";
		}
		// Search for date of birth to convert
		// from yyyy/mm/dd to mm/dd/yyyy
		else if (key === "DateOfBirth")
		{
			convertedDate = transformDate(obj[key])
			obj[key] = convertedDate;
		}
	}

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
									<button class="btn btn-sm btn-info" data-testid="${obj.PolicyID}"  id="save-${obj.PolicyID}" data-toggle="modal" data-target="#updateClientModal" data-backdrop="static" data-keyboard="false">Update</button>
									<button class="btn btn-sm btn-info" data-testid="${obj.PolicyID}"  id="show-${obj.PolicyID}" data-toggle="modal" data-target="#showDetailsModal" data-backdrop="static" data-keyboard="false">Show Details</button>
								</td>
							</tr>`

	$('#tests-table').append(row)

	// Creates buttons for deleting and updating
	// a contact based on the their respective row.
	// $(`#delete-${obj.PolicyID}`).on('click', deleteTest)

	$(`#save-${obj.PolicyID}`).on('click', saveUpdate)
	$(`#show-${obj.PolicyID}`).on('click', fillShowDetailsForm)

}

function restrictDate(date, DOBFlag = false)
{
	// Extract the year from the yyyy/mm/dd format.
	let parts = date.split('/');
	year = parts[0];

	if (DOBFlag)
	{
		currentYear = new Date().getFullYear();
		return ((year >= 1900) && (year <= currentYear));
	}

	else
	{
		return year >= 1900;
	}
}

function transformDate(strDate) 
{
	let result = '';

	if (strDate == null || strDate == "")
		return "N/A";

	if (strDate.includes("/")) 
	{
		let parts = strDate.split('/');
		result = `${parts[1]}/${parts[2]}/${parts[0]}`;
	}

	else if (strDate.includes("-"))
	{
		let parts = strDate.split('-');
		result = `${parts[1]}/${parts[2]}/${parts[0]}`;
	}

	return result;
}

// Helps to streamline the process of displaying the table in the
// landing page by receiving a JSON array as the parameter and
// adding each row to the table based on the array elements (contacts).
function displayClientsTable(loggedIn = false)
{
	// Clear the table if the user
	// has not already logged in.
	if (!loggedIn)
	{
		$('#clientsTable tbody').empty();
	}

	// Package a JSON payload to deliver to the DisplayTable Endpoint with
	// the UserID in order to display their contacts.
  var jsonPayload =
  	'{"AgentID" : "' + userID + '"}';
	var url = urlBase + '/displayClientTables.' + extension;
	var xhr = new XMLHttpRequest();

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	// Basic try and catch to ensure that any server code errors are
	// handled properly.
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				console.log("Success in displayTable()");
				document.getElementById("searchResults").innerHTML = "";

				var results = JSON.parse(xhr.responseText);
				var clientList = results['results'];
				console.log(clientList);
			
				// For each contact in the JSON array, the contact's
				// information will be added to the table.
				for (let i in clientList)
				{
					addRow(clientList[i]);
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log("Failure in displayTable()");
	}
}

// JQuery function inspired and modified by https://www.youtube.com/watch?v=DzXmAKdEYIs
// that links the update button in each row to the Update endpoint.
function saveUpdate()
{
	globalUpdateID = $(this).data('testid');

	var $row = $(this).closest("tr"),       // Finds the closest row <tr>
			$tds = $row.find("td");             // Finds all children <td> elements

	let oldRowInfo = [];

	$.each($tds, function() {               // Visits every single <td> element
		oldRowInfo.push($(this).text());
		console.log($(this).text());        // Prints out the text within the <td>
	});

	// Save global first and last name for client
	globalClientFName = oldRowInfo[1];
	globalClientLName = oldRowInfo[2];

	let newUpdateTitle = "" + globalClientFName + " " + globalClientLName + " Details";

	$(".modal-header #updatePopUpTitle").text(newUpdateTitle);

	// Load in old row information into Update Modal Form
	document.getElementById("updateClientFirstName").placeholder = oldRowInfo[1];
	document.getElementById("updateClientLastName").placeholder = oldRowInfo[2] ;

	document.getElementById("updateClientDateOfBirth").valueAsDate = new Date(oldRowInfo[3]);
	document.getElementById("updateClientSSN").placeholder = oldRowInfo[4];

	document.getElementById("updateClientPhone").placeholder = oldRowInfo[5];
	document.getElementById("updateClientAddress").placeholder = oldRowInfo[6];

	document.getElementById("updateClientSecondLineAddress").placeholder = oldRowInfo[7];

	document.getElementById("updateClientCity").placeholder = oldRowInfo[8];

	document.getElementById("updateClientZIP").placeholder = oldRowInfo[9];
	document.getElementById("updateStatesMenu").value = oldRowInfo[10];

	document.getElementById("updateClientEmail").placeholder = oldRowInfo[11];
	document.getElementById("updateClientNumOfDependents").innerHTML = oldRowInfo[12];

	document.getElementById("updateSourceMenu").value = oldRowInfo[13];

	document.getElementById("updateClientResult").innerHTML = "";

	let updateFlag = true;

	fillShowDetailsForm(updateFlag, globalUpdateID)

	oldRowInfo.length = 0;
}

function updateClientWrap()
{
	updateClient(globalUpdateID);
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

function getDependentsArray(clientNumOfDependents)
{
	var dependentsArray = [];
	var spanName = "createClientResult";

	for (let i = 0; i < clientNumOfDependents; i++)
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
		if (!checkFormNames(dependentFirstName, dependentLastName, spanName))
		{
			dependentsArray.length = 0;
			return;
		}

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

function fillInDependentForm(depArray)
{
	// Number of inputs to create
	var number = depArray.length;

	// Container <div> where dynamic content will be placed
	var container = document.getElementById("detailsDependentsContainer");

	// Clear previous contents of the container
	while (container.hasChildNodes()) 
	{
		container.removeChild(container.lastChild);
	}

	for (let i = 0; i < number; i++)
	{
		if (depArray[i] === "")
			depArray[i] = "N/A";

		// Append a node with a random text
		var depRow = document.createElement("div");
		depRow.className = "row";

		var depFirstNameCol = document.createElement("div")
		depFirstNameCol.className = "col";

		var depLastNameCol = document.createElement("div")
		depLastNameCol.className = "col";

		var depDOBCol = document.createElement("div")
		depDOBCol.className = "col";

		var depSSNCol = document.createElement("div")
		depSSNCol.className = "col";

		// Create Dependent Title

		// HTML Format:
		// <br>

		// <div>
		//   <b style="font-size: 30px; font-family:"Montserrat", Times, serif;">
		//     Dependent Information Form
		//   </b>
		// </div>

		// <br>
		// <br>
		var titleDiv = document.createElement("div");
		var boldedText = document.createElement("b");

		boldedText.id = "dependent-Title"
		boldedText.innerHTML = "Dependent " + (i+1) + " Information";
		titleDiv.append(boldedText);

		container.appendChild(titleDiv);

		// Append two line breaks 
		container.appendChild(document.createElement("br"));

		// Create an <input> element, set its type and name attributes
		var firstName = document.createElement("p");
		firstName.type = "text";
		firstName.name = "Dependent" + i;
		firstName.id="details-dependent-FirstName" + i;
		firstName.innerHTML = "" + depArray[i].FirstName;

		var lastName = document.createElement("p");
		lastName.type = "text";
		lastName.name = "Dependent" + i;
		lastName.id="details-dependent-LastName" + i;
		lastName.innerHTML = "" + depArray[i].LastName;

		var dateOfBirth = document.createElement("p");
		dateOfBirth.type = "date";
		dateOfBirth.name = "Dependent" + i;
		dateOfBirth.id="details-dependent-DOB" + i;

		// Convert date format from yyyy/mm/dd to mm/dd/yyyy
		depArray[i].DateOfBirth = transformDate(depArray[i].DateOfBirth);

		dateOfBirth.innerHTML = "" + depArray[i].DateOfBirth;

		var ssn = document.createElement("p");
		ssn.type = "text";
		ssn.name = "Dependent" + i;
		ssn.id="details-dependent-SSN" + i;
		ssn.innerHTML = "" + depArray[i].SSN;

		// Attach Columns to fields
		depFirstNameCol.appendChild(firstName);
		depLastNameCol.appendChild(lastName);
		depDOBCol.appendChild(dateOfBirth);
		depSSNCol.appendChild(ssn);

		// Attach Rows to create client form
		depRow.append(depFirstNameCol, depLastNameCol, depDOBCol, depSSNCol);  

		// Attach the Row to the Dependent Container
		container.appendChild(depRow);

		// Append a line break 
		container.appendChild(document.createElement("br"));
	}
}

function checkPolicyInfo(spanName)
{
	var planType = document.getElementById("createPlanType").value;
	var ancillaryType = document.getElementById("createAncillaryType").value;

	var effectiveDate = document.getElementById("createEffectiveDate").value;
	var carrier = document.getElementById("createCarrier").value;
	var notes = document.getElementById("createNotes").value;

	var ambassador = document.getElementById("createClientAmbassador").value;
	var applicationID = document.getElementById("createAppID").value;

	effectiveDate = effectiveDate.replace(/[---]+/gi, '/');

	// Package JSON that contains all required
	// policy information fields.
  var requiredObj = 
	{
		"Policy Type": planType,
		"Policy Effective Date": effectiveDate
	};

	// Ensure that no required field is empty.
	if (checkRequiredFields(requiredObj, spanName))
		return false;
	
	// Ensure that the DOB date is greater than
	// 1900 and less than any future date
	if (!restrictDate(effectiveDate))
	{
		document.getElementById(spanName).innerHTML = "Invalid date: Dates before 1900 are not allowed";
		document.getElementById(spanName).style.color = "red";
		return false;
	}

	return true;
}

function checkDependentInfo(clientNumOfDependents, spanName)
{
	for (let i = 0; i < clientNumOfDependents; i++)
	{
		// Depending on the number of dependents
		// these strings will pull the right data accordingly.
		var FNameString = "dependent-input-FirstName" + i;
		var LNameString = "dependent-input-LastName" + i;
		var DOBString = "dependent-input-DOB" + i;
		var SSNString = "dependent-input-SSN" + i;

		var element = document.getElementById(FNameString);
		
		if (element === null || element.value == '') 
		{
			document.getElementById(spanName).innerHTML = "Data Error: Inserted a number of dependents but didn't click on 'Fill Dependent Details'";
			document.getElementById(spanName).style.color = "red";

			return false;
		}

		var dependentFirstName = document.getElementById(FNameString).value;
		var dependentLastName = document.getElementById(LNameString).value;
		var dependentDOB = document.getElementById(DOBString).value;
		var dependentSSN = document.getElementById(SSNString).value;

		// Remove any dashes and replace them with a forward slash.
		dependentDOB = dependentDOB.replace(/[---]+/gi, '/');

		// Package JSON that contains all required
		// policy information fields.
		var requiredObj = 
		{
			"Dependent First Name": dependentFirstName,
			"Dependent Last Name": dependentLastName,
			"Dependent DOB": dependentDOB,
		};
		
		// Ensure that no required field is empty.
		if (checkRequiredFields(requiredObj, spanName))
			return false;

		// This helps to ensure that none of the form
		// inputs are left blank and only have alphabetical characters.
		if (!checkFormNames(dependentFirstName, dependentLastName, spanName))
			return false;

		// Ensure that DOB is correct.
		let DOBFlag = true;

		if (!restrictDate(dependentDOB, DOBFlag))
		{
			document.getElementById(spanName).innerHTML = "Invalid Date: Please choose a date between the years 1900 and " + new Date().getFullYear();
			document.getElementById(spanName).style.color = "red";
			return false;
		}
	}

	return true;
}

function checkUpdatedDependentInfo(clientNumOfDependents, spanName)
{
	for (let i = 0; i < clientNumOfDependents; i++)
	{
		// Depending on the number of dependents
		// these strings will pull the right data accordingly.
		var FNameString = "update-dependent-input-FirstName" + i;
		var LNameString = "update-dependent-input-LastName" + i;
		var DOBString = "update-dependent-input-DOB" + i;
		var SSNString = "update-dependent-input-SSN" + i;

		var element = document.getElementById(FNameString);
		
		if (element === null || element.value == '') 
		{
			document.getElementById(spanName).innerHTML = "Data Error: Inserted a number of dependents but didn't click on 'Fill Dependent Details'";
			document.getElementById(spanName).style.color = "red";

			return false;
		}

		var dependentFirstName = document.getElementById(FNameString).value;
		var dependentLastName = document.getElementById(LNameString).value;
		var dependentDOB = document.getElementById(DOBString).value;
		var dependentSSN = document.getElementById(SSNString).value;

		// Remove any dashes and replace them with a forward slash.
		dependentDOB = dependentDOB.replace(/[---]+/gi, '/');

		// Package JSON that contains all required
		// policy information fields.
		var requiredObj = 
		{
			"Dependent First Name": dependentFirstName,
			"Dependent Last Name": dependentLastName,
			"Dependent DOB": dependentDOB,
		};
		
		// Ensure that no required field is empty.
		if (checkRequiredFields(requiredObj, spanName))
			return false;

		// This helps to ensure that none of the form
		// inputs are left blank and only have alphabetical characters.
		if (!checkFormNames(dependentFirstName, dependentLastName, spanName))
			return false;

		// Ensure that DOB is correct.
		let DOBFlag = true;

		if (!restrictDate(dependentDOB, DOBFlag))
		{
			document.getElementById(spanName).innerHTML = "Invalid Date: Please choose a date between the years 1900 and " + new Date().getFullYear();
			document.getElementById(spanName).style.color = "red";
			return false;
		}
	}

	return true;
}

function insertPolicyInfo()
{
	var planType = document.getElementById("createPlanType").value;
	var ancillaryType = document.getElementById("createAncillaryType").value;

	var effectiveDate = document.getElementById("createEffectiveDate").value;
	var carrier = document.getElementById("createCarrier").value;
	var notes = document.getElementById("createNotes").value;

	var ambassador = document.getElementById("createClientAmbassador").value;
	var applicationID = document.getElementById("createAppID").value;

	spanName = "createClientResult";

	effectiveDate = effectiveDate.replace(/[---]+/gi, '/');

	// Package a JSON payload to deliver to the server that contains all
	// the contact details in order create the contact.
  var jsonPayload = 
	{
		"ApplicationID": applicationID,
		"PolicyType": planType,
		"AncillaryType" : ancillaryType,
		"Carrier": carrier,
		"EffectiveDate": effectiveDate,
		"AmbassadorName": ambassador,
		"Notes": notes,
		"PolicyInfoID": globalPolicyID,
	};

	jsonString = JSON.stringify(jsonPayload);

	var url = urlBase + '/insertPolicyInfo.' + extension;
	var xhr = new XMLHttpRequest();

	xhr.open("POST", url, true);
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

function loadDependents(policyID)
{
	var url = urlBase + '/getDependents.' + extension;
	var xhr = new XMLHttpRequest();

	// Package a JSON payload to deliver to the server that contains all
	// the contact details in order create the contact.
  var jsonPayload = 
	{
		"DependentID": policyID
	};

	jsonString = JSON.stringify(jsonPayload);

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try 
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{    
				var jsonObject = JSON.parse(xhr.responseText);
				var depArray = endpointmsg = jsonObject['results'];
				console.log(depArray);

				if (endpointmsg === "No valid Dependents were found")
				{
					console.log("Unable to load dependents information");
					document.getElementById("showDetailsDependentResult").innerHTML = "This policy has no dependents";	
					document.getElementById("showDetailsDependentResult").style.color = "red";

					// Container <div> where dynamic content will be placed
					let container = document.getElementById("detailsDependentsContainer");

					// Clear previous contents of the container
					while (container.hasChildNodes())
					{
						container.removeChild(container.lastChild);
					}		
				}

				else
				{
					console.log("Successfully loaded dependent information");
					document.getElementById("showDetailsDependentResult").innerHTML = "";	

					fillInDependentForm(depArray)
				}
			}
		};

		console.log(jsonString);
		xhr.send(jsonString);
	}
	
	catch(error)
	{
		console.log(error.message);
		document.getElementById("showDetailsDependentResult").innerHTML = error.message;
		document.getElementById("showDetailsDependentResult").style.color = "red";
	}
}

// Fills out the Policy Information Form for Show
// Details AND the Update Client Form if necessary
function fillShowDetailsForm(updateShow = false, gPolicyID = -1)
{
	var policyID = $(this).data('testid');

	if (typeof policyID === 'undefined')
		policyID = gPolicyID;

	var url = urlBase + '/getPolicyInformation.' + extension;
	var xhr = new XMLHttpRequest();

	var applicationID;
	var planType;
	var ancillaryType;
	
	var carrier;
	var effectiveDate;
	var ambassadorName; 
	var notes;

	var $row = $(this).closest("tr"),       // Finds the closest row <tr>
	$tds = $row.find("td");             // Finds all children <td> elements

	$tds = $row.find("td");             // Finds all children <td> elements

	let oldRowInfo = [];

	$.each($tds, function() {               // Visits every single <td> element
		oldRowInfo.push($(this).text());
		console.log($(this).text());        // Prints out the text within the <td>
	});

	// Save global first and last name for client
	globalClientFName = oldRowInfo[1];
	globalClientLName = oldRowInfo[2];

	let newDetailsTitle = "" + globalClientFName + " " + globalClientLName + " Details";

	$(".modal-header #showDetailsPopUpTitle").text(newDetailsTitle);

	// Package a JSON payload to deliver to the server that contains all
	// the contact details in order create the contact.
  var jsonPayload = 
	{
		"PolicyInfoID": policyID
	};

	jsonString = JSON.stringify(jsonPayload);

	xhr.open("POST", url, true);
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
					// bitch what the fuck
					if (typeof updateShow === "boolean" && updateShow === true)
					{
						console.log("Unable to load policy information");
						document.getElementById("updateClientResult").innerHTML = "This policy has no policy information.";	
						document.getElementById("updateClientResult").style.color = "red";

						// Load the Policy Information Form
						document.getElementById("updatePlanType").placeholder = "N/A";
						document.getElementById("updateAncillaryType").placeholder = "N/A";
						document.getElementById("showDetailsEffectiveDate").valueAsDate = new Date();

						document.getElementById("updateClientAmbassador").placeholder = "N/A";
						document.getElementById("updateDetailsAppID").placeholder = "N/A";
						document.getElementById("updateNotes").innerHTML = "N/A";
					}

					else
					{
						console.log("Unable to load policy information");
						document.getElementById("showDetailsPolicyResult").innerHTML = "This policy has no policy information.";	
						document.getElementById("showDetailsPolicyResult").style.color = "red";

						// Load the Policy Information Form
						document.getElementById("showDetailsPlanType").innerHTML = "N/A";
						document.getElementById("showDetailsAncillaryType").innerHTML = "N/A";
						document.getElementById("showDetailsEffectiveDate").innerHTML = "N/A";

						document.getElementById("showDetailsCarrier").innerHTML = "N/A";
						document.getElementById("showDetailsAmbassador").innerHTML = "N/A";
						document.getElementById("showDetailsAppID").innerHTML = "N/A";
						document.getElementById("showDetailsNotes").innerHTML = "N/A";

						// Check if any Dependent Data was inserted
						// without Policy Info being inserted.
						loadDependents(policyID);
					}
				}

				else
				{
					console.log("Successfully loaded policy information");
					document.getElementById("showDetailsPolicyResult").innerHTML = "";	

					for (let i in jsonObject)
					{
						if (jsonObject[i] === "")
							jsonObject[i] = "N/A";
					}

					applicationID = jsonObject.ApplicationID;
					planType = jsonObject.PolicyType;
					ancillaryType = jsonObject.AncillaryType;
					
					carrier = jsonObject.Carrier;
					effectiveDate = jsonObject.EffectiveDate;

					ambassadorName = jsonObject.AmbassadorName;
					notes = jsonObject.Notes; 

					if (typeof updateShow === "boolean" && updateShow === true)
					{
						// Load the Policy Information Form
						document.getElementById("updatePlanType").placeholder = "" + planType;
						document.getElementById("updateAncillaryType").placeholder = "" + ancillaryType;
						document.getElementById("updateEffectiveDate").valueAsDate = new Date(effectiveDate);

						document.getElementById("updateCarriers").value = carrier;
						document.getElementById("updateClientAmbassador").placeholder = "" + ambassadorName;
						document.getElementById("updateDetailsAppID").placeholder = "" + applicationID;
						document.getElementById("updateNotes").value = "" + notes;
					}

					else
					{
						// Convert the date from yyyy/mm/dd to mm/dd/yyyy
						effectiveDate = transformDate(effectiveDate);

						// Load the Policy Information Form
						document.getElementById("showDetailsPlanType").innerHTML = "" + planType;
						document.getElementById("showDetailsAncillaryType").innerHTML = "" + ancillaryType;
						document.getElementById("showDetailsEffectiveDate").innerHTML = "" + effectiveDate;

						document.getElementById("showDetailsCarrier").innerHTML = "" + carrier;
						document.getElementById("showDetailsAmbassador").innerHTML = "" + ambassadorName;
						document.getElementById("showDetailsAppID").innerHTML = "" + applicationID;
						document.getElementById("showDetailsNotes").innerHTML = "" + notes;

						// Check if any Dependent Data was inserted
						// without Policy Info being inserted.
						loadDependents(policyID);
					}
				}
			}
		};

		console.log(jsonString);
		xhr.send(jsonString);
	}
	
	catch(error)
	{
		console.log(error.message);
		document.getElementById("showDetailsPolicyResult").innerHTML = error.message;
		document.getElementById("showDetailsPolicyResult").style.color = "red";
	}
}

function clearModalForm(numOfDependents)
{
	// Clear the Client Information Form
	document.getElementById("clientFirstName").value = "";
	document.getElementById("clientLastName").value = "";

	document.getElementById("clientDateOfBirth").value = "";
	document.getElementById("clientSSN").value = "";

	document.getElementById("clientPhone").value = "";
	document.getElementById("clientAddress").value = "";

	document.getElementById("clientSecondLineAddress").value = "";

	document.getElementById("clientCity").value = "";
	document.getElementById("clientAddress").value = "";

	document.getElementById("clientZIP").value = "";
	document.getElementById("sourceMenu").value = "";

	document.getElementById("clientEmail").value = "";
	document.getElementById("clientNumOfDependents").value = "";

	// Clear the Policy Information Form
	document.getElementById("createPlanType").value = "";
	document.getElementById("createAncillaryType").value = "";
	document.getElementById("createEffectiveDate").value = "";

	document.getElementById("createCarrier").value = "";
	document.getElementById("createNotes").value = "";

	document.getElementById("createClientAmbassador").value = "";
	document.getElementById("createAppID").value = "";

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

	// Container <div> where dynamic content will be placed
	let container = document.getElementById("dependentsContainer");

	// Clear previous contents of the container
	while (container.hasChildNodes()) 
	{
		container.removeChild(container.lastChild);
	}
}

function clearUpdatedModalForm(numOfDependents)
{
	// Clear the Client Information Form
	document.getElementById("updateClientFirstName").value = "";
	document.getElementById("updateClientLastName").value = "";

	document.getElementById("updateClientSSN").value = "";
	document.getElementById("updateClientPhone").value = "";

	document.getElementById("updateClientAddress").value = "";

	document.getElementById("updateClientSecondLineAddress").value = "";
	document.getElementById("updateClientCity").value = "";

	document.getElementById("updateClientZIP").value = "";

	document.getElementById("updateClientEmail").value = "";

	document.getElementById("updateClientNumOfDependents").value = "";

	// Clear the Policy Information Form
	document.getElementById("updatePlanType").value = "";

	document.getElementById("updateAncillaryType").value = "";

	document.getElementById("updateEffectiveDate").value = "";

	document.getElementById("updateNotes").value = "";
	document.getElementById("updateClientAmbassador").value = "";

	document.getElementById("updateDetailsAppID").value = "";

	for (let i = 0; i < numOfDependents; i++)
	{
		// Depending on the number of dependents
		// these strings will pull the right data accordingly.
		var FNameString = "update-dependent-input-FirstName" + i;
		var LNameString = "update-dependent-input-LastName" + i;
		var DOBString = "update-dependent-input-DOB" + i;
		var SSNString = "update-dependent-input-SSN" + i;

		document.getElementById(FNameString).value = "";
		document.getElementById(LNameString).value = "";
		document.getElementById(DOBString).value = "";
		document.getElementById(SSNString).value = "";
	}

	// Container <div> where dynamic content will be placed
	let container = document.getElementById("updateDependentsContainer");

	// Clear previous contents of the container
	while (container.hasChildNodes()) 
	{
		container.removeChild(container.lastChild);
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

	var clientZIP = document.getElementById("clientZIP").value;
	let clientState = document.getElementById("statesMenu").value;

	var clientEmail = document.getElementById("clientEmail").value;
	var clientNumOfDependents = document.getElementById("clientNumOfDependents").value;

	var clientSource = document.getElementById("sourceMenu").value;

	var spanName = "createClientResult";

	let today = new Date();
	let date = today.getFullYear() + '-' + (today.getMonth()+1)+ '-' + today.getDate();
	let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	let submissionDate = date + ' ' + time;

	if (clientNumOfDependents < 0)
	{
		document.getElementById("createClientResult").innerHTML = "Data Value Error: Negative values are not allowed";
		document.getElementById("createClientResult").style.color = "red";
		return;
	}

	// Ensure that if a user inserts nothing
	// into the number of dependents field, we replace 
	// the value with a 0 to avoid MySQL type errors.
	if (clientNumOfDependents == null || clientNumOfDependents == "")
		clientNumOfDependents = 0;

	// Remove any special characters in order to ensure all
	// numbers are a 10 digit string.
	clientPhone = clientPhone.replace(/[^\w\s]/gi, '');

	// Remove any dashes and replace them with a forward slash.
	clientDateOfBirth = clientDateOfBirth.replace(/[---]+/gi, '/');

	// This helps to ensure that none of the form
	// inputs are left blank and only have alphabetical characters.
	if (!checkFormNames(clientFirstName, clientLastName, spanName))
		return;
	
	// Ensure that the DOB date is greater than
	// 1900 and less than any future date
	let DOBFlag = true;

	if (!restrictDate(clientDateOfBirth, DOBFlag))
	{
		document.getElementById(spanName).innerHTML = "Invalid Date: Please choose a date between the years 1900 and " + new Date().getFullYear();
		document.getElementById(spanName).style.color = "red";
		return;	
	}

	// Package JSON that contains all required
	// client fields
  var requiredObj = 
	{
		"Client Date Of Birth": clientDateOfBirth,
		"Client Address": clientAddress,
		"Client City": clientCity,
		"Client ZipCode": clientZIP,
		"Client State": clientState,
		"Client Source": clientSource
	};

	// This helps to ensure that none of the form
	// inputs are left blank and only have alphabetical characters.
	try 
	{
		checkRequiredFields(requiredObj, spanName);
	}

	catch (error)
	{
		console.log(error);
		return;
	}

	document.getElementById("createClientResult").innerHTML = "";

	// Check Policy and Dependent Info
	// before we insert any data in the database.
	if (!(checkPolicyInfo(spanName) && checkDependentInfo(clientNumOfDependents, spanName)))
		return;

	// Package a JSON payload to deliver to the server that contains all
	// the contact details in order create the contact.
  var jsonPayload = 
	{
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
		"SubmissionDate": submissionDate,
		"Source": clientSource
	};

	jsonString = JSON.stringify(jsonPayload);

	var url = urlBase + '/createPolicyHolder.' + extension;
	var xhr = new XMLHttpRequest();

	xhr.open("POST", url, true);
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
					console.log("Client insertion was successful!");
					document.getElementById("createClientResult").innerHTML = "Primary PolicyHolder has been added.";
					document.getElementById("createClientResult").style.color = "green";

					globalPolicyID = endpointmsg;

					if (clientNumOfDependents >= 1)
					{
						// Retrieve and generate an array based on
						// the dependents forms
						let dependentsArray = getDependentsArray(clientNumOfDependents);

						insertPolicyInfo();
						insertDependents(dependentsArray);
						clearModalForm();

						document.getElementById("createClientResult").innerHTML = "All Primary PolicyHolder information has been added.";
						document.getElementById("createClientResult").style.color = "green";
					}
					
					else
					{
						insertPolicyInfo();
						clearModalForm();

						document.getElementById("createClientResult").innerHTML = "All Primary PolicyHolder information has been added.";
						document.getElementById("createClientResult").style.color = "green";
					}
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
		url = 'https://sunsure-agent.com/API/createDependent.php';
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

	for (let i = 0; i < dependentsArray.length; i++)
		promiseArray.push(postData(dependentsArray[i]))

	Promise.all(promiseArray)
	.then(values => values.map(value => console.log(value.url + " ==> " + value.status)))
	.catch(err=>console.log(err))
}

// Deletes a contact based on their ID. Currently not in use
function deleteClient(clientID)
{
	let xhr = new XMLHttpRequest();
	let url = urlBase + "/deletePolicyHolder" + extension;

	// Package a JSON payload to deliver to the server that contains all
	// the contact's ID in order delete the contact.
	var jsonPayload =
	'{"PolicyID" : "' + clientID + '"}';

	xhr.open("POST", url, true);
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
				var jsonObject = JSON.parse(xhr.responseText);
				var endpointmsg = jsonObject['msg'];

				if (endpointmsg === "Primary PolicyHolder has been deleted successfully!")
				{
					console.log(endpointmsg);
					// document.getElementById("createClientResult").innerHTML = endpointmsg;
					// document.getElementById("createClientResult").style.color = "green";
				}

				else
				{
					console.log(endpointmsg);
					return;
					// document.getElementById("createClientResult").innerHTML = endpointmsg;
					// document.getElementById("createClientResult").style.color = "red";
				}
			}
		};
		
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("deleteResult").innerHTML = err.message;
	}
}

function clearDependents(dependentID)
{
	var xhr = new XMLHttpRequest();
	var url = urlBase + "/clearDependents." + extension;

	// Package a JSON payload to deliver to the server that contains all
	// the contact's ID in order delete the contact.
	var jsonPayload =
	'{"DependentID" : "' + dependentID + '"}';

	xhr.open("POST", url, false);
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
				var jsonObject = JSON.parse(xhr.responseText);
				var endpointmsg = jsonObject['msg'];

				if (endpointmsg === "Dependents have been cleared")
				{
					console.log(endpointmsg);
				}

				else
				{
					console.log(endpointmsg);
				}
			}
		};
		
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("updateClientResult").innerHTML = err.message;
	}	
}

function insertUpdatedDependents(dependentsArray)
{
	async function postData(data) 
	{
		url = 'https://sunsure-agent.com/API/createDependent.php';
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

	for (let i = 0; i < dependentsArray.length; i++)
		promiseArray.push(postData(dependentsArray[i]))

	Promise.all(promiseArray)
	.then(values => values.map(value => console.log(value.url + " ==> " + value.status)))
	.catch(err=>console.log(err))

	console.log(dependentsArray);
}

function updatePolicyInfo(policyID)
{
	// Load in Updated Policy Information
	var updatedPlanType = document.getElementById("updatePlanType").value;
	var updatedAncillaryType = document.getElementById("updateAncillaryType").value;

	var updatedEffectiveDate = document.getElementById("updateEffectiveDate").value;
	var updatedCarrier = document.getElementById("updateCarriers").value;
	var updatedNotes = document.getElementById("updateNotes").value;

	var updatedAmbassador = document.getElementById("updateClientAmbassador").value;
	var updatedApplicationID = document.getElementById("updateDetailsAppID").value;

	updatedEffectiveDate = updatedEffectiveDate.replace(/[---]+/gi, '/');

		// Package a JSON payload to deliver to the server that contains all
	// the contact details in order create the contact.
  var jsonPayload = 
	{
		"ApplicationID": updatedApplicationID,
		"PolicyType": updatedPlanType,
		"AncillaryType": updatedAncillaryType,
		"Carrier" : updatedCarrier,
		"EffectiveDate": updatedEffectiveDate,
		"AmbassadorName": updatedAmbassador,
		"Notes": updatedNotes,
		"PolicyInfoID": policyID
	};

	jsonString = JSON.stringify(jsonPayload);

	var url = urlBase + '/updatePolicyInfo.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
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
				var endpointmsg = jsonObject['msg'];
				console.log(endpointmsg);

				if (endpointmsg === "Policy Information has been updated successfully!")
				{
					document.getElementById("updateClientResult").innerHTML = "Primary Policyholder has been fully updated!";
					document.getElementById("updateClientResult").style.color = "green";
				}

				else
				{
					document.getElementById("updateClientResult").innerHTML = endpointmsg;
					document.getElementById("updateClientResult").style.color = "red";
				}
			}
		};

		console.log(jsonString);
		xhr.send(jsonString);
	}
	
	catch(error)
	{
		console.log(error.message);
		document.getElementById("updateClientResult").innerHTML = error.message;
		document.getElementById("updateClientResult").style.color = "red";
	}
}

function getUpdatedDependentsArray(numOfDependents, dependentID)
{
	var dependentsArray = [];
	var spanName = "updateClientResult";

	for (let i = 0; i < numOfDependents; i++)
	{
		// Depending on the number of dependents
		// these strings will pull the right data accordingly.
		var FNameString = "update-dependent-input-FirstName" + i;
		var LNameString = "update-dependent-input-LastName" + i;
		var DOBString = "update-dependent-input-DOB" + i;
		var SSNString = "update-dependent-input-SSN" + i;

		var dependentFirstName = document.getElementById(FNameString).value;
		var dependentLastName = document.getElementById(LNameString).value;
		var dependentDOB = document.getElementById(DOBString).value;
		var dependentSSN = document.getElementById(SSNString).value;

		// Remove any dashes and replace them with a forward slash.
		dependentDOB = dependentDOB.replace(/[---]+/gi, '/');

		// This helps to ensure that none of the form
		// inputs are left blank and only have alphabetical characters.
		if (!checkFormNames(dependentFirstName, dependentLastName, spanName))
		{
			dependentsArray.length = 0;
			return;
		}

		// Create JSON for each dependent to later
		// store in dependentsArray.
		var dependentObj = 
		{
			"FirstName": dependentFirstName,
			"LastName": dependentLastName,
			"DateOfBirth": dependentDOB,
			"SSN": dependentSSN,
			"DependentID": dependentID
		};

		dependentJSON = JSON.stringify(dependentObj);

		dependentsArray.push(dependentJSON);
	}

	return dependentsArray;
}

// Updates a Contact's information based on their ID.
function updateClient(policyID)
{
	var updatedClientFirstName = document.getElementById("updateClientFirstName").value;
	var updatedClientLastName = document.getElementById("updateClientLastName").value;

	var updatedClientDateOfBirth = document.getElementById("updateClientDateOfBirth").value;
	var updatedClientSSN = document.getElementById("updateClientSSN").value;

	var updatedClientPhone = document.getElementById("updateClientPhone").value;
	var updatedClientAddress = document.getElementById("updateClientAddress").value;

	var updatedClientSecondLineAddress = document.getElementById("updateClientSecondLineAddress").value;

	var updatedClientCity = document.getElementById("updateClientCity").value;

	var updatedClientZIP = document.getElementById("updateClientZIP").value;
	let updatedClientState = document.getElementById("updateStatesMenu").value;

	var updatedClientEmail = document.getElementById("updateClientEmail").value;
	var updatedClientNumOfDependents = document.getElementById("updateClientNumOfDependents").value;

	var updatedClientSource = document.getElementById("updateSourceMenu").value;

	var spanName = "updateClientResult";

	let today = new Date();
	let date = today.getFullYear() + '-' + (today.getMonth()+1)+ '-' + today.getDate();
	let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	let updatedSubDate = date + ' ' + time;

	document.getElementById("updateClientResult").innerHTML = "";

	// Remove any special characters in order to ensure all
	// numbers are a 10 digit string.
	updatedClientPhone = updatedClientPhone.replace(/[^\w\s]/gi, '');

	// Remove any dashes and replace them with a forward slash.
	updatedClientDateOfBirth = updatedClientDateOfBirth.replace(/[---]+/gi, '/');

	if (updatedClientNumOfDependents < 0)
	{
		document.getElementById("updateClientResult").innerHTML = "Data Value Error: Negative values are not allowed";
		document.getElementById("updateClientResult").style.color = "red";
		return;
	}

	let updateFlag = true;

	// This helps to ensure that none of the form
	// inputs are left blank and only have alphabetical characters.
	if (!checkFormNames(updatedClientFirstName, updatedClientLastName, spanName, updateFlag))
		return;
	
	// Ensure that DOB is correct.
	let DOBFlag = true;

	if (!restrictDate(updatedClientDateOfBirth, DOBFlag))
	{
		document.getElementById(spanName).innerHTML = "Invalid Date: Please choose a date between the years 1900 and " + new Date().getFullYear();
		document.getElementById(spanName).style.color = "red";
	}

	// Package a JSON payload to deliver to the server that contains all
	// the contact details in order create the contact.
  var jsonPayload = 
	{
		"AgentID": userID,
		"PolicyID": policyID,
		"FirstName": updatedClientFirstName,
		"LastName" : updatedClientLastName,
		"DateOfBirth": updatedClientDateOfBirth,
		"SSN": updatedClientSSN,
		"Phone": updatedClientPhone,
		"Address": updatedClientAddress,
		"Second_Line_Address": updatedClientSecondLineAddress,
		"City": updatedClientCity,
		"ZipCode": updatedClientZIP,
		"State": updatedClientState,
		"Email": updatedClientEmail,
		"NumOfDependents": updatedClientNumOfDependents,
		"UpdatedSubDate": updatedSubDate,
		"Source": updatedClientSource
	};

	jsonString = JSON.stringify(jsonPayload);

	if (!checkUpdatedDependentInfo(updatedClientNumOfDependents, spanName))
	{
		return;
	}

	var url = urlBase + '/updatePolicyHolder.' + extension;
	var xhr = new XMLHttpRequest();

	xhr.open("POST", url, true);
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
				var endpointmsg = jsonObject['msg'];
				console.log(endpointmsg);

				if (endpointmsg === "Primary PolicyHolder has been updated successfully!")
				{
					console.log(endpointmsg);
					document.getElementById("updateClientResult").innerHTML = endpointmsg;
					document.getElementById("updateClientResult").style.color = "green";

					// If we want to update the dependents information
					// then we need to ensure that a value is inserted
					if (updatedClientNumOfDependents >= 1)
					{
						// Retrieve and generate an array based on
						// the updated dependents forms
						clearDependents(policyID);
						let dependentsArray = getUpdatedDependentsArray(updatedClientNumOfDependents, policyID);

						updatePolicyInfo(policyID);
						insertUpdatedDependents(dependentsArray);
						clearUpdatedModalForm(updatedClientNumOfDependents);
					}
					
					else if (updatedClientNumOfDependents == 0)
					{
						clearDependents(policyID);
						updatePolicyInfo(policyID);
						clearUpdatedModalForm(updatedClientNumOfDependents);
					}

					else if (updatedClientNumOfDependents == "" || updatedClientNumOfDependents === null)
					{
						updatePolicyInfo(policyID);
						clearUpdatedModalForm(updatedClientNumOfDependents);
					}
				}

				else
				{
					console.log(endpointmsg);
					document.getElementById("updateClientResult").innerHTML = endpointmsg;
					document.getElementById("updateClientResult").style.color = "red";
				}
			}
		};

		console.log(jsonString);
		xhr.send(jsonString);
	}
	
	catch(error)
	{
		console.log(error.message);
		document.getElementById("updateClientResult").innerHTML = error.message;
		document.getElementById("updateClientResult").style.color = "red";
	}
}

// Searches for a user's contacts based on the userID.
function searchClients()
{
	// Collects data from the search bar in the landing page.
	let searchQuery = document.getElementById("clientsInput").value;

	// Clears the table to allow for the construction of a new table
	// based on the search results.
  $("#clientsTable tbody tr").remove();

	// Package a JSON payload to deliver to the Search Endpoint with
	// the UserID in order to display the contacts based on the search input.
	var jsonPayload = '{"AgentID" : "' + userID + '", "Input" : "' + searchQuery + '"}';
	var url = urlBase + '/searchPolicyHolder.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
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
					document.getElementById("searchResults").innerHTML = clientsList;
					document.getElementById("searchResults").style.color = "red";
				}

				else
				{
					// Update Status for Clients Table to show 
					// how many results the search query returned
					numOfResults = clientsList.length;
					document.getElementById("searchResults").innerHTML = "Search returned " + numOfResults + " result(s)";
					document.getElementById("searchResults").style.color = "green";

					// For each client in the JSON array, the client's
					// information will be added to the table.
					for (let i in clientsList)
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
		document.getElementById("searchResults").innerHTML = error.message;
		document.getElementById("searchResults").style.color = "red";
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
function checkFormNames(firstName, lastName, spanName, updateFlag = false)
{
	if (updateFlag != true && (firstName.length == 0 || lastName.length == 0))
	{
		document.getElementById(spanName).innerHTML = "Either First Name or Last Name field is empty.";
		document.getElementById(spanName).style.color = "red";
		return false;
	}

	var isGoodChar = function(value)
	{
		return (value == ' ' || value == '-');
 	}

  var isAlpha = function(ch)
  {
    return typeof ch === "string" && ch.length === 1 && (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z");
  }

  for (let i = 0; i < firstName.length; i++) 
	{
    if (!(isGoodChar(firstName[i]) || isAlpha(firstName[i]))) 
		{
			document.getElementById(spanName).innerHTML = "First name must have alphabet characters only";
			document.getElementById(spanName).style.color = "red";

      return false;
    }
  }

  for (let j = 0; j < lastName.length; j++) 
	{
    if (!(isGoodChar(lastName[j]) || isAlpha(lastName[j]))) 
		{
			document.getElementById(spanName).innerHTML = "Last name must have alphabet characters only";
			document.getElementById(spanName).style.color = "red";

      return false;
    }
	}

  return true;
}

// Check fields and sanitize inputs
// in case of any anomalies.
function checkRequiredFields(clientObj, spanName)
{
	for (let key in clientObj)
	{
		if (clientObj[key] === "")
		{
			document.getElementById(spanName).innerHTML = "Data Field Missing: " + key + " cannot be empty.";
			document.getElementById(spanName).style.color = "red";
			throw new Error("Data Field Missing");
		}
	}

	return;
}