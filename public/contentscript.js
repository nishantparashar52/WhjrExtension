// Avoid recursive frame insertion...
var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
if (!location.ancestorOrigins.contains(extensionOrigin)) {
    var iframe = document.createElement('iframe');
    iframe.setAttribute('id', 'lenskartiFrame');
    // Must be declared at web_accessible_resources in manifest.json
    iframe.src = chrome.runtime.getURL('frame.html');

    // Some styles for a fancy sidebar
    iframe.style.cssText = 'position: fixed;right: 0px;top: 9%;display: block;width: 300px;height: 320px;z-index: 100000;' +
                           'border: 1px solid rgb(204, 204, 204);transform: rotateY(0);backface-visibility: hidden;transition: .6s;transform-style: preserve-3d;box-shadow: 0 1px 6px rgba(0,0,0,.3);';
    document.body.appendChild(iframe);
//     document.getElementById("theButton").addEventListener("click",
//     function() {
//   window.postMessage({ type: "FROM_PAGE", text: "Hello from the webpage!" }, "*");
// }, false);
}

// function removeIframe() {
//     debugger;
//     console.log(window);
//     document.getElementById('lenskartiFrame').remove();
// }
// var port = chrome.runtime.connect();

// window.addEventListener("message", function(event) {
//   // We only accept messages from ourselves
//   if (event.source != window)
//     return;

//   if (event.data.type && (event.data.type == "FROM_PAGE")) {
//     console.log("Content script received: " + event.data.text);
//     debugger;
//     // port.postMessage(event.data.text);
//   }
// }, false);