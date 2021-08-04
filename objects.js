//Tworzenie statku
let shipAngleChange = 0.03;
let lastroll = now;
let ship = {
    speedX: 0,
    speedY: 0,
    maxSpeed: 300,
    acceleration: 300,
    drag: 100,
    roll: 200,
    rollCooldown: 0.5,
    angle: 0,
    x: 960,//width=1920 height=1080
    y: 540,
    radius: 75,

    color: "#123456",
    update: function(delta){
        let static = true;
        let speed = (this.speedX**2 + this.speedY**2)**(1/2);
        if((keysDown["w"] || keysDown["W"] || keysDown["ArrowUp"]) && speed < this.maxSpeed){
            this.speedX += Math.sin(this.angle) * this.acceleration * delta;
            this.speedY += Math.cos(this.angle) * this.acceleration * delta;
            static = false;
        } if((keysDown["s"] || keysDown["S"] || keysDown["ArrowDown"]) && speed < this.maxSpeed){//zmiany predkosci
            this.speedX -= Math.sin(this.angle) * this.acceleration * delta;
            this.speedY -= Math.cos(this.angle) * this.acceleration * delta;
            static = false;
        } if(keysDown["d"] || keysDown["D"] || keysDown["ArrowRight"]){
            this.angle += shipAngleChange;
        } if(keysDown["a"] || keysDown["A"] || keysDown["ArrowLeft"]){
            this.angle -= shipAngleChange;
        } if((keysDown["q"] || keysDown["Q"]) && now - lastroll > this.rollCooldown){
            this.barrelRoll(true);
        } if((keysDown["e"] || keysDown["E"]) && now - lastroll > this.rollCooldown){
            this.barrelRoll(false);
        }if((keysDown["z"] || keysDown["Z"] || keysDown[" "])&& now > helpcooldown + cooldown){
            let newMissile = new Missile(ship);
            missiles.push(newMissile);
            helpcooldown = now;
        } if (static && speed != 0) {
            this.speedX = this.speedX * (1 - this.drag * delta / speed);
            this.speedY = this.speedY * (1 - this.drag * delta / speed);//samoczynne zatrzymywanie sie
        }
        this.x += this.speedX * delta;//translacja
        this.y -= this.speedY * delta;
            for (let i = 0 ; i < asteroids.length; i++) {
                if (circleCollide(ship, asteroids[i]) && alive){
                    endscore = now-starttime+score;
                    alive = false;
                }
            }
    },

    render: function(){
        if (0 < this.x < 1920 || 0 < this.y < 1080) {
            this.x = (this.x + 1920) % 1920;
            this.y = (this.y + 1080) % 1080;
        }
        drawRotatedImage(images.shipImage, this.x, this.y, 1.5, this.angle);
    },
    barrelRoll: function(direction){
        if (direction === true) {
        this.speedX += Math.sin(this.angle - Pi/2) * this.roll;
        this.speedY += Math.cos(this.angle - Pi/2) * this.roll;
        } else {
        this.speedX -= Math.sin(this.angle - Pi/2) * this.roll;
        this.speedY -= Math.cos(this.angle - Pi/2) * this.roll;
        }
        lastroll = now;
    }
}
let cooldown = 0.1;
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
    if(parent && parent.radius > 60){
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
                this.speedX = (50 + Math.random()*50)*difficultylevel;
                this.speedY = (Math.random()*50 - Math.random()*50)*difficultylevel;
                break;
            
            case 2:
                this.x = canvas.width * Math.random();
                this.y = -200;
                this.speedX = (Math.random()*50 - Math.random()*50)*difficultylevel;
                this.speedY = (50 + Math.random()*50)*difficultylevel;
                break;
            
            case 3:
                this.x = canvas.width + 200;
                this.y = canvas.height * Math.random();
                this.speedX = (-50 - Math.random()*50)*difficultylevel;
                this.speedY = (Math.random()*50 - Math.random()*50)*difficultylevel;
                break;
            
            case 4:
                this.x = canvas.width * Math.random();
                this.y = canvas.height + 200;
                this.speedX = (Math.random()*50 - Math.random()*50)*difficultylevel;
                this.speedY = (-50 - Math.random()*50)*difficultylevel;
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
let pointdown = 1.5;
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
