readHtmlAsync('doc-ext/templates/content_template.html')
.then(doc => {
  console.log(doc);
  // INFO: First append the markup
  console.log(JSON.stringify(htmlToElems(doc)));
  document.body.appendChild(htmlToElems(doc));
  //setHeaderLogo();
  //initMoveListener();

});

/*
  Utils
*/

// let trackMouse = false;

// function initMoveListener() {
//   const header = document.body.querySelector('#doc-ext-header-A8A662C82DA3');

//   header.addEventListener('mousedown', () => {
//     console.log("down");
//     trackMouse = true;
//   });
//   document.body.addEventListener('mouseup', () => {
//     console.log("up");
//     trackMouse = false;
//   });
//   document.body.addEventListener('mousemove', () => {
//     if (trackMouse === true) {
//       const body = document.body.querySelector('.body-A8A662C82DA3');
//       body.left += 1;
//     }
//   });

// }

function setHeaderLogo() {
  const logo = document.body.querySelector('#doc-ext-header-icon-A8A662C82DA3');
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
