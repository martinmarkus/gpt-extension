readHtmlAsync('doc-ext/templates/content_template.html')
.then(doc => {
  // INFO: First append the markup;
  widget = htmlToElems(doc);
  document.body.appendChild(widget);
  setHeaderLogo();
  setGptLogo();
  setUserLogo();
  initMoveListener();

});

/*
  Utils
*/

let widget;

let trackMouse = false;

// function initMoveListener() {
//   const header = widget.querySelector('#doc-ext-header-A8A662C82DA3');

//   header.addEventListener('mousedown', () => {
//     console.log("down");
//     trackMouse = true;
//   });

//   widget.addEventListener('mouseup', () => {
//     console.log("up");
//     trackMouse = false;
//   });

//   widget.addEventListener('mousemove', () => {
//     if (trackMouse === true) {
//       console.log('widget: ' + widget);

//       console.log(widget.style.left);
//       widget.style.left = '0';
//     }
//   });
// }

function setHeaderLogo() {
  const logo = widget.querySelector('#doc-ext-header-icon-A8A662C82DA3');
  logo.src = chrome.runtime.getURL("doc-ext/assets/robot.png");
  logo.height = 20;
  logo.width = 20;
}

function setGptLogo() {
  const logos = widget.querySelectorAll('.doc-ext-gtp-icon-A8A662C82DA3');

  logos.forEach((x) => {
    x.src = chrome.runtime.getURL("doc-ext/assets/gpt-icon.png");
    x.height = 32;
    x.width = 32;
  })
}

function setUserLogo() {
  const logos = widget.querySelectorAll('.doc-ext-person-A8A662C82DA3');

  logos.forEach((x) => {
    x.src = chrome.runtime.getURL("doc-ext/assets/person-outline.png");
    x.height = 32;
    x.width = 32;
  })
}

function setHeaderLogo() {
  const logo = widget.querySelector('#doc-ext-header-icon-A8A662C82DA3');
  logo.src = chrome.runtime.getURL("doc-ext/assets/robot.png");
  logo.height = 20;
  logo.width = 20;
}


function readHtmlAsync(filePath) {
  return fetch(chrome.runtime.getURL(filePath))
    .then(response => response.text());
}

function htmlToElems(html) {
  let temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.childNodes[0];
}
