let e = document.createElement("img");
(e.id = "ss-ext-timer"),
  (e.style.textAlign = "center"),
  (e.style.position = "fixed"),
  (e.style.zIndex = "2147483647"),
  (e.style.fontSize = "100px"),
  (e.style.fontWeight = "600"),
  (e.style.color = "red"),
  (e.style.borderRadius = "50%"),
  (e.style.width = "150px"),
  (e.style.height = "150px");
let t = document.createElement("div");
(t.id = "loaderDiv2"),
  (t.style.position = "fixed"),
  (t.style.width = "100vw"),
  (t.style.height = "100vh"),
  (t.style.background = "gray"),
  (t.style.opacity = "0.8"),
  (t.style.zIndex = "2147483646"),
  (t.style.textAlign = "center"),
  (t.style.top = "0"),
  (t.style.left = "0"),
  document.body.prepend(t),
  document.body.prepend(e),
  (e.style.top = (window.innerHeight - 150) / 2 + "px"),
  (e.style.left = (window.innerWidth - 150) / 2 + "px");
let o = 3,
  n = setInterval(() => {
    3 === o
      ? ((document.getElementById("ss-ext-timer").src =
          chrome.runtime.getURL("../image/3.png")),
        (o -= 1))
      : 2 === o
      ? ((document.getElementById("ss-ext-timer").src =
          chrome.runtime.getURL("../image/2.png")),
        (o -= 1))
      : 1 === o
      ? ((document.getElementById("ss-ext-timer").src =
          chrome.runtime.getURL("../image/1.png")),
        (o -= 1))
      : ((document.getElementById("loaderDiv2").style.display = "none"),
        (document.getElementById("ss-ext-timer").style.display = "none"),
        clearInterval(n));
  }, 1e3);

if (typeof clickTracker !== "function") {
  let mousedown = false;

  // Create a new MutationObserver
  var observer = new MutationObserver(function (mutationsList) {
    for (var i = 0; i < mutationsList.length; i++) {
      var mutation = mutationsList[i];

      // Check if a node was added to the DOM
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        // Loop through the added nodes
        for (var j = 0; j < mutation.addedNodes.length; j++) {
          var addedNode = mutation.addedNodes[j];
          // Check if the added node is an iframe
          const iframes = document.querySelectorAll("iframe");

          iframes.forEach((iframe) => {
            const iframeRect = iframe.getBoundingClientRect();
            const iframeX = iframeRect.left;
            const iframeY = iframeRect.top;

            if ((iframeX > 0 || iframeY > 0) && chrome.storage?.local) {
              chrome.storage.local.set({
                iframePosition: JSON.stringify({
                  iframeX: parseInt(iframeX),
                  iframeY: parseInt(iframeY),
                }),
              });
            }
          });
        }
      }
    }
  });

  observer.observe(document, { childList: true, subtree: true });

  const storeTrackingInfo = (result, clickData) => {
    let jsonTrackingData = null;

    if (result.trackingData) {
      const trackingData = JSON.parse(result.trackingData);
      trackingData.push(clickData);
      jsonTrackingData = JSON.stringify(trackingData);
      chrome.storage.local.set({ trackingData: jsonTrackingData }).then(() => {
        const resetTimeOut = setTimeout(() => {
          clickTriggered = false;
          mouseDownTriggered = false;
          clearTimeout(resetTimeOut);
        }, 100);
      });
      console.log(trackingData);
      // alert(jsonTrackingData);
      return;
    }

    jsonTrackingData = JSON.stringify([clickData]);
    chrome.storage.local.set({ trackingData: jsonTrackingData }).then(() => {
      clickTriggered = false;
      mouseDownTriggered = false;
    });
    console.log([clickData]);
    // alert(jsonTrackingData);
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

  const clickTracker = async (event) => {
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
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;
          clickData.iframePosition = {
            ...JSON.parse(res.iframePosition),
            iframeWidth: windowWidth,
            iframeHeight: windowHeight,
          };
        } else {
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
        }
      } catch (error) {
        console.log(error);
      }
    }

    chrome.storage?.local
      .get(["trackingData"])
      .then((res) => storeTrackingInfo(res, clickData))
      .catch((err) => console.log(err));
  };

  document.addEventListener("mousedown", (event) => {
    mousedown = true;
    clickTracker(event);
    const cTimeout = setTimeout(() => {
      mousedown = false;
      clearTimeout(cTimeout);
    }, 100);
  });
  document.addEventListener("click", (event) => {
    if (!mousedown) {
      clickTracker(event);
    }
  });
  window.onload = function () {
    let { currentHour, currentMinute } = getCurrentTime();
    currentMinute =
      currentMinute < 10
        ? (currentMinute = "0" + currentMinute)
        : currentMinute;

    const clickData = {
      type: event.type,
      time: currentHour + ":" + currentMinute,
      url: window.location.href,
    };

    chrome.storage?.local
      .get(["trackingData"])
      .then((res) => storeTrackingInfo(res, clickData));
  };
}

alert("DOCUMENT");
console.log(document);
