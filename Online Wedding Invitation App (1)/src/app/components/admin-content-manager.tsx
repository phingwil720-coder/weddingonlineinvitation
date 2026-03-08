import { useState, useEffect } from 'react';
import { supabase, PrenupImage, Venue, FAQ, DressCodeColor } from '../../lib/supabase';
import { deleteImage, extractPathFromUrl } from '../../lib/storage';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { Plus, Trash2, Image as ImageIcon, MapPin, HelpCircle, Palette } from 'lucide-react';
import { ImageUpload } from './image-upload';

export function AdminContentManager() {
  const [prenupImages, setPrenupImages] = useState<PrenupImage[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVenueId, setEditingVenueId] = useState<string | null>(null);

  // Form states
  const [newVenue, setNewVenue] = useState({
    venue_name: '',
    venue_address: '',
    venue_time: '',
    image_url: '',
    image_path: '',
    google_maps_link: '',
  });
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [dressCodeColors, setDressCodeColors] = useState<DressCodeColor[]>([]);
  const [newColor, setNewColor] = useState({ name: '', color: '#8B7355' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const { data: prenupData } = await supabase
        .from('prenup_images')
        .select('*')
        .order('order_index');
      setPrenupImages(prenupData || []);

      const { data: venueData } = await supabase
        .from('venues')
        .select('*')
        .order('order_index');
      setVenues(venueData || []);

      const { data: faqData } = await supabase
        .from('faqs')
        .select('*')
        .order('order_index');
      setFaqs(faqData || []);

      const { data: configData } = await supabase
        .from('event_config')
        .select('dress_code_colors')
        .single();
      
      if (configData?.dress_code_colors) {
        setDressCodeColors(configData.dress_code_colors as DressCodeColor[]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prenup Images
  const handlePrenupImageUpload = async (url: string, path: string) => {
    try {
      const { error } = await supabase.from('prenup_images').insert([
        { 
          image_url: url, 
          image_path: path,
          order_index: prenupImages.length 
        },
      ]);

      if (error) throw error;
      toast.success('Image added successfully');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add image');
    }
  };

  const deletePrenupImage = async (id: string, imagePath?: string) => {
    try {
      // Delete from storage if path exists
      if (imagePath) {
        await deleteImage(imagePath);
      }

      // Delete from database
      const { error } = await supabase.from('prenup_images').delete().eq('id', id);
      if (error) throw error;
      
      toast.success('Image deleted');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete image');
    }
  };

  // Venues
  const handleVenueImageUpload = (url: string, path: string) => {
    setNewVenue({ ...newVenue, image_url: url, image_path: path });
  };

  const addVenue = async () => {
    if (!newVenue.venue_name || !newVenue.venue_address) {
      toast.error('Please enter venue name and address');
      return;
    }

    try {
      const { error } = await supabase.from('venues').insert([
        { ...newVenue, order_index: venues.length },
      ]);

      if (error) throw error;
      toast.success('Venue added successfully');
      setNewVenue({
        venue_name: '',
        venue_address: '',
        venue_time: '',
        image_url: '',
        image_path: '',
        google_maps_link: '',
      });
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add venue');
    }
  };

  const deleteVenue = async (id: string, imagePath?: string) => {
    try {
      // Delete image from storage if exists
      if (imagePath) {
        await deleteImage(imagePath);
      }

      // Delete from database
      const { error } = await supabase.from('venues').delete().eq('id', id);
      if (error) throw error;
      
      toast.success('Venue deleted');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete venue');
    }
  };

  // FAQs
  const addFaq = async () => {
    if (!newFaq.question || !newFaq.answer) {
      toast.error('Please enter both question and answer');
      return;
    }

    try {
      const { error } = await supabase.from('faqs').insert([
        { ...newFaq, order_index: faqs.length },
      ]);

      if (error) throw error;
      toast.success('FAQ added successfully');
      setNewFaq({ question: '', answer: '' });
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add FAQ');
    }
  };

  const deleteFaq = async (id: string) => {
    try {
      const { error } = await supabase.from('faqs').delete().eq('id', id);
      if (error) throw error;
      toast.success('FAQ deleted');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete FAQ');
    }
  };

  // Dress Code Colors
  const addColor = async () => {
    if (!newColor.name || !newColor.color) {
      toast.error('Please enter color name and value');
      return;
    }

    try {
      const updatedColors = [...dressCodeColors, newColor];
      const { error } = await supabase
        .from('event_config')
        .update({ dress_code_colors: updatedColors })
        .eq('id', (await supabase.from('event_config').select('id').single()).data?.id);

      if (error) throw error;
      toast.success('Color added successfully');
      setNewColor({ name: '', color: '#8B7355' });
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add color');
    }
  };

  const deleteColor = async (index: number) => {
    try {
      const updatedColors = dressCodeColors.filter((_, i) => i !== index);
      const { error } = await supabase
        .from('event_config')
        .update({ dress_code_colors: updatedColors })
        .eq('id', (await supabase.from('event_config').select('id').single()).data?.id);

      if (error) throw error;
      toast.success('Color removed');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove color');
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-8 p-6 pb-24">
      {/* Prenup Images Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Prenup Photos Carousel
          </CardTitle>
          <CardDescription>Upload photos for the couple's photo carousel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUpload
            onUploadComplete={handlePrenupImageUpload}
            folder="prenup"
            buttonText="Upload Prenup Photos"
            multiple={true}
          />

          <div className="grid grid-cols-2 gap-4 mt-4">
            {prenupImages.map((img) => (
              <div key={img.id} className="relative group">
                <img
                  src={img.image_url}
                  alt="Prenup"
                  className="w-full aspect-[3/4] object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => deletePrenupImage(img.id, img.image_path)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {prenupImages.length === 0 && (
            <p className="text-center text-slate-500 py-8">No photos uploaded yet</p>
          )}
        </CardContent>
      </Card>

      {/* Venues Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Venues
          </CardTitle>
          <CardDescription>Add event venues with photos and Google Maps links</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <Label>Venue Name *</Label>
              <Input
                placeholder="Grand Ballroom"
                value={newVenue.venue_name}
                onChange={(e) => setNewVenue({ ...newVenue, venue_name: e.target.value })}
              />
            </div>
            <div>
              <Label>Venue Address *</Label>
              <Input
                placeholder="123 Main Street, City, State"
                value={newVenue.venue_address}
                onChange={(e) => setNewVenue({ ...newVenue, venue_address: e.target.value })}
              />
            </div>
            <div>
              <Label>Time</Label>
              <Input
                placeholder="6:00 PM - 10:00 PM"
                value={newVenue.venue_time}
                onChange={(e) => setNewVenue({ ...newVenue, venue_time: e.target.value })}
              />
            </div>
            <div>
              <Label>Google Maps Link</Label>
              <Input
                placeholder="https://maps.google.com/..."
                value={newVenue.google_maps_link}
                onChange={(e) => setNewVenue({ ...newVenue, google_maps_link: e.target.value })}
              />
            </div>
            <div>
              <Label>Venue Photo</Label>
              <ImageUpload
                onUploadComplete={handleVenueImageUpload}
                folder="venues"
                buttonText={newVenue.image_url ? 'Change Photo' : 'Upload Venue Photo'}
              />
              {newVenue.image_url && (
                <img
                  src={newVenue.image_url}
                  alt="Venue preview"
                  className="mt-2 w-full h-40 object-cover rounded-lg"
                />
              )}
            </div>
            <Button onClick={addVenue} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Venue
            </Button>
          </div>

          <div className="space-y-3 mt-6">
            {venues.map((venue) => (
              <div key={venue.id} className="border rounded-lg overflow-hidden">
                {venue.image_url && (
                  <img
                    src={venue.image_url}
                    alt={venue.venue_name}
                    className="w-full h-32 object-cover"
                  />
                )}
                <div className="p-4 flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium">{venue.venue_name}</p>
                    <p className="text-sm text-slate-600">{venue.venue_address}</p>
                    {venue.venue_time && (
                      <p className="text-sm text-slate-500 mt-1">{venue.venue_time}</p>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteVenue(venue.id, venue.image_path)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {venues.length === 0 && (
            <p className="text-center text-slate-500 py-8">No venues added yet</p>
          )}
        </CardContent>
      </Card>

      {/* Dress Code Colors Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Dress Code Colors
          </CardTitle>
          <CardDescription>Add suggested colors for the dress code</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Color Name (e.g., 'Champagne')"
              value={newColor.name}
              onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
              className="flex-1"
            />
            <Input
              type="color"
              value={newColor.color}
              onChange={(e) => setNewColor({ ...newColor, color: e.target.value })}
              className="w-20"
            />
            <Button onClick={addColor}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            {dressCodeColors.map((color, index) => (
              <div key={index} className="flex flex-col items-center gap-2 group">
                <div className="relative">
                  <div
                    className="w-16 h-16 rounded-full shadow-md border-4 border-white"
                    style={{ backgroundColor: color.color }}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => deleteColor(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <span className="text-xs text-slate-600 text-center max-w-[80px]">
                  {color.name}
                </span>
              </div>
            ))}
          </div>

          {dressCodeColors.length === 0 && (
            <p className="text-center text-slate-500 py-8">No colors added yet</p>
          )}
        </CardContent>
      </Card>

      {/* FAQs Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            FAQs
          </CardTitle>
          <CardDescription>Add frequently asked questions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <Label>Question</Label>
              <Input
                placeholder="What time should I arrive?"
                value={newFaq.question}
                onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
              />
            </div>
            <div>
              <Label>Answer</Label>
              <Textarea
                placeholder="Please arrive at least 15 minutes before..."
                value={newFaq.answer}
                onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                rows={3}
              />
            </div>
            <Button onClick={addFaq} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ
            </Button>
          </div>

          <div className="space-y-3 mt-6">
            {faqs.map((faq) => (
              <div key={faq.id} className="p-4 bg-slate-50 rounded-lg">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="font-medium mb-1">{faq.question}</p>
                    <p className="text-sm text-slate-600">{faq.answer}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteFaq(faq.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {faqs.length === 0 && (
            <p className="text-center text-slate-500 py-8">No FAQs added yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}