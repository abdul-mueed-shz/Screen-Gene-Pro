function createCircleAtCoordinates(screenX, screenY) {
  let circle = document.createElement("div");
  circle.classList.add("circle");
  circle.style.left = screenX + "px";
  circle.style.top = screenY + "px";

  document.body.appendChild(circle);
}

document.getElementById("read-content").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];

    function printTitle() {
      const trackingData = [];

      document.addEventListener("click", function (event) {
        function getWindowToScreenCoordinates(event) {
          let screenX = event.screenX;
          let screenY = event.screenY;

          let windowX = event.clientX;
          let windowY = event.clientY;

          return { screenX, screenY, windowX, windowY };
        }

        const { screenX, screenY, windowX, windowY } =
          getWindowToScreenCoordinates(event);
        var currentTime = new Date();
        var currentHour = currentTime.getHours();
        var currentMinute = currentTime.getMinutes();

        if (currentMinute < 10) {
          currentMinute = "0" + currentMinute;
        }
        const clickData = {
          type: event.type,
          Coordinates: {
            x: screenX,
            y: screenY,
          },
          time: currentHour + ":" + currentMinute,
        };
        trackingData.push(clickData);
        console.log(trackingData);
        //   createCircleAtCoordinates(windowX, windowY);
      });
      console.log(document);
    }

    chrome.scripting
      .executeScript({
        target: { tabId: tab.id },
        func: printTitle,
        //        files: ['contentScript.js'],  // To call external file instead
      })
      .then((res) => {
        console.log(res);
        console.log("Injected a function!");
      });
  });
});
// chrome.action.onClicked.addListener(async () => {
//   getBodyElement();
//   // Get the current tab
//   const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   // Execute content script to retrieve the body element
//   chrome.scripting.executeScript(
//     {
//       target: { tabId: tab.id },
//       function: getBodyElement,
//     },
//     (result) => {
//       const bodyElement = result[0].result;
//       console.log(bodyElement);
//     }
//   );
// });

// // Content script to retrieve the body element
// function getBodyElement() {
//   return document.body;
// }
// const btn = document.getElementById("check-btn");
// btn.addEventListener("click", async () => {
//   console.log("check");
//   const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   // Execute content script to retrieve the body element
//   chrome.scripting.executeScript(
//     {
//       target: { tabId: tab.id },
//       function: getBodyElement,
//     },
//     (result) => {
//       const bodyElement = result[0].result;
//       console.log(bodyElement);
//     }
//   );
// });
