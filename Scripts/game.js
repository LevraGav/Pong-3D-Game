// Variabel Objek
var renderer, scene, camera, pointLight, spotLight;

// Mengatur field
var fieldWidth = 400, fieldHeight = 200;

// Variable Padle / pemukul
var paddleWidth, paddleHeight, paddleDepth, paddleQuality;
var paddle1DirY = 0, paddle2DirY = 0, paddleSpeed = 3;

// Variable Bola
var ball, paddle1, paddle2;
var ballDirX = 1, ballDirY = 1, ballSpeed = 2;

// Inisiasi score
var score1 = 0, score2 = 0;

// Untuk set maks score yang dibutuhkan untuk menang
var maxScore = 3;

// Untuk set difficulity (0 itu termudah, 1 itu tersulit)
var difficulty = 0.5;

// Game Function
function setup()
{
	// Update biard untuk menunjukkan berapa score yang dibutuhkan untuk menang
	document.getElementById("winnerBoard").innerHTML = "First to " + maxScore + " wins!";
	
	// Reset score pemain dan komputer
	score1 = 0;
	score2 = 0;
	
	createScene();
	draw();
}

function createScene()
{
	// Mengatur besar scene
	var WIDTH = 640,
		HEIGHT = 360;

	// Mengatur atribut camera
	var VIEW_ANGLE = 50,
		ASPECT = WIDTH / HEIGHT,
		NEAR = 0.1,
		FAR = 10000;

	var c = document.getElementById("gameCanvas");

	// Melakukan rendering
	renderer = new THREE.WebGLRenderer();
	camera =
		new THREE.PerspectiveCamera(
		VIEW_ANGLE,
		ASPECT,
		NEAR,
		FAR);

	scene = new THREE.Scene();

	// Menambahkan kamera 
	scene.add(camera);
	
	// Mengatur posisi default dari kamera
	camera.position.z = 320;
	
	// Start pada renderer
	renderer.setSize(WIDTH, HEIGHT);
	c.appendChild(renderer.domElement);

	// Mengatur ukuran meja (plane)
	var planeWidth = fieldWidth,
		planeHeight = fieldHeight,
		planeQuality = 10;
		
	// Mengatur material paddle 1
	var paddle1Material =
	new THREE.MeshLambertMaterial(
		{
			color: "#16697A"
		});
		
	// Mengatur material paddle 2
	var paddle2Material =
		new THREE.MeshLambertMaterial(
		{
			color: "#E85D75"
		});
		
	// Mengatur material meja (plane)
	var planeMaterial =
		new THREE.MeshLambertMaterial(
		{
			color: "#304D6D"
		});

	var tableMaterial =
		new THREE.MeshLambertMaterial(
		{
			color: "#304D6D"
		});
		
	//Mengatur material pillar
	var pillarMaterial =
		new THREE.MeshLambertMaterial(
		{
			color: "#360568"
		});
		
	// Mengatur material ground
	var groundMaterial =
		new THREE.MeshLambertMaterial(
		{
			color: 0x888888
		});
		
		
	// Membuat medan permainan (plane)
	var plane = new THREE.Mesh(

	new THREE.PlaneGeometry(
		planeWidth * 0.95,
		//Menggunakan 95% dari lebar plane, karena kita ingin melihat saat bolanya keluar	
		planeHeight,
		planeQuality,
		planeQuality),

	planeMaterial);

	scene.add(plane);
	plane.receiveShadow = true;	
	
	var table = new THREE.Mesh(

	new THREE.CubeGeometry(
		planeWidth * 1.05,	// Menggunakan lining untuk menciptakan bentuk meja seperti meja billiard
		planeHeight * 1.03,
		100,				
		planeQuality,
		planeQuality,
		1),

	tableMaterial);
	table.position.z = -51;	
	scene.add(table);
	table.receiveShadow = true;	
		
	var radius = 5,
		segments = 6,
		rings = 6;
		
	var sphereMaterial =
		new THREE.MeshLambertMaterial(
		{
			color: 0xD43001
		});
		
	// Membuat bola
	ball = new THREE.Mesh(

	new THREE.TorusKnotGeometry(5,6,6),
		sphereMaterial
	);

	// Menambahkan bola ke dalam scene
	scene.add(ball);
	
	ball.position.x = 0;
	ball.position.y = 0;
	
	// Mengatur agar bola berada di atas permukaan meja
	ball.position.z = radius;
	ball.receiveShadow = true;
    ball.castShadow = true;
	
	//Mengatur paddle
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

	// Menambahkan Objek Paddle ke dalam Scene
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

	// Menambahkan Objek Paddle (komputer) ke dalam Scene
	scene.add(paddle2);
	paddle2.receiveShadow = true;
    paddle2.castShadow = true;	
	
	// Mengatur letak kedua paddle, diletakkan diujung atas dan ujung bawah
	paddle1.position.x = -fieldWidth/2 + paddleWidth;
	paddle2.position.x = fieldWidth/2 - paddleWidth;
	
	// Posisi z pada paddle diatur untuk dinaiikan ke atas permukaan
	paddle1.position.z = paddleDepth;
	paddle2.position.z = paddleDepth;
	
	// Dilakukan iterasi sebanyak 10x(5x masing2 tiap sisi) yang digunakan untuk membuat pillars untuk menampilkkan shadow/bayangan

	// Membuat pillar pada sisi kiri
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
		backdrop.position.y = 230;
		backdrop.position.z = -30;		
		backdrop.castShadow = true;
		backdrop.receiveShadow = true;		  
		scene.add(backdrop);	
	}

	// Membuat pillar pada sisi kanan
	// Pillar dibentuk dengan menggunakan Cube Geometry
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
		backdrop.position.y = -230;
		backdrop.position.z = -30;
		backdrop.castShadow = true;
		backdrop.receiveShadow = true;		
		scene.add(backdrop);	
	}
	
	// Selanjutnya kita membuat atau menambah ground(permukaan) untuk membuat efek shadow/bayangan yang bagus
	var ground = new THREE.Mesh(
		new THREE.CubeGeometry( 
		1000, 
		1000, 
		3, 
		1, 
		1,
		1 ),

		groundMaterial);
		
    //	Set ground terhadap posisi Z, untuk membentuk bayangannya
	ground.position.z = -132;
	ground.receiveShadow = true;	
	scene.add(ground);		
		
	// // Membuat pencahayaan menggunakan PointLight
	pointLight =
		new THREE.PointLight(0xF8D898);

	// Mengatur Posisi terhadap x y z
	pointLight.position.x = -1000;
	pointLight.position.y = 0;
	pointLight.position.z = 1000;
	pointLight.intensity = 2.9;
	pointLight.distance = 10000;

	// Masukkan ke dalam Scene
	scene.add(pointLight);
		
	// Selanjutnya membuat pencahayaan lagi yaitu menggunakan spotlight untuk membuat bayangan
    spotLight = new THREE.SpotLight(0xF8D898);
    spotLight.position.set(0, 0, 460);
    spotLight.intensity = 1.5;
    spotLight.castShadow = true;
    scene.add(spotLight);
	
	// Render
	renderer.shadowMapEnabled = true;		
}

function draw()
{	
	// Menggambar scene threejs
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
	// Jika bola keluar dari sisi pemain (sisi Player)
	if (ball.position.x <= -fieldWidth/2)
	{	
		// score CPU
		score2++;
		// melakukan update pada scoreboard HTML
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		// Reset agar bola kembali ketengah
		resetBall(2);
		matchScoreCheck();	
	}
	
	// Jika bola keluar dari sisi pemain (sisi CPU)
	if (ball.position.x >= fieldWidth/2)
	{	
		// score Player
		score1++;
		// melakukan update pada scoreboard HTML
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		// Reset agar bola kembali ketengah
		resetBall(1);
		matchScoreCheck();	
	}
	
	// Jika bola keluar dari sisi Atas (sisi Meja)
	if (ball.position.y <= -fieldHeight/2)
	{
		ballDirY = -ballDirY;
	}	
	
	// Jika bola keluar dari sisi Bawah (sisi Meja)
	if (ball.position.y >= fieldHeight/2)
	{
		ballDirY = -ballDirY;
	}
	
	// update ball position over time
	ball.position.x += ballDirX * ballSpeed;
	ball.position.y += ballDirY * ballSpeed;
	
	// Membatasi kecepatan Y Bola menjadi 2x Kecepatan X
	// ini agar bola tidak melaju dari kiri ke kanan dengan sangat cepat
	// membuat game lebih mudah dimainkan
	if (ballDirY > ballSpeed * 2)
	{
		ballDirY = ballSpeed * 2;
	}
	else if (ballDirY < -ballSpeed * 2)
	{
		ballDirY = -ballSpeed * 2;
	}
}

// Menangani gerakan dan logic dari CPU Paddle
function opponentPaddleMovement()
{
	paddle2DirY = (ball.position.y - paddle2.position.y) * difficulty;
	
	// jika fungsi Lerp menghasilkan nilai di atas kecepatan paddle maks, di Clamp
	if (Math.abs(paddle2DirY) <= paddleSpeed)
	{	
		paddle2.position.y += paddle2DirY;
	}
	
	// Jika value Lerp terlalu tinggi, maka harus set Limit kecepatan dari paddlespeed
	else
	{
		// jika paddle mengarah ke +ve 
		if (paddle2DirY > paddleSpeed)
		{
			paddle2.position.y += paddleSpeed;
		}
		// jika paddle mengarah ke -ve 
		else if (paddle2DirY < -paddleSpeed)
		{
			paddle2.position.y -= paddleSpeed;
		}
	}
	paddle2.scale.y += (1 - paddle2.scale.y);	
}


// Mengatur dan Menangani gerakan dari Player Paddle
function playerPaddleMovement()
{
	// Bergerak Ke Kiri
	if (Key.isDown(Key.A))		
	{
		// Jika paddle tidak menyuntuh sisi meja 
		if (paddle1.position.y < fieldHeight * 0.45)
		{
			paddle1DirY = paddleSpeed * 0.5;
		}
		else
		{
			paddle1DirY = 0;
			paddle1.scale.z += (10 - paddle1.scale.z) ;
		}
	}	
	// Bergerak ke kanan
	else if (Key.isDown(Key.D))
	{
		// Jika paddle tidak menyuntuh sisi meja, Gerakkan
		if (paddle1.position.y > -fieldHeight * 0.45)
		{
			paddle1DirY = -paddleSpeed * 0.5;
		}
		else
		{
			paddle1DirY = 0;
			paddle1.scale.z += (10 - paddle1.scale.z);
		}
	}
	// Kecual Paddle tidak bergerak
	else
	{
		// Stop paddle
		paddle1DirY = 0;
	}
	
	paddle1.scale.y += (1 - paddle1.scale.y);	
	paddle1.scale.z += (1 - paddle1.scale.z);	
	paddle1.position.y += paddle1DirY;
}

// Mengatur kamera dan bayangan
function cameraPhysics()
{
	// we can easily notice shadows if we dynamically move lights during the game
	spotLight.position.x = ball.position.x * 2;
	spotLight.position.y = ball.position.y * 2;
	
	// move to behind the player's paddle
	camera.position.x = paddle1.position.x - 100;
	camera.position.y += (paddle1.position.y - camera.position.y) * 0.05;
	camera.position.z = paddle1.position.z + 100 + 0.04 * (-ball.position.x + paddle1.position.x);
	
	// rotate to face towards the opponent
	camera.rotation.x = -0.01 * (ball.position.y) * Math.PI/180;
	camera.rotation.y = -60 * Math.PI/180;
	camera.rotation.z = -90 * Math.PI/180;
}

// Menangani logika tabrakan paddle
function paddlePhysics()
{
	// PLAYER PADDLE LOGIC
	
	// jika bola sejajar dengan paddle1 pada bidang x
	// ingat posisinya adalah PUSAT objek
	// kami hanya memeriksa antara bagian depan dan tengah dayung (tabrakan satu arah)
	if (ball.position.x <= paddle1.position.x + paddleWidth
	&&  ball.position.x >= paddle1.position.x)
	{
		// dan jika bola sejajar dengan paddle 1 pada bidang y
		if (ball.position.y <= paddle1.position.y + paddleHeight/2
		&&  ball.position.y >= paddle1.position.y - paddleHeight/2)
		{
			// dan jika bola bergerak menuju pemain (arah -ve)
			if (ballDirX < 0)
			{
				paddle1.scale.y = 15;
				// Mengubah arah gerakan bola untuk memantulkan
				ballDirX = -ballDirX;
				// disini untuk mempengaruhi sudut bola saat dipukul atau bersentuhan dengan paddle
				// memungkinkan kita untuk 'slice' bola untuk mengalahkan lawan
				ballDirY -= paddle1DirY * 0.7;
			}
		}
	}
	
	// OPPONENT PADDLE LOGIC	
	
	// jika bola sejajar dengan paddle1 pada bidang x
	// ingat posisinya adalah PUSAT objek
	// kami hanya memeriksa antara bagian depan dan tengah dayung (tabrakan satu arah)
	if (ball.position.x <= paddle2.position.x + paddleWidth
	&&  ball.position.x >= paddle2.position.x)
	{
		// dan jika bola sejajar dengan paddle2 pada bidang y
		if (ball.position.y <= paddle2.position.y + paddleHeight/2
		&&  ball.position.y >= paddle2.position.y - paddleHeight/2)
		{
			//dan jika bola bergerak menuju pemain (arah +ve)
			if (ballDirX > 0)
			{
				paddle2.scale.y = 15;	
				// Mengubah arah gerakan bola untuk memantulkan
				ballDirX = -ballDirX;
				// disini untuk mempengaruhi sudut bola saat dipukul atau bersentuhan dengan paddle
				// memungkinkan kita untuk 'slice' bola  untuk mengalahkan lawan
				ballDirY -= paddle2DirY * 0.7;
			}
		}
	}
}

function resetBall(loser)
{
	// memposisikan bola di tengah meja
	ball.position.x = 0;
	ball.position.y = 0;
	
	// Jika player kebobolan, maka bola dimulai dari cpu
	if (loser == 1)
	{
		ballDirX = -1;
	}
	// Jika cpu kebobolan, maka bola dimulai dari player
	else
	{
		ballDirX = 1;
	}
	
	ballDirY = 1;
}

var bounceTime = 0;

// Melakukan pengecekan score player dan cpu
function matchScoreCheck()
{
	// Jika cpu mencapai maks score
	if (score1 >= maxScore)
	{
		// Bola akan berhenti
		ballSpeed = 0;
		
		// Memunculkan tulisan pada layar
		document.getElementById("scores").innerHTML = "Player wins!";		
		document.getElementById("winnerBoard").innerHTML = "Refresh to play again";
		
		// Membuat paddle memantul atas dan bawah
		bounceTime++;
		paddle1.position.z = Math.sin(bounceTime * 0.1) * 10;

		paddle1.scale.z = 2 + Math.abs(Math.sin(bounceTime * 0.1)) * 10;
		paddle1.scale.y = 2 + Math.abs(Math.sin(bounceTime * 0.05)) * 10;
	}
	
	// Jika cpu mencapai maks score
	else if (score2 >= maxScore)
	{
		// Bola akan berhenti
		ballSpeed = 0;
		
		// Memunculkan tulisan pada layar
		document.getElementById("scores").innerHTML = "CPU wins!";
		document.getElementById("winnerBoard").innerHTML = "Refresh to play again";
		
		// Membuat paddle memantul atas dan bawah
		bounceTime++;
		paddle2.position.z = Math.sin(bounceTime * 0.1) * 10;

		paddle2.scale.z = 2 + Math.abs(Math.sin(bounceTime * 0.1)) * 10;
		paddle2.scale.y = 2 + Math.abs(Math.sin(bounceTime * 0.05)) * 10;
	}
}