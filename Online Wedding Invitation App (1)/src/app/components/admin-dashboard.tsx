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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Copy, CheckCircle, XCircle, Clock, Eye, LogOut, Users, Settings as SettingsIcon } from 'lucide-react';
import { DatabaseSetupAlert } from './database-setup-alert';
import { AdminLogin } from './admin-login';
import { EventSettings } from './event-settings';

export function AdminDashboard() {
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

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    email: '',
    phone: '',
    custom_message: '',
    plus_one_allowed: false,
    max_guests: 1,
  });

  // Check authentication on mount
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
      
      // Load guests
      const { data: guestsData, error: guestsError } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (guestsError) throw guestsError;
      setGuests(guestsData || []);

      // Load RSVPs
      const { data: rsvpsData, error: rsvpsError } = await supabase
        .from('rsvps')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (rsvpsError) throw rsvpsError;
      setRSVPs(rsvpsData || []);

      // Load Event Config (don't throw error if table doesn't exist yet)
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
      .replace(/[^a-z0-9]+/g, '')
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
        // Update existing guest
        const { error } = await supabase
          .from('guests')
          .update(formData)
          .eq('id', editingGuest.id);
        
        if (error) throw error;
        toast.success('Guest updated successfully');
      } else {
        // Create new guest
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
    
    // Try to use clipboard API, fallback to alert if blocked
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(link)
        .then(() => {
          toast.success('Invitation link copied to clipboard');
        })
        .catch((err) => {
          console.error('Clipboard error:', err);
          // Fallback - show the link in a toast for manual copy
          toast.success(`Link: ${link}`, { duration: 5000 });
        });
    } else {
      // Fallback - show the link in a toast for manual copy
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
    setEditingGuest(null);
  };

  const getGuestRSVP = (guestId: string) => {
    return rsvps.find(rsvp => rsvp.guest_id === guestId);
  };

  const getRSVPStatus = (guestId: string) => {
    const rsvp = getGuestRSVP(guestId);
    if (!rsvp) return { status: 'pending', icon: Clock, color: 'bg-gray-500' };
    if (rsvp.attending) return { status: 'confirmed', icon: CheckCircle, color: 'bg-green-500' };
    return { status: 'declined', icon: XCircle, color: 'bg-red-500' };
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl mb-2">Silver Anniversary Celebration</h1>
            <p className="text-gray-600">Admin Dashboard - Manage your guest list and track RSVPs</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Database Setup Alert */}
        {showDatabaseSetup && <DatabaseSetupAlert />}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Guests</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Confirmed</CardDescription>
              <CardTitle className="text-3xl text-green-600">{stats.confirmed}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Declined</CardDescription>
              <CardTitle className="text-3xl text-red-600">{stats.declined}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending</CardDescription>
              <CardTitle className="text-3xl text-gray-600">{stats.pending}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Attending</CardDescription>
              <CardTitle className="text-3xl text-purple-600">{stats.totalAttending}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Add Guest Dialog */}
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="mb-6">
              <Plus className="mr-2 h-4 w-4" />
              Add Guest
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingGuest ? 'Edit Guest' : 'Add New Guest'}</DialogTitle>
              <DialogDescription>
                Create a personalized invitation for your guest. They'll receive a unique link.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="mb-2 block">Guest Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <Label htmlFor="slug" className="mb-2 block">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  placeholder="johndoe"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Invitation link: {window.location.origin}/{formData.slug || 'guest-slug'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="mb-2 block">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="mb-2 block">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="custom_message" className="mb-2 block">Personal Message</Label>
                <Textarea
                  id="custom_message"
                  value={formData.custom_message}
                  onChange={(e) => setFormData({ ...formData, custom_message: e.target.value })}
                  placeholder="Add a personal message for this guest..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="plus_one"
                  checked={formData.plus_one_allowed}
                  onCheckedChange={(checked) => setFormData({ 
                    ...formData, 
                    plus_one_allowed: checked,
                    max_guests: checked ? 2 : 1 
                  })}
                />
                <Label htmlFor="plus_one">Allow Plus One</Label>
              </div>

              {formData.plus_one_allowed && (
                <div>
                  <Label htmlFor="max_guests" className="mb-2 block">Maximum Guests</Label>
                  <Input
                    id="max_guests"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.max_guests}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, max_guests: value === '' ? 1 : parseInt(value) || 1 });
                    }}
                  />
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => {
                  setDialogOpen(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingGuest ? 'Update' : 'Create'} Guest
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="guests">
              <Users className="mr-2 h-4 w-4" />
              Guests
            </TabsTrigger>
            <TabsTrigger value="settings">
              <SettingsIcon className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Guests Tab */}
          <TabsContent value="guests">
            <Card>
              <CardHeader>
                <CardTitle>Guest List</CardTitle>
                <CardDescription>Manage your guests and track their RSVP status</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Attending</TableHead>
                      <TableHead>Plus One</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guests.map((guest) => {
                      const rsvp = getGuestRSVP(guest.id);
                      const status = getRSVPStatus(guest.id);
                      const StatusIcon = status.icon;
                      
                      return (
                        <TableRow key={guest.id}>
                          <TableCell>{guest.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="gap-1">
                              <StatusIcon className="h-3 w-3" />
                              {status.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {rsvp ? (
                              rsvp.attending ? (
                                <span className="text-green-600">{rsvp.guest_count} guest(s)</span>
                              ) : (
                                <span className="text-red-600">Declined</span>
                              )
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {guest.plus_one_allowed ? (
                              <Badge variant="secondary">Yes (max {guest.max_guests})</Badge>
                            ) : (
                              <Badge variant="outline">No</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {guest.email && <div>{guest.email}</div>}
                              {guest.phone && <div>{guest.phone}</div>}
                              {!guest.email && !guest.phone && <span className="text-gray-400">-</span>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate(`/${guest.slug}`)}
                                title="View Invitation"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyInvitationLink(guest.slug)}
                                title="Copy Link"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(guest)}
                                title="Edit Guest"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(guest.id)}
                                title="Delete Guest"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                {guests.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No guests added yet. Click "Add Guest" to get started.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* RSVP Responses */}
            {rsvps.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Recent RSVP Responses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rsvps.slice(0, 10).map((rsvp) => {
                      const guest = guests.find(g => g.id === rsvp.guest_id);
                      if (!guest) return null;
                      
                      return (
                        <div key={rsvp.id} className="border-b pb-4 last:border-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{guest.name}</p>
                              <p className="text-sm text-gray-600">
                                {rsvp.attending ? (
                                  <span className="text-green-600">
                                    ✓ Attending with {rsvp.guest_count} guest(s)
                                  </span>
                                ) : (
                                  <span className="text-red-600">✗ Unable to attend</span>
                                )}
                              </p>
                              {rsvp.guest_names && (
                                <p className="text-sm text-gray-500">Guests: {rsvp.guest_names}</p>
                              )}
                              {rsvp.message && (
                                <p className="text-sm italic text-gray-600 mt-1">"{rsvp.message}"</p>
                              )}
                            </div>
                            <span className="text-xs text-gray-400">
                              {new Date(rsvp.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <EventSettings eventConfig={eventConfig} onConfigUpdate={(config) => setEventConfig(config)} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
