let LOG_FPS=true; 
let LOG_TIME=true;
let Pi = Math.PI;

let animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60)
    };

//Canvas
let canvas = document.getElementById("mainCanvas");
let context = canvas.getContext('2d');

let now = Date.now()/1000;
let keysDown = {};

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
    if(asteroids.length < 5){
      asteroids.push(new Asteroid());
    }
      for (let i = 0; i < asteroids.length; i++) {
        asteroids[i].update(delta);
      }

};

//Rysowanie klatki
let render = function (){
  context.fillStyle = "#000000";
  context.fillRect(0, 0, canvas.width, canvas.height);
  ship.render();
  for (let i = 0; i < asteroids.length; i++) {
    asteroids[i].render();
  }

};

let ship = {
  speed: 0,
  acceleration: 200,
  angle: 0,
  x: 100,
  y: 100,
  width: 200,
  height: 300,
  color: "#123456",
  update: function(delta){
    let static = true;
    if((keysDown["w"] || keysDown["ArrowUp"]) && this.speed < 400){
      this.speed += this.acceleration * delta;
      static = false;
    } if((keysDown["s"] || keysDown["ArrowDown"]) && this.speed > -400){
      this.speed -= this.acceleration * delta;
      static = false;
    } if(keysDown["d"] || keysDown["ArrowRight"]){
      this.angle += Pi/120;
    } if(keysDown["a"] || keysDown["ArrowLeft"]){
      this.angle -= Pi/120;
    } if (static) {
      this.speed -= this.acceleration * delta * Math.sign(this.speed) / 2 ;
    }
      this.x += Math.sin(this.angle) * this.speed * delta;
      this.y -= Math.cos(this.angle) * this.speed * delta;

  },
  render: function(){
    drawRotatedRect(this, this.angle);
  },
}

let Asteroid = function() {
this.color = "dd0000";
this.random = Math.ceil(Math.random()*4);
this.x = 0;
this.y = 0;
this.speedX = 0;
this.speedY = 0;
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
    this.speedX = Math.random*50 - Math.random()*50;
    this.speedY = -50 - Math.random()*50;
  }


  this.update = function(delta){
      this.x += this.speedX*delta;
      this.y += this.speedY*delta;
  };
  this.render = function(){
    context.fillStyle = this.color;
    context.fillRect( this.x, this.y, 400, 400);
  };
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


//Ogarnianie klawiatury
window.addEventListener("keydown", function (event) { 
  if(!keysDown[event.key]){
  	document.getElementById('keyCode').innerHTML = event.key;
  	keysDown[event.key] = true;
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
