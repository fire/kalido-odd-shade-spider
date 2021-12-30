const remap = Kalidokit.Utils.remap;
const clamp = Kalidokit.Utils.clamp;
const lerp = Kalidokit.Vector.lerp;

let currentVrm;

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const orbitCamera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
orbitCamera.position.set(0.0, 1.4, 0.7);

const orbitControls = new THREE.OrbitControls(orbitCamera, renderer.domElement);
orbitControls.screenSpacePanning = true;
orbitControls.target.set(0.0, 1.4, 0.0);
orbitControls.update();

const scene = new THREE.Scene();
const light = new THREE.DirectionalLight(0xffffff);
light.position.set(1.0, 1.0, 1.0).normalize();
scene.add(light);

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  if (currentVrm) {
    currentVrm.update(clock.getDelta());
  }
  renderer.render(scene, orbitCamera);
}
animate();

const loader = new THREE.GLTFLoader();
loader.crossOrigin = "anonymous";
loader.load(
  "ツインテ少女.vrm",
  (gltf) => {
    THREE.VRMUtils.removeUnnecessaryJoints(gltf.scene);

    THREE.VRM.from(gltf).then((vrm) => {
      scene.add(vrm.scene);
      currentVrm = vrm;
      currentVrm.scene.rotation.y = Math.PI; // Rotate model 180deg to face camera
    });
  },

  (progress) =>
    console.log(
      "Loading model...",
      100.0 * (progress.loaded / progress.total),
      "%"
    ),

  (error) => console.error(error)
);

const animateRigRotationHelper = (
  name,
  rotation = { x: 0, y: 0, z: 0 },
  dampener = 1,
  lerpAmount = 0.3
) => {
  if (!currentVrm) {
    return;
  }
  const Part = currentVrm.humanoid.getBoneNode(
    THREE.VRMSchema.HumanoidBoneName[name]
  );
  if (!Part) {
    return;
  }

  let euler = new THREE.Euler(
    rotation.x * dampener,
    rotation.y * dampener,
    rotation.z * dampener
  );
  let quaternion = new THREE.Quaternion().setFromEuler(euler);
  Part.quaternion.slerp(quaternion, lerpAmount); // interpolate
};

const animateRigPositionHelper = (
  name,
  position = { x: 0, y: 0, z: 0 },
  dampener = 1,
  lerpAmount = 0.3
) => {
  if (!currentVrm) {
    return;
  }
  const Part = currentVrm.humanoid.getBoneNode(
    THREE.VRMSchema.HumanoidBoneName[name]
  );
  if (!Part) {
    return;
  }
  let vector = new THREE.Vector3(
    position.x * dampener,
    position.y * dampener,
    position.z * dampener
  );
  Part.position.lerp(vector, lerpAmount);
};

let oldLookTarget = new THREE.Euler();
const rigFace = (riggedFace) => {
  if (!currentVrm) {
    return;
  }
  animateRigRotationHelper("Neck", riggedFace.head, 0.7);

  const Blendshape = currentVrm.blendShapeProxy;
  const PresetName = THREE.VRMSchema.BlendShapePresetName;

  // Simple example without winking. Interpolate based on old blendshape, then stabilize blink with `Kalidokit` helper function.
  // for VRM, 1 is closed, 0 is open.
  riggedFace.eye.l = lerp(
    clamp(1 - riggedFace.eye.l, 0, 1),
    Blendshape.getValue(PresetName.Blink),
    0.5
  );
  riggedFace.eye.r = lerp(
    clamp(1 - riggedFace.eye.r, 0, 1),
    Blendshape.getValue(PresetName.Blink),
    0.5
  );
  riggedFace.eye = Kalidokit.Face.stabilizeBlink(
    riggedFace.eye,
    riggedFace.head.y
  );
  Blendshape.setValue(PresetName.Blink, riggedFace.eye.l);

  // Interpolate and set mouth blendshapes
  Blendshape.setValue(
    PresetName.I,
    lerp(riggedFace.mouth.shape.I, Blendshape.getValue(PresetName.I), 0.5)
  );
  Blendshape.setValue(
    PresetName.A,
    lerp(riggedFace.mouth.shape.A, Blendshape.getValue(PresetName.A), 0.5)
  );
  Blendshape.setValue(
    PresetName.E,
    lerp(riggedFace.mouth.shape.E, Blendshape.getValue(PresetName.E), 0.5)
  );
  Blendshape.setValue(
    PresetName.O,
    lerp(riggedFace.mouth.shape.O, Blendshape.getValue(PresetName.O), 0.5)
  );
  Blendshape.setValue(
    PresetName.U,
    lerp(riggedFace.mouth.shape.U, Blendshape.getValue(PresetName.U), 0.5)
  );

  //interpolate pupil and keep a copy of the value
  let lookTarget = new THREE.Euler(
    lerp(oldLookTarget.x, riggedFace.pupil.y, 0.4),
    lerp(oldLookTarget.y, riggedFace.pupil.x, 0.4),
    0,
    "XYZ"
  );
  oldLookTarget.copy(lookTarget);
  currentVrm.lookAt.applyer.lookAt(lookTarget);
};

/* VRM Character Animator */
const animateVRM = (vrm, results) => {
  if (!vrm) {
    return;
  }
  // Take the results from `Holistic` and animate character based on its Face, Pose, and Hand Keypoints.
  let riggedPose, riggedLeftHand, riggedRightHand, riggedFace;

  const faceLandmarks = results.faceLandmarks;
  // Pose 3D Landmarks are with respect to Hip distance in meters
  const pose3DLandmarks = results.ea;
  // Pose 2D landmarks are with respect to videoWidth and videoHeight
  const pose2DLandmarks = results.poseLandmarks;
  // Be careful, hand landmarks may be reversed
  const leftHandLandmarks = results.rightHandLandmarks;
  const rightHandLandmarks = results.leftHandLandmarks;

  // Animate Face
  if (faceLandmarks) {
    riggedFace = Kalidokit.Face.solve(faceLandmarks, {
      runtime: "mediapipe",
      video: videoElement,
    });
    rigFace(riggedFace);
  }

  // Animate Pose
  var animatePose = pose2DLandmarks && pose3DLandmarks;
  if (animatePose) {
    riggedPose = Kalidokit.Pose.solve(pose3DLandmarks, pose2DLandmarks, {
      runtime: "mediapipe",
      video: videoElement,
    });
    animateRigRotationHelper("Hips", riggedPose.Hips.rotation, 0.7);
    animateRigPositionHelper(
      "Hips",
      {
        x: -riggedPose.Hips.position.x, // Reverse direction
        y: riggedPose.Hips.position.y + 1, // Add a bit of height
        z: -riggedPose.Hips.position.z, // Reverse direction
      },
      1,
      0.07
    );

    animateRigRotationHelper("Chest", riggedPose.Spine, 0.25, 0.3);
    animateRigRotationHelper("Spine", riggedPose.Spine, 0.45, 0.3);

    animateRigRotationHelper("RightUpperArm", riggedPose.RightUpperArm, 1, 0.3);
    animateRigRotationHelper("RightLowerArm", riggedPose.RightLowerArm, 1, 0.3);
    animateRigRotationHelper("LeftUpperArm", riggedPose.LeftUpperArm, 1, 0.3);
    animateRigRotationHelper("LeftLowerArm", riggedPose.LeftLowerArm, 1, 0.3);

    animateRigRotationHelper("LeftUpperLeg", riggedPose.LeftUpperLeg, 1, 0.3);
    animateRigRotationHelper("LeftLowerLeg", riggedPose.LeftLowerLeg, 1, 0.3);
    animateRigRotationHelper("RightUpperLeg", riggedPose.RightUpperLeg, 1, 0.3);
    animateRigRotationHelper("RightLowerLeg", riggedPose.RightLowerLeg, 1, 0.3);
  }

  // Animate Hands
  if (leftHandLandmarks) {
    riggedLeftHand = Kalidokit.Hand.solve(leftHandLandmarks, "Left");
    animateRigRotationHelper("LeftHand", {
      // Combine pose rotation Z and hand rotation X Y
      z: riggedPose.LeftHand.z,
      y: riggedLeftHand.LeftWrist.y,
      x: riggedLeftHand.LeftWrist.x,
    });
    animateRigRotationHelper(
      "LeftRingProximal",
      riggedLeftHand.LeftRingProximal
    );
    animateRigRotationHelper(
      "LeftRingIntermediate",
      riggedLeftHand.LeftRingIntermediate
    );
    animateRigRotationHelper("LeftRingDistal", riggedLeftHand.LeftRingDistal);
    animateRigRotationHelper(
      "LeftIndexProximal",
      riggedLeftHand.LeftIndexProximal
    );
    animateRigRotationHelper(
      "LeftIndexIntermediate",
      riggedLeftHand.LeftIndexIntermediate
    );
    animateRigRotationHelper("LeftIndexDistal", riggedLeftHand.LeftIndexDistal);
    animateRigRotationHelper(
      "LeftMiddleProximal",
      riggedLeftHand.LeftMiddleProximal
    );
    animateRigRotationHelper(
      "LeftMiddleIntermediate",
      riggedLeftHand.LeftMiddleIntermediate
    );
    animateRigRotationHelper(
      "LeftMiddleDistal",
      riggedLeftHand.LeftMiddleDistal
    );
    animateRigRotationHelper(
      "LeftThumbProximal",
      riggedLeftHand.LeftThumbProximal
    );
    animateRigRotationHelper(
      "LeftThumbIntermediate",
      riggedLeftHand.LeftThumbIntermediate
    );
    animateRigRotationHelper("LeftThumbDistal", riggedLeftHand.LeftThumbDistal);
    animateRigRotationHelper(
      "LeftLittleProximal",
      riggedLeftHand.LeftLittleProximal
    );
    animateRigRotationHelper(
      "LeftLittleIntermediate",
      riggedLeftHand.LeftLittleIntermediate
    );
    animateRigRotationHelper(
      "LeftLittleDistal",
      riggedLeftHand.LeftLittleDistal
    );
  }
  if (rightHandLandmarks) {
    riggedRightHand = Kalidokit.Hand.solve(rightHandLandmarks, "Right");
    animateRigRotationHelper("RightHand", {
      // Combine Z axis from pose hand and X/Y axis from hand wrist rotation
      z: riggedPose.RightHand.z,
      y: riggedRightHand.RightWrist.y,
      x: riggedRightHand.RightWrist.x,
    });
    animateRigRotationHelper(
      "RightRingProximal",
      riggedRightHand.RightRingProximal
    );
    animateRigRotationHelper(
      "RightRingIntermediate",
      riggedRightHand.RightRingIntermediate
    );
    animateRigRotationHelper(
      "RightRingDistal",
      riggedRightHand.RightRingDistal
    );
    animateRigRotationHelper(
      "RightIndexProximal",
      riggedRightHand.RightIndexProximal
    );
    animateRigRotationHelper(
      "RightIndexIntermediate",
      riggedRightHand.RightIndexIntermediate
    );
    animateRigRotationHelper(
      "RightIndexDistal",
      riggedRightHand.RightIndexDistal
    );
    animateRigRotationHelper(
      "RightMiddleProximal",
      riggedRightHand.RightMiddleProximal
    );
    animateRigRotationHelper(
      "RightMiddleIntermediate",
      riggedRightHand.RightMiddleIntermediate
    );
    animateRigRotationHelper(
      "RightMiddleDistal",
      riggedRightHand.RightMiddleDistal
    );
    animateRigRotationHelper(
      "RightThumbProximal",
      riggedRightHand.RightThumbProximal
    );
    animateRigRotationHelper(
      "RightThumbIntermediate",
      riggedRightHand.RightThumbIntermediate
    );
    animateRigRotationHelper(
      "RightThumbDistal",
      riggedRightHand.RightThumbDistal
    );
    animateRigRotationHelper(
      "RightLittleProximal",
      riggedRightHand.RightLittleProximal
    );
    animateRigRotationHelper(
      "RightLittleIntermediate",
      riggedRightHand.RightLittleIntermediate
    );
    animateRigRotationHelper(
      "RightLittleDistal",
      riggedRightHand.RightLittleDistal
    );
  }
};

let videoElement = document.querySelector(".input_video"),
  guideCanvas = document.querySelector("canvas.guides");

const onResults = (results) => {
  // Draw landmark guides
  drawResults(results);
  // Animate model
  animateVRM(currentVrm, results);
};

const holistic = new Holistic({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1635989137/${file}`;
  },
});

holistic.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7,
  refineFaceLandmarks: true,
});
// Pass holistic a callback function
holistic.onResults(onResults);

const drawResults = (results) => {
  guideCanvas.width = videoElement.videoWidth;
  guideCanvas.height = videoElement.videoHeight;
  let canvasCtx = guideCanvas.getContext("2d");
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, guideCanvas.width, guideCanvas.height);
  // Use `Mediapipe` drawing functions
  drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
    color: "#00cff7",
    lineWidth: 4,
  });
  drawLandmarks(canvasCtx, results.poseLandmarks, {
    color: "#ff0364",
    lineWidth: 2,
  });
  drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
    color: "#C0C0C070",
    lineWidth: 1,
  });
  if (results.faceLandmarks && results.faceLandmarks.length === 478) {
    //draw pupils
    drawLandmarks(
      canvasCtx,
      [results.faceLandmarks[468], results.faceLandmarks[468 + 5]],
      {
        color: "#ffe603",
        lineWidth: 2,
      }
    );
  }
  drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
    color: "#eb1064",
    lineWidth: 5,
  });
  drawLandmarks(canvasCtx, results.leftHandLandmarks, {
    color: "#00cff7",
    lineWidth: 2,
  });
  drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
    color: "#22c3e3",
    lineWidth: 5,
  });
  drawLandmarks(canvasCtx, results.rightHandLandmarks, {
    color: "#ff0364",
    lineWidth: 2,
  });
};

// Use `Mediapipe` utils to get camera - lower resolution = higher fps
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await holistic.send({ image: videoElement });
  },
  width: 640,
  height: 480,
});
camera.start();
