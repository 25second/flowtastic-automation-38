
const puppeteer = require('puppeteer');

let recordingPage = null;
let recordedActions = [];

async function startRecording(req, res) {
  const { browserPort } = req.body;
  
  try {
    console.log(`Connecting to browser on port ${browserPort}...`);
    const browser = await puppeteer.connect({
      browserURL: `http://localhost:${browserPort}`,
      defaultViewport: null
    });

    // Clear previous recording
    recordedActions = [];
    
    // Create a new page for recording
    recordingPage = await browser.newPage();
    
    // Setup page event listeners
    await recordingPage.exposeFunction('recordAction', (action) => {
      console.log('Recorded action:', action);
      recordedActions.push(action);
    });

    // Inject recording scripts
    await recordingPage.evaluateOnNewDocument(() => {
      // Record clicks
      document.addEventListener('click', async (e) => {
        const selector = e.target.id 
          ? `#${e.target.id}`
          : e.target.className 
            ? `.${e.target.className.split(' ')[0]}`
            : e.target.tagName.toLowerCase();
        await window.recordAction({
          type: 'page-click',
          data: {
            label: 'Click Element',
            settings: { selector },
            description: `Click on ${selector}`
          }
        });
      });

      // Record form inputs
      document.addEventListener('input', async (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
          const selector = e.target.id 
            ? `#${e.target.id}`
            : e.target.className 
              ? `.${e.target.className.split(' ')[0]}`
              : e.target.tagName.toLowerCase();
          await window.recordAction({
            type: 'page-type',
            data: {
              label: 'Type Text',
              settings: { 
                selector,
                text: e.target.value
              },
              description: `Type "${e.target.value}" into ${selector}`
            }
          });
        }
      });

      // Record navigation
      const originalPushState = history.pushState;
      history.pushState = function() {
        window.recordAction({
          type: 'goto',
          data: {
            label: 'Navigate',
            settings: { url: arguments[2] },
            description: `Navigate to ${arguments[2]}`
          }
        });
        return originalPushState.apply(this, arguments);
      };

      // Record URL changes
      window.addEventListener('popstate', () => {
        window.recordAction({
          type: 'goto',
          data: {
            label: 'Navigate',
            settings: { url: window.location.href },
            description: `Navigate to ${window.location.href}`
          }
        });
      });

      // Record initial page load
      window.recordAction({
        type: 'goto',
        data: {
          label: 'Navigate',
          settings: { url: window.location.href },
          description: `Navigate to ${window.location.href}`
        }
      });
    });

    console.log('Recording started');
    res.json({ message: 'Recording started' });
  } catch (error) {
    console.error('Error starting recording:', error);
    res.status(500).json({ error: 'Failed to start recording' });
  }
}

async function stopRecording(req, res) {
  try {
    if (recordingPage) {
      await recordingPage.close();
      recordingPage = null;
    }

    console.log('Recording stopped. Actions:', recordedActions);
    
    // Convert recorded actions to nodes
    const nodes = recordedActions.map((action, index) => ({
      id: `recorded-${index}`,
      type: action.type,
      position: { x: 100, y: 100 + (index * 100) },
      data: action.data,
      style: {
        background: '#fff',
        padding: '15px',
        borderRadius: '8px',
        width: 180,
      },
    }));

    res.json({ nodes });
  } catch (error) {
    console.error('Error stopping recording:', error);
    res.status(500).json({ error: 'Failed to stop recording' });
  }
}

module.exports = {
  startRecording,
  stopRecording
};
