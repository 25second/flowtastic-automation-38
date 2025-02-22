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

interface RandomizerConfig {
  gender?: 'male' | 'female';
  locale?: string;
  startDate?: string;
  endDate?: string;
  countryCode?: string;
  emailDomain?: string;
  country?: string;
  state?: string;
}

export const TextSetting = ({ settingKey, value, localSettings, onChange }: TextSettingProps) => {
  const [showGoogleSheets, setShowGoogleSheets] = useState(false);
  const [sheetsUrl, setSheetsUrl] = useState("");
  const [sheetName, setSheetName] = useState("");
  const [columnName, setColumnName] = useState("");
  const [randomizerConfig, setRandomizerConfig] = useState<RandomizerConfig>({});
  const [showRandomizerConfig, setShowRandomizerConfig] = useState(false);
  const [selectedRandomType, setSelectedRandomType] = useState<string>("");

  const locales = ['en', 'es', 'de', 'fr', 'it', 'ru', 'ja', 'ko', 'zh'];
  const countries = ['US', 'GB', 'DE', 'FR', 'IT', 'ES', 'RU', 'JP', 'KR', 'CN'];

  const generateRandomData = (type: string, config: RandomizerConfig = {}) => {
    if (config.locale) {
      faker.locale = config.locale;
    }

    switch (type) {
      case 'name':
        if (config.gender === 'male') {
          return faker.person.fullName({ sex: 'male' });
        } else if (config.gender === 'female') {
          return faker.person.fullName({ sex: 'female' });
        }
        return faker.person.fullName();
      case 'firstName':
        if (config.gender === 'male') {
          return faker.person.firstName('male');
        } else if (config.gender === 'female') {
          return faker.person.firstName('female');
        }
        return faker.person.firstName();
      case 'lastName':
        return faker.person.lastName();
      case 'birthDate':
        const start = config.startDate ? new Date(config.startDate) : new Date(1950, 0, 1);
        const end = config.endDate ? new Date(config.endDate) : new Date(2000, 11, 31);
        return faker.date.between({ from: start, to: end }).toLocaleDateString();
      case 'phone':
        if (config.countryCode) {
          return `${config.countryCode} ${faker.phone.number()}`;
        }
        return faker.phone.number();
      case 'country':
        return faker.location.country();
      case 'email':
        if (config.emailDomain) {
          const username = faker.internet.userName();
          return `${username}@${config.emailDomain}`;
        }
        return faker.internet.email();
      case 'city':
        if (config.country) {
          faker.locale = config.country.toLowerCase();
        }
        return faker.location.city();
      case 'address':
        if (config.country) {
          faker.locale = config.country.toLowerCase();
        }
        return faker.location.streetAddress({ useFullAddress: true });
      case 'zipCode':
        if (config.country) {
          faker.locale = config.country.toLowerCase();
        }
        return faker.location.zipCode();
      default:
        return '';
    }
  };

  const handleRandomTypeSelect = (type: string) => {
    setSelectedRandomType(type);
    setShowRandomizerConfig(true);
  };

  const handleGenerateRandom = () => {
    const result = generateRandomData(selectedRandomType, randomizerConfig);
    onChange(settingKey, result);
    setShowRandomizerConfig(false);
    toast.success('Random value generated');
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
          <Select onValueChange={handleRandomTypeSelect}>
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
              <SelectItem value="city">Random City</SelectItem>
              <SelectItem value="address">Random Address</SelectItem>
              <SelectItem value="zipCode">Random Zip Code</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Dialog open={showRandomizerConfig} onOpenChange={setShowRandomizerConfig}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Random Generation</DialogTitle>
            <DialogDescription>
              Set parameters for random {selectedRandomType} generation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {(selectedRandomType === 'name' || selectedRandomType === 'firstName') && (
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select onValueChange={(value) => setRandomizerConfig(prev => ({ ...prev, gender: value as 'male' | 'female' }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {['name', 'firstName', 'lastName', 'address', 'city'].includes(selectedRandomType) && (
              <div className="space-y-2">
                <Label>Locale</Label>
                <Select onValueChange={(value) => setRandomizerConfig(prev => ({ ...prev, locale: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select locale" />
                  </SelectTrigger>
                  <SelectContent>
                    {locales.map(locale => (
                      <SelectItem key={locale} value={locale}>{locale.toUpperCase()}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedRandomType === 'birthDate' && (
              <>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    onChange={(e) => setRandomizerConfig(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    onChange={(e) => setRandomizerConfig(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </>
            )}

            {selectedRandomType === 'phone' && (
              <div className="space-y-2">
                <Label>Country Code</Label>
                <Input
                  placeholder="+1"
                  onChange={(e) => setRandomizerConfig(prev => ({ ...prev, countryCode: e.target.value }))}
                />
              </div>
            )}

            {selectedRandomType === 'email' && (
              <div className="space-y-2">
                <Label>Email Domain</Label>
                <Input
                  placeholder="example.com"
                  onChange={(e) => setRandomizerConfig(prev => ({ ...prev, emailDomain: e.target.value }))}
                />
              </div>
            )}

            {['address', 'city', 'zipCode'].includes(selectedRandomType) && (
              <div className="space-y-2">
                <Label>Country</Label>
                <Select onValueChange={(value) => setRandomizerConfig(prev => ({ ...prev, country: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button className="w-full" onClick={handleGenerateRandom}>
              Generate
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
