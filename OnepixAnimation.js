var skins = [];
var play = false;

$(document).ready(function () {
    //onclick
    jQuery("#start").click(function () {
        play = true;
    });
    jQuery("#stop").click(function () {
        play = false;
    });

});

function updateAnimation(delta) {
    //      update animation
    if (play == true) {

//            for JSON version
        THREE.AnimationHandler.update(delta);

////              for Collada version
////              0.03 makes it more accurate
//                THREE.AnimationHandler.update( delta * 0.03  );
    }

//            to animation the object position (move whole model forward)

//            for ( var i = 0; i < skins.length; i ++ ) {
//
//                    var skin = skins[ i ];
//
//                    skin.position.x += delta;
//                    if ( skin.position.x > 200 ) skin.position.x = -200;
//
//            }
}


