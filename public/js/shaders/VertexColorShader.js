THREE.VertexColorShader = {

	uniforms: {

	},

	vertexShader: [

                        "varying vec3 vColor;",
                        
                        "void main() {",

                            "vColor = color;",
                            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

                        "}"

	].join("\n"),

	fragmentShader: [

                        "varying vec3 vColor;",

			"void main( void ) {",

                            "gl_FragColor = vec4( vColor.rgb, 1. );",

                        "}"

	].join("\n")

};