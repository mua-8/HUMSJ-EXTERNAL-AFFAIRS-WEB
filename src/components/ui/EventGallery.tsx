import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface EventImage {
  src: string;
  alt: string;
}

interface EventGalleryProps {
  title?: string;
  subtitle?: string;
  images: EventImage[];
  accentColor?: string;
}

const EventGallery = ({ 
  title = "Recent Events", 
  subtitle = "Highlights from our activities and programs",
  images,
  accentColor = "#d4af37"
}: EventGalleryProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  if (images.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-serif font-bold text-[#2d3339] mb-2">{title}</h2>
          <p className="text-[#5c6370]">No event images uploaded yet.</p>
          <p className="text-[#5c6370]/60 text-sm mt-2">
            Add images to the respective folder to display them here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3">
              {title}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => openLightbox(index)}
                className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer
                         shadow-lg hover:shadow-xl transition-all duration-300
                         focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2"
                aria-label={`View ${image.alt}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 
                           group-hover:scale-110"
                  loading="lazy"
                />
                {/* Hover overlay */}
                <div 
                  className="absolute inset-0 bg-black/0 group-hover:bg-black/30 
                           transition-all duration-300 flex items-center justify-center"
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center
                             opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100
                             transition-all duration-300"
                    style={{ backgroundColor: accentColor }}
                  >
                    <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
                {/* Gold border glow on hover */}
                <div 
                  className="absolute inset-0 rounded-xl border-2 border-transparent 
                           group-hover:border-opacity-100 transition-all duration-300
                           group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                  style={{ borderColor: `${accentColor}00`, ['--hover-border' as string]: accentColor }}
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 
                     text-white transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>

          {/* Previous button */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 
                       text-white transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Image */}
          <div 
            className="max-w-[90vw] max-h-[85vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            {/* Caption */}
            <p className="text-white/80 text-center mt-4 text-sm">
              {images[currentIndex].alt}
            </p>
            {/* Counter */}
            <p className="text-white/50 text-center text-xs mt-1">
              {currentIndex + 1} / {images.length}
            </p>
          </div>

          {/* Next button */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 
                       text-white transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default EventGallery;
