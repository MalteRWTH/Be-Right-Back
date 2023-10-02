// Get references to the buttons
var virtualWebcamBtn = document.getElementById("virtual-webcam");
var realWebcamBtn = document.getElementById("real-webcam");

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab.id;
}

// Add event listener to the virtual webcam button
virtualWebcamBtn.addEventListener("click", async function() {
  console.log("stop camera");
  // await the tab id from the async function
  let tabId = await getCurrentTab();


  chrome.scripting.executeScript({

      target: {tabId: tabId, allFrames : true},
      files: ['stopCamera.js'],
      world: chrome.scripting.ExecutionWorld.MAIN

  });

// chrome.scripting.executeScript({
//     target: {tabId: tabId, allFrames: true},
//     func: function() {
//         console.log("hello");
//         try {
//           i=1;

//         } catch (error) {
//           console.log(error);
//         }
//         }
// });

});



// Add event listener to the real webcam button
realWebcamBtn.addEventListener("click", async function() {
  console.log("start camera");
  let tabId = await getCurrentTab();

  chrome.scripting.executeScript({
      target: {tabId: tabId, allFrames : true},
      files: ['change webcam.js'],
      world: chrome.scripting.ExecutionWorld.MAIN
    });

});
