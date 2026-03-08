import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { AlertCircle, Database } from 'lucide-react';
import { useState } from 'react';

export function DatabaseSetupAlert() {
  const [showSQL, setShowSQL] = useState(false);

  const sqlScript = `-- Add new columns to existing rsvps table (if they don't exist)
ALTER TABLE rsvps 
ADD COLUMN IF NOT EXISTS meal_preference TEXT,
ADD COLUMN IF NOT EXISTS dietary_restrictions TEXT,
ADD COLUMN IF NOT EXISTS song_request TEXT;

-- Create event_config table
CREATE TABLE IF NOT EXISTS event_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_names TEXT DEFAULT 'John & Jane',
  event_type TEXT DEFAULT 'Silver Anniversary Celebration',
  event_date DATE DEFAULT CURRENT_DATE,
  event_time TEXT DEFAULT '6:00 PM',
  venue_name TEXT DEFAULT 'The Grand Ballroom',
  venue_address TEXT DEFAULT '123 Celebration Ave, City, State 12345',
  dress_code TEXT DEFAULT 'Formal Attire',
  primary_color TEXT DEFAULT '#9333ea',
  accent_color TEXT DEFAULT '#d946ef',
  hero_image_url TEXT DEFAULT '',
  welcome_message TEXT DEFAULT 'Join us in celebrating 25 years of love and commitment',
  event_description TEXT DEFAULT 'We would be honored to have you join us as we celebrate our Silver Anniversary with family and friends.',
  additional_info TEXT DEFAULT 'Reception to follow ceremony. Dinner and dancing included.',
  rsvp_deadline DATE DEFAULT CURRENT_DATE,
  show_meal_preferences BOOLEAN DEFAULT true,
  show_dietary_restrictions BOOLEAN DEFAULT true,
  show_song_requests BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on event_config
ALTER TABLE event_config ENABLE ROW LEVEL SECURITY;

-- Create policies for event_config
CREATE POLICY "Allow public read access to event_config" ON event_config
  FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to event_config" ON event_config
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to event_config" ON event_config
  FOR UPDATE USING (true);

-- Insert default event config if none exists
INSERT INTO event_config (couple_names, event_type, event_date, event_time, venue_name, venue_address)
SELECT 'John & Jane', 'Silver Anniversary Celebration', CURRENT_DATE + INTERVAL '3 months', '6:00 PM', 'The Grand Ballroom', '123 Celebration Ave, City, State 12345'
WHERE NOT EXISTS (SELECT 1 FROM event_config LIMIT 1);`;

  const copySQL = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(sqlScript);
    }
  };

  return (
    <Alert className="mb-6 border-yellow-300 bg-yellow-50">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="flex items-center justify-between">
        <span>Database tables not found</span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowSQL(!showSQL)}
        >
          <Database className="h-4 w-4 mr-2" />
          {showSQL ? 'Hide' : 'Show'} Setup SQL
        </Button>
      </AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          Please create the required database tables in your Supabase project:
        </p>
        <ol className="list-decimal ml-4 space-y-1 text-sm">
          <li>Go to your <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Supabase Dashboard</a></li>
          <li>Navigate to <strong>SQL Editor</strong></li>
          <li>Copy and paste the SQL below</li>
          <li>Click <strong>Run</strong></li>
          <li>Refresh this page</li>
        </ol>
        
        {showSQL && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">SQL Script:</span>
              <Button
                size="sm"
                variant="secondary"
                onClick={copySQL}
              >
                Copy SQL
              </Button>
            </div>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs max-h-96 overflow-y-auto">
              {sqlScript}
            </pre>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}