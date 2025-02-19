
import { useEffect } from 'react';
import { FlowNodeData } from '@/types/flow';
import { AnnotationNode } from './nodes/AnnotationNode';
import { WorkflowNode } from './nodes/WorkflowNode';

interface CustomNodeProps {
  data: FlowNodeData;
  id: string;
  selected: boolean;
}

const CustomNode = ({
  data,
  id,
  selected
}: CustomNodeProps) => {
  useEffect(() => {
    console.log('Node rendering:', {
      id,
      type: data.type,
      isDataProcessing: typeof data.type === 'string' && data.type.startsWith('data-'),
      selected,
      data
    });
  }, [id, data, selected]);

  if (data.type === 'annotation') {
    return <AnnotationNode data={data} id={id} selected={selected} />;
  }

  return <WorkflowNode data={data} id={id} selected={selected} />;
};

const nodeTypes = {
  'default': CustomNode,
  'input': CustomNode,
  'output': CustomNode,
  'trigger-schedule': CustomNode,
  'trigger-event': CustomNode,
  'tab-new': CustomNode,
  'tab-close': CustomNode,
  'tab-switch': CustomNode,
  'page-click': CustomNode,
  'page-type': CustomNode,
  'page-scroll': CustomNode,
  'js-execute': CustomNode,
  'js-evaluate': CustomNode,
  'screenshot-full': CustomNode,
  'screenshot-element': CustomNode,
  'data-extract': CustomNode,
  'data-save': CustomNode,
  'flow-if': CustomNode,
  'flow-loop': CustomNode,
  'flow-wait': CustomNode,
  'api-get': CustomNode,
  'api-post': CustomNode,
  'api-put': CustomNode,
  'api-delete': CustomNode,
  'start': CustomNode,
  'end': CustomNode,
  'open-page': CustomNode,
  'navigate': CustomNode,
  'close-tab': CustomNode,
  'extract': CustomNode,
  'click': CustomNode,
  'save-data': CustomNode,
  'read-data': CustomNode,
  'wait': CustomNode,
  'condition': CustomNode,
  'read-excel': CustomNode,
  'write-excel': CustomNode,
  'http-request': CustomNode,
  'run-script': CustomNode,
  'session-stop': CustomNode,
  'annotation': CustomNode
};

export { CustomNode, nodeTypes };
