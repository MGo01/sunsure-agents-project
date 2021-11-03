<?php
  // File to connect to DB
  require 'db_conn.php';

  // Load in require Composer libary
  require '../vendor/autoload.php';

  // Load in email configurations
  $configs = include('config.php');

  // Receive JSON payload from signup.js file.
  $inputFromJson = json_decode(file_get_contents('php://input'), true);

  $FirstName = $inputFromJson['FirstName'];
  $LastName = $inputFromJson['LastName'];
  $Password =  $inputFromJson['Password'];
  $Email = $inputFromJson['Email'];

  if (checkEmailUsed($Email, $conn))
  {
    // Create prefix to add uniqueness
    $offset = 15;
    $rand_str = md5(time().$Email);

    $pre = substr($rand_str, -$offset);

    // Generate a unique ID 
    $AgentToken = uniqid($pre, true);

    $sql = "INSERT INTO Agents (Password, Email, FirstName, LastName, AgentToken)
    VALUES ('".$Password."','".$Email."','".$FirstName."','".$LastName."', '".$AgentToken."')";

    if (mysqli_query($conn, $sql))
    {
      $verification_link = "<a href='https://sunsure-agent.com/verifyEmail.html'>Click To Verify Email</a>";

      $standard_msg = "Hi Sunsure Agent User,<br>
      We have received a request to verify the following Sunsure Agent account {$Email}
      Please verify your account by clicking the link:<br><br>

      {$verification_link}<br><br>

      Make sure to copy and paste the following confirmation code into the verification form.<br>
      {$AgentToken}<br><br>

      If you did not request this, please ignore this email";

      $email = new \SendGrid\Mail\Mail();
      $email->addTo($Email);
      $email->setFrom($configs['SENDER_EMAIL']);
      $email->setSubject("Sunsure Agent User Verification");
      $email->addContent("text/plain", $standard_msg);
      $email->addContent(
          "text/html", "<strong>{$standard_msg}</strong>"
      );

      // $sendgrid = new \SendGrid($api_key);
      $sendgrid = new \SendGrid($configs['SENDGRID_API_KEY']);

      try
      {
        $sendgrid->send($email);
        // Successfully inserted Agent into DB message.
        returnInfo("Agent has been inserted successfully!");
      }

      catch (Exception $e)
      {
        echo 'Caught exception: '. $e->getMessage() ."\n";
      }
    }

    else
    {
      // echo "failed to insert records";
      returnError($conn->error);
    }
  }

  else
  {
    returnInfo("Email used");
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
    'msg' => $info
    ];

    outputJson($retval);
  }

  function showToken($token)
  {
    outputJson($retval);
  }

  function outputJson($file)
  {
    header("Content-type:application/json");
    $jsonObj = json_encode($file);
    echo $jsonObj;
  }

  function checkEmailUsed($email, $conn)
  {
    $sql = "SELECT * FROM Agents WHERE Email = '$email'";
    $result = mysqli_query($conn, $sql);
    $rows = mysqli_num_rows($result);

    if ($rows > 0)
      return False;
    else
      return True;
  }
?>