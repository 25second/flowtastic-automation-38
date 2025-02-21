
import WebSocket from 'ws';
import { browserController } from './browserController.js';

class RecordingController {
  constructor() {
    this.recordings = new Map();
  }

  async startRecording(port) {
    if (!browserController.isActive(port)) {
      await browserController.launchBrowser(port);
    }

    // Подключаемся к Chrome DevTools Protocol
    const ws = new WebSocket(`ws://localhost:${port}/devtools/browser`);
    
    const recording = {
      ws,
      actions: [],
      startTime: Date.now()
    };

    this.recordings.set(port, recording);

    ws.on('message', (data) => {
      const message = JSON.parse(data);
      if (message.type === 'recordingAction') {
        recording.actions.push(message.action);
      }
    });

    return { success: true };
  }

  async stopRecording(port) {
    const recording = this.recordings.get(port);
    if (!recording) {
      throw new Error('No active recording found');
    }

    recording.ws.close();
    this.recordings.delete(port);

    // Преобразуем записанные действия в ноды
    const nodes = this.convertActionsToNodes(recording.actions);
    
    await browserController.closeBrowser(port);

    return { success: true, nodes };
  }

  convertActionsToNodes(actions) {
    let nodes = [];
    let currentPosition = { x: 100, y: 100 };

    actions.forEach((action, index) => {
      let node = {
        id: `recorded-${index}`,
        position: { ...currentPosition },
        data: { label: '' },
        type: ''
      };

      switch (action.type) {
        case 'navigation':
          node.type = 'browser-navigate';
          node.data.url = action.url;
          break;
        case 'click':
          node.type = 'browser-click';
          node.data.selector = action.selector;
          break;
        case 'input':
          node.type = 'browser-type';
          node.data.selector = action.selector;
          node.data.text = action.value;
          break;
        case 'tabCreate':
          node.type = 'browser-new-tab';
          break;
        case 'tabClose':
          node.type = 'browser-close-tab';
          break;
      }

      currentPosition.y += 100;
      nodes.push(node);
    });

    return nodes;
  }
}

export const recordingController = new RecordingController();
