const canvas = document.getElementById('flappybird');
const ctx = canvas.getContext('2d');

//variables
let frames = 0;

//load audio 
const die = new Audio();
die.src = "audio/sfx_die.wav";

const flap = new Audio();
flap.src = "audio/sfx_flap.wav";

const hit = new Audio();
hit.src = "audio/sfx_hit.wav";

const point = new Audio();
point.src = "audio/sfx_point.wav";

const swoosh = new Audio();
swoosh.src = "audio/sfx_swooshing.wav";

//load image
const sprite = new Image();
sprite.src = "image/sprite.png";

const degree=Math.PI/180;

//game state
const state={
    current : 0,
    getReady : 0,
    game : 1,
    over: 2
}

// START BUTTON COORD
const startBtn = {
    x : 120,
    y : 263,
    w : 83,
    h : 29
}


//control game
canvas.addEventListener('click',function(event){
    switch(state.current){
        case state.getReady:
            state.current=state.game;
            swoosh.play();
            break;
        case state.game:
            bird.flap();
            flap.play()
            break;
        case state.over:
            let rect = canvas.getBoundingClientRect();
            let clickX = event.clientX - rect.left;
            let clickY = event.clientY - rect.top;
            
            // CHECK IF WE CLICK ON THE START BUTTON
            if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h){
                pipes.reset();
                bird.speedReset();
                score.reset();
                state.current=state.getReady;
            }
            break;
    }
});

//create background 
const bg={
    sx:0,
    sy:0,
    w:275,
    h:226,
    x:0,
    y:canvas.height - 226,

    draw : function(){
        ctx.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x,this.y,this.w,this.h);
        ctx.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x+this.w,this.y,this.w,this.h);
    }
}

//create foreground
const fg={
    sX:276,
    sY:0,
    w:224,
    h:112,
    x:0,
    y:canvas.height - 112,
    dx:2,

    draw : function(){
        ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.h);
        ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x+this.w,this.y,this.w,this.h);
    },
    update:function(){
        if(state.current==state.game){
            this.x = (this.x - this.dx)%(this.w/2);
        }
    }

}

//bird
const bird={
    animation : [
        {sx:276 , sy:112 },
        {sx:276 , sy:139 },
        {sx:276 , sy:164},
        {sx:276 , sy:139 },
    ],
    x:50,
    y:150,
    w:34,
    h:26,

    radius:12,
    gravity:0.25,
    jump:4.6,
    speed:0,
    rotation:0,

    frame:0,
    draw : function(){
        let bird = this.animation[this.frame];
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite,bird.sx,bird.sy,this.w,this.h,-this.w/2,-this.h/2,this.w,this.h);
        ctx.restore();
    },

    flap : function(){
        this.speed = -this.jump;

    },

    update:function(){
        //if state is getready period is 10 so flapping is slow
        this.period = state.current == state.getReady?10:5;
        //we increment frame by 1 each period
        this.frame += frames%this.period==0?1:0;
        // set frame back to 0 if frame=4 or multiple of 4 as animation.length=4
        this.frame = this.frame%this.animation.length;

        if(state.current===state.getReady){
            this.y = 150; // reset position after game over
            this.rotation=0*degree;

        }else{
            this.speed += this.gravity;
            this.y += this.speed;
            
            if(this.y + this.h/2 >= canvas.height - fg.h){
                this.y = canvas.height - fg.h- this.h/2;
                if(state.current== state.game){
                    state.current=state.over;
                    die.play();
                }
            }
            //bird is falling down if speed is > jump
            if(this.speed>=this.jump){
                this.rotation=90*degree;
                this.frame=1;
            }else{
                this.rotation=-25*degree;
            }
        }

    },
 
    speedReset:function(){
        this.speed=0;
    }
}

// get ready meassage
const getReady={
    sx:0,
    sy:228,
    w:173,
    h:152,
    x: canvas.width/2 - 173/2,
    y: canvas.height/2 - 152/2,

    draw : function(){
        if(state.current==state.getReady){
            ctx.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x,this.y,this.w,this.h);
        }
    }
}

//game over message
const gameOver={
    sx:175,
    sy:228,
    w:225,
    h:202,
    x:canvas.width/2 - 225/2,
    y: 90,

    draw : function(){
        if(state.current==state.over){
            ctx.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x,this.y,this.w,this.h);
        }
    }
}

//creating pipes
const pipes={
    position:[],
    bottom:{
        sx:502,
        sy:0,
    },
    top:{
        sx:553,
        sy:0,
    },
    w:53,
    h:400,
    gap:95,
    dx:2,
    maxYpos:-150,

    draw:function(){
        for(let i=0;i<this.position.length;i++){
            let p =this.position[i];

            let topYpos = p.y;
            let bottomYpos= p.y+this.h+this.gap;

            //top pipe
            ctx.drawImage(sprite,this.top.sx,this.top.sy,this.w,this.h,p.x,topYpos,this.w,this.h);

            //bottom pipe
            ctx.drawImage(sprite,this.bottom.sx,this.bottom.sy,this.w,this.h,p.x,bottomYpos,this.w,this.h);

        }
   

    },
    update:function(){
        if(state.current !== state.game){return;}

        if (frames%100 ==0){
            this.position.push({
                x:canvas.width,
                y: this.maxYpos*(Math.random()+1)
            });
        }
        for(let i=0;i<this.position.length;i++){
            let p = this.position[i];

            
            let bottomPipeYpos = p.y +this.h+this.gap;

            //collision detection
            //for top pipe
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius >p.y && bird.y - bird.radius < p.y+this.h){
                state.current=state.over;
                hit.play();
            }       
            
            //bottom pipe
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius >bottomPipeYpos && bird.y - bird.radius < bottomPipeYpos+this.h){
                state.current=state.over;
                hit.play();
            }
            
            //move pipes to left
            p.x -= this.dx;

            //if pipes go beyon canvas we delete them
            if(p.x + this.w <=0){
                this.position.shift();
                score.value += 1;
                point.play();

                score.best=Math.max(score.value,score.best);
                localStorage.setItem('best',score.best);
            }

        }

    },
    reset : function(){
        this.position=[];
    }
}

//create score object 
const score={
    best:parseInt(localStorage.getItem('best')) || 0,
    value:0,

    draw:function(){

        ctx.fillStyle ="white";
        ctx.strokeStyle = "#000"

        if(state.current == state.game){
            ctx.lineWidth = 2;
            ctx.font ="35px Teko";
            ctx.fillText(this.value,canvas.width/2,50);
            ctx.strokeText(this.value,canvas.width/2,50);

        }else if(state.current == state.over){
            //score value
            ctx.font ="25px Teko";
            ctx.fillText(this.value,225,186);
            ctx.strokeText(this.value,225,186);
            //Best score
            ctx.fillText(this.best,225,228);
            ctx.strokeText(this.best,225,228);
        }
    },

    reset:function(){
        this.value=0;

    }
}


//draw function
function draw(){
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0,0,canvas.width,canvas.height); // can use 320,480 instead of .width .height

    bg.draw();
    pipes.draw();
    fg.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
    score.draw();
    
}

//update function
function update(){
    bird.update();
    fg.update();
    pipes.update();
}

//loop function 
function loop (){
    update();
    draw();
    frames++;

    requestAnimationFrame(loop);

}
loop();

