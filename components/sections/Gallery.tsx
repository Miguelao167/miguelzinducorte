'use client'

import { useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import GlowText from '@/components/ui/GlowText'
import { GALLERY_IMAGES } from '@/lib/constants'
import { cn } from '@/lib/utils'

export default function Gallery() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const horizontalRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-70%'])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  const openLightbox = (index: number) => setSelectedImage(index)
  const closeLightbox = () => setSelectedImage(null)
  
  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return
    if (direction === 'prev') {
      setSelectedImage(selectedImage === 0 ? GALLERY_IMAGES.length - 1 : selectedImage - 1)
    } else {
      setSelectedImage(selectedImage === GALLERY_IMAGES.length - 1 ? 0 : selectedImage + 1)
    }
  }

  return (
    <>
      <section
        id="galeria"
        ref={sectionRef}
        className="relative py-32 overflow-hidden bg-gradient-to-b from-white via-bg-secondary/50 to-white"
      >
        <div className="relative z-10">
          {/* Section Header */}
          <motion.div
            className="container-custom mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block text-accent-primary text-sm font-mono tracking-widest uppercase mb-4 font-semibold">
              Portfólio
            </span>
            
            <h2 className="font-display text-4xl md:text-6xl font-bold text-text-primary">
              <GlowText>Nossos</GlowText>{' '}
              <span className="text-text-primary">Trabalhos</span>
            </h2>
          </motion.div>

          {/* Horizontal Scroll Container */}
          <motion.div
            ref={horizontalRef}
            style={{ x, opacity }}
            className="flex gap-6 px-[clamp(1rem,5vw,3rem)]"
          >
            {/* Sticky header for context */}
            <div className="sticky left-0 flex-shrink-0 w-[300px] hidden lg:flex items-center pr-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 }}
              >
                <p className="text-text-secondary text-lg leading-relaxed">
                  Cada corte conta uma história. Cada estilo é único. 
                  Veja alguns dos nossos trabalhos mais recentes.
                </p>
              </motion.div>
            </div>

            {/* Gallery Images */}
            {GALLERY_IMAGES.map((image, index) => (
              <motion.div
                key={image.id}
                className="flex-shrink-0"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-card-light">
                  {/* Image */}
                  <motion.img
                    src={image.src}
                    alt={image.alt}
                    className="w-[350px] h-[450px] md:w-[400px] md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                    whileHover={{ scale: 1.05 }}
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Hover Content */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <motion.div
                      className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center border border-accent-primary/30 shadow-glow-sm"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ type: 'spring' }}
                    >
                      <ZoomIn className="w-8 h-8 text-accent-primary" />
                    </motion.div>
                  </div>

                  {/* Bottom Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-text-primary font-medium">{image.alt}</p>
                  </div>

                  {/* Border glow */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none border-2 border-accent-primary/40" />
                </div>

                {/* Click to open lightbox */}
                <button
                  onClick={() => openLightbox(index)}
                  className="absolute inset-0 w-full h-full"
                  aria-label={`Ver ${image.alt} em tela cheia`}
                />
              </motion.div>
            ))}

            {/* End spacer for scroll */}
            <div className="flex-shrink-0 w-[100px] hidden lg:block" />
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            className="container-custom mt-12 flex items-center gap-4 text-text-muted"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1 }}
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent-primary/20 to-transparent" />
            <span className="text-sm font-medium">Arraste para ver mais</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent-primary/20 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <motion.div
        className={cn(
          'fixed inset-0 z-[100] flex items-center justify-center',
          selectedImage === null ? 'pointer-events-none' : ''
        )}
        initial={{ opacity: 0 }}
        animate={selectedImage !== null ? { opacity: 1 } : { opacity: 0 }}
        onClick={closeLightbox}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-white/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
        
        {/* Image */}
        {selectedImage !== null && (
          <motion.img
            key={selectedImage}
            src={GALLERY_IMAGES[selectedImage].src}
            alt={GALLERY_IMAGES[selectedImage].alt}
            className="relative max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-card-light-hover"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
          />
        )}

        {/* Close button */}
        <button
          className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white border border-accent-primary/20 flex items-center justify-center text-text-primary hover:bg-accent-primary hover:text-white transition-colors shadow-card-light"
          onClick={closeLightbox}
          aria-label="Fechar"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Navigation */}
        {selectedImage !== null && GALLERY_IMAGES.length > 1 && (
          <>
            <button
              className="absolute left-6 w-12 h-12 rounded-full bg-white border border-accent-primary/20 flex items-center justify-center text-text-primary hover:bg-accent-primary hover:text-white transition-colors shadow-card-light"
              onClick={(e) => { e.stopPropagation(); navigateImage('prev') }}
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              className="absolute right-6 w-12 h-12 rounded-full bg-white border border-accent-primary/20 flex items-center justify-center text-text-primary hover:bg-accent-primary hover:text-white transition-colors shadow-card-light"
              onClick={(e) => { e.stopPropagation(); navigateImage('next') }}
              aria-label="Próxima imagem"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image counter */}
        {selectedImage !== null && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white border border-accent-primary/20 text-text-secondary text-sm shadow-card-light">
            {selectedImage + 1} / {GALLERY_IMAGES.length}
          </div>
        )}
      </motion.div>
    </>
  )
}
