/*

The Game Project

1 - Background Scenery

*/

function setup()
{
	createCanvas(1024, 576);

}

function draw()
{
	background(100, 155, 255); //fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, 432, 1024, 144); //draw some green ground

	//1. a cloud in the sky
	//... add your code here
	fill(255)
	ellipse(210,125,70,40)
	ellipse(170,120,70,40)
	ellipse(250,120,70,40)
	ellipse(210,100,60,40)

	noStroke();
	fill(255);
	text("cloud", 200, 100);

	//2. a mountain in the distance
	//... add your code here
	fill(150,75,0)
	triangle(520,270,590,432,450,432) // big
	triangle(460,330,420,432,500,432)
	
	fill(255)
	triangle(520,270,502,310,538,310)
	triangle(460,330,448,360,472,360)

	noStroke();
	fill(255);
	text("mountain", 500, 256);

	//3. a tree
	//... add your code here
	fill(150,75,0)
	rect(840,340,20,100)
	fill(0,155,0);
	ellipse(850,260,40,50)
	ellipse(850,320,40,50)
	ellipse(830,310,40,50)
	ellipse(850,300,40,50)
	ellipse(870,310,40,50)
	ellipse(830,280,40,50)
	ellipse(870,280,40,50)


	noStroke();
	fill(255);
	text("tree", 800, 346);

	//4. a canyon
	//NB. the canyon should go from ground-level to the bottom of the screen
	fill(50)
	beginShape()
	vertex(110,576)
	vertex(160,576)
	vertex(220,432)
	vertex(170,432)
	endShape(CLOSE)
	beginShape()
	vertex(110,432)
	vertex(60,432)
	vertex(0,576)
	vertex(50,576)
	endShape(CLOSE)
	fill(100, 205, 255)
	beginShape()
	vertex(170,432)
	vertex(110,432)
	vertex(50,576)
	vertex(110,576)
	endShape(CLOSE)
	

	//... add your code here

	noStroke();
	fill(255);
	text("canyon", 100, 480);

	//5. a collectable token - eg. a jewel, fruit, coins
	//... add your code here
	fill(255,255,20)
	circle(426,418,30)



	noStroke();
	fill(255);
	text("collectable item", 400, 400);
}
