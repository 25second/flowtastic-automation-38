
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlignStartHorizontal } from "lucide-react";
import { isElectronApp } from "@/electron";
import { PythonExecutionExample } from "./PythonExecutionExample";

export function AgentCreation() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlignStartHorizontal className="h-5 w-5" />
            Создание автоматизации
          </CardTitle>
          <CardDescription>
            Создайте нового агента или автоматизацию для выполнения повторяющихся задач
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="mb-6 max-w-[60%] bg-accent/10 p-4 rounded-xl border border-accent/20">
            <p className="text-lg font-medium">Чем займемся сегодня?</p>
            <p className="text-sm text-muted-foreground mt-2">
              Опишите задачу, которую нужно автоматизировать, и я помогу создать подходящего бота для её решения.
            </p>
          </div>
          
          <div className="space-y-2">
            <Input 
              placeholder="Название агента" 
              className="max-w-md"
            />
          </div>
          
          <div className="space-y-2">
            <Textarea 
              placeholder="Опишите подробно, что должен делать агент..."
              className="min-h-[120px]"
            />
          </div>
          
          <div>
            <Button className="mr-2">
              Создать агента
            </Button>
            <Button variant="outline">
              Отмена
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {isElectronApp && <PythonExecutionExample />}
    </div>
  );
}
