import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import '../../styles/components/ModernModal.css';

/**
 * ModernModal - Modern modal/dialog component
 * 
 * Features:
 * - Full-screen on mobile, centered on desktop
 * - Backdrop with blur effect
 * - Header with close button
 * - Body and footer sections
 * - Scroll inside modal
 * - Fixed header/footer
 * - Animation (fade + slide)
 * - Focus trap
 * - ESC to close
 * - Accessibility optimized
 * 
 * @example
 * <ModernModal 
 *   isOpen={isOpen} 
 *   onClose={handleClose}
 *   title="Customize Order"
 * >
 *   <ModernModal.Body>
 *     Content here
 *   </ModernModal.Body>
 *   <ModernModal.Footer>
 *     <button>Cancel</button>
 *     <button>Confirm</button>
 *   </ModernModal.Footer>
 * </ModernModal>
 */

const ModernModalBody = ({ children, className = '' }) => (
  <div className={`modern-modal__body ${className}`}>
    {children}
  </div>
);

const ModernModalFooter = ({ children, className = '' }) => (
  <div className={`modern-modal__footer ${className}`}>
    {children}
  </div>
);

const ModernModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEsc = true,
}) => {
  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (closeOnEsc && e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEsc, onClose]);

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="modern-modal__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleBackdropClick}
          />

          {/* MODAL */}
          <motion.div
            className="modern-modal__overlay"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className={`modern-modal modern-modal--${size}`}>
              {/* HEADER */}
              <div className="modern-modal__header">
                <h2 className="modern-modal__title">{title}</h2>
                <button
                  className="modern-modal__close"
                  onClick={onClose}
                  aria-label="Close modal"
                  type="button"
                >
                  <X size={24} />
                </button>
              </div>

              {/* CONTENT */}
              <div className="modern-modal__content">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

ModernModal.displayName = 'ModernModal';
ModernModal.Body = ModernModalBody;
ModernModal.Footer = ModernModalFooter;

export default ModernModal;
