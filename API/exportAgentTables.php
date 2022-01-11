<?php
  // File to connect to DB
  require 'db_conn.php';


  // Receive JSON payload from export hook.
  $inputFromJson = json_decode(file_get_contents('php://input'), true);

  // Extract and place all JSON members
  // into separate variables.
  $AgentID = $inputFromJson['AgentID'];
  $Selection = $inputFromJson['Selection'];

  // In case of an empty user
  // input then we will print out
  // the correct messages.
  switch ($Selection)
  {
    case 1:
      $table_name = "Primary_PolicyHolders";
      $sql = "SELECT * FROM Primary_PolicyHolders WHERE AgentID = '$AgentID'";
      break;
    case 2:
      $table_name = "Policy_Info";
      $sql = "SELECT * FROM Policy_Info";
      break;
    case 3:
      $table_name = "Dependents";
      $sql = "SELECT * FROM Dependents";
      break;
  }

  $result = mysqli_query($conn, $sql);

  if (!$result)
    die('Couldn\'t fetch records');

  $num_fields = mysqli_num_fields($result);
  $headers = array();
  $csv_filename = "export" . $table_name . ".csv";

  while ($fieldinfo = mysqli_fetch_field($result))
  {
    $headers[] = $fieldinfo->name;
  }

  $fp = fopen($csv_filename, 'w');

  if ($fp && $result)
  {
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="'.$csv_filename.'"');
    header('Pragma: no-cache');
    header('Expires: 0');
    fputcsv($fp, $headers);

    while ($row = $result->fetch_array(MYSQLI_NUM))
    {
      fputcsv($fp, array_values($row));
    }

    die;
  }
?>