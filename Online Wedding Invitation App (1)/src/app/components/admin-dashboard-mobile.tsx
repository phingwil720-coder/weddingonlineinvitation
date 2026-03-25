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
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Copy, CheckCircle, XCircle, Clock, Eye, LogOut, Users, Settings as SettingsIcon, Menu, Heart, Image as ImageIcon, Search } from 'lucide-react';
import { DatabaseSetupAlert } from './database-setup-alert';
import { AdminLogin } from './admin-login';
import { EventSettings } from './event-settings';
import { AdminContentManager } from './admin-content-manager';
import { MarkSentDialog } from './mark-sent-dialog';

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

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [sentFilter, setSentFilter] = useState<'all' | 'sent' | 'not-sent'>('all');
  const [rsvpFilter, setRsvpFilter] = useState<'all' | 'confirmed' | 'pending' | 'declined'>('all');
  
  // Mark sent dialog state
  const [markSentDialogOpen, setMarkSentDialogOpen] = useState(false);
  const [guestToMarkSent, setGuestToMarkSent] = useState<Guest | null>(null);

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

  const copyInvitationLink = (slug: string, guest: Guest) => {
    const link = `${window.location.origin}/${slug}`;
    
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(link)
        .then(() => {
          toast.success('Link copied!');
          // Show mark as sent dialog
          const skipDialog = localStorage.getItem('skip_mark_sent_dialog') === 'true';
          if (!skipDialog && !guest.link_sent) {
            setGuestToMarkSent(guest);
            setMarkSentDialogOpen(true);
          }
        })
        .catch(() => {
          toast.success(`Link: ${link}`, { duration: 5000 });
        });
    } else {
      toast.success(`Link: ${link}`, { duration: 5000 });
    }
  };

  const toggleLinkSent = async (guestId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('guests')
        .update({ link_sent: !currentStatus })
        .eq('id', guestId);

      if (error) throw error;

      // Update local state
      setGuests(guests.map(g => 
        g.id === guestId ? { ...g, link_sent: !currentStatus } : g
      ));

      toast.success(`Marked as ${!currentStatus ? 'sent' : 'not sent'}`);
    } catch (error) {
      console.error('Error updating link_sent:', error);
      toast.error('Failed to update status');
    }
  };

  const handleMarkSentConfirm = async () => {
    if (guestToMarkSent) {
      await toggleLinkSent(guestToMarkSent.id, guestToMarkSent.link_sent);
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

  // Filter and search guests
  const filteredGuests = guests.filter(guest => {
    // Apply search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      guest.name.toLowerCase().includes(searchLower) ||
      guest.email?.toLowerCase().includes(searchLower) ||
      guest.phone?.toLowerCase().includes(searchLower) ||
      guest.custom_message?.toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;

    // Apply sent filter
    if (sentFilter === 'sent' && !guest.link_sent) return false;
    if (sentFilter === 'not-sent' && guest.link_sent) return false;

    // Apply RSVP filter
    if (rsvpFilter !== 'all') {
      const rsvp = getGuestRSVP(guest.id);
      if (rsvpFilter === 'confirmed' && (!rsvp || !rsvp.attending)) return false;
      if (rsvpFilter === 'declined' && (!rsvp || rsvp.attending)) return false;
      if (rsvpFilter === 'pending' && rsvp) return false;
    }

    return true;
  });

  // Calculate filter counts
  const sentCount = guests.filter(g => g.link_sent).length;
  const notSentCount = guests.filter(g => !g.link_sent).length;
  const confirmedCount = rsvps.filter(r => r.attending).length;
  const declinedCount = rsvps.filter(r => !r.attending).length;
  const pendingCount = guests.length - rsvps.length;

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
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search guests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl h-11"
                />
              </div>
            </div>

            {/* Filter Buttons - Sent */}
            <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
              <Button
                variant={sentFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSentFilter('all')}
                className="rounded-full whitespace-nowrap"
              >
                All ({guests.length})
              </Button>
              <Button
                variant={sentFilter === 'not-sent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSentFilter('not-sent')}
                className="rounded-full whitespace-nowrap"
              >
                Not Sent ({notSentCount})
              </Button>
              <Button
                variant={sentFilter === 'sent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSentFilter('sent')}
                className="rounded-full whitespace-nowrap"
              >
                Sent ({sentCount})
              </Button>
            </div>

            {/* Filter Buttons - RSVP Status */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              <Button
                variant={rsvpFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRsvpFilter('all')}
                className="rounded-full whitespace-nowrap"
              >
                All RSVPs
              </Button>
              <Button
                variant={rsvpFilter === 'confirmed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRsvpFilter('confirmed')}
                className="rounded-full whitespace-nowrap"
                style={rsvpFilter === 'confirmed' ? { backgroundColor: '#16a34a', borderColor: '#16a34a' } : { borderColor: '#16a34a', color: '#16a34a' }}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Confirmed ({confirmedCount})
              </Button>
              <Button
                variant={rsvpFilter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRsvpFilter('pending')}
                className="rounded-full whitespace-nowrap"
                style={rsvpFilter === 'pending' ? { backgroundColor: '#64748b', borderColor: '#64748b' } : { borderColor: '#64748b', color: '#64748b' }}
              >
                <Clock className="h-3 w-3 mr-1" />
                Pending ({pendingCount})
              </Button>
              <Button
                variant={rsvpFilter === 'declined' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRsvpFilter('declined')}
                className="rounded-full whitespace-nowrap"
                style={rsvpFilter === 'declined' ? { backgroundColor: '#dc2626', borderColor: '#dc2626' } : { borderColor: '#dc2626', color: '#dc2626' }}
              >
                <XCircle className="h-3 w-3 mr-1" />
                Declined ({declinedCount})
              </Button>
            </div>

            {/* Guest Cards - Mobile Optimized */}
            {filteredGuests.map((guest) => {
              const rsvp = getGuestRSVP(guest.id);
              const status = getRSVPStatus(guest.id);
              const StatusIcon = status.icon;
              
              return (
                <Card key={guest.id} className="border-none shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{guest.name}</h3>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Checkbox
                              checked={guest.link_sent}
                              onCheckedChange={() => toggleLinkSent(guest.id, guest.link_sent)}
                              id={`sent-mobile-${guest.id}`}
                            />
                            <Label
                              htmlFor={`sent-mobile-${guest.id}`}
                              className="text-xs cursor-pointer"
                            >
                              {guest.link_sent ? (
                                <span className="text-green-600">✓ Sent</span>
                              ) : (
                                <span className="text-slate-400">Not sent</span>
                              )}
                            </Label>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="outline" className="gap-1 text-xs">
                            <StatusIcon className="h-3 w-3" />
                            {status.status}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className="gap-1 text-xs"
                            style={{
                              borderColor: guest.plus_one_allowed ? '#7A9173' : '#94a3b8',
                              backgroundColor: guest.plus_one_allowed ? '#7A917310' : '#f1f5f9',
                              color: guest.plus_one_allowed ? '#7A9173' : '#64748b'
                            }}
                          >
                            {guest.plus_one_allowed ? `+${guest.max_guests - 1}` : 'Solo'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {rsvp && (
                      <div className="mb-3 text-sm text-slate-600 space-y-1">
                        {rsvp.attending ? (
                          <div className="text-green-600 space-y-0.5">
                            <div>✓ {rsvp.guest_count} guest(s) attending</div>
                            {rsvp.guest_names && (
                              <div className="text-xs text-slate-500 pl-3">{rsvp.guest_names}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-red-600">✗ Declined</span>
                        )}
                        {rsvp.message && (
                          <div className="text-xs text-slate-500 italic border-l-2 border-slate-200 pl-2 mt-1">
                            "{rsvp.message}"
                          </div>
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
                        onClick={() => copyInvitationLink(guest.slug, guest)}
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

            {filteredGuests.length === 0 && (
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
                  className="data-[state=unchecked]:bg-slate-300"
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
                  <Label className="mb-3 block text-base">Total Party Size</Label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        const next = Math.max(2, formData.max_guests - 1);
                        setFormData({ ...formData, max_guests: next });
                        setMaxGuestsInput(String(next));
                      }}
                      disabled={formData.max_guests <= 2}
                      className="w-12 h-12 rounded-full border-2 text-xl font-semibold flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{ borderColor: '#7A9173', color: '#7A9173' }}
                    >
                      −
                    </button>
                    <span className="text-2xl font-semibold w-8 text-center text-foreground">
                      {formData.max_guests}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const next = Math.min(10, formData.max_guests + 1);
                        setFormData({ ...formData, max_guests: next });
                        setMaxGuestsInput(String(next));
                      }}
                      disabled={formData.max_guests >= 10}
                      className="w-12 h-12 rounded-full border-2 text-xl font-semibold flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{ borderColor: '#7A9173', color: '#7A9173' }}
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Total attendees including the primary guest (max 10)</p>
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

      {/* Mark Sent Dialog */}
      <MarkSentDialog
        open={markSentDialogOpen}
        onOpenChange={setMarkSentDialogOpen}
        guestName={guestToMarkSent?.name || ''}
        onConfirm={handleMarkSentConfirm}
      />
    </div>
  );
}
