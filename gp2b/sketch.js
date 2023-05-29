/*

The Game Project

2b - Using variables

*/

var floorPos_y;

var gameChar_x;
var gameChar_y;

var treePos_x;
var treePos_y;

var canyon;
var collectable;

var mountain;
var cloud;


function setup()
{
	createCanvas(1024, 576);
	floorPos_y = 432; //NB. we are now using a variable for the floor position

	//NB. We are now using the built in variables height and width
	gameChar_x = width/2;
	gameChar_y = floorPos_y;

	treePos_x = width/2;
	treePos_y = floorPos_y;

	canyon = 
	{
		x_pos: 100,
		width: 100,
	}

	collectable = 
	{
		x_pos: 240,
		y_pos: 402,
		size: 50
	}

	mountain = 
	{
		x_pos : 400,
		size : 1
	}
	cloud = 
	{
		x_pos : 200,
		y_pos : height * 0.2,
		size : 1
	}

}

function draw()
{
	background(100, 155, 255); //fill the sky blue

	noStroke();
	fill(0, 155, 0);
	rect(0, floorPos_y, height, width - floorPos_y); //draw some green ground

	// clouds
	fill(255)
	
	ellipse(
		cloud.x_pos,
		cloud.y_pos,
		70 * cloud.size,
		40 * cloud.size
		)
	ellipse(
		cloud.x_pos - 40 * cloud.size,
		cloud.y_pos - 5 * cloud.size,
		70  * cloud.size,
		40 * cloud.size
		)
	ellipse(
		cloud.x_pos + 40 * cloud.size,
		cloud.y_pos - 5 * cloud.size,
		70 * cloud.size,
		40 * cloud.size
		)
	ellipse(
		cloud.x_pos,
		cloud.y_pos - 25  * cloud.size,
		60 * cloud.size,
		40 * cloud.size
		)
	fill("red")
	ellipse(cloud.x_pos, cloud.y_pos, 10)

	// mountain
	fill(150,75,0)
	triangle(
		mountain.x_pos,
		floorPos_y - 162 * mountain.size,
		mountain.x_pos + 70 * mountain.size, 
		floorPos_y,
		mountain.x_pos - 70 * mountain.size,
		floorPos_y) // big
	triangle(
		mountain.x_pos - 60 * mountain.size,
		floorPos_y - 102 * mountain.size,
		mountain.x_pos -100 * mountain.size,
		floorPos_y,
		mountain.x_pos - 20 * mountain.size,
		floorPos_y)
	// snow on mountains
	fill(255)
	triangle(
		mountain.x_pos,
		floorPos_y - 162 * mountain.size,
		mountain.x_pos + 14 * mountain.size,
		floorPos_y - 132  * mountain.size,
		mountain.x_pos - 14 * mountain.size,
		floorPos_y - 132 * mountain.size
		)
	triangle(
		mountain.x_pos - 60 * mountain.size,
		floorPos_y - 102 * mountain.size,
		mountain.x_pos - 68 * mountain.size,
		floorPos_y - 82 * mountain.size,
		mountain.x_pos - 52 * mountain.size,
		floorPos_y - 82 * mountain.size,
		)

	fill('red');
	ellipse(mountain.x_pos, floorPos_y, 10)

	// canyon
	fill(0,0,205)
	rect(canyon.x_pos, floorPos_y, canyon.width, height - floorPos_y , 0, 0, 10, 10)
	fill(255,0,0)

	// fish 1
	ellipse(canyon.x_pos + 20, floorPos_y + 25, 15,10)
	triangle(canyon.x_pos + 12, floorPos_y + 25 ,canyon.x_pos + 5, floorPos_y + 20,canyon.x_pos + 5, floorPos_y + 30)

	// fish 2
	ellipse(canyon.x_pos + canyon.width - 20, floorPos_y + 45, 15,10)
	triangle(canyon.x_pos + canyon.width - 12, floorPos_y + 45 ,canyon.x_pos + canyon.width - 7, floorPos_y + 40,canyon.x_pos + canyon.width - 7, floorPos_y + 50)

	// fish 3
	ellipse(canyon.x_pos + 20, floorPos_y + 75, 15,10)
	triangle(canyon.x_pos + 12, floorPos_y + 75 ,canyon.x_pos + 5, floorPos_y + 70,canyon.x_pos + 5, floorPos_y + 80)

	// fish eyes
	stroke(255,255, 0)
	strokeWeight(4)
	point(canyon.x_pos + 23, floorPos_y + 25)
	point(canyon.x_pos + canyon.width - 23, floorPos_y + 45)
	point(canyon.x_pos + 23, floorPos_y + 75)
	noStroke();

	fill("red")
	ellipse(canyon.x_pos, floorPos_y, 10)
	
	// tree
	fill(150,75,0)
	rect(treePos_x - 20 , treePos_y - 150,40,150)
	fill(0,155,0,250);

	ellipse(treePos_x ,treePos_y - 170,70,70)
	ellipse(treePos_x ,treePos_y - 240,70,70)
	ellipse(treePos_x-35 ,treePos_y - 187.5,70,70)
	ellipse(treePos_x-35 ,treePos_y - 220.5,70,70)
	ellipse(treePos_x+35 ,treePos_y - 187.5,70,70)
	ellipse(treePos_x+35 ,treePos_y - 220.5,70,70)

	// fruits
	fill(255,0,0)
	ellipse(treePos_x ,treePos_y - 245,15,15)
	ellipse(treePos_x ,treePos_y - 165,15,15)
	ellipse(treePos_x - 40,treePos_y - 182.5,15,15)
	ellipse(treePos_x + 40,treePos_y - 182.5,15,15)
	ellipse(treePos_x - 40,treePos_y - 225.5,15,15)
	ellipse(treePos_x + 40,treePos_y - 225.5,15,15)
	ellipse(treePos_x ,treePos_y - 205,15,15)


	fill("red")
	ellipse(treePos_x, treePos_y, 10)

	// collectable
	fill(255,255,20)
	circle( collectable.x_pos, collectable.y_pos, collectable.size )
	fill(100, 155, 255)
	circle( collectable.x_pos, collectable.y_pos, collectable.size/3 )

	fill("red")
	ellipse(collectable.x_pos, collectable.y_pos, 10)

	// Character
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

function mousePressed()
{
	gameChar_x = mouseX;
	gameChar_y = mouseY;

}
