import { useState, useEffect } from 'react';
import { supabase, EventConfig } from '../../lib/supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import { Save, Palette, Calendar, Settings, FileText } from 'lucide-react';
import { defaultEventConfig } from '../../lib/event-config';
import { ImageUpload } from './image-upload';

interface EventSettingsProps {
  eventConfig?: EventConfig | null;
  onConfigUpdate?: (config: EventConfig) => void;
}

export function EventSettings({ eventConfig: initialConfig, onConfigUpdate }: EventSettingsProps) {
  const [config, setConfig] = useState<Partial<EventConfig>>(initialConfig || defaultEventConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
      setLoading(false);
    } else {
      loadConfig();
    }
  }, [initialConfig]);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('event_config')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setConfig(data);
        onConfigUpdate?.(data);
      }
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Check if config exists
      const { data: existing } = await supabase
        .from('event_config')
        .select('id')
        .single();
      
      let result;
      if (existing) {
        // Update existing
        result = await supabase
          .from('event_config')
          .update(config)
          .eq('id', existing.id)
          .select()
          .single();
      } else {
        // Insert new
        result = await supabase
          .from('event_config')
          .insert([config])
          .select()
          .single();
      }
      
      if (result.error) throw result.error;
      
      setConfig(result.data);
      onConfigUpdate?.(result.data);
      toast.success('Settings saved successfully');
    } catch (error: any) {
      console.error('Error saving config:', error);
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-['Playfair_Display']">
          <Settings className="h-5 w-5" />
          Event Settings
        </CardTitle>
        <CardDescription>
          Customize your invitation appearance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="event">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 h-auto">
            <TabsTrigger value="event" className="text-xs sm:text-sm py-2">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Event
            </TabsTrigger>
            <TabsTrigger value="content" className="text-xs sm:text-sm py-2">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="design" className="text-xs sm:text-sm py-2">
              <Palette className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Design
            </TabsTrigger>
            <TabsTrigger value="rsvp" className="text-xs sm:text-sm py-2">
              <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              RSVP
            </TabsTrigger>
          </TabsList>

          <TabsContent value="event" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="couple_names">Couple Names</Label>
                <Input
                  id="couple_names"
                  value={config.couple_names}
                  onChange={(e) => setConfig({ ...config, couple_names: e.target.value })}
                  placeholder="John & Jane"
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="event_type">Event Type</Label>
                <Input
                  id="event_type"
                  value={config.event_type}
                  onChange={(e) => setConfig({ ...config, event_type: e.target.value })}
                  placeholder="Silver Anniversary Celebration"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event_date">Event Date</Label>
                <Input
                  id="event_date"
                  type="date"
                  value={config.event_date}
                  onChange={(e) => setConfig({ ...config, event_date: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="event_time">Event Time</Label>
                <Input
                  id="event_time"
                  value={config.event_time}
                  onChange={(e) => setConfig({ ...config, event_time: e.target.value })}
                  placeholder="6:00 PM"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="venue_name">Venue Name</Label>
              <Input
                id="venue_name"
                value={config.venue_name}
                onChange={(e) => setConfig({ ...config, venue_name: e.target.value })}
                placeholder="The Grand Ballroom"
                className="rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="venue_address">Venue Address</Label>
              <Input
                id="venue_address"
                value={config.venue_address}
                onChange={(e) => setConfig({ ...config, venue_address: e.target.value })}
                placeholder="123 Celebration Ave, City, State 12345"
                className="rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="dress_code">Dress Code</Label>
              <Input
                id="dress_code"
                value={config.dress_code}
                onChange={(e) => setConfig({ ...config, dress_code: e.target.value })}
                placeholder="Formal Attire"
                className="rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="dress_code_description">Dress Code Description</Label>
              <Textarea
                id="dress_code_description"
                value={config.dress_code_description || ''}
                onChange={(e) => setConfig({ ...config, dress_code_description: e.target.value })}
                placeholder="We recommend elegant attire in soft, complementary tones"
                rows={2}
                className="rounded-xl resize-none"
              />
              <p className="text-xs text-slate-500 mt-2">
                Additional guidance about the dress code. Colors can be managed in the Content tab.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4 mt-6">
            <div>
              <Label htmlFor="welcome_message">Welcome Message</Label>
              <Input
                id="welcome_message"
                value={config.welcome_message}
                onChange={(e) => setConfig({ ...config, welcome_message: e.target.value })}
                placeholder="Join us in celebrating..."
                className="rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="universal_message">Universal Guest Message</Label>
              <Textarea
                id="universal_message"
                value={config.universal_message || ''}
                onChange={(e) => setConfig({ ...config, universal_message: e.target.value })}
                placeholder="A message shown to all guests (if they don't have a custom message)"
                rows={3}
                className="rounded-xl resize-none"
              />
              <p className="text-xs text-slate-500 mt-2">
                This message appears in the "Dear [Name]" section if no personal message is set for the guest.
              </p>
            </div>

            <div>
              <Label htmlFor="event_description">Event Description</Label>
              <Textarea
                id="event_description"
                value={config.event_description}
                onChange={(e) => setConfig({ ...config, event_description: e.target.value })}
                placeholder="We would be honored to have you join us..."
                rows={4}
                className="rounded-xl resize-none"
              />
            </div>

            <div>
              <Label htmlFor="additional_info">Additional Information</Label>
              <Textarea
                id="additional_info"
                value={config.additional_info}
                onChange={(e) => setConfig({ ...config, additional_info: e.target.value })}
                placeholder="Reception details, parking information, etc."
                rows={3}
                className="rounded-xl resize-none"
              />
            </div>
          </TabsContent>

          <TabsContent value="design" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="primary_color">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary_color"
                    type="color"
                    value={config.primary_color}
                    onChange={(e) => setConfig({ ...config, primary_color: e.target.value })}
                    className="w-16 h-12 rounded-xl"
                  />
                  <Input
                    value={config.primary_color}
                    onChange={(e) => setConfig({ ...config, primary_color: e.target.value })}
                    placeholder="#9333ea"
                    className="rounded-xl flex-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="accent_color">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="accent_color"
                    type="color"
                    value={config.accent_color}
                    onChange={(e) => setConfig({ ...config, accent_color: e.target.value })}
                    className="w-16 h-12 rounded-xl"
                  />
                  <Input
                    value={config.accent_color}
                    onChange={(e) => setConfig({ ...config, accent_color: e.target.value })}
                    placeholder="#d946ef"
                    className="rounded-xl flex-1"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Hero Image (Couple Photo)</Label>
              <ImageUpload
                onUploadComplete={(url) => setConfig({ ...config, hero_image_url: url })}
                folder="hero"
                buttonText={config.hero_image_url ? 'Change Hero Image' : 'Upload Hero Image'}
              />
              {config.hero_image_url && (
                <div className="mt-3">
                  <img
                    src={config.hero_image_url}
                    alt="Hero preview"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
              )}
              <p className="text-xs text-slate-500 mt-2">
                Upload a high-quality couple photo (recommended: 1920x1080px landscape)
              </p>
            </div>

            <div>
              <Label>Custom Monogram Icon</Label>
              <ImageUpload
                onUploadComplete={(url, path) => setConfig({ ...config, monogram_icon_url: url, monogram_icon_path: path })}
                folder="monogram"
                buttonText={config.monogram_icon_url ? 'Change Monogram' : 'Upload Monogram'}
              />
              {config.monogram_icon_url && (
                <div className="mt-3 flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <img
                    src={config.monogram_icon_url}
                    alt="Monogram preview"
                    className="w-12 h-12 object-contain"
                  />
                  <div className="text-sm text-slate-600">
                    <p>This will replace the heart icon on guest pages</p>
                    <p className="text-xs mt-1">Click 5 times quickly to access admin</p>
                  </div>
                </div>
              )}
              <p className="text-xs text-slate-500 mt-2">
                Upload your custom monogram (recommended: square PNG with transparent background)
              </p>
            </div>
          </TabsContent>

          <TabsContent value="rsvp" className="space-y-4 mt-6">
            <div>
              <Label htmlFor="rsvp_deadline">RSVP Deadline</Label>
              <Input
                id="rsvp_deadline"
                type="date"
                value={config.rsvp_deadline}
                onChange={(e) => setConfig({ ...config, rsvp_deadline: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-4">
              <Label>RSVP Form Options</Label>
              
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl">
                <div>
                  <p className="font-medium text-sm">Meal Preferences</p>
                  <p className="text-xs text-slate-500">Ask guests for meal selection</p>
                </div>
                <Switch
                  checked={config.show_meal_preferences}
                  onCheckedChange={(checked) => setConfig({ ...config, show_meal_preferences: checked })}
                />
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl">
                <div>
                  <p className="font-medium text-sm">Dietary Restrictions</p>
                  <p className="text-xs text-slate-500">Collect dietary information</p>
                </div>
                <Switch
                  checked={config.show_dietary_restrictions}
                  onCheckedChange={(checked) => setConfig({ ...config, show_dietary_restrictions: checked })}
                />
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl">
                <div>
                  <p className="font-medium text-sm">Song Requests</p>
                  <p className="text-xs text-slate-500">Allow guests to request songs</p>
                </div>
                <Switch
                  checked={config.show_song_requests}
                  onCheckedChange={(checked) => setConfig({ ...config, show_song_requests: checked })}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full sm:w-auto rounded-full px-8"
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}