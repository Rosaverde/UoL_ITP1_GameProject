/*

The Game Project

3a - Game interaction

*/


var gameChar_x;
var gameChar_y; 
var floorPos_y;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;


function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
	gameChar_x = width/2;
	gameChar_y = floorPos_y;

	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

}

function draw()
{

	///////////DRAWING CODE//////////

	background(100,155,255); //fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height - floorPos_y); //draw some green ground

	//draw the canyon


	//the game character
	if(isLeft && isFalling)
	{
		// add your jumping-left code
		//head
		fill(255, 182, 193);
		ellipse(gameChar_x, gameChar_y - 63, 25,25);
		
		// eyes
		fill(0);
		ellipse(gameChar_x - 5, gameChar_y - 63, 5,5);
		
		// feet
		fill(139, 69, 19);
		rect(gameChar_x, gameChar_y- 10, 10,10,5,2,2,2);
		rect(gameChar_x - 20, gameChar_y - 20 , 10,10,5,2,2,2);
		
		// body
		fill(153,50,204)
		rect(gameChar_x- 10, gameChar_y - 50, 20, 40,5);
		
		//hands
		fill(255, 182, 193);
		rect(gameChar_x - 15, gameChar_y - 50, 10,10,2);

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
		// head
		fill(255, 182, 193);
		ellipse(gameChar_x, gameChar_y - 63, 25,25);
		
		// eyes
		fill(0);
		ellipse(gameChar_x + 5, gameChar_y - 63, 5,5);
		
		// feet
		fill(139, 69, 19);
		rect(gameChar_x- 10, gameChar_y- 10, 10,10,2,5,2,2);
		rect(gameChar_x+ 10, gameChar_y - 20, 10,10,2,5,2,2);
		
		// body
		fill(153,50,204)
		rect(gameChar_x- 10, gameChar_y - 50, 20, 40, 5);
		
		//hands
		fill(255, 182, 193);
		rect(gameChar_x + 5 , gameChar_y- 50, 10,10,2);

	}
	else if(isLeft)
	{
		// add your walking left code
		//head
		fill(255, 182, 193);
		ellipse(gameChar_x, gameChar_y - 53, 25,25);

		// eyes
		fill(0);
		ellipse(gameChar_x - 5, gameChar_y - 53, 5,5);
		
		// feet
		fill(139, 69, 19);
		rect(gameChar_x, gameChar_y- 10, 10,10,5,2,2,2);
		rect(gameChar_x - 18, gameChar_y- 10, 10,10,5,2,2,2);
		
		// body
		fill(153,50,204)
		rect(gameChar_x- 10, gameChar_y - 40, 20, 30, 5);
		
		//hands
		fill(255, 182, 193);
		rect(gameChar_x - 15, gameChar_y- 30, 10,10, 2);
	}
	else if(isRight)
	{
		// add your walking right code
		// head
		fill(255, 182, 193);
		ellipse(gameChar_x, gameChar_y - 53, 25,25);

		
		// eyes
		fill(0);
		ellipse(gameChar_x + 5, gameChar_y - 53, 5,5);
		
		// feet
		fill(139, 69, 19);
		rect(gameChar_x- 10, gameChar_y- 10, 10,10,2,5,2,2);
		rect(gameChar_x+ 10, gameChar_y- 10, 10,10,2,5,2,2);
		
		// body
		fill(153,50,204)
		rect(gameChar_x- 10, gameChar_y - 40, 20, 30, 5);
		
		//hands
		fill(255, 182, 193);
		rect(gameChar_x + 5 , gameChar_y- 30, 10,10,2);

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
		//head
		fill(255, 182, 193);
		ellipse(gameChar_x, gameChar_y - 63, 25,25);

		//hands
		rect(gameChar_x- 23, gameChar_y- 60, 10,10, 2);
		rect(gameChar_x+ 13, gameChar_y- 60, 10,10, 2);
		
		// eyes
		fill(0);
		ellipse(gameChar_x - 5, gameChar_y - 63, 5,5);
		ellipse(gameChar_x + 5, gameChar_y - 63, 5,5);
		
		// feet
		fill(139, 69, 19);
		rect(gameChar_x- 20, gameChar_y- 10, 10, 10, 5, 2, 2, 2);
		rect(gameChar_x+ 10, gameChar_y- 10, 10, 10, 2, 5, 2, 2);
		
		// body
		fill(153,50,204)
		rect(gameChar_x- 10, gameChar_y - 50, 20, 40, 5);
	}
	else
	{
		// add your standing front facing code
		//head
		fill(255, 182, 193);
		ellipse(gameChar_x, gameChar_y - 53, 25,25);

		//hands
		rect(gameChar_x- 21, gameChar_y- 35, 10,10, 2);
		rect(gameChar_x+ 11, gameChar_y- 35, 10,10, 2);

		// eyes
		fill(0);
		ellipse(gameChar_x - 5, gameChar_y - 53, 5,5);
		ellipse(gameChar_x + 5, gameChar_y - 53, 5,5);
		
		// feet
		fill(139, 69, 19);
		rect(gameChar_x- 15, gameChar_y- 10, 10,10,5,2,2,2);
		rect(gameChar_x+ 5, gameChar_y- 10, 10,10,2,5,2,2);
		
		// body
		fill(153,50,204);
		rect(gameChar_x- 10, gameChar_y - 40, 20, 30, 5);

		fill("red");
		ellipse(gameChar_x, gameChar_y, 10);
	}

	///////////INTERACTION CODE//////////
	//Put conditional statements to move the game character below here
	//// Turn Left and Right
	if(isLeft == true)
	{
		gameChar_x -= 3;
	}
	else if(isRight == true)
	{
		gameChar_x += 3;
	}
	//// Jump

	if(gameChar_y < floorPos_y)
	{
		gameChar_y += 1;
		isFalling = true;
	}
	else
	{
		isFalling = false;
	}
}


function keyPressed()
{
	// if statements to control the animation of the character when
	// keys are pressed.
	if (keyCode == 65)
	{
		isLeft = true;
	}
	else if(keyCode == 68)
	{
		isRight = true;
	}
	if (keyCode == 87 && isFalling == false)
	{
		gameChar_y -= 100;
	}
	

	//open up the console to see how these work
	console.log("keyPressed: " + key);
	console.log("keyPressed: " + keyCode);
}

function keyReleased()
{
	// if statements to control the animation of the character when
	// keys are released.

	console.log("keyReleased: " + key);
	console.log("keyReleased: " + keyCode);
	if (keyCode == 65)
	{
		isLeft = false;
	}
	else if(keyCode == 68)
	{
		isRight = false;
	}
}
