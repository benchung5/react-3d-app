function onepixLoadStaticJSONcustom(path, newMaterials, castShadows, receiveShadows) {
    
    $('#debug #models').html("loading static JSON model");

    // load JSON model-----------------------------------///
    var loader = new THREE.JSONLoader(manager);


    var deferred = $.Deferred();

//        loader.load('models/cube.js', modelLoadedCallback);
    $('#debug #models').html("loading static JSON model " + path + "<br>");
    loader.load(path, function (geometry, materials) {
        
        deferred.resolve(geometry);
        
        //assign defualt material if no material specified
        if(typeof newMaterials === 'undefined') {
            materialDefault = new THREE.MeshBasicMaterial({ color: 0xdfdfdf });
            newMaterials = [
                materialDefault
            ];
        }

//        meshfacematerial enables multiple materials per object (newMaterials assigns them to mesh face ids from 3d program)
        var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( newMaterials ) );
        mesh.position.set(0, 0, 0);//x,z,y - if you think in blender dimensions ;)

//      specify shadows
        if (typeof castShadows !== 'undefined') {
            mesh.castShadow = castShadows;
        }
        if (typeof receiveShadows !== 'undefined') {
            mesh.receiveShadow = receiveShadows;
        }

        group.add(mesh);

        $('#debug #models').append("static JSON model loaded: " + path + "<br>");
        
    });
    

// Return the Promise
return deferred.promise();

}

function onepixLoadStaticOBJ(path, manager) {
    
    material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});

    // load OBJ model-----------------------------------///
    
    var loader = new THREE.OBJLoader(manager);
    
    $('#debug #models').html("loading static JSON model " + path + "<br>");
    
    loader.load(path, function (object) {

        object.traverse(function (child) {
            
            if (child instanceof THREE.Mesh) {
               

                child.material = material;

            }

        });
        
        group.add(object);

        $('#debug #models').append("static OBJ model loaded: " + path + "<br>");

    }, onProgress, onError );
    
}

//for obj loading progress
var onProgress = function (xhr) {
    if (xhr.lengthComputable) {
//            var percentComplete = xhr.loaded / xhr.total * 100;
//            console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
};

//for obj loading error
var onError = function (xhr) {
};

function onepixLoadSkinnedJSON(path) {
    
    var deferred = $.Deferred();

    // load JSON model-----------------------------------///
    var loader = new THREE.JSONLoader();

//        loader.load('models/cube.js', modelLoadedCallback);
    loader.load(path, function (geometry, materials) {
        
        deferred.resolve(geometry);


        for (var i = 0, il = materials.length; i < il; i++) {

            var originalMaterial = materials[ i ];
            originalMaterial.skinning = true;


//                    originalMaterial.map = THREE.ImageUtils.loadTexture( "../textures/texture.jpg" );
//                    originalMaterial.map = undefined;
//                    originalMaterial.shading = THREE.SmoothShading;
//                    originalMaterial.color.setHSL( 0.01, 0.3, 0.3 );
//                    originalMaterial.ambient.copy( originalMaterial.color );
//                    originalMaterial.specular.setHSL( 0, 0, 0.1 );
//                    originalMaterial.shininess = 75;
//
//                    originalMaterial.wrapAround = true;
//                    originalMaterial.wrapRGB.set( 1, 0.5, 0.5 );

        }


//      mesh = new THREE.Mesh(geometry, materialTexture);
        var material = new THREE.MeshFaceMaterial(materials);
        var mesh = new THREE.SkinnedMesh(geometry, material, false);

//        enable it to cast shadows
        mesh.castShadow = true;
        mesh.receiveShadow = false;

        group.add(mesh);

        skins.push(mesh);

//      THREE.AnimationHandler.add(geometry.animation);
        animation = new THREE.Animation(mesh, geometry.animations[1]);
        animation.play();
        animation.update(0);
        
        $('#debug #models').append("skinned JSON model loaded: " + path + "<br>");


    });

// Return the Promise
    return deferred.promise();

}

function onepixLoadSkinnedCOLLADA(path) {
    
    var deferred = $.Deferred();

    // load Collada model-----------------------------------///
//
    var loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;

    loader.load(path, function (collada) {

//            geometry.computeFaceNormals();
        //geometry.computeVertexNormals();    // requires correct face normals


        materialbasic = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true, skinning: true});

        dae = collada.scene;
        
        deferred.resolve(dae);

        dae.traverse(function (child) {

            if (child instanceof THREE.SkinnedMesh) {
                
                

                var animation = new THREE.Animation(child, child.geometry.animation);
                animation.play();

            }

        });

        setMaterial(dae, materialbasic);

        function setMaterial(child, material) {
            child.material = material;
            if (child.children) {
                for (var i = 0; i < child.children.length; i++) {
                    setMaterial(child.children[i], material);
                }
            }
        }

//            default rotation, position
        dae.rotation.set(0, 0, 0);
        dae.position.set(0, 0, 0);//x,z,y - if you think in blender dimensions ;)
        dae.scale.set(0.5, 0.5, 0.5);

        dae.updateMatrix();

        group.add(dae);
        
        $('#debug #models').append("skinned COLLADA model loaded: " + path + "<br>");

    });
    
    // Return the Promise
    return deferred.promise();

}

function onepixLoadScene(path) {

    //load three.js editor generated scene instead
    var loader = new THREE.ObjectLoader;
    loader.load(path, function (obj) {
        
//        obj.traverse(function(child){ initChild(child); });
        
        group.add(obj);
    });

}

//function initChild(child) {
//    if (child.material != null)
//    {
//        var childName = child.material.name;
//        child.material = new THREE.MeshPhongMaterial({ color: 0xdfdfdf});
//        child.material.name = childName;
//        AssignMap(child.material);
//    }
//}




