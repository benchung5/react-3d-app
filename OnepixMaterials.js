var BasicMat = function (color,isWireframe) {
    material = new THREE.MeshBasicMaterial({
        wireframe: isWireframe,
        color: color
    });
    return material;
}

var CustomMat = function (texturePath, shader) {

    var texture = onepixLoadTexture(texturePath);

    var uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    uniforms[ "texture1" ].value = texture;

    var parameters = {fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms};
    return new THREE.ShaderMaterial(parameters);
}

var VertexColMat = function (shader) {

    var uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    var parameters = {
        //this activates the 'colors' attribute (uses vertex colors stored in the created geometry)
        vertexColors: THREE.VertexColors,
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        side: THREE.DoubleSide,
        uniforms: uniforms};
    return new THREE.ShaderMaterial(parameters);
}

//cubemap material for reflection and fresnel
var CubeMat = function (cubePath, shader) {

    var textureCube = onepixLoadTextureCube(cubePath);
    textureCube.format = THREE.RGBFormat;

    var uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    uniforms[ "tCube" ].value = textureCube;

    var parameters = {fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms};
    var attributes = {shading: THREE.FlatShading};
    return new THREE.ShaderMaterial(parameters, attributes);

}

//dismplacement material
var LavaMat = function (shader) {
    
    //fill values for uniforms(declared in shader file)
    var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
    
    uniforms["texture1"].value = onepixLoadTexture("textures/lava/cloud.png");
    uniforms["texture2"].value = onepixLoadTexture("textures/lava/lavatile.jpg");
    uniforms["texture1"].value.wrapS = uniforms.texture1.value.wrapT = THREE.RepeatWrapping;
    uniforms["texture2"].value.wrapS = uniforms.texture2.value.wrapT = THREE.RepeatWrapping;


    var parameters = {fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms};
    return new THREE.ShaderMaterial(parameters);

}

//used to load textures
function onepixLoadTexture(path) {

    // texture - texture must not be in same folder or there is an error.
    var texture = THREE.ImageUtils.loadTexture(path, {}, function () {
        // texture loaded
        $('#debug #textures').append("texture loaded: " + path + "<br>");
    }, function () {
        //error, texture not loaded
        $('#debug #textures').append("unable to load: " + path + "<br>");
    });

    return texture;
}

//used to load cube textures
function onepixLoadTextureCube(path) {
    
    var format = '.jpg';
    var urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];

    // texture - texture must not be in same folder or there is an error.
    var texture = THREE.ImageUtils.loadTextureCube(urls, {}, function () {
        // texture loaded
        $('#debug #textures').append("cube textures loaded: " + urls + "<br>");
    },
            function () {
                //error, texture not loaded
                $('#debug #textures').append("unable to load cube textures: " + urls + "<br>");
            });

    return texture;
}

