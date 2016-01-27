<?php 
    $conn = mysqli_connect('localhost', 'brandsm', '333ProjectLOLTT') or die(mysqli_error());
    mysqli_select_db($conn, 'loltt') or die(mysqli_error());

    if($_SERVER['REQUEST_METHOD'] == 'GET') {

        if($_GET['type'] == 'user'){
            $username = mysqli_real_escape_string($conn, $_GET['username']);
            $email = mysqli_real_escape_string($conn, $_GET['email']);
            // echo 'Username: ' . $username;
            // echo 'Email: ' . $email;
            // echo 'Query: ' . "SELECT username, email FROM users WHERE username='" . $username . "' AND email='" . $email . "';";
            $users = mysqli_query($conn, "SELECT username, email FROM users WHERE username='" . $username . "' OR email='" . $email . "';");

            $users_json = [];

            while($row = mysqli_fetch_assoc($users)){
                array_push($users_json, $row);
            }

            echo json_encode($users_json); 
        }
         
    }

?>