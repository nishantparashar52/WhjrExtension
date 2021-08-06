// Avoid recursive frame insertion...
var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
if (!location.ancestorOrigins.contains(extensionOrigin)) {
    var iframe = document.createElement('iframe');
    iframe.setAttribute('id', 'lenskartiFrame');
    // Must be declared at web_accessible_resources in manifest.json
    iframe.src = chrome.runtime.getURL('manyavarframe.html');

    // Some styles for a fancy sidebar
    iframe.style.cssText = 'position: fixed;right: 0px;top: 9%;display: block;width: 300px;height: 320px;z-index: 100000;' +
                           'border: 1px solid rgb(204, 204, 204);transform: rotateY(0);backface-visibility: hidden;transition: .6s;transform-style: preserve-3d;box-shadow: 0 1px 6px rgba(0,0,0,.3);';
    document.body.appendChild(iframe);
}