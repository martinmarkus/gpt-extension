readHtmlAsync('doc-ext/templates/content_template.html')
.then(doc => {
  // INFO: First append the markup;
  widget = htmlToElems(doc);
  document.body.appendChild(widget);
  setHeaderLogo();
  setGptLogo();
  setUserLogo();
  //initMoveListener();
  initCloseSub();
  initSendSub();

  chrome.storage.sync.onChanged.addListener(function(change) {
    console.log('show chat: ' + change?.appState?.newValue?.showChat);
    const showChat = change?.appState?.newValue?.showChat === true;

    setWidgetState(showChat);
  });
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

function initCloseSub() {
    const closeButton = document.querySelector('.doc-ext-close-button-A8A662C82DA3');
    closeButton?.addEventListener('click', () => {
      setWidgetState(false);
    });
}

function initSendSub() {
  const sendButton = document.querySelector('#chat-button-send-A8A662C82DA3');

  sendButton?.addEventListener('click', () => {
    const inputHtml = document.querySelector('#chat-input-A8A662C82DA3');

    if (!!inputHtml && inputHtml !== '') {
      sendGptMessage(inputHtml?.value);

      const emptyPlaceholder = document.querySelector('.doc-ext-empty');
      if (!!emptyPlaceholder) {
        emptyPlaceholder.style.display = 'none';
      }

      const requestHtml = `<div class="doc-ext-request">
          <div class="doc-ext-request__content">` + inputHtml?.value + `</div>
          <img class="doc-ext-person-A8A662C82DA3" />
        </div>`;

      const htmlObject = document.createElement('div');
      htmlObject.innerHTML = requestHtml;

      const chatMessages = document.querySelector('.doc-ext-chat__messages');
      chatMessages.appendChild(htmlObject);

      inputHtml.value = '';

      inputHtml.focus();
      setUserLogo();
    }
  });
}

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


function sendGptMessage(message) {
  let data = {
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": message}],
    "temperature": 0.7
  };

  chrome.storage.sync.get(['appState'], function(result) {
    if (!result || !result.appState || !result.appState.apiKeys) {
      return;
    }

    const activeApiKey = result?.appState?.apiKeys?.find(x => x.isActive === true) ?? '';

    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + activeApiKey?.key ?? ''
      },
      body: JSON.stringify(data)
    }).then(function(response) {
      return response?.json();
    }).then(function(data) {
      if (!data) {
        return;
      }
      // INFO: Append to chat popup
      const message = data?.choices[0]?.message?.content ?? '';

      if (!message || message === '') {
        return;
      }

      const responseHtml = `<div class="doc-ext-response">
        <img class="doc-ext-gtp-icon-A8A662C82DA3"/>
        <div class="doc-ext-response__content">` + message + `</div>
      </div>`;

      const htmlObject = document.createElement('div');
      htmlObject.innerHTML = responseHtml;

      const chatMessages = document.querySelector('.doc-ext-chat__messages');
      chatMessages.appendChild(htmlObject);

      setGptLogo();
    });
  });
}

function setWidgetState(open) {
  const chatHtml = document.querySelector('.body-A8A662C82DA3');
  chatHtml.style.display = open ? 'grid' : 'none';
}
