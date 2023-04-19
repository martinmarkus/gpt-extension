/**
 * The entry point of the extension
 */

'use strict';

function main() {
    console.log('a');
    registerEventListeners();
}

function registerEventListeners() {
    chrome.extension.getBackgroundPage().console.log('foo');

    document.querySelector('button').addEventListener('click', () => {
    }, true);
}
