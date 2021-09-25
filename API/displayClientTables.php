<?php
  // File to connect to DB
  require 'db_conn.php';

  // Receive JSON payload from search.js file.
  $inputFromJson = json_decode(file_get_contents('php://input'), true);

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
    public $Dependents = array();
  }

  // Create a class capable of holding Dependent
  // information for search queries.
  class Dependent
  {
    public $FirstName = "";
    public $LastName = "";
    public $DateOfBirth = "";
    public $SSN = "";
    public $DependentID = "";
  }

  // Create an Array of Policyholders.
  $primaryPolicyHolders[] = array();

  // Check if the input string has an empty space at the beginning of the array.
  if (strpos($Input, ' ') > 0)
  {
    $names = explode(" ", $Input);

    $sql_check = "SELECT * from Primary_PolicyHolders WHERE (AgentID = $AgentID)";

    $result = mysqli_query($conn, $sql_check);

    if (mysqli_query($conn, $sql_check))
    {
      // Retrieve search results via getPolicyHolders()
      // and store them in "searchResults"
      $searchResults = getPolicyHolders($result);

      if (is_null($searchResults))
        returnInfo("No valid Primary PolicyHolders were found");

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
    // Retrieve ALL policyholders that correspond to the AgentID
    $sql = "SELECT * FROM Primary_PolicyHolders WHERE (AgentID = $AgentID)";

    $result = mysqli_query($conn, $sql);

    if (mysqli_query($conn, $sql))
    {
      // Retrieve search results via getPolicyHolders()
      // and store them in "searchResults"
      $searchResults = getPolicyHolders($result, $conn);

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

  function getDependents($policyHolder, $conn)
  {
    // SQL Command to get every singe Dependent from the corresponding PolicyID.
    $sql_dep = "SELECT * FROM Dependents WHERE (DependentID = $policyHolder->PolicyID)";
    $dependent_result = mysqli_query($conn, $sql_dep);

    if (mysqli_query($conn, $sql_dep))
    {
      $dependent_array = array();

      while ($dep_row = mysqli_fetch_array($dependent_result))
      {
        $newDependent = new Dependent();

        $newDependent->FirstName = $dep_row['FirstName'];
        $newDependent->LastName = $dep_row['LastName'];
        $newDependent->DateOfBirth = $dep_row['DateOfBirth'];
        $newDependent->SSN = $dep_row['SSN'];
        $newDependent->DependentID = $dep_row['DependentID'];

        $dependent_array[] = $newDependent;
      }

      return $dependent_array;
    }

    else
    {
      // echo "failed to search records";
      returnError($conn->error);
    }
  }

  function getPolicyHolders($result, $conn)
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

      $newPolicyHolder->Dependents[] = getDependents($newPolicyHolder, $conn);

      $primaryPolicyHolders[] = $newPolicyHolder;
    }

    return $primaryPolicyHolders;
  }

  function outputJson($file)
  {
    header("Content-type:application/json");
    $jsonObj = json_encode($file);
    echo $jsonObj;
  }
?>