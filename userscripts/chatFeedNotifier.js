// ==UserScript==
// @name         Chat feed notifier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://chat.stackexchange.com/rooms/2782/the-1st-monitor
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackexchange.com
// @grant        GM_notification
// ==/UserScript==

(async function($) {
    'use strict';
    const permission = await Notification.requestPermission();
    console.log('Notification.permission', permission);
    if (permission !== 'granted') {
        return;
    }
    let notification;
    //let notificationOpen = false;
    //const feedTicker= document.getElementById('feed-ticker'); //const feedTicker= document.getElementById('ticker-item');
    //console.log('feedTicker', feedTicker, ' window: ', window);
    //console.log('DOM content loaded');
    const feedTicker= document.getElementById('feed-ticker'); //const feedTicker= document.getElementById('ticker-item');
    console.log('feedTicker', feedTicker);
    /*const n = new Notification('watching feed items');
    setTimeout(n.close(), 5000);*/
    const observer = new MutationObserver((mutationsList, observer) => {
        console.log('mutationsList: ', mutationsList);
        if (feedTicker.style.display !== 'none') {
            if (notification) {
                notification.close();
                return;
            }
            notification = undefined;
            //don't return here because it won't show new notifications
        }
        for (const mutation of mutationsList) {
            if (mutation.attributeName == 'style') {
                console.log('feedTicker.style.display: ', feedTicker.style.display);
                if (feedTicker.style.display != 'none' && $(feedTicker).is(':visible')) {
                    console.log('making notification');
                    //GM_notification({title: 'feed items', text: feedTicker.innerText});
                    notification = new Notification('feed items', {body: feedTicker.innerText});
                    //notification.addEventListener('close', _ => notificationOpen = false);
                    notification.addEventListener('close', _ => notification = null);
                    //notificationOpen = true;
                    setTimeout(notification.close.bind(notification), 5000);
                    console.log('made notification', notification);
                    break;
                }
            }
        }
    });
    console.log('observing mutations on feedticker');
    observer.observe(feedTicker, {attributes: true});
    $(feedTicker).click(function() {
        console.log('notification: ', notification);
        if (notification) {
            notification.close();
        }
    });
})(jQuery);