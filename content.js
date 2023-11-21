/* Listen for messages */

console.log('content.js')
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.evt && (msg.evt == "dom")) {
        var v = msg.data;
        const d = new DOMParser().parseFromString(v, 'text/html');
        const arr = [];
        var els = d.querySelectorAll('*');
        for (var i = 0; i < els.length; i++) {
            arr.push({type: els[i].tagName, id: els[i].id, class: els[i].className, text: els[i].innerText});
        }
        sendResponse({ result: arr });
    }
});