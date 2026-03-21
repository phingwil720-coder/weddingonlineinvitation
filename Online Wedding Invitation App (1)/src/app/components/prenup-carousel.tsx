import Slider from 'react-slick';
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { FloralDecoration } from './floral-decoration';

interface PrenupCarouselProps {
  images: string[];
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
}

const MAX_DOTS = 5;

export function PrenupCarousel({ images, primaryColor, secondaryColor, textColor }: PrenupCarouselProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const total = images.length;
  const half = Math.floor(MAX_DOTS / 2);
  const startDot = Math.min(Math.max(activeSlide - half, 0), Math.max(total - MAX_DOTS, 0));
  const visibleDots = Math.min(MAX_DOTS, total);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: false,
    centerMode: true,
    centerPadding: '80px',
    beforeChange: (_: number, next: number) => setActiveSlide(next),
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
      <div className="py-16 bg-[#f9f4f3] relative overflow-hidden" style={{ backgroundColor: secondaryColor }}>
        <FloralDecoration variant="vine" position="top-right" size="md" opacity={0.28} color="#C3968C" />
        <FloralDecoration variant="flower" position="bottom-left" size="sm" opacity={0.25} color="#7A9173" />
        <div className="max-w-md mx-auto px-6 relative z-10">
          <h3 
            className="text-center mx-[0px] mt-[0px] mb-[40px] font-[Birthstone] text-[48px] text-[#443730]"
            style={{ color: textColor }}
          >25 Years of Love</h3>
        </div>
        
        <div className="prenup-carousel-container relative z-10">
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

          {/* Windowed dot indicator — shows at most MAX_DOTS dots */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {Array.from({ length: visibleDots }, (_, i) => {
              const slideIndex = startDot + i;
              const isActive = slideIndex === activeSlide;
              return (
                <div
                  key={slideIndex}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: primaryColor,
                    width: isActive ? '24px' : '8px',
                    opacity: isActive ? 1 : 0.3,
                  }}
                />
              );
            })}
          </div>
        </div>
        
        <style>{`
          .prenup-carousel-container .slick-slide {
            transition: all 300ms ease;
            opacity: 0.5;
            transform: scale(0.9);
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
