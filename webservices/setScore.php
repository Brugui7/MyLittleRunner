<?php 

if (isset($_POST['user']) && isset($_POST['score'])) {

	$user = $_POST['user'];
	$score = $_POST['score'];


	$db = new PDO('mysql:host=localhost;dbname=runner;charset=UTF8', 'root', '');

	$stmt = $db->prepare("SELECT id FROM user WHERE name = :name");
	$stmt->bindParam(':name',$user,PDO::PARAM_STR);
	$stmt->execute();
	if ($stmt->rowCount() > 0) {
		$idUser = $stmt->fetch()['id'];	
	} else{
		$stmt = $db->prepare("INSERT INTO user (name)  VALUES (:user)");
		$stmt->bindParam(':user',$user,PDO::PARAM_STR);
		$stmt->execute();
		$idUser = $db->lastInsertId();
	}

	
	$stmt = $db->prepare("INSERT INTO score (user, score)  VALUES (:user, :score)");
	$stmt->bindParam(':user',$idUser,PDO::PARAM_INT);
	$stmt->bindParam(':score',$score,PDO::PARAM_INT);
	$stmt->execute();
}
	

 ?>