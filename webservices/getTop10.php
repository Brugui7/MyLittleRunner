<?php 
	$db = new PDO('mysql:host=localhost;dbname=runner;charset=UTF8', 'root', '');

	$stmt = $db->prepare("SELECT score.score score, user.name user FROM score JOIN user ON score.user = user.id ORDER BY score.score DESC LIMIT 10");
	$stmt->execute();
	$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
	$response = "";
	foreach ($result as $score) {
		$response .= $score['user'].": ".$score['score']."\n";
	}
	echo $response;

 ?>