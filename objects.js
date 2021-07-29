//Tworzenie statku
let ship = {
    speed: 0,
    acceleration: 200,
    drag: 0.5,
    angle: 0,
    x: 100,
    y: 100,
    width: 200,
    height: 300,
    rad: 150,
    color: "#123456",
    update: function(delta){ 
        let static = true;
        if((keysDown["w"] || keysDown["ArrowUp"]) && this.speed < 400){
            this.speed += this.acceleration * delta;
            static = false;
        } if((keysDown["s"] || keysDown["ArrowDown"]) && this.speed > -400){//zmiany predkosci
            this.speed -= this.acceleration * delta;
            static = false;
        } if(keysDown["d"] || keysDown["ArrowRight"]){
            this.angle += Pi/120;
        } if(keysDown["a"] || keysDown["ArrowLeft"]){
            this.angle -= Pi/120;
        } if (static) {
            this.speed -= this.acceleration * delta * Math.sign(this.speed) * this.drag;//samoczynne zatrzymywanie sie
        }
        this.x += Math.sin(this.angle) * this.speed * delta;//translacja
        this.y -= Math.cos(this.angle) * this.speed * delta;
        if(asteroids.length > 1){
            for (let i = asteroids.length - 1; i >= 0; i--) {
                if (circleCollide(ship, asteroids[0])){
                }
            }
        }
    },

    render: function(){
        newX = 0;
        if (0 < this.x < 1920 || 0 < this.y < 1080) {
            this.x = (this.x + 1920) % 1920;
            this.y = (this.y + 1080) % 1080;
        }//width=1920 height=1080
        drawRotatedRect(this, this.angle);//LOREM IPSUM
    },
}
let cooldown = 0.3;
let helpcooldown = 0;
let Missile = function(x, y, angle) {
	this.basespeed= 500;
	this.angle= angle-Pi/2;
	this.x= x;
	this.y= y;
	this.width= 12;
	this.height= 30;
    this.radius = 10;
	this.color= "#EB0018";
	this.update = function(delta){
		if(0<x<canvas.width && 0<y<canvas.height){
			this.y += ((this.basespeed + ship.speed) * Math.sin(this.angle)) * delta;
			this.x += ((this.basespeed + ship.speed) * Math.cos(this.angle)) * delta;
		}
	};
    this.render = function(){
        drawCircle(this)
    };
    this.forDeletion = function(){
        return(!(0<this.x && this.x<canvas.width && 0<this.y && this.y<canvas.height));
    };
}

let Asteroid = function() {
    this.time = 0;
    this.color = "#dfff20";
    this.random = Math.ceil(Math.random()*4);
    this.x = 0;
    this.y = 0;
    this.rad = 200;
    this.speedX = 0;
    this.speedY = 0;
    this.size = 100 + Math.random()*150;
    if( this.random === 1){
        this.x = -200;
        this.y = canvas.height * Math.random();
        this.speedX = 50 + Math.random()*50;
        this.speedY = Math.random()*50 - Math.random()*50;
    }
    else if( this.random === 2){
        this.x = canvas.width * Math.random();
        this.y = -200;
        this.speedX = Math.random()*50 - Math.random()*50;
        this.speedY = 50 + Math.random()*50;
    }
    else if( this.random === 3){
        this.x = canvas.width + 200;
        this.y = canvas.height * Math.random();
        this.speedX = -50 - Math.random()*50;
        this.speedY = Math.random()*50 - Math.random()*50;
    }
    else if( this.random === 4){
        this.x = canvas.width * Math.random();
        this.y = canvas.height + 200;
        this.speedX = Math.random()*50 - Math.random()*50;
        this.speedY = -50 - Math.random()*50;
    }

    this.update = function(delta){
        this.x += this.speedX*delta;
        this.y += this.speedY*delta;
    };
    this.render = function(){
        context.fillStyle = this.color;
        context.fillRect( this.x, this.y, this.size, this.size);
    };
    this.forDeletion = function(bool) {
        return(bool);
    } 
}