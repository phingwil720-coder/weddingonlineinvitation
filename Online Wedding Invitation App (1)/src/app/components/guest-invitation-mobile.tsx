import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { supabase, Guest, RSVP, EventConfig, PrenupImage, Venue, FAQ } from '../../lib/supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { toast } from 'sonner';
import { Heart, Calendar, MapPin, Clock, CheckCircle, Sparkles, ChevronDown } from 'lucide-react';
import { defaultEventConfig } from '../../lib/event-config';
import { CountdownTimer } from './countdown-timer';
import { PrenupCarousel } from './prenup-carousel';
import { VenueCarousel } from './venue-carousel';
import { DressCodeSection } from './dress-code-section';
import { FAQsSection } from './faqs-section';
import { FloralDecoration } from './floral-decoration';
import { EnvelopeOpening } from './envelope-opening';

export function GuestInvitationMobile() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [guest, setGuest] = useState<Guest | null>(null);
  const [config, setConfig] = useState<EventConfig | null>(null);
  const [prenupImages, setPrenupImages] = useState<PrenupImage[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [existingRSVP, setExistingRSVP] = useState<RSVP | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showRSVPForm, setShowRSVPForm] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  
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

  // Parallax scroll effect
  useEffect(() => {
    let ticking = false;
    let lastScrollY = 0;

    const handleScroll = () => {
      lastScrollY = window.scrollY;
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Slow down the background scroll (0.5 = half speed)
          setParallaxOffset(lastScrollY * 0.5);
          ticking = false;
        });
        
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Secret admin access - click Heart icon 5 times
  const handleSecretClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount === 5) {
      navigate('/admin');
      setClickCount(0);
    }
    
    setTimeout(() => setClickCount(0), 3000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      const { data: guestData, error: guestError } = await supabase
        .from('guests')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (guestError) throw guestError;
      setGuest(guestData);

      const { data: configData } = await supabase
        .from('event_config')
        .select('*')
        .single();
      
      setConfig(configData || defaultEventConfig as any);

      // Load prenup images
      const { data: prenupData } = await supabase
        .from('prenup_images')
        .select('*')
        .order('order_index');
      setPrenupImages(prenupData || []);

      // Load venues
      const { data: venueData } = await supabase
        .from('venues')
        .select('*')
        .order('order_index');
      setVenues(venueData || []);

      // Load FAQs
      const { data: faqData } = await supabase
        .from('faqs')
        .select('*')
        .order('order_index');
      setFaqs(faqData || []);

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
        const { error } = await supabase
          .from('rsvps')
          .update(rsvpData)
          .eq('id', existingRSVP.id);
        
        if (error) throw error;
        toast.success('RSVP updated successfully');
      } else {
        const { error } = await supabase
          .from('rsvps')
          .insert([rsvpData]);
        
        if (error) throw error;
        toast.success('RSVP submitted successfully');
      }
      
      setSubmitted(true);
      setShowRSVPForm(false);
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground font-['Montserrat']">Loading your invitation...</p>
        </div>
      </div>
    );
  }

  if (!guest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center">
          <h2 className="text-2xl mb-4 font-['Playfair_Display'] text-foreground">Invitation Not Found</h2>
          <p className="text-muted-foreground font-['Montserrat']">
            Sorry, we couldn't find an invitation with this link.
          </p>
        </div>
      </div>
    );
  }

  const eventConfig = config || defaultEventConfig;
  const eventDate = new Date(eventConfig.event_date);
  const rsvpDeadline = new Date(eventConfig.rsvp_deadline);

  return (
    <div className="min-h-screen bg-white font-['Montserrat']">
      {/* Envelope overlay on first load */}
      {!envelopeOpened && (
        <EnvelopeOpening
          monogramUrl={eventConfig.monogram_icon_url}
          onOpen={() => setEnvelopeOpened(true)}
        />
      )}

      {/* Hero Section - Full-Screen Photo with Guest Name */}
      <div 
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 py-20"
      >
        {/* Parallax Background Layer */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: eventConfig.hero_image_url 
              ? `url(${eventConfig.hero_image_url})`
              : `linear-gradient(135deg, ${eventConfig.primary_color} 0%, ${eventConfig.accent_color} 100%)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${parallaxOffset}px)`,
            willChange: 'transform',
          }}
        />
        
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Secret Monogram/Heart Button */}
        <button 
          onClick={handleSecretClick}
          className={`relative z-10 mb-8 inline-flex items-center justify-center hover:scale-110 transition-transform active:scale-95 ${
            eventConfig.monogram_icon_url 
              ? 'bg-transparent w-20 h-20' 
              : 'bg-white/90 shadow-lg w-14 h-14 rounded-full'
          }`}
          style={{ color: eventConfig.primary_color }}
        >
          {eventConfig.monogram_icon_url ? (
            <img 
              src={eventConfig.monogram_icon_url} 
              alt="Monogram" 
              className="h-20 w-20 object-contain"
            />
          ) : (
            <Heart className="h-7 w-7" fill="currentColor" />
          )}
        </button>
        
        {/* Main Content */}
        <div className="relative z-10 text-center max-w-md text-white">
          <p className="text-xs uppercase tracking-[0.4em] mb-6 opacity-90">
            You're Invited
          </p>
          
          {/* GUEST NAME - PROMINENT */}
          <h1 
            className="text-6xl md:text-7xl mb-12 leading-tight font-['Playfair_Display'] font-bold"
          >
            {guest.name}
          </h1>
          
          {/* Couple Names */}
          <h2 className="text-3xl md:text-4xl mb-6 font-['Playfair_Display'] font-semibold opacity-95">
            {eventConfig.couple_names}
          </h2>
          
          <div className="mb-8">
            <div className="inline-block px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <p className="text-base font-medium tracking-wide">
                {eventConfig.event_type}
              </p>
            </div>
          </div>

          {/* ELEGANT DATE DISPLAY */}
          <div className="mb-6">
            <p className="text-5xl font-['Playfair_Display'] font-bold mb-2">
              {eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </p>
            <p className="text-lg opacity-90">
              {eventDate.toLocaleDateString('en-US', { year: 'numeric' })} • {eventConfig.event_time}
            </p>
          </div>

          {/* Venue at bottom */}
          <div className="mt-12 opacity-90">
            <p className="text-sm mb-1">{eventConfig.venue_name}</p>
            <p className="text-xs">{eventConfig.venue_address}</p>
          </div>

          {/* Scroll indicator */}
          <div className="animate-bounce mt-16">
            <ChevronDown className="h-6 w-6 mx-auto" />
          </div>
        </div>
      </div>

      {/* Countdown Timer */}
      <CountdownTimer 
        targetDate={eventConfig.event_date}
        primaryColor={eventConfig.primary_color}
        accentColor={eventConfig.accent_color}
      />

      {/* Prenup Photo Carousel */}
      {prenupImages.length > 0 && (
        <PrenupCarousel 
          images={prenupImages.map(img => img.image_url)}
          primaryColor={eventConfig.primary_color}
        />
      )}

      {/* Personalized Message */}
      <div className="px-6 py-16 bg-accent bg-[#bd988a] relative overflow-hidden">
        <FloralDecoration variant="branch" position="top-left" size="md" opacity={0.35} color="#ffffff" />
        <FloralDecoration variant="vine" position="bottom-right" size="sm" opacity={0.3} color="#ffffff" />
        <div className="max-w-md mx-auto relative z-10">
          <div className="text-center">
            <Sparkles className="h-8 w-8 mx-auto mb-6 text-white/90" />
            <h2 className="text-4xl mb-8 font-['Playfair_Display'] font-semibold text-white">
              Dear {guest.name},
            </h2>
            <p className="text-lg leading-relaxed font-['Cormorant_Garamond'] italic text-white/90">
              {guest.custom_message || eventConfig.universal_message || eventConfig.event_description}
            </p>
          </div>
        </div>
      </div>

      {/* Venue Carousel */}
      {venues.length > 0 && (
        <VenueCarousel 
          venues={venues}
          primaryColor={eventConfig.primary_color}
          accentColor={eventConfig.accent_color}
        />
      )}

      {/* Dress Code with Color Palette */}
      <DressCodeSection 
        dressCode={eventConfig.dress_code}
        dressCodeDescription={eventConfig.dress_code_description}
        dressCodeColors={eventConfig.dress_code_colors}
        primaryColor={eventConfig.primary_color}
      />

      {/* FAQs Section */}
      {faqs.length > 0 && (
        <FAQsSection 
          faqs={faqs}
          primaryColor={eventConfig.primary_color}
        />
      )}

      {/* RSVP Section */}
      <div className="px-6 py-16 bg-white relative overflow-hidden bg-[#ffffff]">
        <FloralDecoration variant="flower" position="top-left" size="lg" opacity={0.25} color="#7A9173" />
        <FloralDecoration variant="vine" position="bottom-right" size="md" opacity={0.28} color="#7A9173" />
        <div className="max-w-md mx-auto relative z-10">
          {submitted && !showRSVPForm ? (
            <div className="text-center py-12">
              <div 
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: `${eventConfig.primary_color}15` }}
              >
                <CheckCircle className="h-12 w-12" style={{ color: eventConfig.primary_color }} />
              </div>
              <h3 className="text-3xl mb-4 font-['Playfair_Display'] font-semibold text-foreground">
                {formData.attending === 'yes' ? "We'll See You There!" : "Thank You"}
              </h3>
              <p className="text-lg mb-8 text-muted-foreground">
                {formData.attending === 'yes' 
                  ? "We're so excited to celebrate with you!"
                  : "Thank you for letting us know. You'll be missed!"}
              </p>
              <Button 
                onClick={() => setShowRSVPForm(true)}
                variant="outline"
                className="rounded-full px-8 py-6 text-base border-primary text-primary hover:bg-primary/5"
              >
                Update Response
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="text-center mb-10">
                <h3 className="mb-3 font-['Playfair_Display'] font-semibold text-foreground text-[40px]">
                  RSVP
                </h3>
                <p className="text-muted-foreground">
                  Please respond by {rsvpDeadline.toLocaleDateString('en-US', { 
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>

              <div>
                <Label className="text-base mb-4 block text-foreground">Will you be attending?</Label>
                <RadioGroup
                  value={formData.attending}
                  onValueChange={(value) => setFormData({ ...formData, attending: value })}
                  required
                  className="space-y-3"
                >
                  <div 
                    className="flex items-center space-x-4 p-5 rounded-2xl border-2 transition-all cursor-pointer active:scale-[0.98]"
                    style={{ 
                      borderColor: formData.attending === 'yes' ? eventConfig.primary_color : 'rgba(92, 74, 71, 0.15)',
                      backgroundColor: formData.attending === 'yes' ? `${eventConfig.primary_color}08` : 'white'
                    }}
                  >
                    <RadioGroupItem value="yes" id="yes" />
                    <Label htmlFor="yes" className="flex-1 cursor-pointer text-base text-foreground">
                      ✓ Joyfully Accepts
                    </Label>
                  </div>
                  <div 
                    className="flex items-center space-x-4 p-5 rounded-2xl border-2 transition-all cursor-pointer active:scale-[0.98]"
                    style={{ 
                      borderColor: formData.attending === 'no' ? eventConfig.primary_color : 'rgba(92, 74, 71, 0.15)',
                      backgroundColor: formData.attending === 'no' ? `${eventConfig.primary_color}08` : 'white'
                    }}
                  >
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no" className="flex-1 cursor-pointer text-base text-foreground">
                      Regretfully Declines
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.attending === 'yes' && (
                <div className="space-y-6 pt-4">
                  {guest.plus_one_allowed && (
                    <div>
                      <Label htmlFor="guest_count" className="text-base mb-3 block text-foreground">
                        How many people total? (including you)
                      </Label>
                      <Input
                        id="guest_count"
                        type="number"
                        min="1"
                        max={guest.max_guests}
                        value={formData.guest_count}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Allow empty string or valid numbers
                          setFormData({ 
                            ...formData, 
                            guest_count: value === '' ? 0 : parseInt(value) || 0
                          });
                        }}
                        onBlur={(e) => {
                          // On blur, ensure minimum of 1
                          if (formData.guest_count < 1) {
                            setFormData({ ...formData, guest_count: 1 });
                          }
                        }}
                        required
                        className="rounded-xl py-6 text-base"
                      />
                      <p className="text-sm mt-2 text-muted-foreground">
                        You can bring up to {guest.max_guests} {guest.max_guests === 1 ? 'person' : 'people'} total
                      </p>
                    </div>
                  )}

                  {formData.guest_count > 1 && (
                    <div>
                      <Label htmlFor="guest_names" className="text-base mb-3 block text-foreground">
                        Guest Names
                      </Label>
                      <Input
                        id="guest_names"
                        value={formData.guest_names}
                        onChange={(e) => setFormData({ ...formData, guest_names: e.target.value })}
                        placeholder="Please list the names of your guests"
                        className="rounded-xl py-6 text-base"
                      />
                    </div>
                  )}

                  {eventConfig.show_meal_preferences && (
                    <div>
                      <Label htmlFor="meal_preference" className="text-base mb-3 block text-foreground">
                        Meal Preference
                      </Label>
                      <select
                        id="meal_preference"
                        value={formData.meal_preference}
                        onChange={(e) => setFormData({ ...formData, meal_preference: e.target.value })}
                        className="w-full px-4 py-4 border border-border rounded-xl text-base bg-white text-foreground"
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
                      <Label htmlFor="dietary_restrictions" className="text-base mb-3 block text-foreground">
                        Dietary Restrictions
                      </Label>
                      <Input
                        id="dietary_restrictions"
                        value={formData.dietary_restrictions}
                        onChange={(e) => setFormData({ ...formData, dietary_restrictions: e.target.value })}
                        placeholder="Any allergies or dietary requirements?"
                        className="rounded-xl py-6 text-base"
                      />
                    </div>
                  )}

                  {eventConfig.show_song_requests && (
                    <div>
                      <Label htmlFor="song_request" className="text-base mb-3 block text-foreground">
                        Song Request
                      </Label>
                      <Input
                        id="song_request"
                        value={formData.song_request}
                        onChange={(e) => setFormData({ ...formData, song_request: e.target.value })}
                        placeholder="Request a song for the celebration"
                        className="rounded-xl py-6 text-base"
                      />
                    </div>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="message" className="text-base mb-3 block text-foreground">
                  Message to the Couple (Optional)
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share your well wishes..."
                  rows={4}
                  className="rounded-xl text-base resize-none"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full py-7 text-lg rounded-full shadow-lg active:scale-[0.98] transition-transform text-white hover:opacity-90"
                disabled={submitting}
                style={{ backgroundColor: eventConfig.primary_color }}
              >
                {submitting ? 'Submitting...' : 'Submit RSVP'}
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-16 px-6 bg-secondary bg-[#bd988a] relative overflow-hidden">
        <div className="relative z-10">
          <Heart className="h-8 w-8 mx-auto mb-4" style={{ color: eventConfig.accent_color }} />
          <p className="font-['Playfair_Display'] text-xl text-foreground text-[#ffffff] mb-2">
            We can't wait to celebrate with you!
          </p>
          <p className="font-['Montserrat'] text-sm text-[#ffffff] opacity-90 mt-4">
            With love and gratitude
          </p>
        </div>
      </div>
    </div>
  );
}