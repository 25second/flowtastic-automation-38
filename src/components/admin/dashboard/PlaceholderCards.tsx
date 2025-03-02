
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PlaceholderCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Additional Chart</CardTitle>
          <CardDescription>Reserved for future metrics</CardDescription>
        </CardHeader>
        <CardContent className="h-60 flex items-center justify-center bg-muted/20">
          <p className="text-muted-foreground">Chart placeholder</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Additional List</CardTitle>
          <CardDescription>Reserved for future data</CardDescription>
        </CardHeader>
        <CardContent className="h-60 flex items-center justify-center bg-muted/20">
          <p className="text-muted-foreground">List placeholder</p>
        </CardContent>
      </Card>
    </div>
  );
}
