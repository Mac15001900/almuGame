let LOG_FPS=true; 
let LOG_TIME=true;

let animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60)
    };

//Canvas
let canvas = document.getElementById("mainCanvas");
let context = canvas.getContext('2d');

let now = Date.now()/1000;
let keysDown = {};

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
};

//Rysowanie klatki
let render = function (){
  context.fillStyle = "#000000";
  context.fillRect(0, 0, canvas.width, canvas.height);
  ship.render();
};

let ship = {
  speed: 0,
  acceleration: 100,
  angle: 0,
  x: 100,
  y: 100,
  width: 200,
  height: 300,
  color: "#123456",
  update: function(delta){
    if((keysDown["w"] || keysDown["ArrowUp"]) && this.speed < 300){
      this.speed = this.acceleration * delta;
      this.x += Math.sin()this.speed * delta;
      this.y -= Math.cos()this.speed * delta;
    } if(keysDown["s"] || keysDown["ArrowDown"]){
      this.y += this.speed * delta;
    } if(keysDown["d"] || keysDown["ArrowRight"]){
      this.x += this.speed * delta;
    } if(keysDown["a"] || keysDown["ArrowLeft"]){
      this.x -= this.speed * delta;
    }
  },
  render: function(){
    context.fillStyle = this.color;
    context.fillRect( this.x, this.y, this.width, this.height);
  },
}












//Drobne użytkowe funkcje
function drawRotatedRect(rect,rotation){
    context.save();
    context.beginPath();
    context.translate(rect.x+rect.width/2, rect.y+rect.height/2);
    context.rotate(rotation);
    context.rect(-width/2, -height/2, width, height);
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
