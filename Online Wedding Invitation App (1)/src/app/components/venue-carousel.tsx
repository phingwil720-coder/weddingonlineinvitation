import Slider from 'react-slick';
import { MapPin, Clock, ExternalLink } from 'lucide-react';
import { Venue } from '../../lib/supabase';
import { FloralDecoration } from './floral-decoration';

interface VenueCarouselProps {
  venues: Venue[];
  primaryColor: string;
  accentColor: string;
}

export function VenueCarousel({ venues, primaryColor, accentColor }: VenueCarouselProps) {
  if (!venues || venues.length === 0) {
    return null;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: venues.length > 1,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: false,
    centerMode: true,
    centerPadding: '80px',
    dotsClass: 'slick-dots venue-custom-dots',
    customPaging: () => (
      <div 
        className="w-2 h-2 rounded-full transition-all"
        style={{ backgroundColor: primaryColor }}
      />
    ),
  };

  const handleVenueClick = (googleMapsLink?: string) => {
    if (googleMapsLink) {
      window.open(googleMapsLink, '_blank');
    }
  };

  return (
    <div className="py-16 bg-white bg-[#f9f4f3] relative overflow-hidden">
      <FloralDecoration variant="flower" position="top-left" size="md" opacity={0.3} color="#C3968C" />
      <FloralDecoration variant="vine" position="bottom-right" size="sm" opacity={0.25} color="#7A9173" />
      <div className="max-w-md mx-auto px-6 relative z-10">
        <h3 
          className="text-center mb-10 font-['Playfair_Display'] font-semibold text-foreground font-[Birthstone] text-[48px] text-[#443730]"
        >
          {venues.length > 1 ? 'Event Venues' : 'Venue'}
        </h3>
      </div>
        
      <div className="venue-carousel-container relative z-10">
        <Slider {...settings}>
          {venues.map((venue, index) => (
            <div key={venue.id || index} className="px-2">
              <div 
                className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg cursor-pointer group"
                onClick={() => handleVenueClick(venue.google_maps_link)}
              >
                {/* Venue Image with Overlay */}
                <div className="absolute inset-0">
                  {venue.image_url ? (
                    <img 
                      src={venue.image_url} 
                      alt={venue.venue_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div 
                      className="w-full h-full"
                      style={{ backgroundColor: `${primaryColor}20` }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
                </div>

                {/* Venue Details Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <h4 className="text-2xl font-['Playfair_Display'] font-semibold mb-3">
                    {venue.venue_name}
                  </h4>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <p className="text-sm leading-relaxed">{venue.venue_address}</p>
                    </div>
                    
                    {venue.venue_time && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 flex-shrink-0" />
                        <p className="text-sm">{venue.venue_time}</p>
                      </div>
                    )}
                  </div>

                  {venue.google_maps_link && (
                    <div className="flex items-center gap-2 text-sm opacity-90 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="h-4 w-4" />
                      <span>Tap to view on Google Maps</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <style>{`
        .venue-carousel-container .slick-dots {
          bottom: -40px;
        }
        
        .venue-carousel-container .slick-dots li {
          margin: 0 4px;
        }
        
        .venue-carousel-container .slick-dots li div {
          opacity: 0.3;
        }
        
        .venue-carousel-container .slick-dots li.slick-active div {
          opacity: 1;
          width: 24px;
          border-radius: 4px;
        }
        
        .venue-carousel-container .slick-slide {
          transition: all 300ms ease;
          opacity: 0.5;
          transform: scale(0.9);
        }
        
        .venue-carousel-container .slick-slide.slick-center {
          opacity: 1;
          transform: scale(1);
        }
      `}</style>
    </div>
  );
}