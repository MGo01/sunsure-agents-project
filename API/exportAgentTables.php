<?php
  // File to connect to DB
  require 'db_conn.php';


  // Receive JSON payload from export hook.
  $inputFromJson = json_decode(file_get_contents('php://input'), true);

  // Extract and place all JSON members
  // into separate variables.
  $AgentID = $inputFromJson['AgentID'];
  $Selection = $inputFromJson['Selection'];

  // Select database tables based 
  // on user input.
  switch ($Selection)
  {
    case 1:
      $table_name = "Primary_PolicyHolders";
      $sql = "SELECT * FROM Primary_PolicyHolders WHERE AgentID = '$AgentID'";
      break;
    case 2:
      $table_name = "Policy_Info";
      $sql = "SELECT * FROM Policy_Info WHERE Policy_Info.PolicyInfoID IN (SELECT Primary_PolicyHolders.PolicyID FROM Primary_PolicyHolders WHERE AgentID = '$AgentID')";
      break;
    case 3:
      $table_name = "Dependents";
      $sql = "SELECT * FROM Dependents WHERE Dependents.DependentID IN (SELECT Primary_PolicyHolders.PolicyID FROM Primary_PolicyHolders WHERE AgentID = '$AgentID')";
      break;
  }

  $result = mysqli_query($conn, $sql);

  // Terminate the script if no 
  // valid information can be retrieved.
  if (!$result)
    die('Couldn\'t fetch records');

  // Extract the number of fields
  // and provide the correct name for the csv.
  $num_fields = mysqli_num_fields($result);
  $headers = array();
  $csv_filename = "export" . $table_name . ".csv";

  while ($fieldinfo = mysqli_fetch_field($result))
  {
    $headers[] = $fieldinfo->name;
  }

  $fp = fopen("php://output", 'w');

  // If the file and result are both
  // valid then we export the csv file.
  if ($fp && $result)
  {
    // Set the appropiate headers for
    // the exported csv file.
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="'.$csv_filename.'"');
    header('Pragma: no-cache');
    header('Expires: 0');
    fputcsv($fp, $headers);

    // Extract each row of the query result
    // and place it in the csv file.
    while ($row = $result->fetch_array(MYSQLI_NUM))
    {
      fputcsv($fp, array_values($row));
    }

    die;
  }
?>