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

        } else if($_GET['type'] == 'login'){
            $username = mysqli_real_escape_string($conn, $_GET['username']);
            $password = mysqli_real_escape_string($conn, $_GET['password']);

            //print "SELECT username FROM users WHERE username='" . $username . 
            //    "' AND hashed_password=saltedHash('" . $username . "', '" . $password . "');";
            $users = mysqli_query($conn, "SELECT username FROM users WHERE username='" . $username . 
                "' AND hashed_password=saltedHash('" . $username . "', '" . $password . "');");

            $users_json = [];

            while($row = mysqli_fetch_assoc($users)){
                array_push($users_json, $row);
            }

            echo json_encode($users_json); 
        } else if($_GET['type'] == 'tournament'){ #gets info of tournaments for one user
            $username = mysqli_real_escape_string($conn, $_GET['username']);

            $tournaments = mysqli_query($conn, "SELECT Tournament_ID, Name FROM tournament WHERE Manager='" . $username . "';");

            $tournaments_json = [];

            while($row = mysqli_fetch_assoc($tournaments)){
                array_push($tournaments_json, $row);
            }

            echo json_encode($tournaments_json);
        } else if($_GET['type'] == 'team'){
            $name = mysqli_real_escape_string($conn, $_GET['name']);
            
            $teams = mysqli_query($conn, "SELECT Username FROM player WHERE Team_ID = (SELECT Team_ID FROM team WHERE Name ='" . $name . "');");

            $teams_json = [];

            while($row = mysqli_fetch_assoc($teams)){
                array_push($teams_json, $row);
            }

            echo json_encode($teams_json);
        }
         
    } else if($_SERVER['REQUEST_METHOD'] == 'POST'){

        if($_POST['type'] == 'user'){
            $username = mysqli_real_escape_string($conn, $_POST['username']);
            $email = mysqli_real_escape_string($conn, $_POST['email']);
            $password = mysqli_real_escape_string($conn, $_POST['password']);

            // print "INSERT INTO users (username, email, hashed_password) VALUES ('" 
            //     . $username . "', '" . $email . "', saltedHash('" . $username . "', '" . $password . "'));" or die('error');

            mysqli_query($conn, "INSERT INTO users (username, email, hashed_password) VALUES ('" 
                . $username . "', '" . $email . "', saltedHash('" . $username . "', '" . $password . "'))") or die('error');
        } else if($_POST['type'] == 'tournament'){

        }
    } 

?>