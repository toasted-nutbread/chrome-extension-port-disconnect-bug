const version = chrome.runtime.getManifest().manifest_version;
const log = (message, ...args) => { console.log(`${message} [MV${version}]`, ...args); }

let nextPortId = 0;

chrome.runtime.onConnect.addListener((port) => {
  const {name} = port;
  if (name !== 'test2') { return; }

  const tabId = port.sender.tab.id;
  const frameId = port.sender.frameId;
  const portId = nextPortId++;
  log('onConnect', {name, tabId, frameId, portId});

  port.onDisconnect.addListener(() => { log('onDisconnect', {initiator}); });
  port.onMessage.addListener((message) => { log('onMessage', {initiator}, message); });
});

chrome.runtime.onMessage.addListener((message, sender, callback) => {
  switch (message) {
    case 'getFrameInfo':
      callback({tabId: sender.tab.id, frameId: sender.frameId});
      break;
    case 'createTestPort':
      {
        const tabId = sender.tab.id;
        const frameId = sender.frameId;
        const port = chrome.tabs.connect(tabId, {frameId: 0, name: 'test'});
        port.onMessage.addListener((message) => { console.log('Test port message', message); });
        port.onDisconnect.addListener(() => { console.log('Test port disconnected', {port}); });
        log('createTestPort', {tabId, frameId});
        callback();
      }
      break;
  }
});

log('Background initialized');
