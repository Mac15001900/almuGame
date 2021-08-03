//Tworzenie statku
let ship = {
    speedX: 0,
    speedY: 0,
    acceleration: 400,
    drag: 100,
    angle: 0,
    x: 960,//width=1920 height=1080
    y: 540,
    radius: 85,
    color: "#123456",
    update: function(delta){
        let static = true;
        if((keysDown["w"] || keysDown["ArrowUp"]) && this.speedX**2 + this.speedY**2 < 400**2){
            this.speedX += Math.sin(this.angle) * this.acceleration * delta;
            this.speedY += Math.cos(this.angle) * this.acceleration * delta;
            static = false;
        } if((keysDown["s"] || keysDown["ArrowDown"]) && this.speedX**2 + this.speedY**2 < 400**2){//zmiany predkosci
            this.speedX -= Math.sin(this.angle) * this.acceleration * delta;
            this.speedY -= Math.cos(this.angle) * this.acceleration * delta;
            static = false;
        } if(keysDown["d"] || keysDown["ArrowRight"]){
            this.angle += Pi/90;
        } if(keysDown["a"] || keysDown["ArrowLeft"]){
            this.angle -= Pi/90;
        } if((keysDown["z"] || keysDown[" "]) && now > helpcooldown + cooldown){
            let newMissile = new Missile(ship);
            missiles.push(newMissile);
            helpcooldown = now;
        } if (static) {
            this.speedX -= Math.sign(this.speedX) * this.drag * delta;
            this.speedY -= Math.sign(this.speedY) * this.drag * delta;//samoczynne zatrzymywanie sie
        }
        this.x += this.speedX * delta;//translacja
        this.y -= this.speedY * delta;
            for (let i = 0 ; i < asteroids.length; i++) {
                if (circleCollide(ship, asteroids[i]) && alive ){
                    endscore = now-starttime+score;
                    alive = false;
                }
            }
    },

    render: function(){
        newX = 0;
        drawRotatedImage(images.shipImage, this.x, this.y, 1.5, this.angle);
    },
}
let cooldown = 0.3;
let helpcooldown = 0;
let Missile = function(ship) {
    
    this.colisionCheck = false;
	this.angle = ship.angle-Pi/2;
	this.x = ship.x;
	this.y = ship.y;
    this.speed = 500 + (ship.speedY**2 + ship.speedX**2)**(1/2)
    this.radius = 10;
	this.color = "#EB0018";
	this.update = function(delta){
		//if(0 < this.x && this.x < canvas.width && 0 < this.y && this.y < canvas.height){
			this.y += (this.speed * Math.sin(this.angle)) * delta;
			this.x += (this.speed * Math.cos(this.angle)) * delta;
		//}
	};
    this.render = function(){
        drawRotatedImage(images.missileImage, this.x, this.y, 1, this.angle+Pi/2);
        drawCircle(this);
    };
    this.forDeletion = function(){
        return (!(0<this.x && this.x<canvas.width && 0<this.y && this.y<canvas.height) || this.colisionCheck);
    };
}

let Asteroid = function(parent) {
    this.colisionCheck = false;
    this.time = 0;
    this.color = "#dfff20";
    if(parent && parent.radius > 50){
        this.x = parent.x + Math.random() * 100 - 50;
        this.y = parent.y + Math.random() * 100 - 50;
        this.speedX = parent.speedX + Math.random() * 150 - 75;
        this.speedY = parent.speedY + Math.random() * 150 - 75;
        this.radius = parent.radius * (Math.random() * 0.5 + 0.25);
    } else {
        this.random = Math.ceil(Math.random()*4);
        this.radius = 50 + Math.random()*75;
        switch(this.random){
            case 1:
                this.x = -200;
                this.y = canvas.height * Math.random();
                this.speedX = 50 + Math.random()*50;
                this.speedY = Math.random()*50 - Math.random()*50;
                break;
            
            case 2:
                this.x = canvas.width * Math.random();
                this.y = -200;
                this.speedX = Math.random()*50 - Math.random()*50;
                this.speedY = 50 + Math.random()*50;
                break;
            
            case 3:
                this.x = canvas.width + 200;
                this.y = canvas.height * Math.random();
                this.speedX = -50 - Math.random()*50;
                this.speedY = Math.random()*50 - Math.random()*50;
                break;
            
            case 4:
                this.x = canvas.width * Math.random();
                this.y = canvas.height + 200;
                this.speedX = Math.random()*50 - Math.random()*50;
                this.speedY = -50 - Math.random()*50;
                break;
        }
    }
    this.Destroyed = function(){
        return(this.colisionCheck)
    };

    this.update = function(delta,index){
        this.x += this.speedX*delta;
        this.y += this.speedY*delta;
        for(let i=0; i<missiles.length; i++){
            if(circleCollide(asteroids[index],missiles[i])){
                this.colisionCheck = true;
                missiles[i].colisionCheck = true;
                if(asteroids[index] && asteroids[index].radius > 45){
                    asteroids.push(new Asteroid(this));
                    asteroids.push(new Asteroid(this));

                }
            }
        }
    };
    
    this.render = function(){
        drawRotatedImage(images.asteroidImage, this.x, this.y, this.radius/207, this.angle);
        if(SHOW_HITBOXES) drawCircle(this);
        
    };
    this.forDeletion = function() {
        return this.colisionCheck;
    } 
}
let pointdown = 1;
let helppoint = 0;
let Point = function(){
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = 20;
    this.color = "#fbfbfb";
    this.render = function(){
        drawRotatedImage(images.pointImage, this.x, this.y, 1);
        if(SHOW_HITBOXES) drawCircle(this);
    };
}
