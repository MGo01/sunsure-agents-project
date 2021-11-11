<?php
  // File to connect to DB
  require 'db_conn.php';

  // Dependeing on the command line
  // argument/user input, different integer
  // vals will map to different tables.
  $input = $argv[1];

  if (empty($input))
    die('Improper input format, format should be like so: script_name.php 1/2/3/4\n1: Agents\n2: Primary Policyholders\n3: Policy Info\n4: Dependents\n');

  // Parse string into an int
  $base = 10;
  $select = intval($input, $base);

  switch ($select)
  {
    case 1:
      $table_name = "Agents";
      $sql = "SELECT * FROM Agents";
      break;
    case 2:
      $table_name = "Primary_PolicyHolders";
      $sql = "SELECT * FROM Primary_PolicyHolders";
      break;
    case 3:
      $table_name = "Policy_Info";
      $sql = "SELECT * FROM Policy_Info";
      break;
    case 4:
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