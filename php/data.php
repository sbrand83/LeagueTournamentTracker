<?php 
    $conn = mysqli_connect('localhost', 'brandsm', '333ProjectLOLTT') or die(mysqli_error());
    mysqli_select_db($conn, 'loltt') or die(mysqli_error());

    if($_SERVER['REQUEST_METHOD'] == 'GET') {
        $users = mysqli_query($conn, "SELECT * FROM users");

        $users_json = [];

        while($row = mysqli_fetch_array($users)){
            array_push($users_json, $row);
        }

        print_r($users_json);
        foreach ($users_json as $user) {
            print $user;
        }
    }

?>