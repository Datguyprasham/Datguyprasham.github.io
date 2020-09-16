const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


// creating unit box
const box = 32;

// load images

const ground = new Image();
ground.src = "image/ground.png";

const foodImg = new Image();
foodImg.src = "image/food.png";

// load audio files

let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();

dead.src = "audio/dead.mp3";
eat.src = "audio/eat.mp3";
up.src = "audio/up.mp3";
right.src = "audio/right.mp3";
left.src = "audio/left.mp3";
down.src = "audio/down.mp3";


//create snake
let snake = [];
snake[0]={
    x : 9*box,
    y : 10*box
}; // this will give us a box at (9,10)


// create food at random position
let food ={
    x : Math.floor(Math.random()*17+1)*box,
    y : Math.floor(Math.random()*15+3)*box
}; // we use floor to get integer as () gives float and random to generate food at random position 


// create score
let score = 0;

//control snake 
let d;

//to control snake we add eventlistner
document.addEventListener("keydown",direction); //direction is udf

/*every key on the keyboard has a code in our case we will be using
arrows,left=37,up=38,right=39,down=40.*/
function direction(event){
    let key = event.keyCode;

    if (key == 37 && d != "RIGHT"){
        left.play();
        d = "LEFT";
    }else if(key == 38 && d != "DOWN"){
        up.play();
        d = "UP";
    }else if(key == 39 && d != "LEFT"){
        right.play();
        d = "RIGHT";
    }else if(key == 40 && d != "UP"){
        down.play();
        d = "DOWN"
    }
}/* also if we are going to move snake to right we need to 
check that snake is not going left or vice versa, same for up
and down */

// cheack collision function
function collision(head,array){
    for(let i = 0; i < array.length; i++){
        if(head.x == array[i].x && head.y == array[i].y){
            return true;
        }
    }
    return false;
}

//drawing snake and food and everything to canvas
function Draw(){
    ctx.drawImage(ground,0,0);
    for (let i = 0; i< snake.length; i++){
        ctx.fillStyle = (i == 0)? "green" : "white";
        ctx.fillRect(snake[i].x,snake[i].y,box,box);

        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x,snake[i].y,box,box);
    }
    ctx.drawImage(foodImg,food.x,food.y)
    

    //old head posn
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // direction ?
    if (d == "LEFT") {snakeX -= box;}
    if (d == "RIGHT") {snakeX += box;}
    if(d == "UP") {snakeY -= box;}
    if (d == "DOWN") {snakeY += box;}

    // if snake eats food (i.e snake head coordinats = food coordinates)
    if (snakeX == food.x && snakeY == food.y){
        score++;
        eat.play();
        food = {
            x : Math.floor(Math.random()*17+1)*box,
            y : Math.floor(Math.random()*15+3)*box
        }
    }else{
        snake.pop();
    }
    
    //add new head
    let newHead = {
        x : snakeX ,
        y : snakeY
    };
    
    // game over condition 
    if (snakeX < box || snakeX > 17 * box || snakeY < 3*box || snakeY > 17*box || collision(newHead,snake)){
        clearInterval(game);
        dead.play();
    }

    snake.unshift(newHead);

    ctx.fillStyle = "white";
    ctx.font = "45px Changa one";
    ctx.fillText(score,2*box,1.6*box);


}
// call draw function every 100ms
let game = setInterval(Draw,100);
game;




