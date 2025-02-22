
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Wand2, Table } from "lucide-react";
import { toast } from "sonner";
import { faker } from '@faker-js/faker';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface TextSettingProps {
  settingKey: string;
  value: string;
  localSettings: Record<string, any>;
  onChange: (key: string, value: any) => void;
}

export const TextSetting = ({ settingKey, value, localSettings, onChange }: TextSettingProps) => {
  const [showGoogleSheets, setShowGoogleSheets] = useState(false);
  const [sheetsUrl, setSheetsUrl] = useState("");
  const [sheetName, setSheetName] = useState("");
  const [columnName, setColumnName] = useState("");

  const generateRandomData = (type: string) => {
    switch (type) {
      case 'name':
        return faker.person.fullName();
      case 'firstName':
        return faker.person.firstName();
      case 'lastName':
        return faker.person.lastName();
      case 'birthDate':
        return faker.date.birthdate().toLocaleDateString();
      case 'phone':
        return faker.phone.number();
      case 'country':
        return faker.location.country();
      case 'email':
        return faker.internet.email();
      case 'password':
        return faker.internet.password();
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={settingKey} className="capitalize">
          {settingKey.replace(/([A-Z])/g, ' $1')}
        </Label>
        <div className="flex gap-2">
          <Input
            type="text"
            id={settingKey}
            value={localSettings[settingKey] || value}
            onChange={(e) => onChange(settingKey, e.target.value)}
            className="flex-1"
          />
          <Select onValueChange={(val) => onChange(settingKey, generateRandomData(val))}>
            <SelectTrigger className="w-[180px]">
              <Wand2 className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Generate random..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Random Name</SelectItem>
              <SelectItem value="firstName">Random First Name</SelectItem>
              <SelectItem value="lastName">Random Last Name</SelectItem>
              <SelectItem value="birthDate">Random Birth Date</SelectItem>
              <SelectItem value="phone">Random Phone</SelectItem>
              <SelectItem value="country">Random Country</SelectItem>
              <SelectItem value="email">Random Email</SelectItem>
              <SelectItem value="password">Random Password</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="saveToSheets"
              checked={localSettings.saveToSheets || false}
              onCheckedChange={(checked) => {
                onChange('saveToSheets', checked);
                if (checked) {
                  setShowGoogleSheets(true);
                }
              }}
            />
            <Label htmlFor="saveToSheets">Save entered data?</Label>
          </div>
          {localSettings.saveToSheets && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGoogleSheets(true)}
            >
              <Table className="h-4 w-4 mr-2" />
              Configure Google Sheets
            </Button>
          )}
        </div>
      </div>

      <Dialog open={showGoogleSheets} onOpenChange={setShowGoogleSheets}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Google Sheets Configuration</DialogTitle>
            <DialogDescription>
              Enter your Google Sheets details to save the generated data
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Spreadsheet URL</Label>
              <Input
                placeholder="https://docs.google.com/spreadsheets/d/..."
                value={sheetsUrl}
                onChange={(e) => setSheetsUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Sheet Name</Label>
              <Input
                placeholder="Sheet1"
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Column Name</Label>
              <Input
                placeholder="e.g., Name, Email, etc."
                value={columnName}
                onChange={(e) => setColumnName(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              onClick={() => {
                onChange('googleSheets', {
                  url: sheetsUrl,
                  sheet: sheetName,
                  column: columnName
                });
                setShowGoogleSheets(false);
                toast.success('Google Sheets configuration saved');
              }}
            >
              Save Configuration
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
