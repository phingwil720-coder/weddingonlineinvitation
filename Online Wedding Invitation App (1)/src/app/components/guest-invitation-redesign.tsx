import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { supabase, Guest, RSVP, EventConfig } from '../../lib/supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { Heart, Calendar, MapPin, Clock, CheckCircle, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { defaultEventConfig } from '../../lib/event-config';

export function GuestInvitationRedesign() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [guest, setGuest] = useState<Guest | null>(null);
  const [config, setConfig] = useState<EventConfig | null>(null);
  const [existingRSVP, setExistingRSVP] = useState<RSVP | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  
  const [formData, setFormData] = useState({
    attending: '',
    guest_count: 1,
    guest_names: '',
    message: '',
    meal_preference: '',
    dietary_restrictions: '',
    song_request: '',
  });

  useEffect(() => {
    loadData();
  }, [slug]);

  // Secret admin access - click Heart icon 5 times
  const handleSecretClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount === 5) {
      navigate('/admin');
      setClickCount(0);
    }
    
    // Reset counter after 3 seconds of no clicks
    setTimeout(() => setClickCount(0), 3000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load guest
      const { data: guestData, error: guestError } = await supabase
        .from('guests')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (guestError) throw guestError;
      setGuest(guestData);

      // Load event config
      const { data: configData } = await supabase
        .from('event_config')
        .select('*')
        .single();
      
      setConfig(configData || defaultEventConfig as any);

      // Check for existing RSVP
      const { data: rsvpData } = await supabase
        .from('rsvps')
        .select('*')
        .eq('guest_id', guestData.id)
        .single();
      
      if (rsvpData) {
        setExistingRSVP(rsvpData);
        setSubmitted(true);
        setFormData({
          attending: rsvpData.attending ? 'yes' : 'no',
          guest_count: rsvpData.guest_count,
          guest_names: rsvpData.guest_names || '',
          message: rsvpData.message || '',
          meal_preference: rsvpData.meal_preference || '',
          dietary_restrictions: rsvpData.dietary_restrictions || '',
          song_request: rsvpData.song_request || '',
        });
      } else {
        setFormData(prev => ({
          ...prev,
          guest_count: guestData.plus_one_allowed ? 2 : 1,
        }));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!guest) return;
    
    try {
      setSubmitting(true);
      
      const rsvpData = {
        guest_id: guest.id,
        attending: formData.attending === 'yes',
        guest_count: formData.attending === 'yes' ? formData.guest_count : 0,
        guest_names: formData.guest_names,
        message: formData.message,
        meal_preference: formData.meal_preference,
        dietary_restrictions: formData.dietary_restrictions,
        song_request: formData.song_request,
      };

      if (existingRSVP) {
        // Update existing RSVP
        const { error } = await supabase
          .from('rsvps')
          .update(rsvpData)
          .eq('id', existingRSVP.id);
        
        if (error) throw error;
        toast.success('RSVP updated successfully');
      } else {
        // Create new RSVP
        const { error } = await supabase
          .from('rsvps')
          .insert([rsvpData]);
        
        if (error) throw error;
        toast.success('RSVP submitted successfully');
      }
      
      setSubmitted(true);
      loadData();
    } catch (error: any) {
      console.error('Error submitting RSVP:', error);
      toast.error(error.message || 'Failed to submit RSVP');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (!guest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl mb-4">Invitation Not Found</h2>
          <p className="text-slate-600">
            Sorry, we couldn't find an invitation with this link.
          </p>
        </Card>
      </div>
    );
  }

  const eventConfig = config || defaultEventConfig;
  const eventDate = new Date(eventConfig.event_date);
  const rsvpDeadline = new Date(eventConfig.rsvp_deadline);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <div 
        className="relative h-[70vh] flex items-center justify-center overflow-hidden"
        style={{
          background: eventConfig.hero_image_url 
            ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${eventConfig.hero_image_url})`
            : `linear-gradient(135deg, ${eventConfig.primary_color}20 0%, ${eventConfig.accent_color}20 100%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white"></div>
        
        <div className="relative z-10 text-center px-4">
          <button 
            onClick={handleSecretClick}
            className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:scale-110 transition-transform"
            style={{ color: eventConfig.primary_color }}
          >
            <Heart className="h-8 w-8" fill="currentColor" />
          </button>
          
          <h1 className="text-5xl md:text-7xl mb-4 text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>
            {eventConfig.couple_names}
          </h1>
          
          <div className="inline-block px-6 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg mb-6">
            <p className="text-xl md:text-2xl text-slate-700" style={{ fontFamily: 'Georgia, serif' }}>
              {eventConfig.event_type}
            </p>
          </div>
          
          <p className="text-lg md:text-xl text-slate-700 max-w-2xl mx-auto px-4">
            {eventConfig.welcome_message}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16 -mt-20 relative z-20">
        {/* Personal Message Card */}
        <Card className="mb-8 p-8 shadow-xl bg-white/95 backdrop-blur-sm">
          <div className="text-center mb-8">
            <Sparkles className="h-8 w-8 mx-auto mb-4" style={{ color: eventConfig.accent_color }} />
            <h2 className="text-3xl mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Dear {guest.name},
            </h2>
            {guest.custom_message && (
              <p className="text-lg text-slate-600 italic leading-relaxed">
                "{guest.custom_message}"
              </p>
            )}
            {!guest.custom_message && (
              <p className="text-lg text-slate-600 leading-relaxed">
                {eventConfig.event_description}
              </p>
            )}
          </div>
        </Card>

        {/* Event Details Card */}
        <Card className="mb-8 p-8 shadow-xl bg-white/95 backdrop-blur-sm">
          <h3 className="text-2xl mb-6 text-center" style={{ fontFamily: 'Georgia, serif' }}>
            Event Details
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div 
                className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${eventConfig.primary_color}15` }}
              >
                <Calendar className="h-6 w-6" style={{ color: eventConfig.primary_color }} />
              </div>
              <div>
                <p className="text-sm text-slate-500 uppercase tracking-wide">Date</p>
                <p className="text-lg">{eventDate.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div 
                className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${eventConfig.accent_color}15` }}
              >
                <Clock className="h-6 w-6" style={{ color: eventConfig.accent_color }} />
              </div>
              <div>
                <p className="text-sm text-slate-500 uppercase tracking-wide">Time</p>
                <p className="text-lg">{eventConfig.event_time}</p>
              </div>
            </div>

            <div className="flex gap-4 md:col-span-2">
              <div 
                className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${eventConfig.primary_color}15` }}
              >
                <MapPin className="h-6 w-6" style={{ color: eventConfig.primary_color }} />
              </div>
              <div>
                <p className="text-sm text-slate-500 uppercase tracking-wide">Venue</p>
                <p className="text-lg font-medium">{eventConfig.venue_name}</p>
                <p className="text-slate-600">{eventConfig.venue_address}</p>
              </div>
            </div>
          </div>

          {eventConfig.dress_code && (
            <div className="mt-6 pt-6 border-t border-slate-200 text-center">
              <p className="text-sm text-slate-500 uppercase tracking-wide mb-1">Dress Code</p>
              <p className="text-lg">{eventConfig.dress_code}</p>
            </div>
          )}

          {eventConfig.additional_info && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-slate-600 leading-relaxed">{eventConfig.additional_info}</p>
            </div>
          )}
        </Card>

        {/* RSVP Card */}
        <Card className="p-8 shadow-xl bg-white/95 backdrop-blur-sm">
          {submitted ? (
            <div className="text-center py-8">
              <div 
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: `${eventConfig.primary_color}15` }}
              >
                <CheckCircle className="h-12 w-12" style={{ color: eventConfig.primary_color }} />
              </div>
              <h3 className="text-3xl mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                Thank You!
              </h3>
              <p className="text-lg text-slate-600 mb-6">
                {formData.attending === 'yes' 
                  ? "We're delighted you can join us!"
                  : "Thank you for letting us know. You'll be missed!"}
              </p>
              <Button 
                onClick={() => setSubmitted(false)}
                variant="outline"
                style={{ borderColor: eventConfig.primary_color, color: eventConfig.primary_color }}
              >
                Update Response
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-3xl mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  RSVP
                </h3>
                <p className="text-slate-600">
                  Please respond by {rsvpDeadline.toLocaleDateString('en-US', { 
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>

              <div>
                <Label className="text-base mb-3 block">Will you be attending?</Label>
                <RadioGroup
                  value={formData.attending}
                  onValueChange={(value) => setFormData({ ...formData, attending: value })}
                  required
                >
                  <div className="flex items-center space-x-3 p-4 rounded-lg border-2 hover:border-slate-300 transition-colors cursor-pointer"
                    style={{ borderColor: formData.attending === 'yes' ? eventConfig.primary_color : undefined }}
                  >
                    <RadioGroupItem value="yes" id="yes" />
                    <Label htmlFor="yes" className="flex-1 cursor-pointer">
                      Joyfully accepts
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg border-2 hover:border-slate-300 transition-colors cursor-pointer"
                    style={{ borderColor: formData.attending === 'no' ? eventConfig.primary_color : undefined }}
                  >
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no" className="flex-1 cursor-pointer">
                      Regretfully declines
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.attending === 'yes' && (
                <>
                  {guest.plus_one_allowed && (
                    <div>
                      <Label htmlFor="guest_count">Number of Guests</Label>
                      <Input
                        id="guest_count"
                        type="number"
                        min="1"
                        max={guest.max_guests}
                        value={formData.guest_count}
                        onChange={(e) => setFormData({ ...formData, guest_count: parseInt(e.target.value) || 1 })}
                        required
                      />
                      <p className="text-sm text-slate-500 mt-1">
                        Maximum {guest.max_guests} guest{guest.max_guests > 1 ? 's' : ''}
                      </p>
                    </div>
                  )}

                  {formData.guest_count > 1 && (
                    <div>
                      <Label htmlFor="guest_names">Guest Names</Label>
                      <Input
                        id="guest_names"
                        value={formData.guest_names}
                        onChange={(e) => setFormData({ ...formData, guest_names: e.target.value })}
                        placeholder="Please list the names of your guests"
                      />
                    </div>
                  )}

                  {eventConfig.show_meal_preferences && (
                    <div>
                      <Label htmlFor="meal_preference">Meal Preference</Label>
                      <select
                        id="meal_preference"
                        value={formData.meal_preference}
                        onChange={(e) => setFormData({ ...formData, meal_preference: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="">Select meal preference</option>
                        <option value="Chicken">Chicken</option>
                        <option value="Beef">Beef</option>
                        <option value="Fish">Fish</option>
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Vegan">Vegan</option>
                      </select>
                    </div>
                  )}

                  {eventConfig.show_dietary_restrictions && (
                    <div>
                      <Label htmlFor="dietary_restrictions">Dietary Restrictions</Label>
                      <Input
                        id="dietary_restrictions"
                        value={formData.dietary_restrictions}
                        onChange={(e) => setFormData({ ...formData, dietary_restrictions: e.target.value })}
                        placeholder="Any allergies or dietary requirements?"
                      />
                    </div>
                  )}

                  {eventConfig.show_song_requests && (
                    <div>
                      <Label htmlFor="song_request">Song Request</Label>
                      <Input
                        id="song_request"
                        value={formData.song_request}
                        onChange={(e) => setFormData({ ...formData, song_request: e.target.value })}
                        placeholder="Request a song for the celebration"
                      />
                    </div>
                  )}
                </>
              )}

              <div>
                <Label htmlFor="message">Message to the Couple (Optional)</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share your well wishes..."
                  rows={4}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full py-6 text-lg"
                disabled={submitting}
                style={{ backgroundColor: eventConfig.primary_color }}
              >
                {submitting ? 'Submitting...' : 'Submit RSVP'}
              </Button>
            </form>
          )}
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center py-12 text-slate-500">
        <Heart className="h-6 w-6 mx-auto mb-2" style={{ color: eventConfig.accent_color }} />
        <p>We can't wait to celebrate with you!</p>
      </div>
    </div>
  );
}
