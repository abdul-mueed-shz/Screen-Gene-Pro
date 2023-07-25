chrome.action.onClicked.addListener(async (e) => {
  let o,
    t = await chrome.storage.local.get(["rec"]);
  if (t.rec || !0 === t.rec) chrome.runtime.sendMessage({ msg: "recording" });
  else {
    chrome.storage.local.get(["windowId"]).then((e) => {
      var t = e.windowId;
      chrome.tabs.query({ currentWindow: !0 }, function (e) {
        e.map((e) => e.id).includes(t)
          ? chrome.tabs.get(t, (e) => {
              chrome.tabs.update(t, { active: !0 });
            })
          : chrome.tabs
              .create({ url: chrome.runtime.getURL("html/popup.html") })
              .then((e) => {
                (o = e.id),
                  (windowId = e.windowId),
                  console.log(windowId),
                  chrome.storage.local.set({ windowId: o }),
                  chrome.storage.local.set({ currentWindowId: windowId });
              });
      });
    });
    const e = (e, o) => {
        chrome.cookies.get(
          { url: "https://dev.demobites.com", name: e },
          (e) => {
            o(e);
          }
        );
      },
      t = setInterval(() => {
        e("u_k_stt", (e) => {
          e &&
            (chrome.storage.local.get(["windowId"]).then((e) => {
              let o = e.windowId;
              chrome.tabs.get(o, (e) => {
                chrome.tabs.update(o, { active: !0, url: e.url });
              });
            }),
            clearInterval(t));
        });
      }, 100);
  }
});
