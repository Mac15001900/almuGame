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
let starttime = now;
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
   //missiles.splice(i,1)
    if(time>3){
        asteroids.push(new Asteroid());
        time = 0;
    }
    time += delta;
        for (let i = 0; i < asteroids.length; i++) {
        asteroids[i].update(delta,i);
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
    context.fillStyle = "#ff2222";
    context.font = '40px serif';
    context.fillText(now-starttime, 600, 30);
};





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
