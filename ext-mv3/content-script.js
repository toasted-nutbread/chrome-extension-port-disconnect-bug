let tabId = null;
let frameId = null;
const version = chrome.runtime.getManifest().manifest_version;
const log = (message, ...args) => { console.log(`${message} [MV${version}; tabId=${tabId}; frameId=${frameId}]`, ...args); }

async function sendMessage(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      message,
      (result) => {
        const error = chrome.runtime.lastError;
        if (error) {
          reject(new Error(error.message));
        } else {
          resolve(result);
        }
      }
    );
  });
}

function setupPort(port, initiator) {
  port.onDisconnect.addListener(() => { log('onDisconnect', {initiator}); });
  port.onMessage.addListener((message) => { log('onMessage', {initiator}, message); });
}

async function main() {
  chrome.runtime.onConnect.addListener((port) => {
    log('onConnect', {port});
    setupPort(port, false);
  });

  ({tabId, frameId} = await sendMessage('getFrameInfo'));
  log('Content script initialized', {tabId, frameId});

  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (window !== window.top) {
    await sendMessage('createTestPort');
  }

  const port = chrome.runtime.connect(null, {name: 'test2'});
  setupPort(port, true);
  log('connect', {port});
}

main();
