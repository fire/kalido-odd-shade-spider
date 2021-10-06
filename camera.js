// Get access to the webcam //
let Stream;
let videoObj = document.querySelector(".input_video");

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

let checkStream;
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

// Mediapipe Holistic //

let config = {
  selfieMode: true,
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: false,
  smoothSegmentation: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
  effect: "background"
};

async function initHolistic() {
  holistic = new Holistic({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.4.1632785079/${file}`;
    // return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
  }});
  // holistic = new Holistic()

  holistic.setOptions($options.holistic.model);
  // console.log(holistic)
  holistic.onResults(onHolisticResults); //holistic has callback function
} 

const pose = new Pose(config);
// console.log(pose);
pose.onResults(results => {
  let kinematicValues = results.kinematicValues;
  if (!kinematicValues) {
    return;
  }
  //start with default values
  let rotationsList = [...DefaultValues];
  //replace default values with new kinematic values by mapping
  gpp_indices.forEach((e, i) => {
    rotationsList[e] = kinematicValues[i];
  });

  rigCharacter(currentVrm, rotationsList);
});

async function predict() {
  await pose.send({ image: videoObj });
  requestAnimationFrame(predict);
}
