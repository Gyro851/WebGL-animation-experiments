

var main = {
  scene: null,
  camera: null,
  renderer: null,
  container: null,
  controls: null,
  clock: null,

  init: () => {
    // Create main scene
    main.scene = new THREE.Scene();
    main.scene.fog = new THREE.FogExp2(0xffffff, 0.0003);

    var SCREEN_WIDTH = window.innerWidth,
      SCREEN_HEIGHT = window.innerHeight;

    // Prepare perspective camera
    var VIEW_ANGLE = 45,
      ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
      NEAR = 1,
      FAR = 1000;
    main.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    main.scene.add(main.camera);
    main.camera.position.set(100, 20, 100);
    main.camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Prepare webgl renderer
    main.renderer = new THREE.WebGLRenderer({ antialias: true });
    main.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    main.renderer.setClearColor(main.scene.fog.color);
    // main.renderer.setClearColorHex( 0xffffff, 1 );

    // Prepare container
    main.container = document.createElement("div");
    document.body.appendChild(main.container);
    main.container.appendChild(main.renderer.domElement);

    // Events
    // THREEx.WindowResize(main.renderer, main.camera);

    // Prepare Orbit controls
    main.controls = new THREE.OrbitControls(main.camera);
    main.controls.target = new THREE.Vector3(0, 0, 0);
    main.controls.maxDistance = 150;

    // Prepare clock
    main.clock = new THREE.Clock();

    // Add lights
    main.scene.add(new THREE.AmbientLight(0xffffff));

    // Load Dae model
    main.loadDaeModel();
  },
  
  loadDaeModel: () => {
    // Prepare ColladaLoader
    var daeLoader = new THREE.ColladaLoader();
    daeLoader.options.convertUpAxis = true;
    daeLoader.load("models/monster.dae", function (collada) {
      var modelMesh = collada.scene;
      // Prepare and play animation
      modelMesh.traverse(function (child) {
        if (child instanceof THREE.SkinnedMesh) {
          var animation = new THREE.Animation(child, child.geometry.animation);
          animation.play();
        }
      });
      // Set position and scale
      var scale = 0.023;
      modelMesh.position.set(0, -10, 0);
      modelMesh.scale.set(scale, scale, scale);

      // Add the mesh into scene
      main.scene.add(modelMesh);
    });
  },
};

/**
 * Pause button listener
 */
document.addEventListener('click', function (event) {
	if (!event.target.matches('.btn')) return;
  event.preventDefault();
  window.paused = !window.paused;
}, false);

window.paused = false;

/**
 * Change animation frame each "tick"
 */
let tick = () => {
  if (!window.paused) {
    requestAnimationFrame(tick);
    render();
    update();
  } else {
    setTimeout(tick, 100);
  }
  
}

let update = () => {
  var delta = main.clock.getDelta();
  main.controls.update(delta);
  THREE.AnimationHandler.update(delta);
}

// Render the scene
let render = () => {
  if (main.renderer) {
    main.renderer.render(main.scene, main.camera);
  }
}

// Initialize lesson on page load
let initializeLesson = () => {
  main.init();
  tick();
}

if (window.addEventListener)
  window.addEventListener("load", initializeLesson, false);
else if (window.attachEvent) window.attachEvent("onload", initializeLesson);
else window.onload = initializeLesson;
