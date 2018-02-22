/**
* Configuration parameters 
* @author Alejandro Brugarolas
* @since 2017-12-26
*/

var player;
var playerWidth, playerHeight; // Variables to handle projectile spawn
/**
* Enemies types (1 walk, 2 run, 3 fly)
* enemies and types will always have the same length
*/
var backgroundPosition;
var projectileId = 0;
var projectileSpeed = 10;
var projectileList = [];
var projectileDrawList = [];
var height;
var width;
var floor;

var enemies = [], types = [];
var info;

var generating = false;
var speed = 1;//movement speed of the enemy
var bottomLimit; //Where the floor is
var enemyMovement;
var difficult = 1;
var score = 0;
var lives = 3;
var updateInterval;
var shootSound;
var tryAgainSound;
var gameOverSound;
var reloadInterval;
var walkSpeed = 5, runSpeed = 10, flySpeed = 10;
var ammunition = 10;//The quantity of bullets
var reloadTime = 5000;//Interval in what a bullet is reloaded in miliseconds


//Jump variables
var currentJumpHeight;
var jumping = false;
var GRAVITY = 0.8;
var IMPULSE = 25; //jump force

//Bonus variables
var bonusId = 0;
var bonusSpeed = -15;
var bonusList = [];
var bonusDrawList = [];

//Bonus items constants
const BONUS_HEART = 1;
const BONUS_AMMO = 2;


var bonusInterval = 10000;
var lastBonus;
var date;