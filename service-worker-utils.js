// Create overlay element
let overlay = document.createElement("div");
overlay.id = "overlay";
document.body.appendChild(overlay);

// Apply CSS styles to the overlay
overlay.style.position = "fixed";
overlay.style.top = "0";
overlay.style.left = "0";
overlay.style.width = "100%";
overlay.style.height = "100%";
overlay.style.zIndex = "9999";
overlay.style.background = "rgba(0, 0, 0, 0.01)"; // Set a nearly transparent background

const trackClicks = (event) => {
  let x = event.clientX;
  let y = event.clientY;

  // Do something with the coordinates
  console.log("X: " + x + ", Y: " + y);
};

// Add event listeners to the overlay
overlay.addEventListener("click", trackClicks);
overlay.addEventListener("contextmenu", trackClicks);

// Set the overlay element to be transparent to pointer events
overlay.style.pointerEvents = "none";

// Enable pointer events on child elements of the overlay
const overlayChildren = overlay.querySelectorAll("*");
for (let i = 0; i < overlayChildren.length; i++) {
  overlayChildren[i].style.pointerEvents = "auto";
}

// if (window.self === window.top) {
//   const parentWindowCoords = {
//     rootWindowHeight: window.innerHeight,
//     rootWindowWidth: window.innerWidth,
//   };

//   chrome.storage.local.set({
//     parentWindowCoords: JSON.stringify(parentWindowCoords),
//   });
// } else {
//   const windowHeight = window.innerHeight;
//   const windowWidth = window.innerWidth;

//   if (windowHeight && windowWidth) {
//     chrome.storage.local.get(["parentWindowCoords"]).then((result) => {
//       const parentWindowCoords = JSON.parse(result.parentWindowCoords);

//       const heightRatio = parentWindowCoords.rootWindowHeight / windowHeight;
//       const widthRatio = parentWindowCoords.rootWindowWidth / windowWidth;

//       const mappedHeight = +(windowHeight * heightRatio);
//       const mappedWidth = +(windowWidth * widthRatio);

//       console.log(window.parent);

//       chrome.storage.local.set({
//         coordinatesRatio: JSON.stringify({
//           heightRatio,
//           widthRatio,
//         }),
//       });
//     });
//   }
// }
// const clickTracker = async (event) => {
//   const storeTrackingInfo = (result, clickData) => {
//     let jsonTrackingData = null;
//     if (result.trackingData) {
//       const trackingData = JSON.parse(result.trackingData);
//       trackingData.push(clickData);
//       jsonTrackingData = JSON.stringify(trackingData);
//       chrome.storage.local.set({ trackingData: jsonTrackingData });
//       console.log(window.self === window.top ? "root" : "iframe");
//       console.log(trackingData);
//       alert(jsonTrackingData);
//       return;
//     }
//     jsonTrackingData = JSON.stringify([clickData]);
//     chrome.storage.local.set({ trackingData: jsonTrackingData });
//     console.log(window.self === window.top ? "root" : "iframe");
//     console.log([clickData]);
//     alert(jsonTrackingData);
//   };
//   const getCurrentTime = () => {
//     let currentTime = new Date();
//     let currentHour = currentTime.getHours();
//     let currentMinute = currentTime.getMinutes();
//     return { currentHour, currentMinute };
//   };
//   const getWindowToScreenCoordinates = async (event) => {
//     let screenX = event.screenX;
//     let screenY = event.screenY;

//     let windowX = event.clientX;
//     let windowY = event.clientY;

//     if (window.self === window.top) {
//       return { screenX, screenY, windowX, windowY };
//     } else {
//       // const result = await chrome.storage.local.get(["coordinatesRatio"]);
//       // const coordinatesRatio = JSON.parse(result.coordinatesRatio);
//       // const mappedHeight = Math.trunc(windowY * coordinatesRatio.heightRatio);
//       // const mappedWidth = Math.trunc(windowX * coordinatesRatio.widthRatio);
//       return { screenX, screenY, windowX: screenX, windowY: screenY };
//     }

//     return { screenX, screenY, windowX, windowY };
//   };

//   const { windowX, windowY } = await getWindowToScreenCoordinates(event);
//   let { currentHour, currentMinute } = getCurrentTime();
//   currentMinute =
//     currentMinute < 10 ? (currentMinute = "0" + currentMinute) : currentMinute;

//   const clickData = {
//     type: event.type,
//     Coordinates: {
//       x: windowX,
//       y: windowY,
//     },
//     time: currentHour + ":" + currentMinute,
//   };

//   chrome.storage.local
//     .get(["trackingData"])
//     .then((res) => storeTrackingInfo(res, clickData));
// };

// document.addEventListener("click", clickTracker);
// document.addEventListener("contextmenu", clickTracker);
