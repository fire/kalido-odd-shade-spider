// WORLD SETUP //

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
scene.add(light);

// helpers
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// CHARACTER SETUP //

// Import Character VRM
let currentVrm = undefined;
const loader = new THREE.GLTFLoader();
loader.crossOrigin = "anonymous";
loader.load(
  "https://cdn.glitch.me/da3ef98f-b816-4270-a371-6d7912e2a554%2F9e943a97-44ea-4946-bbfb-32d13f509880_AliciaSolid.vrm?v=1633366694935",

  gltf => {
    THREE.VRMUtils.removeUnnecessaryJoints(gltf.scene);

    THREE.VRMDebug.from(gltf).then(vrm => {
      scene.add(vrm.scene);
      currentVrm = vrm;

      //rotate 180deg hips to face camera
      currentVrm.humanoid.getBoneNode(
        THREE.VRMSchema.HumanoidBoneName.Hips
      ).rotation.y = Math.PI;
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

// Rotation Utils
const convert6DToMatrix3 = arr => {
  let a1 = new Vector([arr[0], arr[1], arr[2]]);
  let a2 = new Vector([arr[3], arr[4], arr[5]]);
  //normalize
  a1 = a1.unit();
  a2 = a2.unit();
  //dot product
  let dot = a1.dot(a2);
  //magic
  let b1 = a1.subtract(a2.multiply(dot));
  let b2 = a2.subtract(a1.multiply(dot));
  //normalize
  b1 = b1.unit();
  b2 = b2.unit();
  //more magic
  b1 = b1.add(a1).multiply(0.5);
  b2 = b2.add(a2).multiply(0.5);
  //normalize
  b1 = b1.unit();
  b2 = b2.unit();
  //cross product
  let b3 = b1.cross(b2);
  return [b1, b2, b3];
};

const matrix3ToQuaternion = m3arr => {
  var q = new THREE.Quaternion();
  var m = new THREE.Matrix4();

  m.set(
    m3arr[0].x,
    m3arr[0].y,
    m3arr[0].z,
    1,
    m3arr[1].x,
    m3arr[1].y,
    m3arr[1].z,
    1,
    m3arr[2].x,
    m3arr[2].y,
    m3arr[2].z,
    1,
    0,
    0,
    0,
    1
  );

  q.setFromRotationMatrix(m);
  return q;
};

const rigJoint = (name, jointName, rotations) => {
  //return early if character model not loaded
  if (!currentVrm) {
    return;
  }
  const Part = currentVrm.humanoid.getBoneNode(
    THREE.VRMSchema.HumanoidBoneName[name]
  );
  //return early if model doesn't have part
  if (!Part) {
    return;
  }
  //offset joint index by 3 to skip initial hip indices
  let i = jointMap[jointName] * 6 + 3;
  let rotation6D = [
    rotations[i],
    rotations[i + 2],
    rotations[i + 4],
    rotations[i + 1],
    rotations[i + 3],
    rotations[i + 5]
  ];

  let matrix3 = convert6DToMatrix3(rotation6D);
  let quaternion = matrix3ToQuaternion(matrix3);
  let euler = new THREE.Euler().setFromQuaternion(quaternion);
  //reset to debug default A values
  // euler.x = 0;
  // euler.y = 0;
  // euler.z = 0;

  console.log({
    VRM_name: name,
    GHUM_name: jointName,
    quaternion: quaternion,
    euler: euler
  });

  let invert = name.includes("Left") ? -1 : 1;
  let restingDefaultPart = RestingDefault.Pose[name];
  console.log(RestingDefault.Pose[name],name)

  Part.rotation.x = restingDefaultPart.x + euler.x * invert;
  Part.rotation.y = restingDefaultPart.y + euler.y * invert;
  Part.rotation.z = restingDefaultPart.z + euler.z;

  // Part.quaternion.copy(quaternion);
};

const rigCharacter = (vrm, rotations) => {
  if (!vrm) {
    return;
  }
  // console.log(rotations);
  //rotation array from blazepose ghum

  //unsure if NECK_01 or HEAD_01
  rigJoint("Neck", "NECK_01", rotations);

  //unsure of order Spine order
  // rigJoint("UpperChest", "SPINE_03", rotations);
  // rigJoint("Chest", "SPINE_02", rotations);
  // rigJoint("Spine", "SPINE_01", rotations);

  // rigJoint("Hips", "PELVIS", rotations);

  // unsure if shoulder joints need to be updated
  //         rigJoint("RightShoulder", "UPPERARM_L", rotations);
  rigJoint("RightUpperArm", "UPPERARM_R", rotations);
  rigJoint("RightLowerArm", "LOWERARM_R", rotations);
  rigJoint("RightHand", "HAND_R", rotations);

  //         rigJoint("LeftShoulder", "UPPERARM_L", rotations);
  rigJoint("LeftUpperArm", "UPPERARM_L", rotations);
  rigJoint("LeftLowerArm", "LOWERARM_L", rotations);
  rigJoint("LeftHand", "HAND_L", rotations);

  // rigJoint("LeftUpperLeg", "THIGH_L", rotations);
  // rigJoint("LeftLowerLeg", "CALF_L", rotations);
  // rigJoint("LeftFoot", "UPPERARM_L", rotations);
  // rigJoint("LeftToes", "UPPERARM_L", rotations);

  // rigJoint("RightUpperLeg", "THIGH_R", rotations);
  // rigJoint("RightLowerLeg", "CALF_R", rotations);
  // rigJoint("RightFoot", "ANKLE_R", rotations);
  // rigJoint("RightToes", "TOES_01_R", rotations);
};

// animate function
const clock = new THREE.Clock();

let prevTime = 0;

function animate() {
  requestAnimationFrame(animate);

  const time = performance.now();
  const delta = (time - prevTime) / 1000;

  prevTime = time;

  if (currentVrm) {
    //replace Kvalues with kinematics rotations array from blazepose
    currentVrm.update(clock.getDelta());
  }
  renderer.render(scene, orbitCamera);
}

animate();
