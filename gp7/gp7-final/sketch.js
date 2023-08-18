/*

The Game Project 

7 - Final project

*/

var jumpSound;
var floorPos_y;
var lives;
var cloudBigestSize;

var gameChar_x;
var gameChar_y;
var game_score;

var cameraPosX;
var animationSwitch;

var treePos_y;
var trees_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;


var clouds;
var mountains;
var collectables;
var canyons;
var flagpole;
var platforms;
var enemies;

var uiPos_x;
var uiPos_y;
var uiCollectableObj;


function preload() {
    soundFormats('mp3', 'wav');

    //load your sounds here
    jumpSound = loadSound("assets/jump.mp3");
    jumpSound.setVolume(0.7);

    backgroundSound = loadSound("assets/background.mp3");
    backgroundSound.setVolume(0.2);
    backgroundSound.playMode("untilDone");

    coinSound = loadSound("assets/coin_up.mp3");

    fallSound = loadSound("assets/fall_water.wav");
    fallSound.playMode("untilDone");

    lostGameSound = loadSound("assets/lost_game.mp3");
    lostGameSound.playMode("untilDone");

    roarSound = loadSound("assets/strong_roar.mp3");
    roarSound.playMode("untilDone");

    winGameSound = loadSound("assets/win_game.mp3");
    winGameSound.playMode("untilDone");

    punchSound = loadSound("assets/punch.mp3");
    punchSound.playMode("untilDone");

};


function setup() {
    createCanvas(1024, 576);
    floorPos_y = height * 3 / 4;
    lives = 3;

    uiPos_x = 5;
    uiPos_y = 5;

    startGame();
};

function draw() {
    // Loop for animation
    if (frameCount % 9 === 0) {
        animationSwitch++;
        animationSwitch % 4 === 0 ? animationSwitch = 0 : animationSwitch;
    };

    // Camera move
    cameraPosX = gameChar_x - width / 2;

    ///////////////DRAWING CODE/////////////////

    background(100, 155, 255); //fill the sky blue

    noStroke();

    fill(0, 155, 0);
    rect(0, floorPos_y, width, height - floorPos_y); //draw some green ground

    // CLOUDS
    drawClouds(0.5);  /// out of push() pop() to keep loop flow

    push();
    translate(-cameraPosX, 0);

    /// End of the world pole
    fill(148, 68, 18);
    rect(-2050, floorPos_y, 10, -40);
    beginShape();
    vertex(-2060, floorPos_y - 30);
    vertex(-2020, floorPos_y - 30);
    vertex(-2015, floorPos_y - 35);
    vertex(-2020, floorPos_y - 40);
    vertex(-2060, floorPos_y - 40);
    endShape();

    // Other end of the world castle
    fill(255);
    arc(2200, floorPos_y, 300, 300, PI, 2 * PI);
    arc(2200, floorPos_y - 100, 200, 200, PI, 2 * PI);
    arc(2200, floorPos_y - 180, 100, 100, PI, 2 * PI);
    fill(84, 35, 5);
    rect(2250, floorPos_y, 40, - 60);
    rect(2230, floorPos_y - 150, 25, 25);
    rect(2160, floorPos_y - 150, 25, 25);
    rect(2185, floorPos_y - 210, 25, 25);



    // MOUNTAINS
    drawMountains();

    // COLLECTABLE

    for (let i = 0; i < collectables.length; i++) {
        checkCollectable(collectables[i]);

        if (collectables[i].isFound == false) {
            drawCollectable(collectables[i]);
        };
    };

    // CANYON
    for (let i = 0; i < canyons.length; i++) {
        drawCanyon(canyons[i]);
        //Plummeting
        checkCanyon(canyons[i]);
    };

    // TREES
    drawTrees();

    // Flagpole
    renderFlagpole();


    if (flagpole.isReached == false) {
        checkFlagpole();
    }
    else {
        isLeft = false;
        isRight = false;
    };

    // Platforms

    for (let i = 0; i < platforms.length; i++) {
        platforms[i].draw();
    };

    // Enemies

    for (let i = 0; i < enemies.length; i++) {
        enemies[i].draw();

        let isContact = enemies[i].checkContact(gameChar_x, gameChar_y);

        if (isContact) {
            if (lives > 0) {
                startGame();
                break;
            };
        };
    };


    checkPlayerDie();

    ///////////The game character animation
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

    /// Score and Lives UI

    drawUI();

    /// Loose game message

    if (lives < 1) {
        strokeWeight(10);
        stroke(0);
        fill(255);
        textSize(42);
        text("Game over.", width / 3 + 60, height / 3 + 70);
        text("Press space to continue.", width / 3 - 60, height / 3 + 110);
        strokeWeight(1);

        // lost game sound will continue to play until the player resets game
        lostGameSound.play();
    }
    /// Win game message

    if (flagpole.isReached == true) {
        strokeWeight(10);
        stroke(0);
        fill(255);
        textSize(42);
        text("Level complete.", width / 3 + 60, height / 3 + 70);
        text('Press space to continue.', width / 3 - 60, height / 3 + 110);
        strokeWeight(1);

        // win game sound will continue to play until the player resets game
        winGameSound.play();
    }

    /// End of the world message
    if (gameChar_x < -1995) {
        strokeWeight(8);
        stroke(0);
        fill(255);
        textSize(42);
        text("Turn around.", width / 3 + 60, height / 3 + 70);
        text('This is the end of the world.', width / 3 - 60, height / 3 + 110);
        strokeWeight(1);
    }

    /////////////INTERACTION CODE//////////

    //// Turn Left and Right acceleration
    if (isLeft == true) {
        gameChar_x = max(gameChar_x, -2000); // End of the world restriction
        gameChar_x -= 3;
    }
    else if (isRight == true) {
        gameChar_x = min(gameChar_x, 2000); // End of the world restriction
        gameChar_x += 3;
    };

    //// Jump

    if (gameChar_y < floorPos_y) {
        let isContact = false;
        for (let i = 0; i < platforms.length; i++) {
            if (platforms[i].checkContact(gameChar_x, gameChar_y) == true) {
                isContact = true;
                isFalling = false;
                break;
            };
        };

        if (isContact == false) {
            gameChar_y += 2.5;
            isFalling = true;
        };
    }
    else {
        isFalling = false;
    };

    // Falling in canyon
    if (isPlummeting == true) {
        gameChar_y -= 0.5; // after falling in canyon slowing down tempo of char_y
    };

};

// Function to reset values after losing live
function startGame() {
    gameChar_x = width / 2;
    gameChar_y = floorPos_y;
    game_score = 0;
    cloudBigestSize = undefined; // variable defined in drawCloud function

    cameraPosX = 0;
    animationSwitch = 1;

    treePos_y = floorPos_y;
    trees_x = [-1475, -1195, 80, 550, 880, 1500, 1650, 1800, 1950];

    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;

    backgroundSound.loop();


    clouds =
        [
            {
                x_pos: -140,
                y_pos: height * 0.22,
                size: 1
            },
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
                x_pos: 380,
                y_pos: height * 0.22,
                size: 0.5
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
                x_pos: -1799,
                size: 2
            },
            {
                x_pos: -1699,
                size: 0.7
            },
            {
                x_pos: -999,
                size: 2
            },
            {
                x_pos: -799,
                size: 1
            },
            {
                x_pos: -399,
                size: 0.5
            },
            {
                x_pos: -9,
                size: 2.5
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
                size: 1.5
            },
            {
                x_pos: 900,
                size: 2.5
            },
            {
                x_pos: 1300,
                size: 1.4
            }
        ];

    collectables =
        [
            {
                x_pos: -1990,
                y_pos: floorPos_y - 260,
                size: 40,
                isFound: false
            },
            {
                x_pos: -1995,
                y_pos: floorPos_y - 25,
                size: 40,
                isFound: false
            },
            {
                x_pos: -1995,
                y_pos: floorPos_y - 25,
                size: 40,
                isFound: false
            },

            {
                x_pos: -1335,
                y_pos: floorPos_y - 25,
                size: 40,
                isFound: false
            },
            {
                x_pos: -479,
                y_pos: floorPos_y - 255,
                size: 40,
                isFound: false
            },
            {
                x_pos: -420,
                y_pos: floorPos_y - 255,
                size: 40,
                isFound: false
            },
            {
                x_pos: 245,
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
                x_pos: 620,
                y_pos: floorPos_y - 25,
                size: 40,
                isFound: false
            },
            {
                x_pos: 1140,
                y_pos: floorPos_y - 25,
                size: 40,
                isFound: false
            },
            {
                x_pos: -1675,
                y_pos: floorPos_y - 365,
                size: 40,
                isFound: false
            },
            {
                x_pos: -1605,
                y_pos: floorPos_y - 365,
                size: 40,
                isFound: false
            },
            {
                x_pos: -1535,
                y_pos: floorPos_y - 365,
                size: 40,
                isFound: false
            },
            {
                x_pos: -1035,
                y_pos: floorPos_y - 365,
                size: 40,
                isFound: false
            },
            {
                x_pos: -965,
                y_pos: floorPos_y - 365,
                size: 40,
                isFound: false
            },
            {
                x_pos: -895,
                y_pos: floorPos_y - 365,
                size: 40,
                isFound: false
            },
            {
                x_pos: -385,
                y_pos: floorPos_y - 365,
                size: 40,
                isFound: false
            },
            {
                x_pos: -315,
                y_pos: floorPos_y - 365,
                size: 40,
                isFound: false
            },
            {
                x_pos: -245,
                y_pos: floorPos_y - 365,
                size: 40,
                isFound: false
            },
            {
                x_pos: 245,
                y_pos: floorPos_y - 365,
                size: 40,
                isFound: false
            },
            {
                x_pos: 315,
                y_pos: floorPos_y - 365,
                size: 40,
                isFound: false
            },
            {
                x_pos: 385,
                y_pos: floorPos_y - 365,
                size: 40,
                isFound: false
            },
            {
                x_pos: 895,
                y_pos: floorPos_y - 365,
                size: 40,
                isFound: false
            },
            {
                x_pos: 965,
                y_pos: floorPos_y - 365,
                size: 40,
                isFound: false
            },
            {
                x_pos: 1035,
                y_pos: floorPos_y - 365,
                size: 40,
                isFound: false
            }
        ];

    canyons =
        [
            {
                x_pos: -1590,
                width: 90,
            },
            {
                x_pos: -1450,
                width: 90,
            },
            {
                x_pos: -1310,
                width: 90,
            },
            {
                x_pos: -1170,
                width: 90,
            },
            {
                x_pos: -180,
                width: 100,
            },
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
                width: 290,
            }
        ];

    flagpole =
    {
        x_pos: 2000,
        isReached: false,
    };


    /// Platforms
    platformsInLevel();

    // Enemies
    enemiesInLevel();

};

// Draw functions for background elements

function drawClouds(speed) {

    /// finding biggest cloud size to calculate surplus to stop overlaping 
    /// clouds after few loops
    if (cloudBigestSize == undefined) {
        cloudBigestSize = clouds[0].size
        for (let i = 0; i < clouds.length; i++) {
            if (clouds[i].size > cloudBigestSize) {
                cloudBigestSize = clouds[i].size;
            };
        };
    };

    /// loop traversing through cloud array and drawing each object
    for (let i = 0; i < clouds.length; i++) {
        fill(255);
        clouds[i].x_pos += speed;

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

        /// Cloud position reset after looping through screen
        let sizeSurplus = 70 * cloudBigestSize - (70 * clouds[i].size);
        if (clouds[i].x_pos > width + 70 * clouds[i].size + sizeSurplus) {
            clouds[i].x_pos = -70 * clouds[i].size - sizeSurplus;
        };
    };
};

function drawMountains() {
    for (let i = 0; i < mountains.length; i++) {
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

function drawCollectable(t_collectable) {

    fill(255, 255, 20);
    ellipse(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size);
    push();
    translate(t_collectable.x_pos, t_collectable.y_pos);
    translate(p5.Vector.fromAngle(millis() / 200, t_collectable.size * 0.25));
    fill(255, 0, 0);
    ellipse(0, 0, t_collectable.size / 4);
    fill(0, 0, 255);
    translate(p5.Vector.fromAngle(millis() / 200, -(t_collectable.size * 0.5)));
    ellipse(0, 0, t_collectable.size / 4);
    pop();
};

function drawCanyon(t_canyon) {
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
    strokeWeight(1);
};

function drawTrees() {
    for (let i = 0; i < trees_x.length; i++) {
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

function renderFlagpole() {
    strokeWeight(5);
    stroke(180);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
    noStroke();
    fill(255, 0, 0);
    //// Flagpole reached or not 
    if (flagpole.isReached == false) {
        rect(flagpole.x_pos, floorPos_y, 50, -50);
    }
    else {
        rect(flagpole.x_pos, floorPos_y - 200, 50, -50);
    }

};

function drawUI() {
    fill(0, 0, 0, 150);
    rect(uiPos_x, uiPos_y, 130, 70, 10);
    fill(255);
    textSize(24);
    text("Score: " + game_score, uiPos_x + 5, uiPos_y + 25);

    textSize(24);
    text("Lives:  " + lives, uiPos_x + 5, uiPos_y + 55);

    /// heart shape
    fill(255, 0, 0);
    beginShape();
    vertex(uiPos_x + 115, uiPos_y + 42);
    bezierVertex(uiPos_x + 109, uiPos_y + 36, uiPos_x + 103, uiPos_y + 46, uiPos_x + 115, uiPos_y + 54);
    bezierVertex(uiPos_x + 127, uiPos_y + 46, uiPos_x + 121, uiPos_y + 36, uiPos_x + 115, uiPos_y + 42);
    endShape(CLOSE);

    /// collectible shape
    uiCollectable =
    {
        x_pos: uiPos_x + 115,
        y_pos: uiPos_y + 18,
        size: 15
    }

    drawCollectable(uiCollectable);
};

function createPlatforms(x, y, yRange, length, color) {
    // Platform object
    var p =
    {
        x: x,
        y: y,
        yRange: yRange,
        length: length,
        color: color,
        inc: 0.2,
        currentY: y,
        update: function () /// Updates y position of platform
        {
            this.currentY += this.inc;

            if (this.currentY >= this.y + this.yRange) {
                this.inc = -0.2;
            }
            else if (this.currentY < this.y) {
                this.inc = 0.2;
            };
        },
        draw: function () {
            this.update();

            fill(this.color[0], this.color[1], this.color[2]);
            rect(this.x, this.currentY, this.length, 10, 10);
            fill(255, 0, 0);
            ellipse(this.x, this.currentY + 5, 20);
            ellipse(this.x + this.length, this.currentY + 5, 20);
        },
        checkContact: function (gc_x, gc_y)   /// Check if character is on platform and prevents triggering falling
        {
            if (gc_x > this.x && gc_x < this.x + this.length) {
                let d = this.currentY - gc_y;

                if (d >= -1 && d < 2) {
                    gameChar_y += this.inc;
                    return true;
                };
            };
            return false;
        }
    };
    return p;
};

function Enemy(x, y, size, range) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.range = range;

    this.currentX = x;
    this.isLeft = false;
    this.isRight = true;
    this.inc = 1;

    // updates positon of character and flips sides
    this.update = function () {
        this.currentX += this.inc;

        if (this.currentX >= this.x + this.range) {
            this.inc = -1;
            this.isRight = false;
            this.isLeft = true;
        }
        else if (this.currentX < this.x) {
            this.inc = 1;
            this.isLeft = false;
            this.isRight = true;
        };
    };

    /// Enemy draw function
    this.draw = function () {
        this.update();

        strokeWeight(1);

        if (this.isRight) {
            //face
            fill(0);
            ellipse(this.currentX + 11 * this.size, this.y - 46 * this.size, 10 * this.size, 8 * this.size);

            //head
            fill(255);
            ellipse(this.currentX, this.y - 48 * this.size, 25 * this.size, 25 * this.size);

            //ear
            stroke(255);
            fill(0);
            ellipse(this.currentX - 11 * this.size, this.y - 57 * this.size, 10 * this.size, 10 * this.size);
            noStroke();
            fill(255);
            ellipse(this.currentX - 11 * this.size, this.y - 57 * this.size, 3 * this.size, 3 * this.size);

            // eyes
            fill(0);
            ellipse(this.currentX + 3 * this.size, this.y - 49 * this.size, 12 * this.size, 12 * this.size);
            fill(255);
            ellipse(this.currentX + 4 * this.size, this.y - 49 * this.size, 6 * this.size, 6 * this.size);
            fill(0);
            ellipse(this.currentX + 4 * this.size, this.y - 49 * this.size, 2 * this.size, 2 * this.size);

            // feet
            fill(0);
            rect(this.currentX - 10 * this.size, this.y - 10 * this.size, 10 * this.size, 10 * this.size, 2 * this.size, 5 * this.size, 2 * this.size, 2 * this.size);
            rect(this.currentX + 8 * this.size, this.y - 10 * this.size, 10 * this.size, 10 * this.size, 2 * this.size, 5 * this.size, 2 * this.size, 2 * this.size);
            fill(255);
            rect(this.currentX - 4 * this.size, this.y - 6 * this.size, 4 * this.size, 4 * this.size, 1 * this.size, 2 * this.size, 1 * this.size, 1 * this.size);
            rect(this.currentX + 13 * this.size, this.y - 6 * this.size, 4 * this.size, 4 * this.size, 1 * this.size, 2 * this.size, 1 * this.size, 1 * this.size);

            // body
            fill(0);
            rect(this.currentX - 10 * this.size, this.y - 35 * this.size, 20 * this.size, 25 * this.size, 5 * this.size);
            fill(255);
            rect(this.currentX - 4 * this.size, this.y - 31 * this.size, 10 * this.size, 15 * this.size, 3 * this.size);

            //hands
            stroke(255);
            fill(0);
            ellipse(this.currentX + 10 * this.size, this.y - 25 * this.size, 20 * this.size, 6 * this.size);
            noStroke();
        };
        if (this.isLeft) {
            //face
            fill(0);
            ellipse(this.currentX - 11 * this.size, this.y - 46 * this.size, 10 * this.size, 8 * this.size);

            //head
            fill(255);
            ellipse(this.currentX, this.y - 48 * this.size, 25 * this.size, 25 * this.size);

            //ear
            stroke(255);
            fill(0);
            ellipse(this.currentX + 11 * this.size, this.y - 57 * this.size, 10 * this.size, 10 * this.size);
            noStroke();
            fill(255);
            ellipse(this.currentX + 11 * this.size, this.y - 57 * this.size, 3 * this.size, 3 * this.size);

            // eyes
            fill(0);
            ellipse(this.currentX - 3 * this.size, this.y - 49 * this.size, 12 * this.size, 12 * this.size);
            fill(255);
            ellipse(this.currentX - 4 * this.size, this.y - 49 * this.size, 6 * this.size, 6 * this.size);
            fill(0);
            ellipse(this.currentX - 4 * this.size, this.y - 49 * this.size, 2 * this.size, 2 * this.size);

            // feet
            fill(0);
            rect(this.currentX, this.y - 10 * this.size, 10 * this.size, 10 * this.size, 5 * this.size, 2 * this.size, 2 * this.size, 2 * this.size);
            rect(this.currentX - 18 * this.size, this.y - 10 * this.size, 10 * this.size, 10 * this.size, 5 * this.size, 2 * this.size, 2 * this.size, 2 * this.size);
            fill(255);
            rect(this.currentX, this.y - 6 * this.size, 4 * this.size, 4 * this.size, 2 * this.size, 1 * this.size, 1 * this.size, 1 * this.size);
            rect(this.currentX - 18 * this.size, this.y - 6 * this.size, 4 * this.size, 4 * this.size, 2 * this.size, 1 * this.size, 1 * this.size, 1 * this.size);

            // body
            fill(0);
            rect(this.currentX - 10 * this.size, this.y - 35 * this.size, 20 * this.size, 25 * this.size, 5 * this.size);
            fill(255);
            rect(this.currentX - 8 * this.size, this.y - 31 * this.size, 10 * this.size, 15 * this.size, 3 * this.size);

            //hands
            stroke(255);
            fill(0);
            ellipse(this.currentX - 10 * this.size, this.y - 25 * this.size, 20 * this.size, 6 * this.size);
            noStroke();
        };
    };
    // if character is in range of enemy
    this.checkContact = function (gc_x, gc_y) {
        let d = dist(gc_x, gc_y, this.currentX, this.y);

        // sound trigger
        if (d < 100) {
            roarSound.play();
        };

        let s = 30 + 20 * this.size // scale contact range to enemy size
        // life loss

        if (d < s) {
            punchSound.play();
            return true;
        };
        return false;
    };
};

// Check functions
function checkCollectable(t_collectable) {
    if (dist(gameChar_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) <= t_collectable.size) {

        /// Adding score if collectable is found
        if (t_collectable.isFound == false) {
            game_score += 1;
            coinSound.play();
        }
        t_collectable.isFound = true;
    };
};

function checkCanyon(t_canyon) {
    // if the character is below ground level and over canyon
    if (gameChar_x - 10 > t_canyon.x_pos && gameChar_x + 10 < t_canyon.x_pos + t_canyon.width && gameChar_y >= floorPos_y) {
        isPlummeting = true;
        gameChar_y += 4;

        // sound trigger
        if (lives > 0) {
            fallSound.play();
        };
    };
};

function checkFlagpole() {
    if (dist(gameChar_x, gameChar_y, flagpole.x_pos, floorPos_y) <= 6) {
        flagpole.isReached = true;
    };
};

function checkPlayerDie() {
    if (gameChar_y - 5 > floorPos_y) {
        /// blocks character movements
        isLeft = false;
        isRight = false;

        if (gameChar_y - 5 > height - 10) {
            if (lives > 0) {
                lives -= 1;
            };
            if (lives > 0) {
                startGame();
            };
        };
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

            // hat
            fill(237, 71, 182)
            ellipse(gameChar_x, gameChar_y - 63, 40, 8);
            beginShape();
            vertex(gameChar_x - 10, gameChar_y - 63);
            vertex(gameChar_x, gameChar_y - 93);
            vertex(gameChar_x + 15, gameChar_y - 80);
            vertex(gameChar_x + 5, gameChar_y - 83);
            vertex(gameChar_x + 10, gameChar_y - 63);
            endShape();
            fill(0);
            ellipse(gameChar_x + 15, gameChar_y - 80, 10);

            fill(255, 182, 193);

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

            // hat
            fill(237, 71, 182);
            ellipse(gameChar_x, gameChar_y - 58, 40, 8);
            beginShape();
            vertex(gameChar_x - 10, gameChar_y - 58);
            vertex(gameChar_x, gameChar_y - 88);
            vertex(gameChar_x + 15, gameChar_y - 80);
            vertex(gameChar_x + 5, gameChar_y - 78);
            vertex(gameChar_x + 10, gameChar_y - 58);
            endShape();
            fill(0);
            ellipse(gameChar_x + 15, gameChar_y - 80, 10);

            fill(255, 182, 193);

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

            // hat
            fill(237, 71, 182);
            ellipse(gameChar_x, gameChar_y - 53, 40, 8);
            beginShape();
            vertex(gameChar_x - 10, gameChar_y - 53);
            vertex(gameChar_x, gameChar_y - 83);
            vertex(gameChar_x + 15, gameChar_y - 80);
            vertex(gameChar_x + 5, gameChar_y - 73);
            vertex(gameChar_x + 10, gameChar_y - 53);
            endShape();
            fill(0);
            ellipse(gameChar_x + 15, gameChar_y - 80, 10);

            fill(255, 182, 193);

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

            // hat
            fill(237, 71, 182);
            ellipse(gameChar_x, gameChar_y - 58, 40, 8);
            beginShape();
            vertex(gameChar_x - 10, gameChar_y - 58);
            vertex(gameChar_x, gameChar_y - 88);
            vertex(gameChar_x + 15, gameChar_y - 80);
            vertex(gameChar_x + 5, gameChar_y - 78);
            vertex(gameChar_x + 10, gameChar_y - 58);
            endShape();
            fill(0);
            ellipse(gameChar_x + 15, gameChar_y - 80, 10);

            fill(255, 182, 193);

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

            // hat
            fill(237, 71, 182);
            ellipse(gameChar_x, gameChar_y - 73, 40, 8);
            beginShape();
            vertex(gameChar_x - 10, gameChar_y - 73);
            vertex(gameChar_x, gameChar_y - 103);
            vertex(gameChar_x + 15, gameChar_y - 90);
            vertex(gameChar_x + 5, gameChar_y - 93);
            vertex(gameChar_x + 10, gameChar_y - 73);
            endShape();
            fill(0);
            ellipse(gameChar_x + 15, gameChar_y - 90, 10);

            fill(255, 182, 193);

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

            // hat
            fill(237, 71, 182);
            ellipse(gameChar_x, gameChar_y - 73, 40, 8);
            beginShape();
            vertex(gameChar_x - 10, gameChar_y - 73);
            vertex(gameChar_x, gameChar_y - 123);

            vertex(gameChar_x + 10, gameChar_y - 73);
            endShape();
            fill(0);
            ellipse(gameChar_x, gameChar_y - 123, 10);

            fill(255, 182, 193);

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

            // hat
            fill(237, 71, 182);
            ellipse(gameChar_x, gameChar_y - 73, 40, 8);
            beginShape();
            vertex(gameChar_x + 10, gameChar_y - 73);
            vertex(gameChar_x, gameChar_y - 103);
            vertex(gameChar_x - 15, gameChar_y - 90);
            vertex(gameChar_x - 5, gameChar_y - 93);
            vertex(gameChar_x - 10, gameChar_y - 73);
            endShape();
            fill(0);
            ellipse(gameChar_x - 15, gameChar_y - 90, 10);

            fill(255, 182, 193);

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

            // hat
            fill(237, 71, 182);
            ellipse(gameChar_x, gameChar_y - 73, 40, 8);
            beginShape();
            vertex(gameChar_x - 10, gameChar_y - 73);
            vertex(gameChar_x, gameChar_y - 123);

            vertex(gameChar_x + 10, gameChar_y - 73);
            endShape();
            fill(0);
            ellipse(gameChar_x, gameChar_y - 123, 10);

            fill(255, 182, 193);

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

            // hat
            fill(237, 71, 182);
            ellipse(gameChar_x, gameChar_y - 63, 40, 8);
            beginShape();
            vertex(gameChar_x - 10, gameChar_y - 63);
            vertex(gameChar_x, gameChar_y - 93);
            vertex(gameChar_x + 15, gameChar_y - 80);
            vertex(gameChar_x + 5, gameChar_y - 83);
            vertex(gameChar_x + 10, gameChar_y - 63);
            endShape();
            fill(0);
            ellipse(gameChar_x + 15, gameChar_y - 80, 10);

            fill(255, 182, 193);

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

            // hat
            fill(237, 71, 182);
            ellipse(gameChar_x, gameChar_y - 61, 40, 8);
            beginShape();
            vertex(gameChar_x - 10, gameChar_y - 61);
            vertex(gameChar_x, gameChar_y - 91);
            vertex(gameChar_x + 20, gameChar_y - 86);
            vertex(gameChar_x + 5, gameChar_y - 80);
            vertex(gameChar_x + 10, gameChar_y - 61);
            endShape();
            fill(0);
            ellipse(gameChar_x + 20, gameChar_y - 86, 10);

            fill(255, 182, 193);

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

            // hat
            fill(237, 71, 182);
            ellipse(gameChar_x, gameChar_y - 60, 40, 8);
            beginShape();
            vertex(gameChar_x - 10, gameChar_y - 59);
            vertex(gameChar_x, gameChar_y - 90);
            vertex(gameChar_x + 15, gameChar_y - 95);
            vertex(gameChar_x + 5, gameChar_y - 79);
            vertex(gameChar_x + 10, gameChar_y - 59);
            endShape();
            fill(0);
            ellipse(gameChar_x + 15, gameChar_y - 95, 10);

            fill(255, 182, 193);

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

            // hat
            fill(237, 71, 182);
            ellipse(gameChar_x, gameChar_y - 61, 40, 8);
            beginShape();
            vertex(gameChar_x - 10, gameChar_y - 61);
            vertex(gameChar_x, gameChar_y - 91);
            vertex(gameChar_x + 20, gameChar_y - 86);
            vertex(gameChar_x + 5, gameChar_y - 80);
            vertex(gameChar_x + 10, gameChar_y - 61);
            endShape();
            fill(0);
            ellipse(gameChar_x + 20, gameChar_y - 86, 10);

            fill(255, 182, 193);

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

            // hat
            fill(237, 71, 182);
            ellipse(gameChar_x, gameChar_y - 63, 40, 8);
            beginShape();
            vertex(gameChar_x + 10, gameChar_y - 63);
            vertex(gameChar_x, gameChar_y - 93);
            vertex(gameChar_x - 15, gameChar_y - 80);
            vertex(gameChar_x - 5, gameChar_y - 83);
            vertex(gameChar_x - 10, gameChar_y - 63);
            endShape();
            fill(0);
            ellipse(gameChar_x - 15, gameChar_y - 80, 10);

            fill(255, 182, 193);

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

            // hat
            fill(237, 71, 182);
            ellipse(gameChar_x, gameChar_y - 61, 40, 8);
            beginShape();
            vertex(gameChar_x + 10, gameChar_y - 61);
            vertex(gameChar_x, gameChar_y - 91);
            vertex(gameChar_x - 20, gameChar_y - 86);
            vertex(gameChar_x - 5, gameChar_y - 80);
            vertex(gameChar_x - 10, gameChar_y - 61);
            endShape();
            fill(0);
            ellipse(gameChar_x - 20, gameChar_y - 86, 10);

            fill(255, 182, 193);

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

            // hat
            fill(237, 71, 182);
            ellipse(gameChar_x, gameChar_y - 60, 40, 8);
            beginShape();
            vertex(gameChar_x + 10, gameChar_y - 59);
            vertex(gameChar_x, gameChar_y - 90);
            vertex(gameChar_x - 15, gameChar_y - 95);
            vertex(gameChar_x - 5, gameChar_y - 79);
            vertex(gameChar_x - 10, gameChar_y - 59);
            endShape();
            fill(0);
            ellipse(gameChar_x - 15, gameChar_y - 95, 10);

            fill(255, 182, 193);

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

            // hat
            fill(237, 71, 182)
            ellipse(gameChar_x, gameChar_y - 61, 40, 8);
            beginShape();
            vertex(gameChar_x + 10, gameChar_y - 61);
            vertex(gameChar_x, gameChar_y - 91);
            vertex(gameChar_x - 20, gameChar_y - 86);
            vertex(gameChar_x - 5, gameChar_y - 80);
            vertex(gameChar_x - 10, gameChar_y - 61);
            endShape();
            fill(0);
            ellipse(gameChar_x - 20, gameChar_y - 86, 10);

            fill(255, 182, 193);

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

            // hat
            fill(237, 71, 182);
            ellipse(gameChar_x, gameChar_y - 73, 40, 8);
            beginShape();
            vertex(gameChar_x + 10, gameChar_y - 73);
            vertex(gameChar_x, gameChar_y - 103);
            vertex(gameChar_x - 15, gameChar_y - 90);
            vertex(gameChar_x - 5, gameChar_y - 93);
            vertex(gameChar_x - 10, gameChar_y - 73);
            endShape();
            fill(0);
            ellipse(gameChar_x - 15, gameChar_y - 90, 10);

            fill(255, 182, 193);

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

            // hat
            fill(237, 71, 182);
            ellipse(gameChar_x, gameChar_y - 73, 40, 8);
            beginShape();
            vertex(gameChar_x + 10, gameChar_y - 73);
            vertex(gameChar_x, gameChar_y - 103);
            vertex(gameChar_x - 15, gameChar_y - 90);
            vertex(gameChar_x - 5, gameChar_y - 93);
            vertex(gameChar_x - 10, gameChar_y - 73);
            endShape();
            fill(0);
            ellipse(gameChar_x - 15, gameChar_y - 90, 10);

            fill(255, 182, 193);

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

            // hat
            fill(237, 71, 182);
            ellipse(gameChar_x, gameChar_y - 73, 40, 8);
            beginShape();
            vertex(gameChar_x + 10, gameChar_y - 73);
            vertex(gameChar_x, gameChar_y - 103);
            vertex(gameChar_x - 15, gameChar_y - 90);
            vertex(gameChar_x - 5, gameChar_y - 93);
            vertex(gameChar_x - 10, gameChar_y - 73);
            endShape();
            fill(0);
            ellipse(gameChar_x - 15, gameChar_y - 90, 10);

            fill(255, 182, 193);

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

            // hat
            fill(237, 71, 182);
            ellipse(gameChar_x, gameChar_y - 73, 40, 8);
            beginShape();
            vertex(gameChar_x + 10, gameChar_y - 73);
            vertex(gameChar_x, gameChar_y - 103);
            vertex(gameChar_x - 15, gameChar_y - 90);
            vertex(gameChar_x - 5, gameChar_y - 93);
            vertex(gameChar_x - 10, gameChar_y - 73);
            endShape();
            fill(0);
            ellipse(gameChar_x - 15, gameChar_y - 90, 10);

            fill(255, 182, 193);

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

            // hat
            fill(237, 71, 182);
            ellipse(gameChar_x, gameChar_y - 73, 40, 8);
            beginShape();
            vertex(gameChar_x - 10, gameChar_y - 73);
            vertex(gameChar_x, gameChar_y - 103);
            vertex(gameChar_x + 15, gameChar_y - 90);
            vertex(gameChar_x + 5, gameChar_y - 93);
            vertex(gameChar_x + 10, gameChar_y - 73);
            endShape();
            fill(0);
            ellipse(gameChar_x + 15, gameChar_y - 90, 10);

            fill(255, 182, 193);

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

            // hat
            fill(237, 71, 182);
            ellipse(gameChar_x, gameChar_y - 73, 40, 8);
            beginShape();
            vertex(gameChar_x - 10, gameChar_y - 73);
            vertex(gameChar_x, gameChar_y - 103);
            vertex(gameChar_x + 15, gameChar_y - 90);
            vertex(gameChar_x + 5, gameChar_y - 93);
            vertex(gameChar_x + 10, gameChar_y - 73);
            endShape();
            fill(0);
            ellipse(gameChar_x + 15, gameChar_y - 90, 10);

            fill(255, 182, 193);

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

            // hat
            fill(237, 71, 182);
            ellipse(gameChar_x, gameChar_y - 73, 40, 8);
            beginShape();
            vertex(gameChar_x - 10, gameChar_y - 73);
            vertex(gameChar_x, gameChar_y - 103);
            vertex(gameChar_x + 15, gameChar_y - 90);
            vertex(gameChar_x + 5, gameChar_y - 93);
            vertex(gameChar_x + 10, gameChar_y - 73);
            endShape();
            fill(0);
            ellipse(gameChar_x + 15, gameChar_y - 90, 10);

            fill(255, 182, 193);

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

            // hat
            fill(237, 71, 182);
            ellipse(gameChar_x, gameChar_y - 73, 40, 8);
            beginShape();
            vertex(gameChar_x - 10, gameChar_y - 73);
            vertex(gameChar_x, gameChar_y - 103);
            vertex(gameChar_x + 15, gameChar_y - 90);
            vertex(gameChar_x + 5, gameChar_y - 93);
            vertex(gameChar_x + 10, gameChar_y - 73);
            endShape();
            fill(0);
            ellipse(gameChar_x + 15, gameChar_y - 90, 10);

            fill(255, 182, 193);

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

// Control buttons functions
function keyPressed() {
    if (isPlummeting == false) {
        // turn left and right
        if (keyCode == 65) {
            isLeft = true;
        }
        else if (keyCode == 68) {
            isRight = true;
        };
        /// jump
        if (keyCode == 87 && isFalling == false && flagpole.isReached == false) {
            jumpSound.play();
            gameChar_y -= 100;
        };
    };

    // window refresh after losing or wining
    if (keyCode == 32 && (lives < 1 || flagpole.isReached == true)) {
        location.reload();
    };
};

function keyReleased() {
    if (keyCode == 65) {
        isLeft = false;
    }
    else if (keyCode == 68) {
        isRight = false;
    };
};

// Level design functions

function platformsInLevel() {
    platforms = [];

    platforms.push(createPlatforms(-1900, 350, 15, 200, [random(0, 255), random(0, 255), random(0, 255)]));
    platforms.push(createPlatforms(-1950, 280, 20, 200, [random(0, 255), random(0, 255), random(0, 255)]));
    platforms.push(createPlatforms(-2010, 200, 15, 200, [random(0, 255), random(0, 255), random(0, 255)]));

    platforms.push(createPlatforms(-1600, 360, 20, 520, [random(0, 255), random(0, 255), random(0, 255)]));

    platforms.push(createPlatforms(-799, 350, 25, 400, [random(0, 255), random(0, 255), random(0, 255)]));
    platforms.push(createPlatforms(-699, 280, 15, 300, [random(0, 255), random(0, 255), random(0, 255)]));
    platforms.push(createPlatforms(-499, 200, 20, 100, [random(0, 255), random(0, 255), random(0, 255)]));


    platforms.push(createPlatforms(150, 350, 25, 200, [random(0, 255), random(0, 255), random(0, 255)]));
    platforms.push(createPlatforms(50, 300, 20, 200, [random(0, 255), random(0, 255), random(0, 255)]));
    platforms.push(createPlatforms(0, 250, 15, 200, [random(0, 255), random(0, 255), random(0, 255)]));

    platforms.push(createPlatforms(610, 360, 40, 240, [random(0, 255), random(0, 255), random(0, 255)]));

    platforms.push(createPlatforms(1800, 350, 15, 240, [random(0, 255), random(0, 255), random(0, 255)]));
    platforms.push(createPlatforms(1600, 280, 25, 240, [random(0, 255), random(0, 255), random(0, 255)]));
    platforms.push(createPlatforms(1400, 210, 20, 240, [random(0, 255), random(0, 255), random(0, 255)]));
    platforms.push(createPlatforms(1200, 140, 0, 240, [random(0, 255), random(0, 255), random(0, 255)]));
    platforms.push(createPlatforms(-1700, 90, 0, 2950, [random(0, 255), random(0, 255), random(0, 255)]));
};

function enemiesInLevel() {
    enemies = [];
    enemies.push(new Enemy(-1900, floorPos_y, 1, 150));
    enemies.push(new Enemy(-669, floorPos_y, 0.75, 250));
    enemies.push(new Enemy(-769, floorPos_y, 0.75, 350));
    enemies.push(new Enemy(50, floorPos_y, 0.75, 100));
    enemies.push(new Enemy(930, floorPos_y, 0.5, 350));
    enemies.push(new Enemy(1200, floorPos_y, 0.5, 300));
};
