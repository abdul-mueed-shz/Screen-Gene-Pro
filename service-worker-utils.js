if (typeof clickTracker !== "function") {
  // Loop through the iframe elements
  const iframes = document.querySelectorAll("iframe");
  iframes.forEach((iframe) => {
    const iframeRect = iframe.getBoundingClientRect();
    const iframeX = iframeRect.left;
    const iframeY = iframeRect.top;

    chrome.storage.local.set({
      iframePosition: JSON.stringify({
        iframeX,
        iframeY,
      }),
    });
  });
  const clickTracker = async (event) => {
    const storeTrackingInfo = (result, clickData) => {
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
    };
    const getCurrentTime = () => {
      let currentTime = new Date();
      let currentHour = currentTime.getHours();
      let currentMinute = currentTime.getMinutes();
      return { currentHour, currentMinute };
    };
    const getWindowToScreenCoordinates = async (event) => {
      let screenX = event.screenX;
      let screenY = event.screenY;

      let windowX = event.clientX;
      let windowY = event.clientY;

      return { screenX, screenY, windowX, windowY };
    };

    const { windowX, windowY } = await getWindowToScreenCoordinates(event);
    let { currentHour, currentMinute } = getCurrentTime();
    currentMinute =
      currentMinute < 10
        ? (currentMinute = "0" + currentMinute)
        : currentMinute;

    const clickData = {
      type: event.type,
      Coordinates: {
        x: windowX,
        y: windowY,
      },
      time: currentHour + ":" + currentMinute,
      url: window.location.href,
    };
    if (window.top !== window.self) {
      try {
        const res = await chrome.storage.local.get(["iframePosition"]);
        if (res.iframePosition) {
          console.log("found");
          clickData.iframePosition = JSON.parse(res.iframePosition);
          return;
        }
        console.log("not found");
        const iframes = document.querySelectorAll("iframe");
        iframes.forEach((iframe) => {
          const iframeRect = iframe.getBoundingClientRect();
          const iframeX = iframeRect.left;
          const iframeY = iframeRect.top;

          chrome.storage.local.set({
            iframePosition: JSON.stringify({
              iframeX,
              iframeY,
            }),
          });
        });
      } catch (error) {
        console.log(error);
      }
    }

    chrome.storage?.local
      .get(["trackingData"])
      .then((res) => storeTrackingInfo(res, clickData));
  };

  document.addEventListener("click", clickTracker);
  document.addEventListener("contextmenu", clickTracker);
}
