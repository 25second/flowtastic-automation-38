
import { FlowNodeWithData } from '@/types/flow';

export const processMouseNode = (node: FlowNodeWithData): string => {
  const { type, data } = node;
  const settings = data.settings || {};

  switch (type) {
    case 'mouse-click':
      return `
    // Click on element
    const selector${node.id} = '${settings.selector}';
    console.log('Clicking element:', selector${node.id});
    await page.click(selector${node.id});`;

    case 'mouse-click-modified':
      const modifiers = Array.isArray(settings.modifiers) ? settings.modifiers : [];
      return `
    // Modified click with ${modifiers.join('+')}
    const modifiedSelector${node.id} = '${settings.selector}';
    console.log('Modified click on element:', modifiedSelector${node.id}, 'with modifiers:', ${JSON.stringify(modifiers)});
    await page.click(modifiedSelector${node.id}, { modifiers: ${JSON.stringify(modifiers)} });`;

    case 'mouse-double-click':
      return `
    // Double click on element
    const doubleClickSelector${node.id} = '${settings.selector}';
    console.log('Double clicking element:', doubleClickSelector${node.id});
    await page.dblclick(doubleClickSelector${node.id});`;

    case 'mouse-hover':
      return `
    // Hover over element
    const hoverSelector${node.id} = '${settings.selector}';
    console.log('Hovering over element:', hoverSelector${node.id});
    await page.hover(hoverSelector${node.id});`;

    case 'mouse-move':
      return `
    // Move mouse to coordinates
    const x${node.id} = ${settings.x || 0};
    const y${node.id} = ${settings.y || 0};
    console.log('Moving mouse to coordinates:', { x: x${node.id}, y: y${node.id} });
    await page.mouse.move(x${node.id}, y${node.id});`;

    case 'mouse-drag-drop':
      return `
    // Drag and drop
    const startX${node.id} = ${settings.startX || 0};
    const startY${node.id} = ${settings.startY || 0};
    const endX${node.id} = ${settings.endX || 0};
    const endY${node.id} = ${settings.endY || 0};
    console.log('Performing drag and drop from', { x: startX${node.id}, y: startY${node.id} }, 'to', { x: endX${node.id}, y: endY${node.id} });
    await page.mouse.move(startX${node.id}, startY${node.id});
    await page.mouse.down();
    await page.mouse.move(endX${node.id}, endY${node.id});
    await page.mouse.up();`;

    case 'mouse-wheel':
      return `
    // Scroll using mouse wheel
    const deltaX${node.id} = ${settings.deltaX || 0};
    const deltaY${node.id} = ${settings.deltaY || 100};
    console.log('Scrolling with deltas:', { x: deltaX${node.id}, y: deltaY${node.id} });
    await page.mouse.wheel({ deltaX: deltaX${node.id}, deltaY: deltaY${node.id} });`;

    default:
      return `
    console.error('Unknown mouse node type:', '${type}');
    throw new Error('Unknown mouse node type: ${type}');`;
  }
};
