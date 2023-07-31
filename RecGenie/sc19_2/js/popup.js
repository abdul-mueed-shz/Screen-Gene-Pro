let mainStream,
  timeout,
  minimumTimePassed,
  audioStream,
  language,
  tabRecordingTempStream,
  isNotAborted,
  timeout1,
  timeout2,
  ltimeout,
  stopTime,
  startTime,
  blob,
  videoElement,
  cinterval,
  recordedChunks = [],
  allAutoStopped = [];
var loaderimg = document.getElementById("loaderimg");
loaderimg.style.top = window.innerHeight / 2 + 20 + "px";
var loaderParentDiv = document.getElementById("loaderParentDiv");
function offScreen() {
  loaderParentDiv.style.display = "none";
}
function onScreen() {
  loaderParentDiv.style.display = "flex";
}
const checkLogin = () => {
  chrome.tabs.query({ currentWindow: !0 }, function (e) {
    const t = e.filter((e) => "devauth.demobites.com" === e.url.split("/")[2]);
    t[0]
      ? chrome.tabs.update(t[0].id, { active: !0, url: t[0].url })
      : chrome.tabs.create({ active: !0, url: "https://dev.demobites.com" });
  });
};
var loginBtn = document.getElementById("check_login"),
  loginBtn2 = document.getElementById("check_login2");
(loginBtn.onclick = checkLogin), (loginBtn2.onclick = checkLogin);
const checkUserAuthentication = () => {
  getCookie("u_k_stt", (e) => {
    null === e &&
      chrome.tabs.query({ currentWindow: !0 }, function (e) {
        const t = e.filter(
          (e) => "devauth.demobites.com" === e.url.split("/")[2]
        );
        t[0]
          ? chrome.tabs.update(t[0].id, { active: !1, url: t[0].url })
          : chrome.tabs.create({
              active: !1,
              url: "https://dev.demobites.com",
            });
      }),
      navigator.mediaDevices.enumerateDevices().then((t) => {
        let o = t.filter((e) => e.deviceId && "audioinput" == e.kind),
          n = { sessionId: e, devices: o };
        if (n.sessionId && n.sessionId.value) {
          if ((displayScreen("app"), n.devices.length > 0)) {
            let e = n.devices.filter((e) => "default" == e.deviceId),
              t = n.devices.filter((e) => "default" != e.deviceId);
            e.length > 0 &&
              ($("#audio-option").html(""),
              e.forEach((e) => {
                $("#audio-option").append(
                  `<option value="${e.deviceId}">${e.label}</option>`
                );
              }),
              $("#audio-option").append(
                '<option value="system">System sound</option>'
              ),
              $("#audio-option").append(
                '<option value="mute">No sound</option>'
              ),
              $("#audio-option").val(e[0].deviceId),
              $("#language-option").removeAttr("disabled")),
              t.forEach((e) => {
                $("#audio-option").append(
                  `<option value="${e.deviceId}">${e.label}</option>`
                );
              });
          } else
            $("#audio-option").append(
              '<option value="microphone">Microphone</option>'
            );
          fixForMacSecondaryMonitorDisplay();
        } else displayScreen("not-loggedin");
      });
  });
};
function checkUrItem() {
  var e = localStorage.getItem("url");
  if ("" != e || null != e) {
    var t = document.getElementById("start"),
      o = document.getElementById("upload"),
      n = document.getElementById("cancel"),
      i = document.getElementById("main-audio"),
      a = document.getElementById("note-pera");
    (videoElement = document.getElementById("videoElement")),
      (videoElement.src = ""),
      localStorage.setItem("url", null),
      (n.style.display = "none"),
      (t.style.display = "block"),
      (o.style.display = "none"),
      (videoElement.style.display = "none"),
      (i.style.display = "block"),
      (a.style.display = "block");
  } else {
    (t = document.getElementById("start")),
      (o = document.getElementById("upload")),
      (n = document.getElementById("cancel"));
    var d = document.getElementById("videoElement");
    i = document.getElementById("main-audio");
    ((a = document.getElementById("note-pera")).style.display = "none"),
      (i.style.display = "none"),
      (n.style.display = "block"),
      (t.style.display = "none"),
      (o.style.display = "block"),
      (d.style.display = "block");
  }
}
const getCookie = (e, t) => {
  chrome.cookies.get({ url: "https://dev.demobites.com", name: e }, (e) => {
    t(e);
  });
};
chrome.runtime.onMessage.addListener(async (e, t, o) => {
  "recording" == e.msg &&
    (mainStream ? stopRecording() : await chrome.storage.local.remove(["rec"]));
});
const postVideoIntoS3Bucket = (e, t, o, n) => {
    $.ajax({
      url: e,
      type: "POST",
      data: o,
      contentType: !1,
      processData: !1,
      success: function (e) {
        offScreen(),
          e &&
            chrome.storage.local.get(["windowId"]).then((e) => {
              let t = e.windowId;
              chrome.tabs.get(t, (e) => {
                chrome.tabs.update(t, { url: e.url });
              });
            });
      },
      error: function () {
        let e = window.location.href.split("?uuid=")[1];
        e &&
          e == req.uuid &&
          $("#msg")
            .text(
              "We can't process your video right now please try another video"
            )
            .css({ color: "red" });
      },
    });
  },
  generateForm = (e, t) => {
    let o = new File([e], "myvideo", {
        type: "video/webm",
        lastModified: Date.now(),
      }),
      n = new FormData();
    return (
      n.append("key", t.uuid),
      n.append("acl", "public-read"),
      n.append("X-Amz-Credential", t["x-amz-credential"]),
      n.append("X-Amz-Date", t.iso_date),
      n.append("X-Amz-Algorithm", "AWS4-HMAC-SHA256"),
      n.append("Policy", t.policy),
      n.append("X-Amz-Signature", t["x-amz-Signature"]),
      n.append("success_action_redirect", t.success_url),
      n.append("file", o),
      n
    );
  };
async function getS3Info(e) {
  return await $.ajax({
    type: "post",
    url: "https://dev.demobites.com/upload_ce.php",
    data: { language: e || "mute or system" },
  });
}
const uploadVideo = (e, t, o) => {
    getS3Info(o)
      .then((o) => {
        if (o && o.bucket) {
          let t = generateForm(e, o),
            a = `http://${o.bucket}.s3.amazonaws.com/`;
          o.success_url;
          (n = a),
            (i = t),
            $.ajax({
              url: n,
              type: "POST",
              data: i,
              contentType: !1,
              processData: !1,
              success: function (e) {
                offScreen(),
                  e &&
                    chrome.storage.local.get(["windowId"]).then((e) => {
                      let t = e.windowId;
                      chrome.tabs.get(t, (e) => {
                        chrome.tabs.update(t, { url: e.url });
                      });
                    });
              },
              error: function () {
                let e = window.location.href.split("?uuid=")[1];
                e &&
                  e == req.uuid &&
                  $("#msg")
                    .text(
                      "We can't process your video right now please try another video"
                    )
                    .css({ color: "red" });
              },
            });
        } else chrome.runtime.sendMessage({ msg: "uploading-failed", uuid: t });
        var n, i;
      })
      .catch((e) => {
        e &&
          setTimeout(function () {
            chrome.runtime.sendMessage({ msg: "uploading-failed", uuid: t });
          }, 1e3);
      });
  },
  removeVideoFromArray = (e) => {
    allAutoStopped = allAutoStopped.filter((t) => t.uuid != e);
  },
  checkTokenBeforUploadS3 = () => {
    getCookie("u_k_stt", (e) => {
      null === e
        ? chrome.tabs.query({ currentWindow: !0 }, function (e) {
            if (
              e.filter(
                (e) => "devauth.demobites.com" === e.url.split("/")[2]
              )[0]
            ) {
              const e = setInterval(() => {
                getCookie("u_k_stt", (t) => {
                  t &&
                    (chrome.storage.local.get(["windowId"]).then((e) => {
                      let t = e.windowId;
                      chrome.tabs.get(t, (e) => {
                        chrome.tabs.update(t, { active: !0 });
                      });
                    }),
                    clearInterval(e));
                });
              }, 100);
            } else {
              const e = setInterval(() => {
                getCookie("u_k_stt", (t) => {
                  t &&
                    (chrome.storage.local.get(["windowId"]).then((e) => {
                      let t = e.windowId;
                      chrome.tabs.get(t, (e) => {
                        chrome.tabs.update(t, { active: !0 });
                      });
                    }),
                    clearInterval(e));
                });
              }, 100);
            }
          })
        : (onScreen(),
          checkUrItem(),
          chrome.storage.local.get(["uuid"]).then((e) => {
            let t = e.uuid;
            if (t) {
              let e = allAutoStopped.filter((e) => e.uuid == t);
              e &&
                e[0] &&
                (uploadVideo(e[0].blob, e[0].uuid, e[0].language),
                removeVideoFromArray(t));
            }
          }));
    });
  };
document.getElementById("upload").addEventListener("click", () => {
  chrome.tabs.query({ currentWindow: !0 }, function (e) {
    const t = e.filter((e) => "devauth.demobites.com" === e.url.split("/")[2]);
    t[0]
      ? chrome.tabs.update(t[0].id, { active: !0, url: t[0].url }).then(() => {
          setTimeout(() => {
            checkTokenBeforUploadS3();
          }, 1e3);
        })
      : chrome.tabs
          .create({ active: !0, url: "https://dev.demobites.com" })
          .then(() => {
            setTimeout(() => {
              checkTokenBeforUploadS3();
            }, 1e3);
          });
  });
}),
  document.getElementById("cancel").addEventListener("click", () => {
    chrome.storage.local.get(["uuid"]).then((e) => {
      let t = e.uuid;
      t &&
        (removeVideoFromArray(t),
        (videoElement = document.getElementById("videoElement")),
        (videoElement.src = ""),
        localStorage.setItem("url", null),
        checkUrItem(),
        (tabRecordingTempStream = null));
    });
  }),
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("stop").addEventListener("click", stopRecording);
    Plyr.setup(".js-player", {
      controls: [
        "play-large",
        "restart",
        "rewind",
        "play",
        "fast-forward",
        "progress",
        "progressbar",
        "current-time",
        "duration",
        "mute",
        "volume",
        "captions",
        "settings",
        "fullscreen",
      ],
    });
    var e = document.querySelector(".js-player"),
      t = document.querySelector(".overlay");
    e.append(t);
  });
const displayScreen = (e) => {
  $(".view").hide(), $(`.view[view='${e}']`).show();
};
$(document).on("click", "#start", function () {
  chrome.tabs.query({ currentWindow: !0 }, function (e) {
    const t = e.filter(
      (e) =>
        "devauth.demobites.com" === e.url.split("/")[2] ||
        "dev.demobites.com" === e.url.split("/")[2]
    );
    t[0]
      ? chrome.tabs.update(t[0].id, { url: t[0].url })
      : chrome.tabs.create({ active: !1, url: "https://dev.demobites.com" });
  }),
    onScreen(),
    setTimeout(() => {
      offScreen(),
        getCookie("u_k_stt", (e) => {
          if (e) {
            let e = $("#audio-option").val(),
              t = $(".screen-option-active").attr("value"),
              o = $("#language-option").val();
            if (((o = o), (isNotAborted = !1), "mute" != e && "system" != e)) {
              navigator.mediaDevices
                .getUserMedia({
                  audio: {
                    deviceId: e,
                    echoCancellation: !0,
                    noiseSuppression: !0,
                    sampleRate: 44100,
                    channelCount: 2,
                  },
                })
                .then((o) => {
                  (audioStream = o), getUserMediaVideoMic(e, t);
                })
                .catch((e) => {
                  window.alert("Error occured while acceing your microphone");
                });
            } else getUserMediaVideoSystemMute(e, t);
          } else
            chrome.tabs.query({ currentWindow: !0 }, function (e) {
              if (
                e.filter(
                  (e) =>
                    "devauth.demobites.com" === e.url.split("/")[2] ||
                    "dev.demobites.com" === e.url.split("/")[2]
                )[0]
              ) {
                const e = setInterval(() => {
                  getCookie("u_k_stt", (t) => {
                    t &&
                      (chrome.storage.local.get(["windowId"]).then((e) => {
                        let t = e.windowId;
                        chrome.tabs.get(t, (e) => {
                          chrome.tabs.update(t, { active: !0 });
                        });
                      }),
                      clearInterval(e));
                  });
                }, 100);
              } else {
                const e = setInterval(() => {
                  getCookie("u_k_stt", (t) => {
                    t &&
                      (chrome.storage.local.get(["windowId"]).then((e) => {
                        let t = e.windowId;
                        chrome.tabs.get(t, (e) => {
                          chrome.tabs.update(t, { active: !0 });
                        });
                      }),
                      clearInterval(e));
                  });
                }, 100);
              }
            }),
              chrome.storage.local.get(["windowId"]).then((e) => {
                let t = e.windowId;
                chrome.tabs.get(t, (e) => {
                  chrome.tabs.update(t, { url: e.url });
                });
              });
        });
    }, 1e3);
});
const getUserMediaVideoSystemMute = (e, t) => {
    "mute" == e || "system" != e
      ? chrome.desktopCapture.chooseDesktopMedia(["tab"], (e) => {
          let t = {
            audio: !1,
            video: {
              optional: [],
              mandatory: {
                chromeMediaSource: "desktop",
                chromeMediaSourceId: e,
                maxWidth: 1920,
                maxHeight: 1080,
                maxFrameRate: 60,
              },
            },
          };
          onScreen(),
            setTimeout(() => {
              offScreen();
            }, 1e3),
            setTimeout(() => {
              navigator.mediaDevices
                .getUserMedia(t)
                .then(function (e) {
                  recordTheStream(e, "window or desktop");
                })
                .catch(function (e) {
                  var t = document.getElementById("start"),
                    o = document.getElementById("stop");
                  (document.getElementById("main-audio").style.display =
                    "block"),
                    (t.style.display = "block"),
                    (o.style.display = "none");
                });
            }, 1e3);
        })
      : chrome.desktopCapture.chooseDesktopMedia(["tab", "audio"], (e) => {
          let t = {
            audio: {
              mandatory: {
                chromeMediaSource: "desktop",
                chromeMediaSourceId: e,
              },
            },
            video: {
              optional: [],
              mandatory: {
                chromeMediaSource: "desktop",
                chromeMediaSourceId: e,
                maxWidth: 1920,
                maxHeight: 1080,
                maxFrameRate: 60,
              },
            },
          };
          onScreen(),
            setTimeout(() => {
              offScreen();
            }, 1e3),
            setTimeout(() => {
              navigator.mediaDevices
                .getUserMedia(t)
                .then(function (e) {
                  recordTheStream(e, "window or desktop");
                })
                .catch(function (e) {
                  var t = document.getElementById("start"),
                    o = document.getElementById("stop");
                  (document.getElementById("main-audio").style.display =
                    "block"),
                    (t.style.display = "block"),
                    (o.style.display = "none");
                });
            }, 1e3);
        });
  },
  getUserMediaVideoMic = (e, t) => {
    chrome.desktopCapture.chooseDesktopMedia(["tab", "audio"], (e) => {
      let t = {
        audio: !1,
        video: {
          optional: [],
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: e,
            maxWidth: 1920,
            maxHeight: 1080,
            maxFrameRate: 60,
          },
        },
      };
      onScreen(),
        setTimeout(() => {
          offScreen();
        }, 1e3),
        setTimeout(() => {
          navigator.mediaDevices
            .getUserMedia(t)
            .then(function (e) {
              recordTheStream(e, "window or desktop");
            })
            .catch(function (e) {
              var t = document.getElementById("start"),
                o = document.getElementById("stop");
              (document.getElementById("main-audio").style.display = "block"),
                (t.style.display = "block"),
                (o.style.display = "none");
            });
        }, 1e3);
    });
  },
  updateBadge = (e, t) => {
    chrome.action.setBadgeBackgroundColor({ color: t }),
      chrome.action.setBadgeText({ text: e });
  },
  removeBadge = () => {
    chrome.action.setBadgeText({ text: "" });
  },
  showLastCountDown = () => {
    let e = 10;
    updateBadge("Rec 10", "red"),
      (cinterval = setInterval(function () {
        e >= 1
          ? ((e -= 1), updateBadge("Rec " + e.toString(), "red"))
          : (removeBadge(), clearTimeout(cinterval));
      }, 1e3));
  },
  getMicrophonePermission = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: !0 })
      .then((e) => {
        location.reload();
      })
      .catch((e) => {
        $("h1").text("Permission Denied!").css({ color: "red" }),
          $("p").html("Please allow the microphone <br>Then refresh the page");
      });
  };
$(document).on("change", "#audio-option", function () {
  let e = $(this).val();
  "microphone" == e
    ? navigator.mediaDevices
        .getUserMedia({ audio: !0 })
        .then((e) => {
          location.reload();
        })
        .catch((e) => {
          $("h1").text("Permission Denied!").css({ color: "red" }),
            $("p").html(
              "Please allow the microphone <br>Then refresh the page"
            );
        })
    : "mute" != e && "system" != e
    ? $("#language-option").removeAttr("disabled").val("English")
    : $("#language-option").attr("disabled", "true").val("");
});

const fixForMacSecondaryMonitorDisplay = () => {
    (window.screenLeft < 0 ||
      window.screenTop < 0 ||
      window.screenLeft > window.screen.width ||
      window.screenTop > window.screen.height) &&
      chrome.runtime.getPlatformInfo(function (e) {
        if ("mac" === e.os) {
          const e = new CSSStyleSheet();
          e.insertRule(
            "\n\t\t\t\t\t@keyframes redraw{\n\t\t\t\t\t\t0%{\n\t\t\t\t\t\t\topacity:1;\n\t\t\t\t\t\t}\n\t\t\t\t\t\t100%{\n\t\t\t\t\t\t\topacity:.99;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t"
          ),
            e.insertRule(
              "\n\t\t\t\t\thtml{\n\t\t\t\t\t\tanimation:redraw 1s linear infinite;\n\t\t\t\t\t}\n\t\t\t\t"
            ),
            (document.adoptedStyleSheets = [...document.adoptedStyleSheets, e]);
        }
      });
  },
  getUniqueId = () => new Date().valueOf(),
  stopRecording = (e) => {
    chrome.storage.local.get(["recordedTabId"]).then((res) => {
      console.log("END");
      if (res.recordedTabId) {
        console.log(res.recordedTabId);
        chrome.tabs.reload(res.recordedTabId);
        chrome.storage.local.remove("recordedTabId");
        chrome.storage.local.remove("trackingData");
        chrome.storage.local.remove("recordStartTime");
      }
      chrome.storage.local.get(null, (result) => {
        console.log("STORAGE CHECK IN CONTENT SCRIPT", result);
      });
    });
    stopTime = new Date().getTime();
    var t = document.getElementById("start"),
      o = document.getElementById("stop");
    (document.getElementById("main-audio").style.display = "block"),
      (t.style.display = "block"),
      (o.style.display = "none"),
      chrome.storage.local.get(["windowId"]).then((e) => {
        let t = e.windowId;
        chrome.tabs.update(t, { active: !0 });
      }),
      chrome.storage.local.get(["currentWindowId"]).then((e) => {
        let t = e.currentWindowId;
        chrome.windows.update(t, { focused: !0 });
      }),
      $("#ss-ext-timer").remove(),
      removeBadge(),
      (audioSource = null),
      mainStream.getAudioTracks().forEach(function (e) {
        e.stop();
      }),
      mainStream.getVideoTracks().forEach(function (e) {
        e.stop();
      }),
      saveBlob(e);
  },
  saveBlob = async (e) => {
    await chrome.storage.local.remove(["rec"]),
      (blob = new Blob(recordedChunks, { type: "video/webm" })),
      (uuid = new Date().valueOf());
    const t = URL.createObjectURL(blob);
    var o = document.getElementById("start"),
      n = document.getElementById("upload"),
      i = document.getElementById("cancel"),
      a = document.getElementById("videoElement"),
      d = document.getElementById("main-audio");
    (document.getElementById("note-pera").style.display = "none"),
      (d.style.display = "none"),
      (a.style.display = "block"),
      (i.style.display = "block"),
      (o.style.display = "none"),
      (n.style.display = "block"),
      (videoElement = document.getElementById("videoElement")),
      (videoElement.src = t),
      chrome.storage.local.set({ uuid: uuid });
    o = document.getElementById("start");
    var r = document.getElementById("stop");
    ((d = document.getElementById("main-audio")).style.display = "none"),
      (o.style.display = "none"),
      (r.style.display = "none");
    var l = stopTime - startTime;
    (videoElement.playbackRate = 15),
      (videoElement.muted = !0),
      videoElement.play();
    var c = document.getElementById("loaderParentDiv"),
      s = document.getElementById("loaderDiv");
    (c.style.display = "flex"),
      (s.style.opacity = "1"),
      setTimeout(() => {
        (videoElement.muted = !1),
          (document.getElementById("loaderDiv").style.opacity = "0.8"),
          offScreen(),
          videoElement.play(),
          (videoElement.playbackRate = 1);
      }, l / 10),
      localStorage.setItem("url", t),
      allAutoStopped.push({ blob: blob, uuid: uuid, language: "English" }),
      (mainStream = null),
      (minimumTimePassed = null),
      clearTimeout(timeout),
      clearInterval(cinterval),
      clearTimeout(ltimeout),
      (language = "");
  },
  appendTimer = async () => {
    chrome.runtime.getPlatformInfo(function (t) {
      "mac" === t.os
        ? setTimeout(async () => {
            const [t] = await chrome.tabs.query({
                active: !0,
                lastFocusedWindow: !0,
              }),
              o = t.url.split("/")[0];
            console.log(o),
              ("chrome-extension:" === o && "chrome:" === o) ||
                (console.log("hello"),
                await chrome.scripting.executeScript({
                  target: { tabId: t.id },
                  files: ["js/content.js"],
                }));
            const currentTime = new Date();
            chrome.storage.local.set({ recordedTabId: t.id });
            chrome.storage.local.set({
              recordStartTime: currentTime.toString(),
            });
          }, 100)
        : setTimeout(async () => {
            !(async function () {
              const [t] = await chrome.tabs.query({
                  active: !0,
                  lastFocusedWindow: !0,
                }),
                o = t.url.split("/")[0];
              console.log(o),
                ("chrome-extension:" === o && "chrome:" === o) ||
                  (console.log("hello"),
                  await chrome.scripting.executeScript({
                    target: { tabId: t.id },
                    files: ["js/content.js"],
                  }));
              chrome.storage.local.set({ recordedTabId: t.id });
              const currentTime = new Date();
              chrome.storage.local.set({
                recordStartTime: currentTime.toString(),
              });
            })();
          }, 100);
    });
  },
  showTimer = () => {
    updateBadge("3", "black"),
      (timeout1 = setTimeout(function () {
        updateBadge("2", "black"),
          (timeout2 = setTimeout(function () {
            updateBadge("1", "black");
          }, 1e3));
      }, 1e3));
  },
  waitForSecond = (e) => new Promise((t) => setTimeout(t, e));
async function recordTheStream(e, t) {
  if (!tabRecordingTempStream && !isNotAborted) {
    const [t] = await chrome.tabs.query({ active: !0, lastFocusedWindow: !0 }),
      i = t.url.split("/")[0];
    console.log(t, i);
    if (
      (updateBadge("Rec", "red"), "chrome-extension:" === i || "chrome:" === i)
    ) {
      var o = document.getElementById("start"),
        n = document.getElementById("stop");
      (document.getElementById("main-audio").style.display = "none"),
        (o.style.display = "none"),
        (n.style.display = "block"),
        (tabRecordingTempStream = e),
        (isNotAborted = !0),
        await waitForSecond(1e3);
    } else
      appendTimer(),
        (tabRecordingTempStream = e),
        (isNotAborted = !0),
        setTimeout(() => {
          var e = document.getElementById("start"),
            t = document.getElementById("stop");
          (document.getElementById("main-audio").style.display = "none"),
            (e.style.display = "none"),
            (t.style.display = "block");
        }, 5e3),
        await waitForSecond(5e3);
    chrome.storage.local.set({ rec: !0 }),
      audioStream && e.addTrack(audioStream.getTracks()[0]),
      (recordedChunks = []);
    let a = new MediaRecorder(e, {
      mimeType: "video/webm;codecs=H264",
      videoMaximizeFrameRate: !0,
    });
    (a.onstart = () => {
      a.requestData(), (mainStream = e), (startTime = new Date().getTime());
    }),
      (a.ondataavailable = (e) => {
        e.data.size > 0 && recordedChunks.push(e.data);
      }),
      (a.onerror = (e) => {
        console.log(e.error);
      }),
      (e.getVideoTracks()[0].onended = stopRecording),
      a.start(100),
      getCookie("ext_min_time", (e) => {
        timeout = setTimeout(function () {
          minimumTimePassed = !0;
        }, parseInt(1e3 * (e || 3)));
      }),
      getCookie("ext_max_time", (e) => {
        let t = e || 60;
        (ltimeout = setTimeout(function () {
          showLastCountDown();
        }, parseInt(1e3 * t) - 10600)),
          (timeout = setTimeout(function () {
            // mainStream && stopRecording("timeout");
          }, parseInt(1e3 * t) + 1600));
      });
  }
}
window.onload = () => {
  fixForMacSecondaryMonitorDisplay(),
    $(".logo").attr("src", chrome.runtime.getURL("image/logo.png")),
    $("#loading-img").attr("src", chrome.runtime.getURL("image/loading.svg")),
    getCookie("u_k_stt", (e) => {
      null === e &&
        chrome.tabs.query({ currentWindow: !0 }, function (e) {
          const t = e.filter(
            (e) => "devauth.demobites.com" === e.url.split("/")[2]
          );
          t[0]
            ? chrome.tabs.update(t[0].id, { active: !1, url: t[0].url })
            : chrome.tabs.create({
                active: !1,
                url: "https://dev.demobites.com",
              });
        }),
        navigator.mediaDevices.enumerateDevices().then((t) => {
          let o = t.filter((e) => e.deviceId && "audioinput" == e.kind),
            n = { sessionId: e, devices: o };
          if (n.sessionId && n.sessionId.value) {
            if ((displayScreen("app"), n.devices.length > 0)) {
              let e = n.devices.filter((e) => "default" == e.deviceId),
                t = n.devices.filter((e) => "default" != e.deviceId);
              e.length > 0 &&
                ($("#audio-option").html(""),
                e.forEach((e) => {
                  $("#audio-option").append(
                    `<option value="${e.deviceId}">${e.label}</option>`
                  );
                }),
                $("#audio-option").append(
                  '<option value="system">System sound</option>'
                ),
                $("#audio-option").append(
                  '<option value="mute">No sound</option>'
                ),
                $("#audio-option").val(e[0].deviceId),
                $("#language-option").removeAttr("disabled")),
                t.forEach((e) => {
                  $("#audio-option").append(
                    `<option value="${e.deviceId}">${e.label}</option>`
                  );
                });
            } else
              $("#audio-option").append(
                '<option value="microphone">Microphone</option>'
              );
            fixForMacSecondaryMonitorDisplay();
          } else displayScreen("not-loggedin");
        });
    });
};
