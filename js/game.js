/**
* Main controller of the game
* @author Alejandro Brugarolas Sánchez-Lidón <alejandro.brugarolas@gmail.com>
* @since 2017-12-26
*/


window.onload = function(){
    height = window.innerHeight;
    width = window.innerWidth;
	player = document.getElementById('player');
	playerWidth = player.offsetWidth;
	playerHeight = player.offsetHeight;
	var location = player.getBoundingClientRect();
    date = new Date();
    lastBonus = date.getTime();
	floor = location.top + player.offsetHeight; //The position of the player, sets where the floor is

	bottomLimit = location.top;
	backgroundPosition = 0;

	currentJumpHeight = IMPULSE;

	var audio = new Audio('res/music.mp3');
	audio.loop = true;
	audio.play();
	tryAgainSound = new Audio('res/tryAgain.mp3');
	gameOverSound = new Audio('res/no.mp3');


	document.onkeypress = movePlayer;
	window.addEventListener('keydown',movePlayer);
	//window.addEventListener('keyup',jump);
	window.addEventListener('click',function(ev){
		event = ev || window.event;
		if (ammunition > 0) {
			addProjectile( projectileSpeed, (player.getBoundingClientRect().x + playerWidth), player.getBoundingClientRect().y + playerHeight/2, event.x, event.y, true);
			ammunition -= 1;
			drawInfo();
		}
	});

    drawInfo();
	updateInterval = setInterval(updateGame,30);
	reloadInterval = setInterval(reload,reloadTime);
};

var updateGame = function(){
	console.log("updating");
	//Updates the player location
	var location = player.getBoundingClientRect();

	//Moves the background 
	document.body.style.backgroundPosition = --backgroundPosition+'px 0';

	if (enemies.length < difficult) {
		generateEnemy();
	}
	
	enemies.forEach ( function (enemy) {
	    moveEnemy(enemy);
	});
	
	document.getElementById("score").innerHTML = '<span>Score: </span>'+score;

	projectileList.forEach( function (projectile) {
            updateProjectile(projectile);
    });

    bonusList.forEach( function (bonus) {
        updateBonus(bonus);
    });



	//											##############
    //											#####JUMP#####
    //											##############
    
    if (jumping === true) {
    	if (currentJumpHeight > 0) {
    		console.log("Jumping");
    		currentJumpHeight -= GRAVITY;
    		player.style.top =  location.top - currentJumpHeight+'px';
    	} else{
    		currentJumpHeight -= GRAVITY;
    		player.style.top =  location.top - currentJumpHeight+'px';
    		//If the player touches the floor
    		if (location.y >= bottomLimit) {
    			player.style.top = bottomLimit+'px';
    			currentJumpHeight = IMPULSE;
    			jumping = false;
    		}

    	}
    }

    //											#############
    //											####BONUS####
    //											#############

    //Checks the time since the last bonus
    date = new Date();
    if (date.getTime() > lastBonus + bonusInterval){
        console.log("Generatin bonus...");
        switch (Math.floor(Math.random() * (3 - 1)) + 1){
            case 1:
                addBonus(BONUS_HEART);
                break;
            case 2:
                addBonus(BONUS_AMMO);
                break;
        }
        //The minimum interval between bonus spawn are 10 seconds
        bonusInterval = difficult > 10 ? difficult * 10000 : 10000;
        date = new Date();
        lastBonus = date.getTime()
    }
};

/** Adds a bullet to the player ammo */
var reload = function(){
	ammunition+=1;
	document.getElementById("ammo").innerHTML = ammunition;
};








//### Player Logic ###


var movePlayer = function(ev){
	var event = ev || window.event;
	var location = player.getBoundingClientRect();
	
	if (event.keyCode === 37 && location.left - 10 > 0){
		player.style.left = location.left - 10 + 'px';
	}else if (event.keyCode === 39 && location.right + 10 < width){
		player.style.left = location.left + 10 + 'px';
	}else if (event.keyCode === 38 && jumping === false) {
		jumping = true;
	}
};

//### Enemies Logic ###


/**
* Generates an enemy depending of the number of enemies in scene, and the difficult
*
* await can only be executed in functions prefixed with the async keyword.
* Runkit wraps your code in an async function before executing it.
* await only pauses the current async function
*/
var generateEnemy = async function(){
	
	if (!generating) {
		console.log("Generating enemy...");
		generating = true;
		var enemyType;
		await sleep(Math.floor(Math.random() * (6000 - 1000)) + 1000);
		if (difficult <= 3) {
			enemyType = 1;
		} else if (difficult > 3 && difficult <= 6) {
			enemyType = Math.floor(Math.random() * (3 - 1)) + 1;
		} else{
			enemyType = Math.floor(Math.random() * (4 - 1)) + 1;
		}

		if (enemyType === 1) {
			generateWalk();
		} else if (enemyType === 2) {
			generateRun();
		} else if (enemyType === 3) {
			generateFly();
		}

		generating = false;
	}
	

}

/**
* Moves the walking enemies 
* @param enemy to move
*/
var moveEnemy = function(enemy){
	var location = enemy.getBoundingClientRect();
	
	
	//Checks the type of the enemy
	var index = enemies.indexOf(enemy);
	if (index > -1) {
		//If it's a flying enemy, tries to shoot
		if(types[index] === 3){
			enemy.style.left = location.left -5+"px";
			var probability = Math.floor(Math.random() * 60 ) + 1;
			if (probability === 30) {
				enemyWidth = enemy.offsetWidth;
				enemyHeight = enemy.offsetHeight;
				addProjectile(projectileSpeed, location.x - enemyWidth, location.y + enemyHeight, player.getBoundingClientRect().x + playerWidth/2, player.getBoundingClientRect().y + playerHeight/2, false);
			}
		//If it's a faster enemy, runs	
		} else if(types[index] === 2){
			enemy.style.left = location.left -10+"px";
		//If it's a normal enemy.....is a normal enemy
		} else{
			enemy.style.left = location.left -5+"px";
		}
	}
	if (location.left < 0) {
		deleteEnemy(enemy)
	} else if (true === checkCollision(player, enemy)){
	        loseALive();
        }
};

/**
* Deletes an enemy and add the score if necesary
*/
var deleteEnemy = function(enemy){
	console.log("Removing enemy...");
	var index = enemies.indexOf(enemy);
	if (index > -1) {
		enemies.splice(index, 1);
		score += types[index];
		types.splice(index, 1);
		document.body.removeChild(enemy);
		difficult++;
	}
};


//### Enemy generation ###

var generateWalk = function(){
	var img = document.createElement("img");
	img.src = "res/walk1.gif";
	img.className += "enemyWalk";
	img.className += " enemy";
	enemies.push(img);
	types.push(1);
	document.body.appendChild(img);
};

var generateRun = function(){
	var img = document.createElement("img");
	img.src = "res/run1.gif";
	img.className += "enemyWalk";
	img.className += " enemy";
	enemies.push(img);
	types.push(2);
	document.body.appendChild(img);
};

var generateFly = function(){
	var img = document.createElement("img");
	img.src = "res/fly1.gif";
	img.className += "enemyFly";
	img.className += " enemy";
	enemies.push(img);
	types.push(3);
	document.body.appendChild(img);
};

//##### GAME LOGIC #####

/** Removes all elements for the scene and removes 1 live*/
function loseALive(){
	console.log("Losing a life");
	clearInterval(updateInterval);
	clearInterval(reloadInterval);
	for (var i = enemies.length - 1; i >= 0; i--) {
		document.body.removeChild(enemies[i]);
		enemies.splice(i, 1);
		types.splice(i, 1);
		
	}
	projectileList.forEach( function (projectile) {
            destroyProjectile(projectile);
    });
	lives -=1;
	document.getElementById("lives").innerHTML = '<span>Lives: </span>'+lives;
	if (lives <= 0) {
		endGame();
	} else{
		tryAgainSound.play();
		updateInterval = setInterval(updateGame,30);
		reloadInterval = setInterval(reload,reloadTime);
	}
	
}


/** Ends the game and sets the score */
function endGame(){
	console.log("Game over");
	gameOverSound.play();
	clearInterval(updateInterval);
	var username = prompt("Game over. \n Your score was: "+score+"\n Set your username");
	if (username != null) {
		if (username.length > 0) {
			//setScore(username, score);
		}
	}
}

//##### PROJECTILE LOGIC #####

	/**
	* TODO: Size and color
	* @param id
	* @param speed
	* @param x
	* @param y
	* @param eX (Target X position)
	* @param eY (Target Y position)
	* @param fromPlayer true if the player shoots the bullet, false if not
	*/
    function projectile(id, speed, x, y, eX, eY, fromPlayer) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.eX = eX;
        this.eY = eY;
        this.velocityX = 1;
        this.velocityY = 1;
        this.speed = speed;
        this.fromPlayer = fromPlayer;
    }

    

    /**
    * Creates a projectile and adds it to the scene
    * @param speed
    * @param x generation point x
    * @param y generation point x
    * @param eX
    * @param eY
	* @param fromPlayer boolean if the bullet has been shooted by the player
    */
    function addProjectile(speed, x, y, eX, eY, fromPlayer) {
    	//shootSound.pause();
		//shootSound.currentTime = 0;
        shootSound = new Audio('res/pew.mp3');
    	var img = document.createElement("img");
		img.src = "res/bullet.png";
		img.className += "bullet";
		document.body.appendChild(img);
		shootSound.play();
		img.style.position = "absolute";
		img.style.left = x + "px";
		img.style.top = y + "px";
        projectileList[projectileId] = new projectile(projectileId, speed, x, y, eX, eY, fromPlayer);
        projectileDrawList[projectileId] = img;
        var newProjectile = projectileList[projectileId];
        projectileId += 1;

        //Calculates how the bullet should move in each update
        var dx = (newProjectile.eX - newProjectile.x);
        var dy = (newProjectile.eY - newProjectile.y); 
        var mag = Math.sqrt(dx * dx + dy * dy);
        newProjectile.velocityX = (dx / mag) * newProjectile.speed;
        newProjectile.velocityY = (dy / mag) * newProjectile.speed;
    }

	/**
	* Updates the bullet position and redraws it
	* @param projectile
	* @param player
	*/
    function updateProjectile(projectile) {
    	//playerLocation = player.getBoundingClientRect();
    	//var dx = (projectile.eX - playerLocation.x);
        //var dy = (projectile.eY - playerLocation.y);
        if (projectile != null) {
        	
	        projectile.x += projectile.velocityX;
	        projectile.y += projectile.velocityY;
	        var bullet = projectileDrawList[projectile.id];
        	bullet.style.left = projectile.x + "px";
        	bullet.style.top = projectile.y + "px";
        	//for each enemy, checks if the bullet is hitting this enemy
	        for (var i = enemies.length - 1; i >= 0; i--) {
	        	//A bullet shooted by an enemy, can kill other enemy
	        	if(checkCollision(enemies[i],projectileDrawList[projectile.id])){
	        		deleteEnemy(enemies[i],true);
	        		destroyProjectile(projectile);
	        	}	
			}

			//Checks if the bullet was shooted by an enemy, and checks if it's hitting the player
			//A bullet shooted by the player, can't do damage to the player
			if (!projectile.fromPlayer) {
				if(checkCollision(player,projectileDrawList[projectile.id])){
	        		destroyProjectile(projectile);
	        		loseALive();
	        	}	
			}
	        
	        	
	        if (projectile.y < 0 || projectile.x < 0 || projectile.x > window.innerWidth || projectile.y > window.innerHeight) {
	        	destroyProjectile(projectile);
	        }
        }
    }

    /**
    * Destroys a projectile
    * @param projectile to destroy
    */
    function destroyProjectile(projectile){
    	console.log("Removing projectile...");
    	if (projectile != null) {
    		if (projectileDrawList[projectile.id] !== undefined) {
	    		document.body.removeChild(projectileDrawList[projectile.id]);
	    		//projectileDrawList.splice(projectile.id, 1);
	    		//projectileList.splice(projectile.id, 1);
	    		projectileDrawList[projectile.id] = null;
	    		projectileList[projectile.id] = null;
	    	}
    	}
    	
    }

//                                          #######################
//                                          ##### BONUS ITEMS #####
//                                          #######################


/**
 * Object that represents a bonus that will benefit the player if it's picked up
 * @param id
 * @param speed
 * @param x
 * @param y
 * @param type type of the bonus
 */
function Bonus(id, speed, x, y, type) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.velocityX = 1;
    this.velocityY = 1;
    this.speed = speed;
    this.type = type;
}



/**
 * Creates a bonus and adds it to the scene
 * @param type type of the bonus
 */
function addBonus(type) {
    var img = document.createElement("img");
    switch (type){
        case BONUS_HEART:
            img.src = "res/heart.gif";
            break;
        case BONUS_AMMO:
            img.src = "res/ammo.gif";
            break;
    }
    img.className += "bonus";
    document.body.appendChild(img);
    img.style.position = "absolute";
    img.style.left = width + "px";
    img.style.top = floor + "px";
    bonusList[bonusId] = new Bonus(bonusId, speed, width, floor - img.height, type);
    bonusDrawList[bonusId] = img;
    var newBonus = bonusList[bonusId];
    bonusId++;
    newBonus.velocityX = bonusSpeed;
}

/**
 * Updates the bonus position and redraws it
 * @param bonus
 */
function updateBonus(bonus) {
    if (bonus != null) {

        bonus.x += bonus.velocityX;
        //projectile.y += projectile.velocityY;
        var bonusImg = bonusDrawList[bonus.id];
        bonusImg.style.left = bonus.x + "px";
        bonusImg.style.top = bonus.y + "px";

        if(checkCollision(player, bonusDrawList[bonus.id])){
            destroyBonus(bonus, true);
        }

        if (bonus.x < 0) {
            destroyBonus(bonus, false);
        }
    }
}

/**
 * Destroys a bonus and adds the benefits if the player has picked it
 * @param bonus to destroy
 * @param picked if the bonus has been picked up or it just went to the limit of the screen
 */
function destroyBonus(bonus, picked){
    console.log("Removing bonus...");
    if (bonus != null) {
        if (picked === true){
        	var bonusPickedSound = new Audio('res/bonus.mp3');
            switch (bonus.type){
                case BONUS_HEART:
                    lives++;
                    break;
                case BONUS_AMMO:
                    ammunition += 5;
                    break;
            }
            bonusPickedSound.play();
            drawInfo();
        }
        if (bonusDrawList[bonus.id] !== undefined) {
            document.body.removeChild(bonusDrawList[bonus.id]);
            bonusDrawList[bonus.id] = null;
            bonusList[bonus.id] = null;
        }
    }

}

//### Aux functions ###


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Obtains the top 10 scores from the database */
function getLeaderBoard(){
	  var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	     alert("LeaderBoard: \n"+this.responseText);
	    }
	  };
	  xhttp.open("GET", "webservices/getTop10.php", true);
	  xhttp.send();
}


/** Sets the score
* @param user
* @param score
 */
function setScore(user,score){
	var xhttp = new XMLHttpRequest();
	var url = "get_data.php";
	var params = "user="+user+"&score="+score;
	xhttp.open("POST", "webservices/setScore.php", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	xhttp.onreadystatechange = function() {//Call a function when the state changes.
	    if(xhttp.readyState == 4 && xhttp.status == 200) {
	        getLeaderBoard();
	    }
	};
	xhttp.send(params);
}

/**
* Checks if there is a collision between two elements
* @param elem1
* @param elem2
* @return boolean
*/
function checkCollision(elem1, elem2){
	return elem1.x      < elem2.x     + elem2.width  &&
           elem1.x      + elem1.width > elem2.x      &&
           elem1.y      < elem2.y     + elem2.height &&
           elem1.height + elem1.y     > elem2.y;
}

function drawInfo(){
    document.getElementById("lives").innerHTML = '<span>Lives: </span>'+lives;
    document.getElementById("ammo").innerHTML = ammunition;
}