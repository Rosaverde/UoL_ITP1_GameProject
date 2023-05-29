/*

The Game Project

2a - Game character

*/

var gameChar_x = 0;
var gameChar_y = 0;

function setup()
{
	createCanvas(400, 600);
}

function draw()
{
	background(255);

	//Standing, facing frontwards

	stroke(100);
	noFill();
	rect(20, 60, 50, 80);
	noStroke();
	fill(0);
	text("1. standing front facing", 20, 160);

	gameChar_x = 45;
	gameChar_y = 137;
	//Add your code here ...

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
	fill(0, 191, 255);
	rect(gameChar_x- 10, gameChar_y - 40, 20, 30, 5);

	//Jumping facing forwards
	stroke(100);
	noFill();
	rect(220, 60, 50, 80);
	noStroke();
	fill(0);
	text("2. jumping facing forwards", 220, 160);

	gameChar_x = 245;
	gameChar_y = 137;
	//Add your code here ...

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
	fill(0, 191, 255);
	rect(gameChar_x- 10, gameChar_y - 50, 20, 40, 5);


	//Walking, turned left
	stroke(100);
	noFill();
	rect(20, 260, 50, 80);
	noStroke();
	fill(0);
	text("3. Walking left", 20, 360);

	gameChar_x = 45;
	gameChar_y = 337;
	//Add your code here ...

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
	fill(0, 191, 255);
	rect(gameChar_x- 10, gameChar_y - 40, 20, 30, 5);
	
	//hands
	fill(255, 182, 193);
	rect(gameChar_x - 15, gameChar_y- 30, 10,10, 2);
	

	//Walking, turned right
	stroke(100);
	noFill();
	rect(220, 260, 50, 80);
	noStroke();
	fill(0);
	text("4. Walking right", 220, 360);

	gameChar_x = 245;
	gameChar_y = 337;
	//Add your code here ...

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
	fill(0, 191, 255);
	rect(gameChar_x- 10, gameChar_y - 40, 20, 30, 5);
	
	//hands
	fill(255, 182, 193);
	rect(gameChar_x + 5 , gameChar_y- 30, 10,10,2);
	

	//Jumping right
	stroke(100);
	noFill();
	rect(20, 460, 50, 80);
	noStroke();
	fill(0);
	text("5. Jumping to the right", 20, 560);

	gameChar_x = 45;
	gameChar_y = 537;
	//Add your code here ...

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
	fill(0, 191, 255);
	rect(gameChar_x- 10, gameChar_y - 50, 20, 40, 5);
	
	//hands
	fill(255, 182, 193);
	rect(gameChar_x + 5 , gameChar_y- 50, 10,10,2);



	//Jumping to the left
	stroke(100);
	noFill();
	rect(220, 460, 50, 80);
	noStroke();
	fill(0);
	text("6. Jumping to the left", 220, 560);

	gameChar_x = 245;
	gameChar_y = 537;
	//Add your code here ...

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
	fill(0, 191, 255);
	rect(gameChar_x- 10, gameChar_y - 50, 20, 40,5);
	
	//hands
	fill(255, 182, 193);
	rect(gameChar_x - 15, gameChar_y - 50, 10,10,2);

}
