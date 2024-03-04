/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/popup.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getActiveTabURL: () => (/* binding */ getActiveTabURL)
/* harmony export */ });
// Adds listener to popup
document.addEventListener("DOMContentLoaded", async () => {
   let activeTab = await getActiveTabURL();

   if (activeTab.url.includes("bu.edu/link/bin/uiscgi_studentlink.pl/")) {
      // Add download button and functionality
      let downloadButton = document.getElementById("download")
      setButtonControl("download", "Download schedule", onClassesDownload, downloadButton)

      let inputDiv = document.getElementById("dateInput")
      setDateInput(inputDiv)
   } else {
      // when current tab is not BU schedule 
      let container = document.getElementsByClassName("container")[0];
      container.innerHTML = '<div class="title">This is not a BU schedule page.</div>';
   }
});


// Helper: Get active tab's url (used in popup)
async function getActiveTabURL() {
   let tabs = await chrome.tabs.query({
      currentWindow: true,
      active: true
   });

   return tabs[0];
}

// onClick event: Injects parseClassesSchedule to current tab
const onClassesDownload = async () => {
   // Gets user's current tab url
   let activeTab = await getActiveTabURL()

   // Gets html input from popup page
   let startDate = document.getElementById("inputTag").value

   // Creates startDate variable then injects script
   chrome.scripting.executeScript({
      target: {tabId: activeTab.id},
      args: [{startDate: startDate}],
      func: vars => Object.assign(self, vars),
    }, () => {
      chrome.scripting.executeScript({
         target: { tabId: activeTab.id },
         files: ['parseClassesSchedule.bundle.js']
      });
    });

};

/**
 * Creates download button and assgins it to a @param eventListener
 * @param {String} icon Image name to use as icon
 * @param {String} title String to use as hover title
 * @param {Function} eventListener Function assigned to button
 * @param {HTMLElement} parentElement Parent element to assign the button to
 */
const setButtonControl = (icon, title, eventListener, parentElement) => {
   // Creates HTML element
   let controlElement = document.createElement("img")

   // Adds icon and hover title
   controlElement.src = "assets/" + icon + ".png"
   controlElement.title = title

   // Adds event listenter
   controlElement.addEventListener("click", eventListener)
   // TODO?: style download button: controlElement.style = ""
   // Appends to parent
   parentElement.appendChild(controlElement)
};

// Creates date picker (html input)
const setDateInput = (parentElement) => {
   // Creates input element
   let inputElement = document.createElement("input")

   inputElement.type = "date"
   inputElement.valueAsDate = new Date();  // default date
   inputElement.id = "inputTag"

   parentElement.appendChild(inputElement)
}
/******/ })()
;
//# sourceMappingURL=popup.bundle.js.map