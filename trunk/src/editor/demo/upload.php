<?php

 $HOST = $_SERVER['HTTP_HOST'];

 if(DIRECTORY_SEPARATOR=='\\') {
	 //sleep(1); // ����ʱ���鿴������Ч��
	 $uploaddir = 'e:\\web_root\\htdocs\\kissy\\src\\editor\\demo\\uploads\\';
 }

 $filename = basename($_FILES['imgFile']['name']);
 $uploadfile = $uploaddir . $filename;
 $uri = 'http://' . $HOST . '/kissy/src/editor/demo/uploads/';
 
 if (move_uploaded_file($_FILES['imgFile']['tmp_name'], $uploadfile)) {
    echo '{"status": "0", "imgUrl": "' . $uri . $filename . '"}';
 } else {
     echo '{"status": "1", "error": "�ϴ������г�����"}';
 }

 //echo 'Here is some more debugging info:';
 //print_r($_FILES);
 //print_r($_POST);
?> 
