Example demonstrating a bug on Chrome extensions where the `Port.onDisconnect` event may not be fired
if the background page is reloaded (MV2) or the service worker is reloaded (MV3).

Messages are logged to the console indicating what ports are opened and when they are disconnected.

https://toasted-nutbread.github.io/chrome-extension-port-disconnect-bug/
