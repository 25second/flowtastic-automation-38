
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

const components = [
  {
    category: "Triggers",
    items: [
      { name: "Cron", description: "Schedule based trigger" },
      { name: "HTTP", description: "HTTP endpoint trigger" },
      { name: "Event", description: "Event based trigger" },
    ]
  },
  {
    category: "Processing",
    items: [
      { name: "Function", description: "JavaScript function" },
      { name: "Template", description: "Template processing" },
      { name: "Switch", description: "Conditional routing" },
    ]
  },
  {
    category: "Output",
    items: [
      { name: "HTTP Request", description: "Make HTTP requests" },
      { name: "Database", description: "Database operations" },
      { name: "File", description: "File operations" },
    ]
  }
];

export function FlowstreamSidebar() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredComponents = components.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="w-64 border-r bg-background">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-4 space-y-6">
          {filteredComponents.map((category) => (
            <div key={category.category}>
              <h2 className="mb-2 text-sm font-semibold tracking-tight">{category.category}</h2>
              <div className="space-y-2">
                {category.items.map((item) => (
                  <div
                    key={item.name}
                    className={cn(
                      "rounded-md border bg-card p-2 cursor-move hover:border-primary",
                      "transition-colors duration-200"
                    )}
                    draggable
                  >
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
