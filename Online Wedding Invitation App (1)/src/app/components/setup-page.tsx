import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { AlertCircle, Database, Key, Link, CheckCircle2 } from 'lucide-react';

export function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl mb-2">🎉 Wedding Invitation Setup</h1>
          <p className="text-gray-600">Let's get your silver anniversary celebration site ready!</p>
        </div>

        <Alert className="mb-6 border-yellow-300 bg-yellow-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Supabase not configured.</strong> Please follow the steps below to connect your database.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          {/* Step 1 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-600">Step 1</Badge>
                <CardTitle>Create a Supabase Project</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>1. Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">supabase.com</a> and create a free account</p>
              <p>2. Click "New Project" and fill in the details</p>
              <p>3. Wait for your project to finish setting up (takes ~2 minutes)</p>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-600">Step 2</Badge>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Create Database Tables
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>1. In your Supabase dashboard, go to <strong>SQL Editor</strong></p>
              <p>2. Copy and paste the SQL commands from the <code className="bg-gray-100 px-2 py-1 rounded">SETUP.md</code> file</p>
              <p>3. Click "Run" to create the tables</p>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                <pre>{`-- Quick reference (full SQL in SETUP.md)
CREATE TABLE guests (...);
CREATE TABLE rsvps (...);
-- Plus policies and indexes`}</pre>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-600">Step 3</Badge>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Get Your API Credentials
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>1. In your Supabase project, go to <strong>Settings → API</strong></p>
              <p>2. Copy these two values:</p>
              <div className="space-y-2 ml-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <strong>Project URL</strong>
                    <p className="text-sm text-gray-600">Looks like: https://xxxxx.supabase.co</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <strong>anon/public key</strong>
                    <p className="text-sm text-gray-600">Starts with: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-600">Step 4</Badge>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Configure Your App
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p><strong>Option A: Environment Variables (Recommended)</strong></p>
              <ol className="list-decimal ml-6 space-y-2">
                <li>Create a <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file in the root directory</li>
                <li>Add your credentials:</li>
              </ol>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                <pre>{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here`}</pre>
              </div>
              
              <p className="pt-4"><strong>Option B: Hardcode (Quick Setup)</strong></p>
              <ol className="list-decimal ml-6 space-y-2">
                <li>Open the file <code className="bg-gray-100 px-2 py-1 rounded">/src/lib/supabase.ts</code></li>
                <li>Replace the placeholder values at the top:</li>
              </ol>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                <pre>{`const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key-here';`}</pre>
              </div>

              <Alert className="mt-4">
                <AlertDescription>
                  After configuration, refresh this page and your app will be ready to use!
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Deployment Info */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle>Deploying to Vercel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>When deploying to Vercel:</p>
              <ol className="list-decimal ml-6 space-y-2">
                <li>Push your code to GitHub</li>
                <li>Import the project in Vercel</li>
                <li>Add the same environment variables in Vercel project settings</li>
                <li>Deploy!</li>
              </ol>
              <p className="text-sm text-gray-600">
                Full deployment instructions are available in <code className="bg-white px-2 py-1 rounded">SETUP.md</code>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            Need help? Check the <code className="bg-gray-100 px-2 py-1 rounded">SETUP.md</code> file for detailed instructions.
          </p>
        </div>
      </div>
    </div>
  );
}
