<?php
    if (is_ajax()) {
        if (isset($_POST["action"]) && !empty($_POST["action"])) { //Checks if action value exists
            $action = $_POST["action"];
            switch($action) { //Switch case for value of action
                case "formPost": json_file(); 
                break;
            }
        }
    }

    //Function to check if the request is an AJAX request
    function is_ajax() {
        return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
    }

    function json_file() {
        $response = $_POST;
        //$return["json"] = json_encode($return);
        echo json_encode($response);

        file_put_contents('users.json', json_encode($response), FILE_APPEND);
        // fwrite($fp, json_encode($response));
        // fclose($fp);
    }
?>