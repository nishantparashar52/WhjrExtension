// import { showNotification } from './../src/helper';
chrome.runtime.onInstalled.addListener(() => {
    console.log('onInstalled...');
    getFlashSale();
    getOrderStatus();
    // getAllTabsUrl();
    // create alarm after extension is installed / upgraded
    chrome.alarms.create('getOrderStatus', {
        periodInMinutes: 1
    });
});

chrome.alarms.onAlarm.addListener((alarm) => {
    getOrderStatus();
});
chrome.tabs.query({
    active: true,
    currentWindow: true
}, function (tabs) {
    var tabURL = tabs.length && tabs[0].url;
    console.log(tabURL);
});
let itemStatus = {};

function getCookies(domain, name, callback) {
    chrome.cookies.get({
        "url": domain,
        "name": name
    }, function (cookie) {
        if (callback) {
            callback(cookie.value);
        }
    });
}

function getOrderStatus() {
    let sessionToken = '';
    getCookies("http://www.lenskart.com", "frontend",
        function (id) {
            sessionToken = id;
            fetch(`https://api.lenskart.com/v3/orders?page=0&page-size=1`, {
                    headers: {
                        'x-api-client': 'desktop',
                        'x-session-token': sessionToken
                    }
                })
                .then(resp => {
                    resp.json().then(res => {
                        const orderData = res.result && res.result.orders;
                        const {
                            items
                        } = orderData[0];
                        const statusUpdated = [];
                        let item;
                        let status;
                        for (let i = 0, len = items.length; i < len; i++) {
                            item = items[i];
                            status = item.status.status.replace('_', ' ');
                            if (itemStatus[item.id] !== status) {
                                statusUpdated.push({
                                    title: `Updated status for item ${item.id}`,
                                    message: `${status}`
                                });
                                itemStatus[item.id] = status;
                            }
                        }
                        if (statusUpdated.length) {
                            options = {
                                type: "list",
                                title: "Your Order Status",
                                message: "Your order has been updated",
                                items: statusUpdated,
                                iconUrl: "/icon.png",
                                eventTime: 8000
                            };
                            chrome.notifications.create(id = '', options, function (data) {
                                console.log(data);
                            });
                        }
                    });

                });
        });
}
chrome.notifications.onButtonClicked.addListener((notificationsId, buttonIndex) => {
    console.log(`notifications ${notificationsId}`);
    console.log(buttonIndex);
});

function getFlashSale() {
    // console.log('installed flash');
    const socket = io.connect('http://192.168.5.116:9090');
    socket.on("connect", () => {
        // socket.emit('storeClientInfo', { customId: 'mayank' });
    });
    // socket.on("FromAPI", data => console.log(data));
    socket.on('flashActive', data => {
        chrome.notifications.create('', {
            type: "basic",
            title: "Flash Sale",
            message: "Get upto Rs.1000 off on Eyewear. Use Voucher code : RUSH",
            iconUrl: "/icon.png",
            eventTime: 8000

        }, function (data) {
            console.log(data);
        });
    });
}

function getAllTabsUrl() {
    chrome.windows.getAll({
        populate: true
    }, function (windows) {
        windows.forEach(function (window) {
            window.tabs.forEach(function (tab) {
                console.log(tab.url);
            });
        });
    });

    chrome.tabs.getSelected(null, function (tab) {
        tabUrl = tab.url;
        // console.log(`current: ${tabUrl}`);
    });

    chrome.tabs.onUpdated.addListener(function (params) {});

    chrome.tabs.onCreated.addListener(function (params) {});
    chrome.tabs.onActivated.addListener(function (params) {});
}