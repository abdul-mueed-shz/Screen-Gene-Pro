// This is the service worker script, which executes in its own context
// when the extension is installed or refreshed (or when you access its console).
// It would correspond to the background script in chrome extensions v2.

console.log(
  "This prints to the console of the service worker (background script)"
);
// chrome.scripting.registerContentScripts([
//   {
//     id: "tracker",
//     matches: ["<all_urls>", "http://*/*", "https://*/*"],
//     allFrames: true,
//     js: ["service-worker-utils.js"],
//   },
// ]);

// // Importing and using functionality from external files is also possible.
// // importScripts("service-worker-utils.js");

// // If you want to import a file that is deeper in the file hierarchy of your
// // extension, simply do `importScripts('path/to/file.js')`.
// // The path should be relative to the file `manifest.json`.

// chrome.action.onClicked.addListener(() => {
//   chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       files: ["service-worker-utils.js"],
//     });
//   });
// });

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["service-worker-utils.js"],
    });
  }
});
