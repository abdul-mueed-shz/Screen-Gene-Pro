if (typeof clickTracker !== "function") {
  // Listen for messages from the content script
  window.addEventListener("message", function (event) {
    // Check the origin of the message to ensure security

    console.log("Inside POST LISTENER");

    // if (event.origin !== window.location.origin) {
    //   return;
    // }

    // // Check if the message contains click coordinates
    if (event.data.windowX && event.data.windowY) {
      // Calculate the click coordinates relative to the parent window

      console.log(event);
      console.log(event.source.screenLeft);
      console.log(event.source.screenTop);

      const parentX = event.source.screenLeft + event.data.windowX;
      const parentY = event.source.screenTop + event.data.windowY;

      // Do something with the coordinates relative to the parent window
      console.log("Click coordinates (Parent):", parentX, parentY);
    }
  });

  function clickTracker(event) {
    function getWindowToScreenCoordinates(event) {
      let screenX = event.screenX;
      let screenY = event.screenY;

      let windowX = event.clientX;
      let windowY = event.clientY;

      if (window.self === window.top) {
        console.log("Code is running in the top-level window");
      } else {
        console.log("Code is running inside an iframe");
        console.log("Inside Iframe");
        console.log(window.parent.screenLeft);
        console.log(window.frameElement, window.frameElement);
        window.postMessage({ windowX, windowY }, "*");
      }

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

    chrome.storage.local.get(["trackingData"]).then((result) => {
      let jsonTrackingData = null;
      if (result.trackingData) {
        const trackingData = JSON.parse(result.trackingData);
        trackingData.push(clickData);
        jsonTrackingData = JSON.stringify(trackingData);
        chrome.storage.local.set({ trackingData: jsonTrackingData });
        console.log(trackingData);
        alert(jsonTrackingData);
        return;
      }
      jsonTrackingData = JSON.stringify([clickData]);
      chrome.storage.local.set({ trackingData: jsonTrackingData });
      console.log([clickData]);
      alert(jsonTrackingData);
    });
  }
}

document.addEventListener("mousedown", clickTracker);
document.addEventListener("click", clickTracker);
