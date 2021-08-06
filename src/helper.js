/*global chrome*/
export function getCookies(domain, name, callback) { 
    chrome.cookies.get({"url": domain, "name": name}, function(cookie) { 
        if(callback) { callback(cookie.value); } 
    });
}

export const showNotification = (id, options, callback) => {
    chrome.notifications.create(id, options, function(data) {
        if(callback) { callback(data); }
    });
};