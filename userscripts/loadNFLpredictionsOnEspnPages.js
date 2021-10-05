// ==UserScript==
// @name         Load NFL game predictions
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.espn.com/nfl*
// @icon         https://www.google.com/s2/favicons?domain=espn.com
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';
    const leaguesList = $('ul#leagues');
    console.log('leaguesList: ', leaguesList);
    const observer = new MutationObserver(function( mutations ) {
        mutations.forEach(function( mutation ) {
            console.log('mutation', mutation);
            if (mutation.type === 'childList') {
                loadGamePreditions();
            }
        });
    });

    // Configuration of the observer:
    const config = {
        //attributes: true,
        childList: true,
        characterData: true
    };

    // Pass in the target node, as well as the observer options
    observer.observe(leaguesList[0], config);
    //document.addEventListener('DOMContentLoaded', async _ => {
    async function loadGamePreditions() {
        console.log('loadGamePreditions() begin');
        const links = document.querySelectorAll('.nfl .cscore_header-link:not(.external)');
        console.log('links: ', links)
        $('#global-scoreboard').css({'height': '88px'});
        $('ul#leagues li.league').css({'height': '88px'});
        $('.scores-carousel').css({'height': '88px'});
        $('#global-scoreboard .wrap').css({'min-width': '1700px'});
        for (const link of links) {
            console.log('linkhref: ', link.href)
            const result = await fetch(link.href);
            const text = await result.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, "text/html");
            const predictor = xmlDoc.querySelector('#gamepackage-predictor');
            console.log('homeTeam finding');
            const homeTeam = predictor.querySelector('.home-team');
            const valueAway = predictor.querySelector('.value-away');//const valueHome = predictor.querySelector('.value-home');
            console.log('homeTeam: ', homeTeam, link.parentNode.parentNode);
            link.parentNode.nextElementSibling.innerHTML += `<div class="haha">${homeTeam.innerText} - ${valueAway.innerText}</div>`;
            console.log('predictor', predictor);//console.log('result', result, 'text', text, predictor);
        }
    }
    // });
/*
    console.log('DOMContentLoaded');

    */
})();