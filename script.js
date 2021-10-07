//Import Helper Functions from Kalidokit
const remap = Kalidokit.Utils.remap;
const clamp = Kalidokit.Utils.clamp;
const lerp = Kalidokit.Vector.lerp;

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
orbitCamera.position.set(0.0, 1.4, 0.7);

// controls
const orbitControls = new THREE.OrbitControls(orbitCamera, renderer.domElement);
orbitControls.screenSpacePanning = true;
orbitControls.target.set(0.0, 1.4, 0.0);
orbitControls.update();

// scene
const scene = new THREE.Scene();

// light
const light = new THREE.DirectionalLight(0xffffff);
light.position.set(1.0, 1.0, 1.0).normalize();
// helpers
const gridHelper = new THREE.GridHelper(10, 10);
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper, gridHelper, light);

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
//import model from URL
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

//Part Rotation Helper function
const rigRotation = (
  name,
  rotation = { x: 0, y: 0, z: 0 },
  dampener = 1,
  lerp = 0.3
) => {
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

  let euler = new THREE.Euler(
    rotation.x * dampener,
    rotation.y * dampener,
    rotation.z * dampener
  );
  let quaternion = new THREE.Quaternion().setFromEuler(euler);
  //interpolate
  Part.quaternion.slerp(quaternion, lerp);
};

//Part Position Helper Function
const rigPosition = (
  name,
  position = { x: 0, y: 0, z: 0 },
  dampener = 1,
  lerp = 0.3
) => {
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
  let vector = new THREE.Vector3(
    position.x * dampener,
    position.y * dampener,
    position.z * dampener
  );
  Part.position.lerp(vector, lerp);
};

//VRM Character Animator
const animateVRM = (vrm, results) => {
  if (!vrm) {
    return;
  }
  //Take the results from Holistic and animate character based on its Face, Pose, and Hand Keypoints.

  //Identify Key Landmarks
  const faceLandmarks = results.faceLandmarks;
  // Pose 3D Landmarks are with respect to Hip distance in meters
  const pose3DLandmarks = results.ea;
  // Pose 2D landmarks are with respect to videoWidth and videoHeight
  const pose2DLandmarks = results.poseLandmarks;
  //Hand landmarks may be reversed
  const leftHandLandmarks = results.rightHandLandmarks;
  const rightHandLandmarks = results.leftHandLandmarks;
  let riggedPose, riggedLeftHand, riggedRightHand, riggedFace;

  //Animate Face
  if (faceLandmarks) {
    riggedFace = Kalidokit.Face.solve(faceLandmarks,{runtime:"mediapipe",smoothBlink:true});
    rigRotation("Neck", riggedFace.head, 0.7);

    // Blendshapes and Preset Name Schema
    const Blendshape = currentVrm.blendShapeProxy;
    const PresetName = THREE.VRMSchema.BlendShapePresetName;

    //handle Wink
    if (riggedFace.eye.l !== riggedFace.eye.r) {
      riggedFace.eye.l = clamp(1 - riggedFace.eye.l, 0, 1);
      riggedFace.eye.r = clamp(1 - riggedFace.eye.r, 0, 1);
      Blendshape.setValue(PresetName.Blink, 0);
      Blendshape.setValue(PresetName.BlinkL, riggedFace.eye.l);
      Blendshape.setValue(PresetName.BlinkR, riggedFace.eye.r);
    } else {
      const stabilizedBlink = clamp(1 - riggedFace.eye.l, 0, 1);
      Blendshape.setValue(PresetName.Blink, stabilizedBlink);
      Blendshape.setValue(PresetName.BlinkL, 0);
      Blendshape.setValue(PresetName.BlinkR, 0);
    }
    
    //lerp and set mouth blendshapes
    Blendshape.setValue(PresetName.I, lerp(riggedFace.mouth.shape.I,Blendshape.getValue(PresetName.I), .5));
    Blendshape.setValue(PresetName.A, lerp(riggedFace.mouth.shape.A,Blendshape.getValue(PresetName.A), .5));
    Blendshape.setValue(PresetName.E, lerp(riggedFace.mouth.shape.E,Blendshape.getValue(PresetName.E), .5));
    Blendshape.setValue(PresetName.O, lerp(riggedFace.mouth.shape.O,Blendshape.getValue(PresetName.O), .5));
    Blendshape.setValue(PresetName.U, lerp(riggedFace.mouth.shape.U,Blendshape.getValue(PresetName.U), .5));

    //PUPILS
    let lookTarget = new THREE.Euler(
      clamp(0.8 * riggedFace.pupil.y, -0.6, 0.6),
      riggedFace.pupil.x,
      0,
      "XYZ"
    );
    currentVrm.lookAt.applyer.lookAt(lookTarget);
  }

  //Animate Pose
  if (pose2DLandmarks && pose3DLandmarks) {
    riggedPose = Kalidokit.Pose.solve(pose3DLandmarks, pose2DLandmarks, {
      runtime: "mediapipe"
    });
    // console.log(riggedPose)
    rigRotation("Hips", riggedPose.Hips.rotation, 0.7);
    rigPosition(
      "Hips",
      {
        x: -riggedPose.Hips.position.x, //reverse direction
        y: riggedPose.Hips.position.y + 1, //add a bit of height
        z: -riggedPose.Hips.position.z // reverse direction
      },
      1,
      0.07
    );

    rigRotation("Chest", riggedPose.Spine, 0.25);
    rigRotation("Spine", riggedPose.Spine, 0.45);

    rigRotation("RightUpperArm", riggedPose.RightUpperArm);
    rigRotation("RightLowerArm", riggedPose.RightLowerArm);
    rigRotation("LeftUpperArm", riggedPose.LeftUpperArm);
    rigRotation("LeftLowerArm", riggedPose.LeftLowerArm);

    rigRotation("LeftUpperLeg", riggedPose.LeftUpperLeg);
    rigRotation("LeftLowerLeg", riggedPose.LeftLowerLeg);
    rigRotation("RightUpperLeg", riggedPose.RightUpperLeg);
    rigRotation("RightLowerLeg", riggedPose.RightLowerLeg);
  }

  //Animate Hands
  if (leftHandLandmarks) {
    riggedLeftHand = Kalidokit.Hand.solve(leftHandLandmarks, "Left");
    rigRotation("LeftHand", {
      //combine pose rotation Z and hand rotation X Y
      z: riggedPose.LeftHand.z,
      y: riggedLeftHand.LeftWrist.y,
      x: riggedLeftHand.LeftWrist.x
    });
    rigRotation("LeftRingProximal", riggedLeftHand.LeftRingProximal);
    rigRotation("LeftRingIntermediate", riggedLeftHand.LeftRingIntermediate);
    rigRotation("LeftRingDistal", riggedLeftHand.LeftRingDistal);
    rigRotation("LeftIndexProximal", riggedLeftHand.LeftIndexProximal);
    rigRotation("LeftIndexIntermediate", riggedLeftHand.LeftIndexIntermediate);
    rigRotation("LeftIndexDistal", riggedLeftHand.LeftIndexDistal);
    rigRotation("LeftMiddleProximal", riggedLeftHand.LeftMiddleProximal);
    rigRotation("LeftMiddleIntermediate", riggedLeftHand.LeftMiddleIntermediate);
    rigRotation("LeftMiddleDistal", riggedLeftHand.LeftMiddleDistal);
    rigRotation("LeftThumbProximal", riggedLeftHand.LeftThumbProximal);
    rigRotation("LeftThumbIntermediate", riggedLeftHand.LeftThumbIntermediate);
    rigRotation("LeftThumbDistal", riggedLeftHand.LeftThumbDistal);
    rigRotation("LeftLittleProximal", riggedLeftHand.LeftLittleProximal);
    rigRotation("LeftLittleIntermediate", riggedLeftHand.LeftLittleIntermediate);
    rigRotation("LeftLittleDistal", riggedLeftHand.LeftLittleDistal);
  }
  if (rightHandLandmarks) {
    riggedRightHand = Kalidokit.Hand.solve(rightHandLandmarks, "Right");
    rigRotation("RightHand", {
      //combine pose rotation Z and hand rotation X Y
      z: riggedPose.RightHand.z,
      y: riggedRightHand.RightWrist.y,
      x: riggedRightHand.RightWrist.x
    });
    rigRotation("RightRingProximal", riggedRightHand.RightRingProximal);
    rigRotation("RightRingIntermediate", riggedRightHand.RightRingIntermediate);
    rigRotation("RightRingDistal", riggedRightHand.RightRingDistal);
    rigRotation("RightIndexProximal", riggedRightHand.RightIndexProximal);
    rigRotation("RightIndexIntermediate",riggedRightHand.RightIndexIntermediate);
    rigRotation("RightIndexDistal", riggedRightHand.RightIndexDistal);
    rigRotation("RightMiddleProximal", riggedRightHand.RightMiddleProximal);
    rigRotation("RightMiddleIntermediate", riggedRightHand.RightMiddleIntermediate);
    rigRotation("RightMiddleDistal", riggedRightHand.RightMiddleDistal);
    rigRotation("RightThumbProximal", riggedRightHand.RightThumbProximal);
    rigRotation("RightThumbIntermediate", riggedRightHand.RightThumbIntermediate);
    rigRotation("RightThumbDistal", riggedRightHand.RightThumbDistal);
    rigRotation("RightLittleProximal", riggedRightHand.RightLittleProximal);
    rigRotation("RightLittleIntermediate", riggedRightHand.RightLittleIntermediate);
    rigRotation("RightLittleDistal", riggedRightHand.RightLittleDistal);
  }
};

//* GET ACCESS TO WEBCAM *//
let Stream,
  checkStream,
  videoObj = document.querySelector(".input_video"),
  guideCanvas = document.querySelector('canvas.guide'),
  canvasCtx = guideCanvas.getContext('2d');

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

//* SETUP MEDIAPIPE HOLISTIC INSTANCE *//
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
    //draw results
    guideCanvas.width = guideCanvas.videoWidth;
    guideCanvas.height = guideCanvas.videoHeight;
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    //animate model
    animateVRM(currentVrm, results);
    
  });
}
initHolistic();

async function predict() {
  if (holistic && videoObj) {
    await holistic.send({ image: videoObj });
  }
  requestAnimationFrame(predict);
}
