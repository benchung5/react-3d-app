var container = document.getElementById('container');
var containerInnerWidth = container.offsetWidth;
var containerInnerHeight = container.offsetHeight;

var clock = new THREE.Clock();

var manager, camera, scene, renderer, group;

//array to hold assets to load in queue
var requests = [];

//used by mouse tracking
var windowHalfX = containerInnerWidth / 2;
var windowHalfY = containerInnerHeight / 2;

var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;
var NEAR = 10, FAR = 999.05;

init();
update();

function init() {
        
    //initialize the manager to handle all loaded events (currently just works for OBJ and image files)
    manager = new THREE.LoadingManager();
    
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };
    manager.onLoad = function () {
        console.log('all items loaded');
        allItemsLoaded();
    };
    manager.onError = function () {
        console.log('there has been an error');
    };
    
//-----------------------------------------------------------------------------// 
//loading animation
//-----------------------------------------------------------------------------// 

    //to display loading animation before it's ready
    $(document).ready(function () {
        if ($('.loading-container').length) {

            //to show loading animation
            $imgloader = $('.loading-container');
            $loadingimg = $('<div id="canvasloader-container" class="onepix-imgloader"></div>');


//          $loadingimg.attr("src","images/flexslider/loading.gif");
            $imgloader.prepend($loadingimg);

//          canvasloader code
            var cl = new CanvasLoader('canvasloader-container');
            cl.setColor('#4f4f4f'); // default is '#000000'
            cl.setDiameter(45); // default is 40
            cl.setDensity(75); // default is 40
            cl.setRange(0.7); // default is 1.3
            cl.setSpeed(3); // default is 2
            cl.setFPS(22); // default is 24
            cl.show(); // Hidden by default
        }


    });
    
    function allItemsLoaded() {
        $('.onepix-imgloader').fadeOut();
        // fade in content (using opacity instead of fadein() so it retains it's height.
        $('.loading-container > *:not(.onepix-imgloader)').fadeTo(8000, 100);
    }


//-----------------------------------------------------------------------------//
//init scene
//-----------------------------------------------------------------------------//

    scene = new THREE.Scene();
    group = new THREE.Object3D();

    initDebug();

    initMouse();

    window.addEventListener('resize', onWindowResize, false);

//-----------------------------------------------------------------------------//
//load geometry 
//-----------------------------------------------------------------------------//

//load static obj file (obj loadin works with the THREE.LoadingManager())
////-----------------------------------------------//

//onepixLoadStaticOBJ('models/cube/cube.obj', manager);


//draw faces with vertex colors
//-----------------------------------------------//

//    var geometry = new THREE.Geometry();
//    geometry.vertices.push(
//            new THREE.Vector3(0, 0, 0),
//            new THREE.Vector3(-2, -2, 0),
//            new THREE.Vector3(2, -2, 0));
//
//    geometry.faces.push(new THREE.Face3(0, 1, 2));
//
//    geometry.faces[0].vertexColors[0] = new THREE.Color("rgb(255,0,0)");
//    geometry.faces[0].vertexColors[1] = new THREE.Color("rgb(0,255,0)");
//    geometry.faces[0].vertexColors[2] = new THREE.Color("rgb(0,0,255)");
//
//    material = new VertexColMat(THREE.VertexColorShader);
//
//    mesh = new THREE.Mesh(geometry, material);
//    mesh.position.y = 1;
//    group.add(mesh);

//simple generated primitive
//-----------------------------------------------//

    //SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
//    geometry = new THREE.SphereGeometry(1, 80, 80);
    
//    //BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)
//    geometry = new THREE.CubeGeometry(1, 1, 1);
//
//    //PlaneGeometry(width, height, widthSegments, heightSegments)
//    geometry = new THREE.PlaneGeometry(1, 1, 1);

//    material = new BasicMat('red', false); 
//    mesh = new THREE.Mesh(geometry, material);
//    group.add(mesh);

//simple generated primitive with custom shader
//-----------------------------------------------//

//    material = new CustomMat("textures/texture.jpg", THREE.SimpleShader);
//    geometry = new THREE.SphereGeometry(1, 80, 80);
//    mesh = new THREE.Mesh(geometry, material);
//    group.add(mesh);

//simple cube with custom shader
//-----------------------------------------------//
    materialMetal = new LavaMat(THREE.LavaShader);

    var newMaterials = [
        materialMetal
    ];
    ;
    
//    requests.push(onepixLoadStaticJSONcustom('models/cube/cube.js', newMaterials, false, false));


//reflective ring and diamond
//-----------------------------------------------//
    var reflectionShader = THREE.ReflectionShader;
    materialMetal = new CubeMat("textures/cube/Escher/", reflectionShader);

    var fresnelShader = THREE.FresnelShader;
    materialDiamond = new CubeMat("textures/cube/Escher/", fresnelShader);

    var newMaterials = [
        materialMetal,
        materialDiamond
    ];
    
    requests.push(onepixLoadStaticJSONcustom('models/ring/ring.js', newMaterials, false, false, manager));

//animated versions (load groundplane too)
//-----------------------------------------------//

//    $.when(
//            onepixLoadSkinnedCOLLADA('models/tube/animated-tube.dae'),
////            onepixLoadSkinnedJSON('models/tube/animated-tube.json'),
//            onepixLoadStaticJSONcustom('models/ground/ground.json', undefined, false, true)
//
//            ).done(function (value1, value2) {
//        //    alert('loaded' + value1);
//        //    alert('loaded' + value2);
//        allItemsLoaded();
//    });
    

//    requests.push(onepixLoadSkinnedCOLLADA('models/tube/animated-tube.dae'));
//    requests.push(onepixLoadStaticJSONcustom('models/ground/ground.json', undefined, false, true));
    
//if all items loaded
//-----------------------------------------------// 
    $.when.apply($, requests).done(function () {
        //console.log(arguments); //it is an array like object which can be looped
        var total = 0;
        $.each(arguments, function (i, data) {
            //console.log(data); //data is the value returned by each of the ajax requests
        });

        allItemsLoaded();
    });


//scene exported from three.js editor
//-----------------------------------------------//
//    onepixLoadScene('scenes/scene.json');

//-----------------------------------------------------------------------------//
//setup scene
//-----------------------------------------------------------------------------//

    //scene graph (group.add(mesh); is in the loaders)
    scene.add(group);
    
    // fog
    scene.fog = new THREE.FogExp2(0xdfdfdf, 0.04);
    
//-----------------------------------------------------------------------------//
//setup renderer
//-----------------------------------------------------------------------------//

//  renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(containerInnerWidth, containerInnerHeight);

    renderer.setClearColor(0xdfdfdf, 1);
//  renderer.autoClear = false;

    renderer.shadowMapEnabled = true;
    //renderer.shadowMapType = THREE.PCFShadowMap;
    //soft shadowmap version
    renderer.shadowMapType = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    
//-----------------------------------------------------------------------------//  
//setup camara
//-----------------------------------------------------------------------------//  

    camera = new THREE.PerspectiveCamera(75, containerInnerWidth / containerInnerHeight, 0.1, 10000);
    //adjust this to zoom camera close or far
    camera.position.z = 3;
    //camera height
    camera.position.y = 0;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    cameraControls = new THREE.TrackballControls(camera, renderer.domElement);
    cameraControls.target.set(0, 0, 0);

//-----------------------------------------------------------------------------//
//setup lights
//-----------------------------------------------------------------------------//

    light = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 2, 1);
    light.position.set(0.5, 3, 3);
    light.target.position.set(0, 0, 0);

    // cast shadow
    light.castShadow = true;
    light.shadowCameraNear = 1;
    light.shadowCameraFar = 10;
    light.shadowCameraFov = 50;

    //show light camera frustrum
    //light.shadowCameraVisible = true;

    light.shadowBias = 0.0001;
    light.shadowDarkness = 0.5;

    light.shadowMapWidth = SHADOW_MAP_WIDTH;
    light.shadowMapHeight = SHADOW_MAP_HEIGHT;

    scene.add(light);

    //secondary light
    light = new THREE.DirectionalLight(0x002288, 1);
    light.position.set(-1, -1, -1);
    scene.add(light);

    //ambient light
    light = new THREE.AmbientLight(0x222222);
    scene.add(light);

}

function onWindowResize() {

    // make sure to updtate the container proportions on window resize
    containerInnerWidth = container.offsetWidth;
    containerInnerHeight = container.offsetHeight;

    windowHalfX = containerInnerWidth / 2;
    windowHalfY = containerInnerHeight / 2;

    camera.aspect = containerInnerWidth / containerInnerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(containerInnerWidth, containerInnerHeight);

}

function update() {
    
    var delta = clock.getDelta();

    requestAnimationFrame(update);

    //update onepix mouse tracking - manipulates the scene
//    updateMouse();
    //or use the three.js TrachballControls  manipulates the camera
    cameraControls.update(delta);

    updateAnimation(delta);

    renderer.render(scene, camera);
    stats.update();

}