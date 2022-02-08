<?php
  // File to connect to DB
  require 'db_conn.php';

  // Receive JSON payload from export hook.
  $inputFromJson = json_decode(file_get_contents('php://input'), true);

  // Extract and place all JSON members
  // into separate variables.
  $AgentID = $inputFromJson['AgentID'];
  $Role = $inputFromJson['Role'];

  // Select database tables based 
  // on user input.
  $export_name = "AgentData";

  // It may seem counterintuitive
  // but strcmp returns 0 if there
  // is no difference between $Role
  // and "User".
  if (strcmp($Role, "Admin") == 0)
  {
    // Back up SQL
    // $sql = "SELECT * 
    // FROM Primary_PolicyHolders 
    // INNER JOIN Policy_Info ON Policy_Info.PolicyInfoID = Primary_PolicyHolders.PolicyID 
    // LEFT OUTER JOIN Dependents ON Dependents.DependentID = Policy_Info.PolicyInfoID";

    $sql = "SELECT * FROM Primary_PolicyHolders
      LEFT JOIN Agents ON Agents.AgentID = Primary_PolicyHolders.AgentID
      INNER JOIN Policy_Info ON Policy_Info.PolicyInfoID = Primary_PolicyHolders.PolicyID 
      LEFT OUTER JOIN Dependents ON Dependents.DependentID = Policy_Info.PolicyInfoID";
  }

  else
  {
    $sql = "SELECT * 
    FROM Primary_PolicyHolders 
    INNER JOIN Policy_Info ON Policy_Info.PolicyInfoID = Primary_PolicyHolders.PolicyID 
    LEFT OUTER JOIN Dependents ON Dependents.DependentID = Policy_Info.PolicyInfoID 
    WHERE AgentID = '$AgentID'";
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
  $csv_filename = "export" . $export_name . ".csv";

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