
let isRecording = false;
let recordedActions = [];
let port = null;

chrome.runtime.onConnect.addListener(function(messagePort) {
  port = messagePort;
  port.onMessage.addListener(function(msg) {
    if (msg.command === 'startRecording') {
      isRecording = true;
      recordedActions = [];
    } else if (msg.command === 'stopRecording') {
      isRecording = false;
      if (port) {
        port.postMessage({
          type: 'recordingComplete',
          actions: recordedActions
        });
      }
    }
  });
});

// Отслеживание создания/закрытия вкладок
chrome.tabs.onCreated.addListener((tab) => {
  if (isRecording) {
    recordedActions.push({
      type: 'tabCreate',
      url: tab.url,
      timestamp: Date.now()
    });
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  if (isRecording) {
    recordedActions.push({
      type: 'tabClose',
      tabId,
      timestamp: Date.now()
    });
  }
});

// Отслеживание навигации
chrome.webNavigation.onCompleted.addListener((details) => {
  if (isRecording && details.frameId === 0) {
    recordedActions.push({
      type: 'navigation',
      url: details.url,
      timestamp: Date.now()
    });
  }
});
