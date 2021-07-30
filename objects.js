//Tworzenie statku
let ship = {
    speedX: 0,
    speedY: 0,
    acceleration: 300,
    drag: 100,
    angle: 0,
    x: 100,
    y: 100,
    width: 200,
    height: 300,
    radius: 150,
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
            this.angle += Pi/120;
        } if(keysDown["a"] || keysDown["ArrowLeft"]){
            this.angle -= Pi/120;
        } if(keysDown["z"] && now > helpcooldown + cooldown){
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
                    alive = false;
                    endscore = score;
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
        drawCircle(this);
        drawRotatedImage(images.missileImage, this.x, this.y, 1, this.angle+Pi/2);
    };
    this.forDeletion = function(){
        return (!(0<this.x && this.x<canvas.width && 0<this.y && this.y<canvas.height) || this.colisionCheck);
    };
}

let Asteroid = function() {
    this.colisionCheck = false;
    this.time = 0;
    this.color = "#dfff20";
    this.random = Math.ceil(Math.random()*4);
    this.x = 0;
    this.y = 0;
    this.speedX = 0;
    this.speedY = 0;
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

    this.update = function(delta,asteroidindex){
        this.x += this.speedX*delta;
        this.y += this.speedY*delta;
        for(let i=0; i<missiles.length; i++){
            if(circleCollide(asteroids[asteroidindex],missiles[i])){
                this.colisionCheck = true;
                missiles[i].colisionCheck = true;
                if(asteroids[asteroidindex] && asteroids[asteroidindex].radius > 45){
                    asteroids.push(new SmallAsteroid(asteroids[asteroidindex].x   ,  asteroids[asteroidindex].y  ,  asteroids[asteroidindex].speedX + 150 * Math.random() - 75,  asteroids[asteroidindex].speedY + 400 * Math.random() - 200 ,  0.25 * asteroids[asteroidindex].radius + 0.5 * Math.random() * asteroids[asteroidindex].radius));
                    asteroids.push(new SmallAsteroid(asteroids[asteroidindex].x   ,  asteroids[asteroidindex].y  ,  asteroids[asteroidindex].speedX + 150 * Math.random() - 75,  asteroids[asteroidindex].speedY + 400 * Math.random() - 200 ,  0.25 * asteroids[asteroidindex].radius + 0.5 * Math.random() * asteroids[asteroidindex].radius));

                }
            }
        }
    };
    
    this.render = function(){
        drawCircle(this);
        
    };
    this.forDeletion = function() {
        return this.colisionCheck;
    } 
}

let SmallAsteroid = function(parent) {
    this.colisionCheck = false;
    this.color = "#dfff20";
    this.random = Math.ceil(Math.random()*4);
    this.x = parent.x + Math.random() * 100 - 50;
    this.y = parent.y + Math.random() * 100 - 50;
    this.speedX = parent.speedX + Math.random() * 150 - 75;
    this.speedY = parent.speedY + Math.random() * 150 - 75;
    this.radius = parent.radius * (Math.random() * 0.5 + 0.25);
 
    this.update = function(delta,asteroidindex){
        this.x += this.speedX*delta;
        this.y += this.speedY*delta;
        for(let i=0; i<missiles.length; i++){
            if(circleCollide(asteroids[asteroidindex],missiles[i])){
                this.colisionCheck=true;
                missiles[i].colisionCheck = true;

            }
        }
    };

    this.render = function(){
        drawCircle(this);
        
    };
    this.forDeletion = function() {
        return this.colisionCheck;
    } 
}
