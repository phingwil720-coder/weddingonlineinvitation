import { useState, useEffect } from 'react';
import { supabase, Guest, RSVP, EventConfig } from '../../lib/supabase';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Copy, CheckCircle, XCircle, Clock, Eye, LogOut, Users, Settings as SettingsIcon, Menu, Heart, Image as ImageIcon } from 'lucide-react';
import { DatabaseSetupAlert } from './database-setup-alert';
import { AdminLogin } from './admin-login';
import { EventSettings } from './event-settings';
import { AdminContentManager } from './admin-content-manager';

export function AdminDashboardMobile() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rsvps, setRSVPs] = useState<RSVP[]>([]);
  const [eventConfig, setEventConfig] = useState<EventConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [showDatabaseSetup, setShowDatabaseSetup] = useState(false);
  const [activeTab, setActiveTab] = useState('guests');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    email: '',
    phone: '',
    custom_message: '',
    plus_one_allowed: false,
    max_guests: 1,
  });
  
  // Separate state for max_guests input to allow empty string on mobile
  const [maxGuestsInput, setMaxGuestsInput] = useState('1');

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_authenticated') === 'true';
    setIsAuthenticated(isAuth);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const { data: guestsData, error: guestsError } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (guestsError) throw guestsError;
      setGuests(guestsData || []);

      const { data: rsvpsData, error: rsvpsError } = await supabase
        .from('rsvps')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (rsvpsError) throw rsvpsError;
      setRSVPs(rsvpsData || []);

      const { data: eventConfigData } = await supabase
        .from('event_config')
        .select('*')
        .single();
      
      setEventConfig(eventConfigData || null);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
      setShowDatabaseSetup(true);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingGuest) {
        const { error } = await supabase
          .from('guests')
          .update(formData)
          .eq('id', editingGuest.id);
        
        if (error) throw error;
        toast.success('Guest updated successfully');
      } else {
        const { error } = await supabase
          .from('guests')
          .insert([formData]);
        
        if (error) throw error;
        toast.success('Guest added successfully');
      }
      
      setDialogOpen(false);
      resetForm();
      loadData();
    } catch (error: any) {
      console.error('Error saving guest:', error);
      toast.error(error.message || 'Failed to save guest');
    }
  };

  const handleEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setFormData({
      name: guest.name,
      slug: guest.slug,
      email: guest.email || '',
      phone: guest.phone || '',
      custom_message: guest.custom_message || '',
      plus_one_allowed: guest.plus_one_allowed,
      max_guests: guest.max_guests,
    });
    setMaxGuestsInput(guest.max_guests.toString());
    setDialogOpen(true);
  };

  const handleDelete = async (guestId: string) => {
    if (!confirm('Are you sure you want to delete this guest?')) return;
    
    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', guestId);
      
      if (error) throw error;
      toast.success('Guest deleted successfully');
      loadData();
    } catch (error) {
      console.error('Error deleting guest:', error);
      toast.error('Failed to delete guest');
    }
  };

  const copyInvitationLink = (slug: string) => {
    const link = `${window.location.origin}/${slug}`;
    
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(link)
        .then(() => {
          toast.success('Link copied!');
        })
        .catch(() => {
          toast.success(`Link: ${link}`, { duration: 5000 });
        });
    } else {
      toast.success(`Link: ${link}`, { duration: 5000 });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      email: '',
      phone: '',
      custom_message: '',
      plus_one_allowed: false,
      max_guests: 1,
    });
    setMaxGuestsInput('1');
    setEditingGuest(null);
  };

  const getGuestRSVP = (guestId: string) => {
    return rsvps.find(rsvp => rsvp.guest_id === guestId);
  };

  const getRSVPStatus = (guestId: string) => {
    const rsvp = getGuestRSVP(guestId);
    if (!rsvp) return { status: 'Pending', icon: Clock, color: 'bg-slate-500' };
    if (rsvp.attending) return { status: 'Confirmed', icon: CheckCircle, color: 'bg-green-500' };
    return { status: 'Declined', icon: XCircle, color: 'bg-red-500' };
  };

  const stats = {
    total: guests.reduce((sum, guest) => sum + guest.max_guests, 0),
    confirmed: rsvps.filter(r => r.attending).length,
    declined: rsvps.filter(r => !r.attending).length,
    pending: guests.length - rsvps.length,
    totalAttending: rsvps.filter(r => r.attending).reduce((sum, r) => sum + r.guest_count, 0),
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 font-['Montserrat']">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-['Montserrat']">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-['Playfair_Display'] font-semibold">Admin</h1>
            <p className="text-xs text-slate-500">Silver Anniversary</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 pb-24">
        {showDatabaseSetup && <DatabaseSetupAlert />}

        {/* Stats Cards - Mobile Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-slate-500 mb-1">Total Guests</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-slate-500 mb-1">Confirmed</p>
              <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-slate-500 mb-1">Pending</p>
              <p className="text-3xl font-bold text-slate-600">{stats.pending}</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-slate-500 mb-1">Attending</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalAttending}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs - Mobile Friendly */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="guests">
              <Users className="mr-2 h-4 w-4" />
              Guests
            </TabsTrigger>
            <TabsTrigger value="content">
              <ImageIcon className="mr-2 h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="settings">
              <SettingsIcon className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Guests Tab */}
          <TabsContent value="guests" className="space-y-4">
            {/* Guest Cards - Mobile Optimized */}
            {guests.map((guest) => {
              const rsvp = getGuestRSVP(guest.id);
              const status = getRSVPStatus(guest.id);
              const StatusIcon = status.icon;
              
              return (
                <Card key={guest.id} className="border-none shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{guest.name}</h3>
                        <Badge variant="outline" className="gap-1 text-xs">
                          <StatusIcon className="h-3 w-3" />
                          {status.status}
                        </Badge>
                      </div>
                    </div>

                    {rsvp && (
                      <div className="mb-3 text-sm text-slate-600">
                        {rsvp.attending ? (
                          <span className="text-green-600">✓ {rsvp.guest_count} guest(s) attending</span>
                        ) : (
                          <span className="text-red-600">✗ Declined</span>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/${guest.slug}`)}
                        className="flex-1 rounded-full"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyInvitationLink(guest.slug)}
                        className="flex-1 rounded-full"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(guest)}
                        className="rounded-full"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(guest.id)}
                        className="rounded-full"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {guests.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p>No guests added yet</p>
                <p className="text-sm">Click the + button to add your first guest</p>
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <EventSettings eventConfig={eventConfig} onConfigUpdate={(config) => setEventConfig(config)} />
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <AdminContentManager />
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button 
              size="lg"
              className="rounded-full w-14 h-14 shadow-2xl"
              style={{ backgroundColor: eventConfig?.primary_color || '#9333ea' }}
            >
              <Plus className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] max-h-[85vh] overflow-y-auto rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-['Playfair_Display']">
                {editingGuest ? 'Edit Guest' : 'Add New Guest'}
              </DialogTitle>
              <DialogDescription>
                Create a personalized invitation
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div>
                <Label htmlFor="name" className="mb-3 block text-base">Guest Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="rounded-xl h-12 text-base"
                />
              </div>
              
              <div>
                <Label htmlFor="slug" className="mb-3 block text-base">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  placeholder="johndoe"
                  className="rounded-xl h-12 text-base"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Link: .../{formData.slug || 'guest-slug'}
                </p>
              </div>

              <div>
                <Label htmlFor="email" className="mb-3 block text-base">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="rounded-xl h-12 text-base"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="mb-3 block text-base">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                  className="rounded-xl h-12 text-base"
                />
              </div>

              <div>
                <Label htmlFor="custom_message" className="mb-3 block text-base">Personal Message</Label>
                <Textarea
                  id="custom_message"
                  value={formData.custom_message}
                  onChange={(e) => setFormData({ ...formData, custom_message: e.target.value })}
                  placeholder="Add a personal message..."
                  rows={4}
                  className="rounded-xl resize-none text-base min-h-[100px]"
                />
              </div>

              <div className="flex items-center space-x-3 py-2">
                <Switch
                  id="plus_one"
                  checked={formData.plus_one_allowed}
                  onCheckedChange={(checked) => {
                    setFormData({ 
                      ...formData, 
                      plus_one_allowed: checked,
                      max_guests: checked ? 2 : 1 
                    });
                    setMaxGuestsInput(checked ? '2' : '1');
                  }}
                />
                <Label htmlFor="plus_one" className="text-base">Allow Plus One</Label>
              </div>

              {formData.plus_one_allowed && (
                <div>
                  <Label htmlFor="max_guests" className="mb-3 block text-base">Maximum Guests</Label>
                  <Input
                    id="max_guests"
                    type="text"
                    inputMode="numeric"
                    value={maxGuestsInput}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setMaxGuestsInput(value);
                      if (value !== '') {
                        const numValue = parseInt(value);
                        if (numValue >= 1 && numValue <= 10) {
                          setFormData({ ...formData, max_guests: numValue });
                        }
                      }
                    }}
                    onBlur={() => {
                      // Set to 1 if empty on blur
                      if (maxGuestsInput === '') {
                        setMaxGuestsInput('1');
                        setFormData({ ...formData, max_guests: 1 });
                      }
                    }}
                    placeholder="2"
                    className="rounded-xl h-12 text-base"
                  />
                  <p className="text-xs text-slate-500 mt-2">Enter a number between 1 and 10</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setDialogOpen(false);
                    resetForm();
                  }}
                  className="flex-1 rounded-full h-12"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 rounded-full h-12"
                  style={{ backgroundColor: eventConfig?.primary_color || '#9333ea' }}
                >
                  {editingGuest ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
