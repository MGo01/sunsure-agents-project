<?php
  // File to connect to DB
  require 'db_conn.php';

  // Receive JSON payload from search.js file.
  $inputFromJson = json_decode(file_get_contents('php://input'), true);
	
	$Input = $inputFromJson["Input"];
	$AgentID = $inputFromJson["AgentID"];
 
  // Create a class capable of holding policy holder
  // information for search queries.
  class PolicyHolder 
  {
    public $AgentID = "";
    public $PolicyID = "";
    public $FirstName = "";
    public $LastName = "";
    public $DateOfBirth = "";
    public $SSN = "";
    public $Phone = "";
    public $Address = "";
    public $Second_Line_Address = "";
    public $City = "";
    public $ZipCode = "";
    public $State =  "";
    public $Email = "";
    public $NumOfLives = "";
    public $NumOfDependents = "";
    public $PolicyInfoID = "";
    public $Source = "";
  }
 
  // Create an Array of Policyholders.
  $primaryPolicyHolders[] = array();
 
  // Check if the input string has an empty space at the beginning of the array.
  if (strpos($Input, ' ') > 0)
  {
    $names = explode(" ", $Input);

    $sql_check = "SELECT * from Primary_PolicyHolders WHERE (AgentID = $AgentID) AND (FirstName LIKE '%$names[0]%' AND LastName LIKE '%$names[1]%')";

    $result = mysqli_query($conn, $sql_check);

    if (mysqli_query($conn, $sql))
    {
      // Retrieve search results via getPolicyHolders() 
      // and store them in "searchResults"
      $searchResults = getPolicyHolders($result);
      returnInfo($searchResults);
    }

    else
    {
      // echo "failed to search records";
      returnError($conn->error);
    }
  }

  else
  {

    $sql = "SELECT * from Primary_PolicyHolders Where (AgentID = $AgentID) AND (FirstName LIKE '%$Input%' OR LastName LIKE '%$Input%' OR              Email LIKE '%$Input%' OR Phone LIKE '%$Input%')";

    $result = mysqli_query($conn, $sql);

    if (mysqli_query($conn, $sql))
    {
      // Retrieve search results via getPolicyHolders() 
      // and store them in "searchResults"
      $searchResults = getPolicyHolders($result);
      returnInfo($searchResults);
    }

    else
    {
      // echo "failed to search records";
      returnError($conn->error);
    }
  }
  
  mysqli_close($conn);
	
  function returnError($error)
  {
    $retval = (object) [
      'msg' => $error
    ];
    
    outputJson($retval);
  }

  function returnInfo($info)
  {
    $retval = (object) [
    'results' => $info
    ];

    outputJson($retval);
  }

  function getPolicyHolders($result)
  {
    while ($row = mysqli_fetch_array($result))
    {
      $newPolicyHolder = new PolicyHolder();
      
      $newPolicyHolder->AgentID = $row['AgentID'];
      $newPolicyHolder->PolicyID = $row['PolicyID'];
      $newPolicyHolder->FirstName = $row['FirstName'];
      $newPolicyHolder->LastName = $row['LastName'];

      $newPolicyHolder->DateOfBirth = $row['DateOfBirth'];
      $newPolicyHolder->SSN = $row['SSN'];
      $newPolicyHolder->Phone = $row['Phone'];
      $newPolicyHolder->Address = $row['Address'];
      $newPolicyHolder->Second_Line_Address = $row['Second_Line_Address'];

      $newPolicyHolder->City = $row['City'];
      $newPolicyHolder->ZipCode = $row['ZipCode'];
      $newPolicyHolder->State = $row['State'];
      $newPolicyHolder->Email = $row['Email'];
      
      $newPolicyHolder->NumOfLives = $row['NumOfLives'];
      $newPolicyHolder->NumOfDependents = $row['NumOfDependents'];
      $newPolicyHolder->PolicyInfoID = $row['PolicyInfoID'];
      $newPolicyHolder->Source = $row['Source'];
      
      $primaryPolicyHolders[] = $newPolicyHolder;
    }
  
    unset($primaryPolicyHolders[0]);
    
    return $primaryPolicyHolders;
  }

  function outputJson($file)
  {
    header("Content-type:application/json");
    $jsonObj = json_encode($file);
    echo $jsonObj;
  }
?>