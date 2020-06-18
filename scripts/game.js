
var renderer, scene, camera, pointLight, spotLight;

var fieldWidth = 400, fieldHeight = 200;

var paddleWidth, paddleHeight, paddleDepth, paddleQuality;
var paddle1DirY = 0, paddle2DirY = 0, paddleSpeed = 3;

var ball, paddle1, paddle2;
var ballDirX = 1, ballDirY = 1, ballSpeed = 2;

var score1 = 0, score2 = 0;

var maxScore = 7;

var difficulty = 0.2;


function setup()
{
	document.getElementById("winnerBoard").innerHTML = "Набравший " + maxScore + " очков победит!";

	score1 = 0;
	score2 = 0;

	createScene();

	draw();
}

function createScene()
{
	var WIDTH = 640,
		HEIGHT = 360;

	var VIEW_ANGLE = 50,
		ASPECT = WIDTH / HEIGHT,
		NEAR = 0.1,
		FAR = 10000;

	var c = document.getElementById("gameCanvas");

	renderer = new THREE.WebGLRenderer();
	camera =
		new THREE.PerspectiveCamera(
			VIEW_ANGLE,
			ASPECT,
			NEAR,
			FAR);

	scene = new THREE.Scene();

	scene.add(camera);

	camera.position.z = 340;
	camera.position.y = 600;
	camera.position.x = 900;

	renderer.setSize(WIDTH, HEIGHT);

	c.appendChild(renderer.domElement);

	var planeWidth = fieldWidth,
		planeHeight = fieldHeight,
		planeQuality = 10;


	var paddle1Material =
		new THREE.MeshLambertMaterial(
			{
				color: 0x1B32C0
			});

	var paddle2Material =
		new THREE.MeshLambertMaterial(
			{
				color: 0xFF4045
			});

	var planeMaterial =
		new THREE.MeshLambertMaterial(
			{
				color: 0x4BD121
			});

	var tableMaterial =
		new THREE.MeshLambertMaterial(
			{
				color: 0x111111
			});

	var pillarMaterial =
		new THREE.MeshLambertMaterial(
			{
				color: 0x534d0d
			});

	var groundMaterial =
		new THREE.MeshLambertMaterial(
			{
				color: 0x888888
			});

	var plane = new THREE.Mesh(

		new THREE.PlaneGeometry(
			planeWidth * 0.95,
			planeHeight,
			planeQuality,
			planeQuality),

		planeMaterial);
	plane.position.y = -51;

	scene.add(plane);
	plane.receiveShadow = true;

	var table = new THREE.Mesh(

		new THREE.CubeGeometry(
			planeWidth * 1.05,
			planeHeight * 1.03,
			100,
			planeQuality,
			planeQuality,
			1),

		tableMaterial);
	table.position.z = -51;
	table.position.y = -51;
	scene.add(table);
	table.receiveShadow = true;

	var radius = 5,
		segments = 6,
		rings = 6;

	var sphereMaterial =
		new THREE.MeshLambertMaterial(
			{
				color: 0x34ebdb // color: 0xD43001
			});

	ball = new THREE.Mesh(

		new THREE.SphereGeometry(
			radius,
			segments,
			rings),

		sphereMaterial);

	scene.add(ball);

	ball.position.x = 0;
	ball.position.y = 0;
	ball.position.z = radius;
	ball.receiveShadow = true;
	ball.castShadow = true;

	paddleWidth = 10;
	paddleHeight = 30;
	paddleDepth = 10;
	paddleQuality = 1;

	paddle1 = new THREE.Mesh(

		new THREE.CubeGeometry(
			paddleWidth,
			paddleHeight,
			paddleDepth,
			paddleQuality,
			paddleQuality,
			paddleQuality),

		paddle1Material);

	scene.add(paddle1);
	paddle1.receiveShadow = true;
	paddle1.castShadow = true;

	paddle2 = new THREE.Mesh(

		new THREE.CubeGeometry(
			paddleWidth,
			paddleHeight,
			paddleDepth,
			paddleQuality,
			paddleQuality,
			paddleQuality),

		paddle2Material);

	scene.add(paddle2);
	paddle2.receiveShadow = true;
	paddle2.castShadow = true;

	paddle1.position.x = -fieldWidth/2 + paddleWidth;
	paddle2.position.x = fieldWidth/2 - paddleWidth;


	paddle1.position.z = paddleDepth;
	paddle2.position.z = paddleDepth;

	for (var i = 0; i < 5; i++)
	{
		var backdrop = new THREE.Mesh(

			new THREE.CubeGeometry(
				30,
				30,
				300,
				1,
				1,
				1 ),

			pillarMaterial);

		backdrop.position.x = -50 + i * 100;
		backdrop.position.y = 600;
		backdrop.position.z = -130;
		backdrop.castShadow = true;
		backdrop.receiveShadow = true;
		scene.add(backdrop);
	}

	for (var i = 0; i < 5; i++)
	{
		var backdrop = new THREE.Mesh(

			new THREE.CubeGeometry(
				30,
				30,
				300,
				1,
				1,
				1 ),

			pillarMaterial);

		backdrop.position.x = -100 + i * 100;
		backdrop.position.y = -230;
		backdrop.position.z = -130;
		backdrop.castShadow = true;
		backdrop.receiveShadow = true;
		scene.add(backdrop);
	}


	var ground = new THREE.Mesh(

		new THREE.CubeGeometry(
			1000,
			1000,
			3,
			1,
			1,
			1 ),

		groundMaterial);
	ground.position.z = -132;
	ground.receiveShadow = true;
	scene.add(ground);

	pointLight =
		new THREE.PointLight(0xF8D898);

	pointLight.position.x = -2000;
	pointLight.position.y = 0;
	pointLight.position.z = 1000;
	pointLight.intensity = 4;
	pointLight.distance = 10000;
	scene.add(pointLight);

	spotLight = new THREE.SpotLight(0xF8D898);
	spotLight.position.set(0, 0, 460);
	spotLight.intensity = 1.5;
	spotLight.castShadow = true;
	scene.add(spotLight);

	renderer.shadowMapEnabled = true;
}

function draw()
{
	renderer.render(scene, camera);
	requestAnimationFrame(draw);

	ballPhysics();
	paddlePhysics();
	cameraPhysics();
	playerPaddleMovement();
	opponentPaddleMovement();
}

function ballPhysics()
{
	if (ball.position.x <= -fieldWidth/2)
	{
		score2++;
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		resetBall(2);
		matchScoreCheck();
	}

	if (ball.position.x >= fieldWidth/2)
	{
		score1++;
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		resetBall(1);

		matchScoreCheck();
	}

	if (ball.position.y <= -fieldHeight/2)
	{
		ballDirY = -ballDirY;
	}
	if (ball.position.y >= fieldHeight/2)
	{
		ballDirY = -ballDirY;
	}

	ball.position.x += ballDirX * ballSpeed;
	ball.position.y += ballDirY * ballSpeed;

	if (ballDirY > ballSpeed * 2)
	{
		ballDirY = ballSpeed * 2;
	}
	else if (ballDirY < -ballSpeed * 2)
	{
		ballDirY = -ballSpeed * 2;
	}
}

// Программирование AI
function opponentPaddleMovement()
{
	paddle2DirY = (-ball.position.y - paddle2.position.y) * difficulty;

	if (Math.abs(paddle2DirY) <= paddleSpeed)
	{
		paddle2.position.y += paddle2DirY;
	}
	else
	{
		if (paddle2DirY > paddleSpeed)
		{
			paddle2.position.y += paddleSpeed;
		}
		else if (paddle2DirY < -paddleSpeed)
		{
			paddle2.position.y -= paddleSpeed;
		}
	}

	paddle2.scale.y += (1 - paddle2.scale.y) * 0.2;
}


function playerPaddleMovement()
{
	if (Key.isDown(Key.A))
	{
		if (paddle1.position.y < fieldHeight * 0.45)
		{
			paddle1DirY = paddleSpeed * 0.5;
		}

		else
		{
			paddle1DirY = 0;
			paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
		}
	}
	else if (Key.isDown(Key.D))
	{
		if (paddle1.position.y > -fieldHeight * 0.45)
		{
			paddle1DirY = -paddleSpeed * 0.5;
		}

		else
		{
			paddle1DirY = 0;
			paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
		}
	}
	else
	{
		paddle1DirY = 0;
	}

	paddle1.scale.y += (1 - paddle1.scale.y) * 0.2;
	paddle1.scale.z += (1 - paddle1.scale.z) * 0.2;
	paddle1.position.y += paddle1DirY;
}

function cameraPhysics()
{
	spotLight.position.x = ball.position.x * 2;
	spotLight.position.y = ball.position.y * 2;

	camera.position.x = paddle1.position.x - 100;
	camera.position.y += (paddle1.position.y - camera.position.y) * 0.05;
	camera.position.z = paddle1.position.z + 100 + 0.04 * (-ball.position.x + paddle1.position.x);

	camera.rotation.x = -0.01 * (ball.position.y) * Math.PI/180;
	camera.rotation.y = -60 * Math.PI/180;
	camera.rotation.z = -90 * Math.PI/180;
}

function paddlePhysics()
{

	if (ball.position.x <= paddle1.position.x + paddleWidth
		&&  ball.position.x >= paddle1.position.x)
	{
		if (ball.position.y <= paddle1.position.y + paddleHeight/2
			&&  ball.position.y >= paddle1.position.y - paddleHeight/2)
		{
			if (ballDirX < 0)
			{
				paddle1.scale.y = 15;
				ballDirX = -ballDirX;
				ballDirY -= paddle1DirY * 0.7;
			}
		}
	}

	if (ball.position.x <= paddle2.position.x + paddleWidth
		&&  ball.position.x >= paddle2.position.x)
	{
		if (ball.position.y <= paddle2.position.y + paddleHeight/2
			&&  ball.position.y >= paddle2.position.y - paddleHeight/2)
		{
			if (ballDirX > 0)
			{
				paddle2.scale.y = 15;
				ballDirX = -ballDirX;

				ballDirY -= paddle2DirY * 0.7;
			}
		}
	}
}

function resetBall(loser)
{

	ball.position.x = 0;
	ball.position.y = 0;


	if (loser == 1)
	{
		ballDirX = -1;
	}

	else
	{
		ballDirX = 1;
	}


	ballDirY = 1;
}

var bounceTime = 0;

function matchScoreCheck()
{

	if (score1 >= maxScore)
	{

		ballSpeed = 0;

		document.getElementById("scores").innerHTML = "Игрок выиграл!";
		document.getElementById("winnerBoard").innerHTML = "Обновите страницу чтобы сыграть снова";

		bounceTime++;
		paddle1.position.z = Math.sin(bounceTime * 0.1) * 10;

		paddle1.scale.z = 2 + Math.abs(Math.sin(bounceTime * 0.1)) * 10;
		paddle1.scale.y = 2 + Math.abs(Math.sin(bounceTime * 0.05)) * 10;
	}

	else if (score2 >= maxScore)
	{

		ballSpeed = 0;

		document.getElementById("scores").innerHTML = "Выиграл компьютер!";
		document.getElementById("winnerBoard").innerHTML = "Обновите страницу чтобы сыграть снова";

		bounceTime++;
		paddle2.position.z = Math.sin(bounceTime * 0.1) * 10;

		paddle2.scale.z = 2 + Math.abs(Math.sin(bounceTime * 0.1)) * 10;
		paddle2.scale.y = 2 + Math.abs(Math.sin(bounceTime * 0.05)) * 10;
	}
}
