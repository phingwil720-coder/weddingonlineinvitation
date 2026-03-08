import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PrenupCarouselProps {
  images: string[];
  primaryColor: string;
}

export function PrenupCarousel({ images, primaryColor }: PrenupCarouselProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: false,
    centerMode: true,
    centerPadding: '60px',
    dotsClass: 'slick-dots custom-dots',
    customPaging: () => (
      <div 
        className="w-2 h-2 rounded-full transition-all"
        style={{ backgroundColor: primaryColor }}
      />
    ),
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="px-6 py-16 bg-white">
        <div className="max-w-md mx-auto">
          <h3 
            className="text-3xl text-center mb-10 font-['Playfair_Display'] font-semibold text-foreground"
          >
            Our Journey
          </h3>
          
          <div className="prenup-carousel-container">
            <Slider {...settings}>
              {images.map((imageUrl, index) => (
                <div key={index} className="px-2">
                  <div 
                    className="aspect-[3/4] rounded-3xl overflow-hidden shadow-lg cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={() => openLightbox(index)}
                  >
                    <img 
                      src={imageUrl} 
                      alt={`Couple photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>

        <style>{`
          .prenup-carousel-container .slick-dots {
            bottom: -40px;
          }
          
          .prenup-carousel-container .slick-dots li {
            margin: 0 4px;
          }
          
          .prenup-carousel-container .slick-dots li div {
            opacity: 0.3;
          }
          
          .prenup-carousel-container .slick-dots li.slick-active div {
            opacity: 1;
            width: 24px;
            border-radius: 4px;
          }
          
          .prenup-carousel-container .slick-slide {
            transition: all 300ms ease;
            opacity: 0.4;
            transform: scale(0.85);
          }
          
          .prenup-carousel-container .slick-slide.slick-center {
            opacity: 1;
            transform: scale(1);
          }
        `}</style>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 z-60 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6 text-white" />
          </button>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              className="absolute left-4 z-60 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
          )}

          {/* Image */}
          <div 
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentImageIndex]}
              alt={`Photo ${currentImageIndex + 1}`}
              className="w-full h-full object-contain rounded-lg"
            />
            
            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 text-white text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>

          {/* Next Button */}
          {images.length > 1 && (
            <button
              className="absolute right-4 z-60 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          )}
        </div>
      )}
    </>
  );
}