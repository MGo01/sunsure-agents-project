<?php

  // File to connect to DB
  require 'db_conn.php';

  // Load in require Composer libary
  require 'vendor/autoload.php'; 

  // Receive JSON payload from login.js file.
  $inputFromJson = json_decode(file_get_contents('php://input'), true);
  $input_email = $inputFromJson['Email'];

  // Create prefix to add uniqueness
  $offset = 15;
  $rand_str = md5(time().$input_email);

  $pre = substr($rand_str, -$offset);

  // Generate a unique ID 
  $PasswordToken = uniqid($pre, true);

  // Check if the token references any User in the database.
  $sql = "UPDATE Agents SET PasswordToken = '$PasswordToken' WHERE Email = '$input_email'";

  if (mysqli_query($conn, $sql))
  {
    $email = new \SendGrid\Mail\Mail(); 
    $email->setFrom("SA-bot-2021@outlook.com", "Example User");
    $email->setSubject("Sending with SendGrid is Fun");
    $email->addTo($input_email, "Example User");
    $email->addContent("text/plain", "and easy to do anywhere, even with PHP");
    $email->addContent(
        "text/html", "<strong>and easy to do anywhere, even with PHP</strong>"
    );

    $sendgrid = new \SendGrid(getenv('SENDGRID_API_KEY'));

    try 
    {
      $response = $sendgrid->send($email);
      print $response->statusCode() . "\n";
      print_r($response->headers());
      print $response->body() . "\n";
    } 

    catch (Exception $e) 
    {
      echo 'Caught exception: '. $e->getMessage() ."\n";
    }
  }

  else
  {
    returnError("Email/User was not found.");
  }

  function returnError($error)
  {
    $retval->msg = $error;
    outputJson($retval);
  }
  
  function returnInfo($info)
  {
    $retval->msg = $info;
    outputJson($retval);
  }
?>