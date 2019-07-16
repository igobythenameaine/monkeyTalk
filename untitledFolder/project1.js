// Init SpeechSynth API
const synth = window.speechSynthesis;

// DOM Elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const body = document.querySelector('body');

//Browser identifier
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';
// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;
var scene;
var camera;
var cameraControl;
var gui;
var clock;
		

// Init voices array
let voices = []; 
let isSpeaking = false;


//render the scene
function createRenderer() {
    renderer = new THREE.WebGLRenderer(); //allow for WebGL rendering
    renderer.setSize(window.innerWidth, window.innerHeight); //set to scale for window 
    renderer.shadowMap.enabled = true; //allow for showcast to scene
}



function getVoices() {
  voices = synth.getVoices();

  // Loop through voices and create an option for each one
  voices.forEach(voice => {
    // Create option element
    const option = document.createElement('option');
    // Fill option with voice and language
    option.textContent = voice.name + '(' + voice.lang + ')';

    // Set needed option attributes
    option.setAttribute('data-lang', voice.lang);
    option.setAttribute('data-name', voice.name);
    voiceSelect.appendChild(option);
  });
};

if (isFirefox) {
    getVoices();
}
if (isChrome) {
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = getVoices;
    }
}


function update(time){
  if(isSpeaking){
    createMonkeyTalk();
  } else {
    createMonkey();
  }

  window.requestAnimationFrame(update);
}

function isSpeakingSwitch() {
  isSpeaking = !isSpeaking;
}




// Speak
function speak() {

  // Check if speaking
  if (synth.speaking) {
    console.error('Already speaking...');
    return;
  }
  
  if (textInput.value !== '') {
  
    // Add monkey animation
    createMonkeyTalk();
     
     
    // Get speak text
    var speakText = new SpeechSynthesisUtterance(textInput.value);
    
  
    // Speak end
    speakText.onend = e => {
      console.log('Done speaking...');
        isSpeakingSwitch();
        //or
        isSpeaking = false;
    };

    // Speak error
    speakText.onerror = e => {
      console.error('Something went wrong');
      isSpeaking = false;
    };

    // Selected voice
    var selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
      'data-name'
    );

    // Loop through voices
    voices.forEach(voice => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });

    synth.speak(speakText);
   
  }
};

// EVENT LISTENERS

// Text form submit
textForm.addEventListener('submit', e => {
  e.preventDefault();
  speak();
  textInput.blur();
});

// Voice select change
voiceSelect.addEventListener('change', e => speak());   

//add Camera to scene  
function createCamera() {
    camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1, 1000);
    camera.position.x = 80;
    camera.position.y = -100;
    camera.position.z = 200;
    camera.lookAt(scene.position);
    
    //add controls import from OrbitControls.js
    //cameraControl = new THREE.OrbitControls(camera);
}

//create lights
function createLight() {

//directional light
var directionalLight = new THREE.DirectionalLight(0xffffff, 2);


    directionalLight.position.set(10, 100, 10);
    directionalLight.name = 'directional';
    directionalLight.castShadow = true;
    
    scene.add(directionalLight);
    

//ambient light
    var ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    
//spot Light
    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( -100, -200, 10 );
    spotLight.name = 'spotLight';
    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1;
    spotLight.shadow.mapSize.height = 11;

    spotLight.shadow.camera.near = 100;
    spotLight.shadow.camera.fov = 30;

    scene.add( spotLight );
 }
 
//create avatar 
function createMonkey() {
 
   var gltfLoader = new THREE.GLTFLoader();
   gltfLoader.load('../shapeKeys.glb',function(gltf) {
   
   //set values to ucc
		var shape = gltf.scene;
			shape.position.set(0,20,0);
		    shape.scale.set(70,70,70);
			shape.traverse(function(object) {
				if (object.isMesh) {
					object.castShadow = false;
				}
			} );
			scene.add(shape);
			console.log ("monkey one loaded");
			} );
}
			
			
function createMonkeyTalk() {
 
   var gltfLoader = new THREE.GLTFLoader();
   gltfLoader.load('../shapeKeys.glb',function(gltf) {
   
   //set values to ucc
		var shape = gltf.scene;
			shape.position.set(0,20,0);
		    shape.scale.set(70,70,70);
			shape.traverse(function(object) {
				if (object.isMesh) {
					object.castShadow = false;
				}
			} );
			scene.add(shape);


	var params = {
		O:   0,
        E:   0,
        AI:  0,
        U:   0,
        L:   0,
        WQ:  0,
        MBP: 0,
        FV:  0,
        ECT: 0,
   };

	var gui = new dat.GUI();
    var mesh = shape.getObjectByName( 'Suzanne' );
	var folder = gui.addFolder( 'Morph Targets' );
	var expressions = Object.keys( mesh.morphTargetDictionary );
  //folder.add( params, 'MBP', 0, 1 ).step( 0.01 ).listen().onChange( function( value ) { mesh.morphTargetInfluences[ i ] = value; } );	
  
  for ( var i = 0; i < expressions.length; i ++ ) {
   					folder.add( mesh.morphTargetInfluences, i, 0, 1, 0.01 ).name( expressions[ i ] );
 				}
  
  			
  folder.open();
			
	var update = function() {
  	requestAnimationFrame(update); 	
  	var isSpeaking = false;	
    var time = Date.now() * 0.05;
    var value = 0.5 * Math.sin( 0.5 * time ) + 0.3;
   	mesh.morphTargetInfluences[ 6 ] = params.MBP = value; // CHANGED
  };
  
    update();
   		

		
	
// 	 	var gui = new dat.GUI();
// 
// 	    mixer = new THREE.AnimationMixer( shape );
// 	    //actions = {}
// 
//         var mesh = shape.getObjectByName( 'Suzanne' );
// 		var expressions = Object.keys( mesh.morphTargetDictionary );
// 		var morphs = gui.addFolder( 'Expressions' );
// 			for ( var i = 0; i < expressions.length; i ++ ) {
// 			
// 					morphs.add( mesh.morphTargetInfluences, i, 0, 1, 0.01 ).name( expressions[ i ] );
// 				}
// 	
// 		     morphs.open();
		} );
}

// function createNinjaHead() {

    var textureLoader = new THREE.TextureLoader();
    var map = textureLoader.load('../test.png');
    var material = new THREE.MeshPhongMaterial({map: map});

    loader = new THREE.OBJLoader();
    loader.load('../ninjaHead_Low.obj', function(object) {
        
        object.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                child.material = material;
                child.position.set(20,5,20);
                child.scale.set(1,1,1);             
                child.castShadow = true;
            }
        } );
        ninjaHead = object;
        scene.add(ninjaHead);
    });
// }

//initialise content
function init() {
   
    scene = new THREE.Scene();
 
    createRenderer();
    createCamera();
    createLight();
    // createNinjaHead();
    createMonkey();
    //createGUI();
   
 
   
    document.body.appendChild(renderer.domElement);
}

//render object and animation 
function render() {
  
    clock = new THREE.Clock();
  	var dt = clock.getDelta();

   // cameraControl.update();
    
    requestAnimationFrame(render);
   //   var time = Date.now() * 0.003;
//      var value = 0.5 * Math.sin( 0.5 * time ) + 0.3;
// 
//     mesh.morphTargetInfluences[ 0 ] = params.O = value;  
		
    renderer.render(scene, camera);
}

init();
render();
//update();
