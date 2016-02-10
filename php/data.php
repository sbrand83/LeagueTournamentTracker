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
            $username = mysqli_real_escape_string($conn, $_POST['username']);
            $name = mysqli_real_escape_string($conn, $_POST['name']);

            // print "INSERT INTO users (username, email, hashed_password) VALUES ('" 
            //     . $username . "', '" . $email . "', saltedHash('" . $username . "', '" . $password . "'));" or die('error');

            mysqli_query($conn, "INSERT INTO tournament (Manager, Name) VALUES ('" 
                . $username . "', '" . $name . "');") or die('error');

        } else if($_POST['type'] == 'team'){
            $name = mysqli_real_escape_string($conn, $_POST['name']);

            // print "INSERT INTO users (username, email, hashed_password) VALUES ('" 
            //     . $username . "', '" . $email . "', saltedHash('" . $username . "', '" . $password . "'));" or die('error');

            mysqli_query($conn, "INSERT INTO team (Name, Wins, Losses) VALUES ('" 
                . $name . "', 0, 0);") or die('error');

        } else if($_POST['type'] == 'participates_in'){
            $team_name = mysqli_real_escape_string($conn, $_POST['team_name']);
            $tournament_name = mysqli_real_escape_string($conn, $_POST['tournament_name']);

            $team_ids = mysqli_query($conn, "SELECT Team_ID FROM team WHERE Name = '" . $team_name . "';");
            #print $team_id;
            $tournament_ids = mysqli_query($conn, "SELECT Tournament_ID FROM tournament WHERE Name = '" . $tournament_name . "';");
            #print $tournament_id;

            $team_id = 0;
            $tournament_id = 0;
            while($row = mysqli_fetch_assoc($team_ids)){
                $team_id = $row['Team_ID'];
            }

            print $team_id;
            while($row = mysqli_fetch_assoc($tournament_ids)){
                $tournament_id = $row['Tournament_ID'];
            }

            print $tournament_id;
            print "INSERT INTO participates_in (Team_ID, Tournament_ID) VALUES (" 
                . $team_id . ", " . $tournament_id . ");";

            mysqli_query($conn, "INSERT INTO participates_in (Team_ID, Tournament_ID) VALUES (" 
                . $team_id . ", " . $tournament_id . ");") or die('error');
        }
    } 

?>