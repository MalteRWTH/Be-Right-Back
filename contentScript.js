let canvas;
let ctx;
let stream;
let i = 0;
let videoElement
let test;
let m;

createNewCamera();
function stopCamera() {
  i=1;
}


function changeToWebcam() {
i=0;


  // Check if the browser supports navigator.mediaDevices
if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
  
  // Call enumerateDevices to retrieve the list of devices
  navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
      // Find the non-virtual video input device
      const videoInputDevice = devices.find(function(device) {
        return device.kind === 'videoinput' && !device.label.includes('Virtual');
      });

      if (videoInputDevice) {
        // Get user media stream from the selected video input device
        navigator.mediaDevices.getUserMedia({ 
          video: { 
            deviceId: videoInputDevice.deviceId,
            aspectRatio: 16/9  // Change to desired aspect ratio
          } 
        }).then(function(stream2) {
            // Create a video element
            const videoElement = document.createElement('video');
            videoElement.srcObject = stream2;
            videoElement.autoplay = true;

            
            // Set the canvas size to match the video stream
            videoElement.addEventListener('loadedmetadata', function() {

              canvas.height = videoElement.videoHeight;
              canvas.width = videoElement.videoWidth;

              
              ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
              console.log(ctx);
              
  
              // Draw video frames onto the canvas
              function drawFrame() {
                if (i == 0) {
                  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  
                } else {
  
  
                  // Set the background color
                  ctx.fillStyle = 'blue';
                  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
                  // Set the text properties
                  ctx.font = '80px Arial';
                  ctx.fillStyle = 'white';
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
  
                  // Draw the text
                  ctx.fillText('BRB', canvas.width / 2, canvas.height / 2)- 40;
  
                  ctx.font = '15px Arial';
                  ctx.fillStyle = 'white';
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
  
                  // Draw the additional message below "BRB" text
                  ctx.fillText('Just getting some coffee or taking a bathroom break,', canvas.width / 2, canvas.height / 2 + 40);
                  ctx.fillText('I will be back any second', canvas.width / 2, canvas.height / 2 + 70);
  
  
                  // Convert the canvas to an image
                  const image = new Image();
                  image.src = canvas.toDataURL();
                  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
                  ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // Draw the image
                  
                }
                requestAnimationFrame(drawFrame);
              }
              videoElement.addEventListener('canplay', function() {
                drawFrame();
              });
            });


           

            // Append the video and canvas elements to the document body
            // document.body.appendChild(videoElement);
            // document.body.appendChild(canvas);

            // Start drawing frames on the canvas
            
          })
          .catch(function(err) {
            console.error("Error accessing video stream: " + err);
          });
      } else {
        console.error("No non-virtual video input device found");
      }
    })
    .catch(function(err) {
      console.error("Error enumerating devices: " + err);
    });
} else {
  console.error("enumerateDevices is not supported");
}


  // const enumerateDevicesFn = MediaDevices.prototype.enumerateDevices;
  // MediaDevices.prototype.enumerateDevices = deleteCamera(enumerateDevicesFn)
}

function newCanvas(){
  console.log("new Canvas")
try {
    console.log("defining canvas")
    canvas = document.createElement('canvas');
    canvas.id = "canvasHelper"
    ctx = canvas.getContext('2d');
    
    // fill the canvas with a blue color
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    
    // capture the canvas as a media stream
    stream = canvas.captureStream(60);
    test = 1;
    
    } catch (error) {
        console.log("error"+error)
    }
};



function changeColor() {
  i=1
  // alert("changing Color")
  // ctx.fillStyle = 'blue';
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  // track.requestFrame(); // capture a new frame after color change
}
// function test(){console.log(ctx.fillStyle)};

function createNewCamera(enumerateDevicesFn) {
  return async function() {
    console.log("adding the additional webcam");
    const devices = await enumerateDevicesFn.call(navigator.mediaDevices);
    const virtualDevice = {
      deviceId: "virtual",
      kind: "videoinput",
      label: "Virtual Image Webcam",
      groupId: "virtual-group"
    };
    devices.push(virtualDevice);
    return devices;
  };
}

function changeStream(getUserMediaFn) {
  return async function() {

    const args = arguments;



    if (args.length && args[0].video && args[0].video.deviceId) {
      // alert("inif");
      if (
        
        args[0].video.deviceId === "virtual" ||
        args[0].video.deviceId.exact === "virtual" ||
        args[0].video.deviceId.ideal == "virtual"
      ) {
        console.log("returning stream...");
        console.log(test);
        
        stream = canvas.captureStream(60);
        // const videoTrack = stream.getVideoTracks()[0];
        // const constraints = { aspectRatio: 4/3 }; // Change to desired aspect ratio

        // videoTrack.applyConstraints(constraints)
        return stream;
      }
    }
    console.log("error - failed changing stream")
    const res = await getUserMediaFn.call(navigator.mediaDevices, ...arguments);
    return res;
  };
}

function monkeyPatchMediaDevices() {
  // const constraints = {
  //   video: {
  //     aspectRatio: 4/3 // Change to desired aspect ratio
  //   }
  // };
  // navigator.mediaDevices.getUserMedia(constraints)
  // .then(stream => {
  //   const video = document.querySelector('video');
  //   video.srcObject = stream;
  // })
  // .catch(error => console.error('getUserMedia error:', error));

  const enumerateDevicesFn = MediaDevices.prototype.enumerateDevices;
  MediaDevices.prototype.enumerateDevices = createNewCamera(enumerateDevicesFn);  
  const getUserMediaFn = MediaDevices.prototype.getUserMedia;
  MediaDevices.prototype.getUserMedia = changeStream(getUserMediaFn);

  console.log('VIRTUAL WEBCAM INSTALLED')
}

// monkeyPatchMediaDevices();




chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    alert("wow")
    if(request.greeting == "hello")
      i=1;
    alert("helllo")
  }
);


async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  alert(tab.id)
  return tab.id;
}






