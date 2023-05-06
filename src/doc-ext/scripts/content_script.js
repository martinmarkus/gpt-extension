
readHtmlAsync('doc-ext/templates/content_template.html')
  .then(doc => {
    console.log('asdasd');
    document.body.appendChild(htmlToElems(doc));
    setHeaderLogo();
  });

initMoveListener();

/*
  Utils
*/

let trackMouse = false;

function initMoveListener() {
  const header =  document.getElementById('doc-ext-header-A8A662C82DA3');

  header.addEventListener('mousedown', () => {
    console.log("down");
    trackMouse = true;
  });
  document.addEventListener('mouseup', () => {
    console.log("up");
    trackMouse = false;
  });
  document.addEventListener('mousemove', () => {
    if (trackMouse === true) {
      const body = document.querySelector('.body-A8A662C82DA3');
      body.left += 1;
    }
  });

}

function setHeaderLogo() {
  const logo = document.querySelector('#doc-ext-header-icon-A8A662C82DA3');
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
