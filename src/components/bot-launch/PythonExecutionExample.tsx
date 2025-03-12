
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, AlertCircle, Code, Play } from 'lucide-react';
import { isElectronApp, executePythonCode } from '@/electron';
import { PythonExecutor } from '@/utils/pythonExecutor';
import { toast } from 'sonner';

export function PythonExecutionExample() {
  const [pythonCode, setPythonCode] = useState("import sys\nprint('Python version:', sys.version)\nprint('Hello from Python!')\n");
  const [output, setOutput] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState(false);

  const executePython = async () => {
    if (!pythonCode.trim()) {
      toast.error('Please enter some Python code');
      return;
    }

    setIsExecuting(true);
    setOutput('');

    try {
      let result: string;
      
      if (isElectronApp) {
        // In Electron, use the PythonExecutor
        result = await PythonExecutor.executeCode(pythonCode);
      } else {
        toast.error('Python execution is only available in desktop application');
        setOutput('Python execution is only available in the desktop application');
        return;
      }
      
      setOutput(result);
      toast.success('Python code executed successfully');
    } catch (error) {
      console.error('Error executing Python code:', error);
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
      toast.error('Failed to execute Python code');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          Python Execution
        </CardTitle>
        <CardDescription>
          Execute Python code directly in the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isElectronApp && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Not available</AlertTitle>
            <AlertDescription>
              Python execution is only available in the desktop application.
            </AlertDescription>
          </Alert>
        )}
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Code className="h-4 w-4" />
            <span className="font-medium">Python Code</span>
          </div>
          <Textarea
            value={pythonCode}
            onChange={(e) => setPythonCode(e.target.value)}
            className="font-mono text-sm h-[150px]"
            placeholder="Enter Python code here..."
            disabled={isExecuting}
          />
        </div>
        
        {output && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="h-4 w-4" />
              <span className="font-medium">Output</span>
            </div>
            <div className="bg-black text-white p-4 rounded-md font-mono text-sm whitespace-pre-wrap h-[150px] overflow-auto">
              {output}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={executePython} 
          disabled={isExecuting || !isElectronApp}
          className="flex items-center gap-2"
        >
          {isExecuting ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              Executing...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Execute Python
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
