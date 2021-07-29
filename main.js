let LOG_FPS=true; 
let LOG_TIME=true;
let Pi = Math.PI;
let time = 0;
let animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60)
    };

//Canvas
let canvas = document.getElementById("mainCanvas");
let context = canvas.getContext('2d');

let now = Date.now()/1000;
let keysDown = {};

let missiles = [];
let asteroids = [];

let init = function(){

  //Rzeczy dziejące się na początku  

};

//Logika gry (w każdej klatce)
let update = function (){
	//Update time and FPS
    let newTime=Date.now()/1000;
    let delta=(newTime-now);
    now=newTime;
    fpsCalculator.update();
    if(LOG_TIME) document.getElementById('timeLog').innerHTML = Math.round((now%100000)*100)/100;
    ship.update(delta);
    for( let i=0; i<missiles.length; i++) {
    	missiles[i].update(delta);
    }
    for (let i=0; i<missiles.length;i++){
		if(missiles[i].forDeletion()){
			missiles.splice(i,1);
		}
	}
    for (let i=0; i<asteroids.length;i++){
    if(asteroids[i].forDeletion()){
      asteroids.splice(i,1);
    }
  }
   //missiles.splice(i,1
    if(time>3){
      asteroids.push(new Asteroid());
      time = 0;
    }
    time += delta;
      for (let i = 0; i < asteroids.length; i++) {
        asteroids[i].update(delta);
      }
};

//Rysowanie klatki
let render = function (){
  context.fillStyle = "#000000";
  context.fillRect(0, 0, canvas.width, canvas.height);
  for( let i=0; i<missiles.length; i++) {
    	missiles[i].render();
  }
  for (let i = 0; i < asteroids.length; i++) {
    asteroids[i].render();
  }
  ship.render();

};

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
          console.log("bajo jajo");
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
  this.forDeletion = function() {
    return(false);
  } 
}
//podział asteroidy na dwa
let KaBOOM = function (size,i) {
  if(size>200){




  }
}
//Drobne użytkowe funkcje
function drawRotatedRect(rect,rotation){
    context.save();
    context.beginPath();
    context.translate(rect.x+rect.width/2, rect.y+rect.height/2);
    context.rotate(rotation);
    context.rect(-rect.width/2, -rect.height/2, rect.width, rect.height);
    context.fillStyle = rect.color;
    context.fill()
    context.restore()
}

function circleCollide(circ1,circ2){
  let x = Math.max(circ1.x, circ2.x) - Math.min(circ1.x, circ2.x);
  let y = Math.max(circ1.y, circ2.y) - Math.min(circ1.y, circ2.y);
  return (x**2 + y**2 < circ1.rad + circ2.rad);
}
function drawCircle(circle){
    context.beginPath();
    context.fillStyle = circle.color;
    context.arc(circle.x, circle.y, circle.radius, 0, Math.PI*2);
    context.fill();
}


//Ogarnianie klawiatury
window.addEventListener("keydown", function (event) { 
  if(!keysDown[event.key]){
  	document.getElementById('keyCode').innerHTML = event.key;
  	keysDown[event.key] = true;
  	if(event.key === "z" && now > helpcooldown + cooldown){
  		missiles.push(new Missile(ship.x, ship.y, ship.angle));
      helpcooldown = now;
  	}
    //Tutaj wydarzenia reagujące na wciśnięcie przycisku klawiatury
  }
});

window.addEventListener("keyup", function (event) {
  delete keysDown[event.key];
  //Tutaj wydarzenia reagujące na odciśnięcie przycisku klawiatury
});

//Ogarnianie myszki
canvas.addEventListener("mousedown", function (event){
	let mouseX = event.pageX; //Koordynaty kliknięcia
	let mouseY = event.pageY;
    //Tutaj wydarzenia reagujące na kliknięcie myszką
}, false);


//Kalkulator mierzący FPS
let fpsCalculator = {
	lastCheck: now,
	fps: 0,
	framesSinceLastCheck: 0,
	update: function () {
		this.framesSinceLastCheck++;
		if(now>this.lastCheck+1){
			this.fps= this.framesSinceLastCheck/(now-this.lastCheck);
			this.lastCheck=now;
			this.framesSinceLastCheck=0;
			if(LOG_FPS) document.getElementById('fpsLog').innerHTML = Math.round(this.fps);
		}
	}
}

//Starting the game
let step = function () {
    update();
    render();
    animate(step);
};

init();
animate(step);
