THREE.SimpleShader = {

	uniforms: {
            texture1: {type: "t", value: null},
            scale: {type: "f", value: 1.0},
	},

	vertexShader: [

                        //"varying vec2 vUv;",
                        "varying vec3 fNormal;",
                        
                        "void main() {",

                            //"vUv = uv;",
                            "fNormal = normal;",

                            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
                            //see it enlargen along the normal
                            //"gl_Position = projectionMatrix * modelViewMatrix * vec4( position + normal, 1.0 );",

                        "}"

	].join("\n"),

	fragmentShader: [

			//"varying vec2 vUv;",
                        "varying vec3 fNormal;",

			"void main( void ) {",

                            // compose the colour using the normals then 
                            // whatever is heightened by the noise is lighter
                            "gl_FragColor = vec4( fNormal, 1. );",

                        "}"

	].join("\n")

};