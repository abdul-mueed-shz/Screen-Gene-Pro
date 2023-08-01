if (typeof clickTracker !== "function") {
  chrome.storage.local.get(null, (result) => {
    if (!result.rec) {
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
    }
  });
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

  const getCurrentTime = async () => {
    const res = await chrome.storage.local.get(["recordStartTime"]);
    const recordStartTimeString = res.recordStartTime;
    const storedDatetime = new Date(recordStartTimeString);
    let currentTime = new Date();

    const timeDifferenceMillis =
      currentTime.getTime() - storedDatetime.getTime();

    const secondsTillDatetime = timeDifferenceMillis / 1000;

    return secondsTillDatetime.toFixed(2);
  };
  const getWindowToScreenCoordinates = async (event) => {
    let screenX = event.screenX;
    let screenY = event.screenY;

    let windowX = event.clientX;
    let windowY = event.clientY;

    return { screenX, screenY, windowX, windowY };
  };
  // Define the debounce function
  function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  // Your original scroll event handler
  const handleScroll = (event) => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;
    chrome.storage?.local.get(["trackingData"]).then((res) => {
      getCurrentTime().then((time) => {
        const clickData = {
          type: event.type,
          time,
          url: window.location.href,
          scrollCoordinates: {
            top: scrollTop,
            left: scrollLeft,
          },
        };
        storeTrackingInfo(res, clickData);
      });
    });
  };

  // Debounce the scroll event handler to be called after 500 milliseconds of scroll inactivity
  const debouncedScrollHandler = debounce(handleScroll, 500);

  const clickTracker = async (event) => {
    const { windowX, windowY } = await getWindowToScreenCoordinates(event);
    const time = await getCurrentTime();
    const clickData = {
      type: event.type,
      Coordinates: {
        x: windowX,
        y: windowY,
      },
      time,
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
  window.onload = async function (event) {
    chrome.storage?.local.get(["trackingData"]).then((res) => {
      getCurrentTime().then((time) => {
        const clickData = {
          type: event.type,
          time,
          url: window.location.href,
        };
        storeTrackingInfo(res, clickData);
      });
    });
  };
  window.addEventListener("scroll", debouncedScrollHandler);
}
