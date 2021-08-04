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
    return (x**2 + y**2 < (circ1.radius + circ2.radius)**2);
}
function drawCircle(circle){
    context.globalAlpha = 0.5;
    context.beginPath();
    context.fillStyle = circle.color;
    context.arc(circle.x, circle.y, circle.radius, 0, Math.PI*2);
    context.fill();
    context.globalAlpha = 1;
}

//Funckja z https://stackoverflow.com/questions/17411991/html5-canvas-rotate-image
function drawRotatedImage(image, x, y, scale, rotation){
    if(!image) return;
    context.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
    context.rotate(rotation);
    context.drawImage(image, -image.width / 2, -image.height / 2);
    context.setTransform(1,0,0,1,0,0);
} 

function restart(){

    starttime = now;
    delta = 0;
    alive = true;
    score = 0;
    cooldown = 0.5;
    kasa = 0;
    shipAngleChange = 0.03;
    for (let i=0; i<asteroids.length; i++){
        asteroids.splice(i,1);
    }
    for (let i=0; i<points.length; i++){
        points.splice(i,1);
    }
        for (let i=0; i<missiles.length; i++){
        missiles.splice(i,1);
    }
    ship.x = 960;
    ship.y = 540;
    ship.angle = 0;
    ship.speedX = 0;
    ship.speedY = 0;
    money = 0;
    cooldownlvl = 0;
    rotatelvl = 0;
    speedlvl = 0;
    ship.maxSpeed = 400;
    ship. acceleration = 400;
}
function shopUpdate(ship, upgrade) {
    // body...
}