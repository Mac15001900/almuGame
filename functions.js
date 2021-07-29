//podział asteroidy na dwa
let KaBOOM = function (asteroid,missle) {
   
    
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
    return (x**2 + y**2 < (circ1.rad + circ2.rad)**2);
}
function drawCircle(circle){
    context.beginPath();
    context.fillStyle = circle.color;
    context.arc(circle.x, circle.y, circle.radius, 0, Math.PI*2);
    context.fill();
}