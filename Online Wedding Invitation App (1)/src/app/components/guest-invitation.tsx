import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { supabase, Guest, RSVP } from '../../lib/supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { Heart, Calendar, MapPin, Clock, CheckCircle, Settings } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function GuestInvitation() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [guest, setGuest] = useState<Guest | null>(null);
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
  });

  useEffect(() => {
    loadGuest();
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

  const loadGuest = async () => {
    if (!slug) return;
    
    try {
      setLoading(true);
      
      // Load guest by slug
      const { data: guestData, error: guestError } = await supabase
        .from('guests')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (guestError) throw guestError;
      setGuest(guestData);

      // Check for existing RSVP
      const { data: rsvpData, error: rsvpError } = await supabase
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
        });
      }
    } catch (error: any) {
      console.error('Error loading guest:', error);
      if (error.code !== 'PGRST116') { // Not found error
        toast.error('Failed to load invitation');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!guest || !formData.attending) {
      toast.error('Please select whether you can attend');
      return;
    }

    if (formData.attending === 'yes' && formData.guest_count < 1) {
      toast.error('Please specify the number of guests');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const rsvpData = {
        guest_id: guest.id,
        attending: formData.attending === 'yes',
        guest_count: formData.attending === 'yes' ? formData.guest_count : 0,
        guest_names: formData.guest_names || null,
        message: formData.message || null,
      };

      if (existingRSVP) {
        // Update existing RSVP
        const { error } = await supabase
          .from('rsvps')
          .update(rsvpData)
          .eq('id', existingRSVP.id);
        
        if (error) throw error;
        toast.success('RSVP updated successfully!');
      } else {
        // Create new RSVP
        const { error } = await supabase
          .from('rsvps')
          .insert([rsvpData]);
        
        if (error) throw error;
        toast.success('Thank you for your RSVP!');
      }
      
      setSubmitted(true);
      loadGuest(); // Reload to get updated RSVP
    } catch (error: any) {
      console.error('Error submitting RSVP:', error);
      toast.error(error.message || 'Failed to submit RSVP');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (!guest) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Invitation Not Found</CardTitle>
            <CardDescription>
              We couldn't find an invitation with this link. Please check the URL and try again.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header Image */}
        <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1764380746818-18c01e96df12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjB3ZWRkaW5nJTIwYW5uaXZlcnNhcnklMjBjZWxlYnJhdGlvbiUyMGVsZWdhbnR8ZW58MXx8fHwxNzcwNzA2NTQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Silver Anniversary Celebration"
            className="w-full h-64 object-cover"
          />
        </div>

        {/* Invitation Card */}
        <Card className="shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <Heart className="h-12 w-12 text-purple-600 fill-purple-100" onClick={handleSecretClick} />
            </div>
            <CardTitle className="text-4xl mb-2">
              Silver Anniversary Celebration
            </CardTitle>
            <p className="text-xl text-gray-600 mb-4">
              25 Years of Love & Commitment
            </p>
            <div className="text-lg">
              <p className="mb-1">Together we celebrate</p>
              <p className="text-2xl text-purple-600">Our Parents' Journey</p>
            </div>
          </CardHeader>

          <CardContent>
            {/* Personal Message */}
            <Card className="mb-6 bg-purple-50 border-purple-200">
              <CardContent className="pt-6">
                <p className="text-lg mb-2">Dear {guest.name},</p>
                {guest.custom_message ? (
                  <p className="text-gray-700 leading-relaxed">{guest.custom_message}</p>
                ) : (
                  <p className="text-gray-700 leading-relaxed">
                    We would be honored to have you join us as we celebrate 25 wonderful years together. 
                    Your presence would mean the world to us as we mark this special milestone.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Event Details */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-purple-600 mt-1" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-gray-600">Saturday, March 15, 2026</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-purple-600 mt-1" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-gray-600">6:00 PM - 11:00 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-purple-600 mt-1" />
                    <div>
                      <p className="font-medium">Venue</p>
                      <p className="text-gray-600">The Grand Ballroom</p>
                      <p className="text-gray-600">123 Celebration Avenue, Your City</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* RSVP Form */}
            {submitted && !existingRSVP ? (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl mb-2">Thank You!</h3>
                  <p className="text-gray-700">
                    {formData.attending === 'yes' 
                      ? "We're so excited to celebrate with you!" 
                      : "Thank you for letting us know. You'll be missed!"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>RSVP</CardTitle>
                  <CardDescription>
                    Please let us know if you can join us
                    {existingRSVP && " (You can update your response below)"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label className="text-base mb-3 block">Will you be attending?</Label>
                      <RadioGroup
                        value={formData.attending}
                        onValueChange={(value) => setFormData({ ...formData, attending: value })}
                      >
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="yes" id="yes" />
                          <Label htmlFor="yes" className="flex-1 cursor-pointer">
                            Yes, I'll be there! 🎉
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="no" id="no" />
                          <Label htmlFor="no" className="flex-1 cursor-pointer">
                            Sorry, I can't make it
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {formData.attending === 'yes' && (
                      <>
                        <div>
                          <Label htmlFor="guest_count">Number of Guests</Label>
                          <Input
                            id="guest_count"
                            type="number"
                            min="1"
                            max={guest.max_guests}
                            value={formData.guest_count}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              guest_count: parseInt(e.target.value) || 1 
                            })}
                            required
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            {guest.plus_one_allowed 
                              ? `You can bring up to ${guest.max_guests} guest(s)` 
                              : 'Individual invitation'}
                          </p>
                        </div>

                        {formData.guest_count > 1 && (
                          <div>
                            <Label htmlFor="guest_names">Names of Additional Guests</Label>
                            <Input
                              id="guest_names"
                              value={formData.guest_names}
                              onChange={(e) => setFormData({ ...formData, guest_names: e.target.value })}
                              placeholder="e.g., Jane Doe, John Smith"
                            />
                          </div>
                        )}
                      </>
                    )}

                    <div>
                      <Label htmlFor="message">Message (Optional)</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Share your best wishes or dietary requirements..."
                        rows={4}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={submitting || !formData.attending}
                    >
                      {submitting ? 'Submitting...' : existingRSVP ? 'Update RSVP' : 'Submit RSVP'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Footer */}
            <div className="mt-8 text-center text-gray-600">
              <p className="text-sm">
                For any questions, please contact us at celebration@example.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}