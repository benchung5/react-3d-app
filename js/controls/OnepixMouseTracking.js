var targetRotationX = 0;
var targetRotationOnMouseDownX = 0;

var targetRotationY = 0;
var targetRotationOnMouseDownY = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var mouseY = 0;
var mouseYOnMouseDown = 0;

function initMouse() {

    var canvas = container.querySelector('canvas');

    canvas.addEventListener('mousedown', onContainerMouseDown, false);
    canvas.addEventListener('mousemove', onContainerMouseMove, false);
    canvas.addEventListener('touchstart', onContainerTouchStart, false);
    canvas.addEventListener('touchmove', onContainerTouchMove, false);
}

function onContainerMouseDown(event) {

    event.preventDefault();

    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationOnMouseDownX = targetRotationX;

    mouseYOnMouseDown = event.clientY - windowHalfY;
    targetRotationOnMouseDownY = targetRotationY;

}

function onContainerMouseMove(event) {

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;

    targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.02;
    targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.02;
}

function onContainerTouchStart( event ) {

    if ( event.touches.length == 1 ) {

        event.preventDefault();

        mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
        targetRotationOnMouseDownX = targetRotationX;
        
        mouseYOnMouseDown = event.touches[ 0 ].pageY - windowHalfY;
        targetRotationOnMouseDownY = targetRotationY;
            
    }

}

function onContainerTouchMove( event ) {


    if ( event.touches.length == 1 ) {
        event.preventDefault();

        mouseX = event.touches[ 0 ].pageX - windowHalfX;
        targetRotationX = targetRotationOnMouseDownX + ( mouseX - mouseXOnMouseDown ) * 0.05;
        
        mouseY = event.touches[ 0 ].pageY - windowHalfY;
        targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.05;
    }

}

function updateMouse() {

     //horizontal rotation (the * 0.1 adds a falloff slowdown effect)
     group.rotation.y += ( targetRotationX - group.rotation.y ) * 0.1;
            
    if ((targetRotationY <= 1 && targetRotationY >= -0.3)) {

        addedRotationY = (targetRotationY - group.rotation.x);
        group.rotation.x += addedRotationY;
    }
    if (targetRotationY > 1) {

        targetRotationY = 1;
        addedRotationY = (targetRotationY - group.rotation.x);
        group.rotation.x += addedRotationY;
    }
    else if (targetRotationY < -0.3) {

        targetRotationY = -0.3;
        addedRotationY = (targetRotationY - group.rotation.x);
        group.rotation.x += addedRotationY;
    }

}


