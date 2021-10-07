//* THREEJS WORLD SETUP *//
let currentVrm;

// renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// camera
const orbitCamera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
orbitCamera.position.set(0.0, 1.0, 2.0);

// controls
const orbitControls = new THREE.OrbitControls(orbitCamera, renderer.domElement);
orbitControls.screenSpacePanning = true;
orbitControls.target.set(0.0, 1.0, 0.0);
orbitControls.update();

// scene
const scene = new THREE.Scene();

// light
const light = new THREE.DirectionalLight(0xffffff);
light.position.set(1.0, 1.0, 1.0).normalize();
// helpers
const gridHelper = new THREE.GridHelper(10, 10);
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper,gridHelper,light);

// Main Render Loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  if (currentVrm) {
    //keep model physics up to date
    currentVrm.update(clock.getDelta());
  }
  renderer.render(scene, orbitCamera);
}
animate();

//* VRM CHARACTER SETUP *//

// Import Character VRM
const loader = new THREE.GLTFLoader();
loader.crossOrigin = "anonymous";
loader.load(
  "https://cdn.glitch.me/da3ef98f-b816-4270-a371-6d7912e2a554%2F9e943a97-44ea-4946-bbfb-32d13f509880_AliciaSolid.vrm?v=1633366694935",

  gltf => {
    THREE.VRMUtils.removeUnnecessaryJoints(gltf.scene);

    THREE.VRM.from(gltf).then(vrm => {
      scene.add(vrm.scene);
      currentVrm = vrm;
      currentVrm.scene.rotation.y = Math.PI; //rotate model 180deg to face camera
    });
  },

  progress =>
    console.log(
      "Loading model...",
      100.0 * (progress.loaded / progress.total),
      "%"
    ),

  error => console.error(error)
);



const rigRotation = (name, rotation={x:0,y:0,z:0}, dampener=1) => {
  if (!currentVrm) {
    //return early if character not loaded
    return;
  }
  const Part = currentVrm.humanoid.getBoneNode(
    THREE.VRMSchema.HumanoidBoneName[name]
  );
  if (!Part) {
    //return early if part doesn't exist
    return;
  }

  let euler = new THREE.Euler(rotation.x*dampener, rotation.y*dampener, rotation.z*dampener);
  let quaternion = new THREE.Quaternion().setFromEuler(euler);
  Part.quaternion.slerp(quaternion,0.3) //interpolation easing
};

const rigCharacter = (vrm, results) => {
  if (!vrm) {
    return;
  }
  
  const faceLandmarks = results.faceLandmarks
  const pose3DLandmarks = results.ea
  const poseLandmarks = results.poseLandmarks
  const leftHandLandmarks = results.leftHandLandmarks 
  const rightHandLandmarks = results.rightHandLandmarks
  
  if(poseLandmarks && pose3DLandmarks){
    let riggedPose = Kalidokit.Pose.solve(pose3DLandmarks,poseLandmarks,{runtime:'mediapipe'})
    // console.log(riggedPose)
    rigRotation("Hips", riggedPose.Hips.rotation, .7);
    rigRotation("Chest", riggedPose.Spine, .2);
    rigRotation("Spine", riggedPose.Spine, .2);
    
    rigRotation("RightUpperArm", riggedPose.RightUpperArm);
    rigRotation("RightLowerArm", riggedPose.RightLowerArm);
    rigRotation("LeftUpperArm", riggedPose.LeftUpperArm);
    rigRotation("LeftLowerArm", riggedPose.LeftLowerArm);
    rigRotation("RightHand", riggedPose.RightHand);
    rigRotation("LeftHand", riggedPose.LeftHand);
    
    rigRotation("LeftUpperLeg", riggedPose.LeftUpperLeg);
    rigRotation("LeftLowerLeg", riggedPose.LeftLowerLeg);
    rigRotation("RightUpperLeg", riggedPose.RightUpperLeg);
    rigRotation("RightLowerLeg", riggedPose.RightLowerLeg);


  }

  //unsure if NECK_01 or HEAD_01
  // rigRotation("Neck", rotations);

  //unsure of order Spine order
  // rigRotation("UpperChest", "SPINE_03", rotations);
  // rigRotation("Chest", "SPINE_02", rotations);
  // rigRotation("Spine", "SPINE_01", rotations);

  // rigRotation("Hips", "PELVIS", rotations);

  // unsure if shoulder joints need to be updated
  //         rigRotation("RightShoulder", "UPPERARM_L", rotations);


  //         rigRotation("LeftShoulder", "UPPERARM_L", rotations);
 

  // rigRotation("LeftUpperLeg", "THIGH_L", rotations);
  // rigRotation("LeftLowerLeg", "CALF_L", rotations);
  // rigRotation("LeftFoot", "UPPERARM_L", rotations);
  // rigRotation("LeftToes", "UPPERARM_L", rotations);

  // rigRotation("RightUpperLeg", "THIGH_R", rotations);
  // rigRotation("RightLowerLeg", "CALF_R", rotations);
  // rigRotation("RightFoot", "ANKLE_R", rotations);
  // rigRotation("RightToes", "TOES_01_R", rotations);
};

//* GET ACCESS TO WEBCAM *//
let Stream,
  checkStream,
  videoObj = document.querySelector(".input_video");

const getStream = () => {
  const constraints = {
    video: {
      facingMode: "user",
      width: { min: 480, ideal: 640, max: 640 },
      height: { min: 480, ideal: 480, max: 640 }
    },
    audio: false
  };

  // Get access to the camera!
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    if (!Stream || Stream.active === false) {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          handleStream(stream);
        })
        .catch(err => {
          // alert('Please allow camera for facial tracking.');
          setTimeout(() => {}, 1000);
        });
    }
  }
};

const handleStream = stream => {
  videoObj.srcObject = stream;

  checkStream = setInterval(() => {
    if (videoObj.readyState >= 3) {
      videoObj.play();
      videoObj.width = videoObj.videoWidth;
      videoObj.height = videoObj.videoHeight;
      //stop checking every half second
      predict();
      clearInterval(checkStream);
    }
  }, 500);
};

getStream();

//* SETUP MEDIAPIPE HOLISTIC *//
let holistic;
async function initHolistic() {
  holistic = new Holistic({
    locateFile: file => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.4.1632785079/${file}`;
    }
  });

  holistic.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
  });
  //holistic has callback function
  holistic.onResults(results => {
    rigCharacter(currentVrm,results);
  });
}
initHolistic()

async function predict() {
  if (holistic && videoObj) {
    await holistic.send({ image: videoObj });
  }
  requestAnimationFrame(predict);
}
