/*

The Game Project

5 - Multiple interactables

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var collectables;
var canyons;
var trees_x;
var treePos_y;
var clouds;
var mountains;
var cameraPosX;
var animationSwitch;

function setup() {
	createCanvas(1024, 576);
	floorPos_y = height * 3 / 4;
	gameChar_x = width / 2;
	gameChar_y = floorPos_y;
	trees_x = [80, 550, 880];
	treePos_y = floorPos_y;
	cameraPosX = 0;
	animationSwitch = 1;

	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	clouds = [
		{
			x_pos: -20,
			y_pos: height * 0.12,
			size: 0.8
		},
		{
			x_pos: 80,
			y_pos: height * 0.22,
			size: 0.7
		},
		{
			x_pos: 280,
			y_pos: height * 0.12,
			size: 0.8
		},
		{
			x_pos: 480,
			y_pos: height * 0.13,
			size: 1
		},
		{
			x_pos: 680,
			y_pos: height * 0.2,
			size: 1.2
		},
		{
			x_pos: 880,
			y_pos: height * 0.13,
			size: 1.5
		}
	];

	mountains =
		[
			{
				x_pos: -80,
				size: 0.5
			},
			{
				x_pos: 50,
				size: 0.7
			},
			{
				x_pos: 400,
				size: 1
			}, {
				x_pos: 630,
				size: 0.8
			},
			{
				x_pos: 800,
				size: 0.5
			}
		];

	canyons = 
[
		{
		x_pos: 190,
		width: 90,
	},
	{
		x_pos: 390,
		width: 90,
	},
	{
		x_pos: 590,
		width: 90,
	}
]

	collectables =
	[
		{
			x_pos: 240,
			y_pos: floorPos_y - 25,
			size: 40,
			isFound: false
		},
		{
			x_pos: 440,
			y_pos: floorPos_y - 25,
			size: 40,
			isFound: false
		},
		{
			x_pos: 640,
			y_pos: floorPos_y - 25,
			size: 40,
			isFound: false
		},
		{
			x_pos: 840,
			y_pos: floorPos_y - 25,
			size: 40,
			isFound: false
		}
	];
};

function draw() {

	// Loop for animation
	if (frameCount % 9 === 0) {
		animationSwitch++;
		animationSwitch % 4 === 0 ? animationSwitch = 0 : animationSwitch;
	};

	// Camera move

	cameraPosX = gameChar_x - width / 2;

	///////////DRAWING CODE//////////

	background(100, 155, 255); //fill the sky blue

	noStroke();
	fill(0, 155, 0);
	rect(0, floorPos_y, width, height - floorPos_y); //draw some green ground

	push();
	translate(-cameraPosX, 0);

	// CLOUDS
	drawClouds();

	// MOUNTAINS
	drawMountains();

	// CANYON
	for(var i = 0; i< canyons.length; i++)
	{
		drawCanyon(canyons[i]);
			//Plummeting
		checkCanyon(canyons[i]);
	};

	// TREES
	drawTrees();

	// COLLECTABLE
	for(var i=0; i< collectables.length; i++)
{
		checkCollectable(collectables[i]);
	
		if (collectables[i].isFound == false) {
			drawCollectable(collectables[i]);
		};
}


	//the game character
	if (isLeft && isFalling) {
		character_jump_left(gameChar_x, gameChar_y, animationSwitch);
	}
	else if (isRight && isFalling) {
		character_jump_right(gameChar_x, gameChar_y, animationSwitch);
	}
	else if (isLeft) {
		character_walking_left(gameChar_x, gameChar_y, animationSwitch);
	}
	else if (isRight) {
		character_walking_right(gameChar_x, gameChar_y, animationSwitch);
	}
	else if (isFalling || isPlummeting) {
		character_jumping_front(gameChar_x, gameChar_y, animationSwitch);
	}
	else {
		character_standing(gameChar_x, gameChar_y, animationSwitch);
	}

	pop();

	///////////INTERACTION CODE//////////

	//// Turn Left and Right
	if (isLeft == true) {
		gameChar_x -= 3;
	}
	else if (isRight == true) {
		gameChar_x += 3;
	};
	//// Jump

	if (gameChar_y < floorPos_y) {
		gameChar_y += 2.5;
		isFalling = true;
	}
	else {
		isFalling = false;
	};

};

function keyPressed() {
	if (isPlummeting == false) {
		if (keyCode == 65) {
			isLeft = true;
		}
		else if (keyCode == 68) {
			isRight = true;
		};
		if (keyCode == 87 && isFalling == false) {
			gameChar_y -= 100;
		};
	};
};

function keyReleased() {
	if (keyCode == 65) {
		isLeft = false;
		test = true;
	}
	else if (keyCode == 68) {
		isRight = false;
	};
};

function checkCanyon(t_canyon)
{
	if (gameChar_x - 10 > t_canyon.x_pos && gameChar_x + 10 < t_canyon.x_pos + t_canyon.width && gameChar_y >= floorPos_y) {
		isPlummeting = true;
	};
	if (isPlummeting == true) {
		gameChar_y += 1;
	};
};

function checkCollectable(t_collectable)
{
	if (dist(gameChar_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) <= 35) {
		t_collectable.isFound = true;
	};
};

function drawCanyon(t_canyon)
{
	fill(0, 0, 205);
	rect(t_canyon.x_pos, floorPos_y, t_canyon.width, height - floorPos_y, 0, 0, 10, 10);
	fill(255, 0, 0);

	// fish 1
	ellipse(t_canyon.x_pos + 23, floorPos_y + 25, 15, 10);
	triangle(t_canyon.x_pos + 12, floorPos_y + 25, t_canyon.x_pos + 5, floorPos_y + 20, t_canyon.x_pos + 5, floorPos_y + 30);

	// fish 2
	ellipse(t_canyon.x_pos + t_canyon.width - 20, floorPos_y + 45, 15, 10);
	triangle(t_canyon.x_pos + t_canyon.width - 12, floorPos_y + 45, t_canyon.x_pos + t_canyon.width - 7, floorPos_y + 40, t_canyon.x_pos + t_canyon.width - 7, floorPos_y + 50);

	// fish 3
	ellipse(t_canyon.x_pos + 20, floorPos_y + 75, 15, 10);
	triangle(t_canyon.x_pos + 12, floorPos_y + 75, t_canyon.x_pos + 5, floorPos_y + 70, t_canyon.x_pos + 5, floorPos_y + 80);

	// fish eyes
	stroke(255, 255, 0);
	strokeWeight(4);
	point(t_canyon.x_pos + t_canyon.width - 23, floorPos_y + 45);
	point(t_canyon.x_pos + 23, floorPos_y + 75);
	point(t_canyon.x_pos + 23, floorPos_y + 25);
	noStroke();
};

function drawCollectable(t_collectable)
{
	fill(255, 255, 20);
	circle(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size);
	fill(100, 155, 255);
	circle(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size / 3);
};

function drawClouds()
{
	for (var i = 0; i < clouds.length; i++) {
		fill(255);

		ellipse(
			clouds[i].x_pos,
			clouds[i].y_pos,
			70 * clouds[i].size,
			40 * clouds[i].size
		);
		ellipse(
			clouds[i].x_pos - 40 * clouds[i].size,
			clouds[i].y_pos - 5 * clouds[i].size,
			70 * clouds[i].size,
			40 * clouds[i].size
		);
		ellipse(
			clouds[i].x_pos + 40 * clouds[i].size,
			clouds[i].y_pos - 5 * clouds[i].size,
			70 * clouds[i].size,
			40 * clouds[i].size
		);
		ellipse(
			clouds[i].x_pos,
			clouds[i].y_pos - 25 * clouds[i].size,
			60 * clouds[i].size,
			40 * clouds[i].size
		);
	};
};

function drawMountains()
{
	for (var i = 0; i < mountains.length; i++) {
		fill(92, 125, 146);
		// BIG MOUNTAIN
		triangle(
			mountains[i].x_pos,
			floorPos_y - 162 * mountains[i].size,
			mountains[i].x_pos + 70 * mountains[i].size,
			floorPos_y,
			mountains[i].x_pos - 70 * mountains[i].size,
			floorPos_y
		);
		// SMALL MOUNTAIN
		triangle(
			mountains[i].x_pos - 60 * mountains[i].size,
			floorPos_y - 102 * mountains[i].size,
			mountains[i].x_pos - 100 * mountains[i].size,
			floorPos_y,
			mountains[i].x_pos - 20 * mountains[i].size,
			floorPos_y
		);
		// SNOW ON MOUNTAINS
		fill(255);
		// BIG
		triangle(
			mountains[i].x_pos,
			floorPos_y - 162 * mountains[i].size,
			mountains[i].x_pos + 13 * mountains[i].size,
			floorPos_y - 132 * mountains[i].size,
			mountains[i].x_pos - 13 * mountains[i].size,
			floorPos_y - 132 * mountains[i].size
		);
		// SMALL
		triangle(
			mountains[i].x_pos - 60 * mountains[i].size,
			floorPos_y - 102 * mountains[i].size,
			mountains[i].x_pos - 68 * mountains[i].size,
			floorPos_y - 82 * mountains[i].size,
			mountains[i].x_pos - 52 * mountains[i].size,
			floorPos_y - 82 * mountains[i].size,
		);
	};
};

function drawTrees()
{
	for (var i = 0; i < trees_x.length; i++) {
		fill(156, 90, 57);
		rect(trees_x[i] - 20, treePos_y - 150, 40, 150);
		fill(0, 155, 0, 250);

		ellipse(trees_x[i], treePos_y - 170, 70, 70);
		ellipse(trees_x[i], treePos_y - 240, 70, 70);
		ellipse(trees_x[i] - 35, treePos_y - 187.5, 70, 70);
		ellipse(trees_x[i] - 35, treePos_y - 220.5, 70, 70);
		ellipse(trees_x[i] + 35, treePos_y - 187.5, 70, 70);
		ellipse(trees_x[i] + 35, treePos_y - 220.5, 70, 70);

		// fruits
		fill(255, 0, 0);
		ellipse(trees_x[i], treePos_y - 245, 15, 15);
		ellipse(trees_x[i], treePos_y - 165, 15, 15);
		ellipse(trees_x[i] - 40, treePos_y - 182.5, 15, 15);
		ellipse(trees_x[i] + 40, treePos_y - 182.5, 15, 15);
		ellipse(trees_x[i] - 40, treePos_y - 225.5, 15, 15);
		ellipse(trees_x[i] + 40, treePos_y - 225.5, 15, 15);
		ellipse(trees_x[i], treePos_y - 205, 15, 15);
	};
};


///////////ANIMATION CODE//////////

function character_standing(gameChar_x, gameChar_y, state) {
	switch (state) {
		case 0:
			// POS 1

			//head
			fill(255, 182, 193)
			ellipse(gameChar_x, gameChar_y - 53, 25, 25);

			//hands
			rect(gameChar_x - 21, gameChar_y - 35, 10, 10, 2);
			rect(gameChar_x + 11, gameChar_y - 35, 10, 10, 2);

			// eyes
			fill(0);
			ellipse(gameChar_x - 5, gameChar_y - 53, 5, 5);
			ellipse(gameChar_x + 5, gameChar_y - 53, 5, 5);

			// feet
			fill(139, 69, 19);
			rect(gameChar_x - 15, gameChar_y - 10, 10, 10, 5, 2, 2, 2);
			rect(gameChar_x + 5, gameChar_y - 10, 10, 10, 2, 5, 2, 2);

			// body
			fill(153, 50, 204);
			rect(gameChar_x - 10, gameChar_y - 40, 20, 30, 5);
			break;
		case 1:
			// POS 2

			//head
			fill(255, 182, 193);
			ellipse(gameChar_x, gameChar_y - 48, 25, 25);

			//hands
			rect(gameChar_x - 21, gameChar_y - 25, 10, 10, 2);
			rect(gameChar_x + 11, gameChar_y - 25, 10, 10, 2);

			// eyes
			fill(0);
			ellipse(gameChar_x - 6, gameChar_y - 43, 5, 5);
			ellipse(gameChar_x + 6, gameChar_y - 43, 5, 5);

			// feet
			fill(139, 69, 19);
			rect(gameChar_x - 16, gameChar_y - 10, 10, 10, 5, 2, 2, 2);
			rect(gameChar_x + 6, gameChar_y - 10, 10, 10, 2, 5, 2, 2);

			// body
			fill(153, 50, 204);
			rect(gameChar_x - 10, gameChar_y - 32, 20, 22, 7);
			break;

		case 2:
			// POS 3

			//head
			fill(255, 182, 193);
			ellipse(gameChar_x, gameChar_y - 43, 25, 25);

			//hands
			rect(gameChar_x - 25, gameChar_y - 25, 10, 10, 2);
			rect(gameChar_x + 15, gameChar_y - 25, 10, 10, 2);

			// eyes
			fill(0);
			ellipse(gameChar_x - 7, gameChar_y - 43, 5, 5);
			ellipse(gameChar_x + 7, gameChar_y - 43, 5, 5);

			// feet
			fill(139, 69, 19);
			rect(gameChar_x - 17, gameChar_y - 10, 10, 10, 5, 2, 2, 2);
			rect(gameChar_x + 7, gameChar_y - 10, 10, 10, 2, 5, 2, 2);

			// body
			fill(153, 50, 204);
			rect(gameChar_x - 15, gameChar_y - 30, 30, 20, 10);
			break;

		case 3:
			// POS 4

			//head
			fill(255, 182, 193);
			ellipse(gameChar_x, gameChar_y - 48, 25, 25);

			//hands
			rect(gameChar_x - 21, gameChar_y - 25, 10, 10, 2);
			rect(gameChar_x + 11, gameChar_y - 25, 10, 10, 2);

			// eyes
			fill(0);
			ellipse(gameChar_x - 6, gameChar_y - 53, 5, 5);
			ellipse(gameChar_x + 6, gameChar_y - 53, 5, 5);

			// feet
			fill(139, 69, 19);
			rect(gameChar_x - 16, gameChar_y - 10, 10, 10, 5, 2, 2, 2);
			rect(gameChar_x + 6, gameChar_y - 10, 10, 10, 2, 5, 2, 2);

			// body
			fill(153, 50, 204);
			rect(gameChar_x - 10, gameChar_y - 32, 20, 22, 7);
			break;
	};
};

function character_jumping_front(gameChar_x, gameChar_y, state) {
	switch (state) {
		case 0:
			// POS 1

			//head
			fill(255, 182, 193);
			ellipse(gameChar_x, gameChar_y - 63, 25, 25);

			//hands
			rect(gameChar_x - 23, gameChar_y - 60, 10, 10, 2);
			rect(gameChar_x + 13, gameChar_y - 60, 10, 10, 2);

			// eyes
			fill(0);
			ellipse(gameChar_x - 5, gameChar_y - 63, 5, 5);
			ellipse(gameChar_x + 5, gameChar_y - 63, 5, 5);

			// feet
			fill(139, 69, 19);
			rect(gameChar_x - 20, gameChar_y - 10, 10, 10, 5, 2, 2, 2);
			rect(gameChar_x + 10, gameChar_y - 10, 10, 10, 2, 5, 2, 2);

			// body
			fill(153, 50, 204);
			rect(gameChar_x - 10, gameChar_y - 50, 20, 40, 5);
			break;

		case 1:
			// POS 2

			//head
			fill(255, 182, 193);
			ellipse(gameChar_x, gameChar_y - 63, 25, 25);

			//hands
			rect(gameChar_x - 25, gameChar_y - 55, 10, 10, 2);
			rect(gameChar_x + 15, gameChar_y - 55, 10, 10, 2);

			// eyes
			fill(0);
			ellipse(gameChar_x - 5, gameChar_y - 64, 6, 6);
			ellipse(gameChar_x + 5, gameChar_y - 64, 6, 6);

			// feet
			fill(139, 69, 19);
			rect(gameChar_x - 21, gameChar_y - 15, 10, 10, 5, 2, 2, 2);
			rect(gameChar_x + 11, gameChar_y - 15, 10, 10, 2, 5, 2, 2);

			// body
			fill(153, 50, 204);
			rect(gameChar_x - 12, gameChar_y - 50, 24, 35, 7);
			break;

		case 2:
			// POS 3

			//head
			fill(255, 182, 193);
			ellipse(gameChar_x, gameChar_y - 63, 25, 25);

			//hands
			rect(gameChar_x - 26, gameChar_y - 50, 10, 10, 2);
			rect(gameChar_x + 16, gameChar_y - 50, 10, 10, 2);

			// eyes
			fill(0);
			ellipse(gameChar_x - 5, gameChar_y - 65, 7, 7);
			ellipse(gameChar_x + 5, gameChar_y - 65, 7, 7);

			// feet
			fill(139, 69, 19);
			rect(gameChar_x - 20, gameChar_y - 20, 10, 10, 5, 2, 2, 2);
			rect(gameChar_x + 10, gameChar_y - 20, 10, 10, 2, 5, 2, 2);

			// body
			fill(153, 50, 204);
			rect(gameChar_x - 15, gameChar_y - 50, 30, 30, 10);
			break;

		case 3:
			// POS 4

			//head
			fill(255, 182, 193);
			ellipse(gameChar_x, gameChar_y - 63, 25, 25);

			//hands
			rect(gameChar_x - 24, gameChar_y - 55, 10, 10, 2);
			rect(gameChar_x + 14, gameChar_y - 55, 10, 10, 2);

			// eyes
			fill(0);
			ellipse(gameChar_x - 5, gameChar_y - 64, 5, 5);
			ellipse(gameChar_x + 5, gameChar_y - 64, 5, 5);

			// feet
			fill(139, 69, 19);
			rect(gameChar_x - 21, gameChar_y - 15, 10, 10, 5, 2, 2, 2);
			rect(gameChar_x + 11, gameChar_y - 15, 10, 10, 2, 5, 2, 2);

			// body
			fill(153, 50, 204);
			rect(gameChar_x - 12, gameChar_y - 50, 24, 35, 7);
			break;
	};
};

function character_walking_left(gameChar_x, gameChar_y, state) {
	switch (state) {
		case 0:
			// POS 1

			//head
			fill(255, 182, 193);
			ellipse(gameChar_x, gameChar_y - 53, 25, 25);

			// eyes
			fill(0);
			ellipse(gameChar_x - 5, gameChar_y - 53, 5, 5);

			// feet
			fill(139, 69, 19);
			rect(gameChar_x, gameChar_y - 10, 10, 10, 5, 2, 2, 2);
			rect(gameChar_x - 18, gameChar_y - 10, 10, 10, 5, 2, 2, 2);

			// body
			fill(153, 50, 204);
			rect(gameChar_x - 10, gameChar_y - 40, 20, 30, 5);

			//hands
			fill(255, 182, 193);
			rect(gameChar_x - 15, gameChar_y - 30, 10, 10, 2);
			break;

		case 1:
			// POS 2

			//head
			fill(255, 182, 193);
			ellipse(gameChar_x, gameChar_y - 51, 25, 25);

			// eyes
			fill(0);
			ellipse(gameChar_x - 5, gameChar_y - 52, 5, 5);

			// feet
			fill(139, 69, 19);
			rect(gameChar_x, gameChar_y - 10, 10, 10, 5, 2, 2, 2);
			rect(gameChar_x - 14, gameChar_y - 9, 10, 10, 5, 2, 2, 2);

			// body
			fill(153, 50, 204);
			rect(gameChar_x - 12, gameChar_y - 37, 25, 27, 7);

			//hands
			fill(255, 182, 193);
			rect(gameChar_x - 10, gameChar_y - 29, 10, 10, 2);
			break;

		case 2:
			// POS 3

			//head
			fill(255, 182, 193);
			ellipse(gameChar_x, gameChar_y - 50, 25, 25);

			// eyes
			fill(0);
			ellipse(gameChar_x - 5, gameChar_y - 51, 5, 5);

			// feet
			fill(139, 69, 19);
			rect(gameChar_x - 4, gameChar_y - 10, 10, 10, 5, 2, 2, 2);
			rect(gameChar_x - 5, gameChar_y - 8, 10, 10, 5, 2, 2, 2);

			// body
			fill(153, 50, 204);
			rect(gameChar_x - 15, gameChar_y - 35, 30, 25, 10);

			//hands
			fill(255, 182, 193);
			rect(gameChar_x - 5, gameChar_y - 28, 10, 10, 2);
			rect(gameChar_x - 15, gameChar_y - 30, 10, 10, 2);
			break;

		case 3:
			// POS 4

			//head
			fill(255, 182, 193);
			ellipse(gameChar_x, gameChar_y - 51, 25, 25);

			// eyes
			fill(0);
			ellipse(gameChar_x - 5, gameChar_y - 52, 5, 5);

			// feet
			fill(139, 69, 19);
			rect(gameChar_x, gameChar_y - 9, 10, 10, 5, 2, 2, 2);
			rect(gameChar_x - 14, gameChar_y - 10, 10, 10, 5, 2, 2, 2);

			// body
			fill(153, 50, 204);
			rect(gameChar_x - 12, gameChar_y - 37, 25, 27, 7);

			//hands
			fill(255, 182, 193);
			rect(gameChar_x - 10, gameChar_y - 29, 10, 10, 2);
			break;
	};
};

function character_walking_right(gameChar_x, gameChar_y, state) {
	switch (state) {
		case 0:
			// POS 1

			// head
			fill(255, 182, 193);
			ellipse(gameChar_x, gameChar_y - 53, 25, 25);

			// eyes
			fill(0);
			ellipse(gameChar_x + 5, gameChar_y - 53, 5, 5);

			// feet
			fill(139, 69, 19);
			rect(gameChar_x - 10, gameChar_y - 10, 10, 10, 2, 5, 2, 2);
			rect(gameChar_x + 8, gameChar_y - 10, 10, 10, 2, 5, 2, 2);

			// body
			fill(153, 50, 204);
			rect(gameChar_x - 10, gameChar_y - 40, 20, 30, 5);

			//hands
			fill(255, 182, 193);
			rect(gameChar_x + 5, gameChar_y - 30, 10, 10, 2);
			break;

		case 1:
			// POS 2

			// head
			fill(255, 182, 193);
			ellipse(gameChar_x, gameChar_y - 51, 25, 25);

			// eyes
			fill(0);
			ellipse(gameChar_x + 5, gameChar_y - 52, 5, 5);

			// feet
			fill(139, 69, 19);
			rect(gameChar_x - 10, gameChar_y - 10, 10, 10, 2, 5, 2, 2);
			rect(gameChar_x + 4, gameChar_y - 9, 10, 10, 2, 5, 2, 2);

			// body
			fill(153, 50, 204);
			rect(gameChar_x - 12, gameChar_y - 37, 25, 27, 7);

			//hands
			fill(255, 182, 193);
			rect(gameChar_x, gameChar_y - 29, 10, 10, 2);
			break;

		case 2:
			// POS 3

			// head
			fill(255, 182, 193);
			ellipse(gameChar_x, gameChar_y - 50, 25, 25);

			// eyes
			fill(0);
			ellipse(gameChar_x + 5, gameChar_y - 51, 5, 5);

			// feet
			fill(139, 69, 19);
			rect(gameChar_x - 6, gameChar_y - 10, 10, 10, 2, 5, 2, 2);
			rect(gameChar_x - 5, gameChar_y - 8, 10, 10, 2, 5, 2, 2);

			// body
			fill(153, 50, 204);
			rect(gameChar_x - 15, gameChar_y - 35, 30, 25, 10);

			//hands
			fill(255, 182, 193);
			rect(gameChar_x - 5, gameChar_y - 28, 10, 10, 2);
			rect(gameChar_x + 5, gameChar_y - 30, 10, 10, 2);
			break;

		case 3:
			// POS 4

			// head
			fill(255, 182, 193);
			ellipse(gameChar_x, gameChar_y - 51, 25, 25);

			// eyes
			fill(0);
			ellipse(gameChar_x + 5, gameChar_y - 52, 5, 5);

			// feet
			fill(139, 69, 19);
			rect(gameChar_x - 10, gameChar_y - 9, 10, 10, 2, 5, 2, 2);
			rect(gameChar_x + 4, gameChar_y - 10, 10, 10, 2, 5, 2, 2);

			// body
			fill(153, 50, 204);
			rect(gameChar_x - 12, gameChar_y - 37, 25, 27, 7);

			//hands
			fill(255, 182, 193);
			rect(gameChar_x, gameChar_y - 29, 10, 10, 2);
			break;
	};
};

function character_jump_right(gameChar_x, gameChar_y, state) {
	switch (state) {
		case 0:
			// POS 1

			// head
			fill(255, 182, 193);
			ellipse(gameChar_x, gameChar_y - 63, 25, 25);

			// eyes
			fill(0);
			ellipse(gameChar_x + 5, gameChar_y - 63, 5, 5);

			// feet
			fill(139, 69, 19);
			rect(gameChar_x - 7, gameChar_y - 25, 10, 10, 2, 5, 2, 2);
			rect(gameChar_x + 5, gameChar_y - 24, 10, 10, 2, 5, 2, 2);

			// body
			fill(153, 50, 204);
			rect(gameChar_x - 12, gameChar_y - 50, 24, 30, 10);

			//hands
			fill(255, 182, 193);
			rect(gameChar_x + 10, gameChar_y - 45, 10, 10, 2);
			break;

		case 1:
			// POS 2

			// head
			fill(255, 182, 193);
			ellipse(gameChar_x, gameChar_y - 63, 25, 25);

			// eyes
			fill(0);
			ellipse(gameChar_x + 5, gameChar_y - 63, 5, 5);

			// feet
			fill(139, 69, 19);
			rect(gameChar_x - 7, gameChar_y - 17, 10, 10, 2, 5, 2, 2);
			rect(gameChar_x + 7, gameChar_y - 15, 10, 10, 2, 5, 2, 2);

			// body
			fill(153, 50, 204);
			rect(gameChar_x - 11, gameChar_y - 48, 22, 35, 7);

			//hands
			fill(255, 182, 193);
			rect(gameChar_x + 10, gameChar_y - 40, 10, 10, 2);
			break;

		case 2:
			// POS 3

			// head
			fill(255, 182, 193);
			ellipse(gameChar_x, gameChar_y - 63, 25, 25);

			// eyes
			fill(0);
			ellipse(gameChar_x + 5, gameChar_y - 63, 5, 5);

			// feet
			fill(139, 69, 19);
			rect(gameChar_x - 16, gameChar_y - 9, 10, 10, 2, 5, 2, 2);
			rect(gameChar_x - 2, gameChar_y - 10, 10, 10, 2, 5, 2, 2);

			// body
			fill(153, 50, 204);
			rect(gameChar_x - 10, gameChar_y - 47, 20, 40, 5);

			//hands
			fill(255, 182, 193);
			rect(gameChar_x - 5, gameChar_y - 40, 10, 10, 2);
			break;

		case 3:
			// POS 4

			// head
			fill(255, 182, 193);
			ellipse(gameChar_x, gameChar_y - 63, 25, 25);

			// eyes
			fill(0);
			ellipse(gameChar_x + 5, gameChar_y - 63, 5, 5);

			// feet
			fill(139, 69, 19);
			rect(gameChar_x - 7, gameChar_y - 15, 10, 10, 2, 5, 2, 2);
			rect(gameChar_x + 5, gameChar_y - 17, 10, 10, 2, 5, 2, 2);

			// body
			fill(153, 50, 204);
			rect(gameChar_x - 11, gameChar_y - 48, 22, 37, 7);

			//hands
			fill(255, 182, 193);
			rect(gameChar_x + 2, gameChar_y - 43, 10, 10, 2);
			break;
	};
};

function character_jump_left(gameChar_x, gameChar_y, state) {
	switch (state) {
		case 0:
			// POS 1

			//head
			fill(255, 182, 193);
			ellipse(gameChar_x, gameChar_y - 63, 25, 25);

			// eyes
			fill(0);
			ellipse(gameChar_x - 5, gameChar_y - 63, 5, 5);

			// feet
			fill(139, 69, 19);
			rect(gameChar_x - 3, gameChar_y - 25, 10, 10, 5, 2, 2, 2);
			rect(gameChar_x - 15, gameChar_y - 24, 10, 10, 5, 2, 2, 2);

			// body
			fill(153, 50, 204);
			rect(gameChar_x - 12, gameChar_y - 50, 24, 30, 10);

			//hands
			fill(255, 182, 193);
			rect(gameChar_x - 20, gameChar_y - 45, 10, 10, 2);
			break;

		case 1:
			// POS 2

			//head
			fill(255, 182, 193);
			ellipse(gameChar_x, gameChar_y - 63, 25, 25);

			// eyes
			fill(0);
			ellipse(gameChar_x - 5, gameChar_y - 63, 5, 5);

			// feet
			fill(139, 69, 19);
			rect(gameChar_x - 3, gameChar_y - 17, 10, 10, 5, 2, 2, 2);
			rect(gameChar_x - 17, gameChar_y - 15, 10, 10, 5, 2, 2, 2);

			// body
			fill(153, 50, 204);
			rect(gameChar_x - 11, gameChar_y - 48, 22, 35, 7);

			//hands
			fill(255, 182, 193);
			rect(gameChar_x - 20, gameChar_y - 40, 10, 10, 2);
			break;

		case 2:
			// POS 3

			//head
			fill(255, 182, 193);
			ellipse(gameChar_x, gameChar_y - 63, 25, 25);

			// eyes
			fill(0);
			ellipse(gameChar_x - 5, gameChar_y - 63, 5, 5);

			// feet
			fill(139, 69, 19);
			rect(gameChar_x + 6, gameChar_y - 9, 10, 10, 5, 2, 2, 2);
			rect(gameChar_x - 8, gameChar_y - 10, 10, 10, 5, 2, 2, 2);

			// body
			fill(153, 50, 204);
			rect(gameChar_x - 10, gameChar_y - 47, 20, 40, 5);

			//hands
			fill(255, 182, 193);
			rect(gameChar_x - 5, gameChar_y - 40, 10, 10, 2);
			break;

		case 3:
			// POS 4

			//head
			fill(255, 182, 193);
			ellipse(gameChar_x, gameChar_y - 63, 25, 25);

			// eyes
			fill(0);
			ellipse(gameChar_x - 5, gameChar_y - 63, 5, 5);

			// feet
			fill(139, 69, 19);
			rect(gameChar_x - 15, gameChar_y - 17, 10, 10, 5, 2, 2, 2);
			rect(gameChar_x - 3, gameChar_y - 15, 10, 10, 5, 2, 2, 2);

			// body
			fill(153, 50, 204);
			rect(gameChar_x - 11, gameChar_y - 48, 20, 40, 5);

			//hands
			fill(255, 182, 193);
			rect(gameChar_x - 12, gameChar_y - 43, 10, 10, 2);
			break;
	};
};
