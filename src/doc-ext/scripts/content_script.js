
readHtmlAsync('doc-ext/templates/content_template.html')
  .then(doc => {
    document.body.appendChild(htmlToElems(doc));
  });


/*
  Utils
*/

function readHtmlAsync(filePath) {
  return fetch(chrome.runtime.getURL(filePath))
    .then(response => response.text());
}


function htmlToElems(html) {
  let temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.childNodes[0];
}
