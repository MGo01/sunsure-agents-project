<?php

  // File to connect to DB
  require 'db_conn.php';

  // Load in require Composer libary
  require '../vendor/autoload.php';

  // Load in email configurations
  $configs = include('config.php');

  // Receive JSON payload from login.js file.
  $inputFromJson = json_decode(file_get_contents('php://input'), true);
  $input_email = $inputFromJson["Email"];

  // Create prefix to add uniqueness
  $offset = 15;
  $rand_str = md5(time().$input_email);

  $pre = substr($rand_str, -$offset);

  // Generate a unique Password Token
  $PasswordToken = uniqid($pre, true);

  // Check if the token references any User in the database.
  $sql = "UPDATE Agents SET PasswordToken = '$PasswordToken' WHERE Email = '$input_email'";

  $standard_msg = "Hi Sunsure Agent User,\n 
  We have received a request to reset the password for Sunsure Agent account {$input_email}. 
  You can reset your password by clicking the link below within one hour.\n

  
  Make sure to copy and paste the following confirmation code into the reset form.\n
  {$PasswordToken}\n\n
  
  If you did not request this, please ignore this email and your password will remain unchanged."

  if (mysqli_query($conn, $sql))
  {
    $email = new \SendGrid\Mail\Mail();
    $email->addTo($input_email);
    $email->setFrom($configs['SENDER_EMAIL']);
    $email->setSubject("Sending with SendGrid is Fun");
    $email->addContent("text/plain", $msg);
    $email->addContent(
        "text/html", "<strong>{$msg}</strong>"
    );

    // $sendgrid = new \SendGrid($api_key);
    $sendgrid = new \SendGrid($configs['SENDGRID_API_KEY']);

    try
    {
      $sendgrid->send($email);
      returnInfo("Email sent to {$input_email}");
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
    $retval = (object) [
    'results' => $info
    ];

    outputJson($retval);
  }

  function outputJson($file)
  {
    header("Content-type:application/json");
    $jsonObj = json_encode($file);
    echo $jsonObj;
  }
?>