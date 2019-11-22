// ==UserScript==
// @name         Highlight active review
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bring attention to the user when a post is up for reviewing
// @author       Sam Onela
// @match        https://codereview.stackexchange.com/review/*
// ==/UserScript==

;(function() {
    'use strict';
    const INITIAL_CHECK_TIMEOUT = 1500;
    const INTERVAL_DELAY = 400;
    const RELOAD_DELAY = 6500;
    const CLICK_CHECK_DELAY = 6000;
    const DELETED_CHECK_DELAY = 30000;
    const NOTIFY_DELAY = 45000;
    const ticks = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let checkTimer = setTimeout(check, INITIAL_CHECK_TIMEOUT);
    let interval, deletedTimer;
    const drilledIntoReviewItem = _ => location.pathname.match(/\d+/);
    const multipleActionsAvailable = _ => typeof $ === 'function' && $('.review-actions').length && $('.review-actions input').length > 1;
    const updateTitle = (clear = false) =>{
        const titleMatches = document.title.match(/^([\W]{1})Review/);
        if (titleMatches && titleMatches.length > 1) {
            const index = ticks.indexOf(titleMatches[1]);
            document.title =  document.title.replace(titleMatches[1], ticks[(index+1)%ticks.length]);
        }
        else {
            document.title =  (clear?'*': ticks[0]) + document.title;
        }
    };
    const checkDeleted = _ => {
        const deletedContainer = document.querySelector('.realtime-post-deleted-notification');
        if (deletedContainer) {
            const noActionButton = document.querySelector('input[value="No Action Needed"]');
            if (noActionButton) {
                clearInterval(deletedTimer);
                noActionButton.click();
            }
        }
    };
    const jsonPLoad = response => {
        console.log('response from email send: ', response);
    };
    const notify = _ => {
        if (!drilledIntoReviewItem() || !multipleActionsAvailable()) {
            return;
        }
        const URL = 'https://api.emailjs.com/api/v1.0/email/send';
        const data = {
            service_id: 'gmail',
            template_id: 'template_46UITlmH',
            user_id: 'user_',
            template_params: {
                message_html: location.href,
                message_subject: location.pathname.split('/')[2]
            }
        };
        console.log('sending data to ' + URL, data);
        $.ajax(URL, {
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json'
        }).then(jsonPLoad);
    };
    function check(clickHandlerAdded = false){
        if (document.body.childNodes.length > 0 &&
            document.body.childNodes[0].innerHTML &&
            (document.body.childNodes[0].innerHTML.indexOf('I/O error') > -1 ||
             document.body.childNodes[0].innerHTML.indexOf('Service Unavailable') > -1 ||
             document.body.childNodes[0].innerHTML.indexOf('failed to connect to host') > -1)) {
            location.reload();
            return;
        }
        if (checkTimer) {
            clearTimeout(checkTimer);
            checkTimer = 0;
        }
        if (drilledIntoReviewItem()) { // drilled in to a review item
            updateTitle(true);
            if (!clickHandlerAdded) {
                document.addEventListener('click', (event) => checkTimer = window.setTimeout(check, CLICK_CHECK_DELAY, true));
            }
            deletedTimer = setInterval(checkDeleted, DELETED_CHECK_DELAY);
            if (new Date().getHours() > 5) {
                const notifyTimer = setTimeout(notify, NOTIFY_DELAY);
                document.addEventListener('mousemove', _ => clearTimeout(notifyTimer));
            }
        }
        else if (typeof $ === 'function' && $('.review-actions').length && !$('.review-actions input').length) {
            updateTitle();
            if (interval === undefined) {
                interval = window.setInterval(updateTitle, INTERVAL_DELAY);
            }
            setTimeout(_=> window.location = window.location, RELOAD_DELAY);
        }
    }
})();