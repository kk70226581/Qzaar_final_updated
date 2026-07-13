import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeButton = true,
  overlayClickClose = true,
}) => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-4xl',
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/40 dark:bg-black/60 z-40"
            onClick={overlayClickClose ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              className={`bg-white dark:bg-slate-900 rounded-2xl shadow-2xl ${sizes[size]} w-full max-h-[90vh] overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {(title || closeButton) && (
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                  {title && (
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{title}</h2>
                  )}
                  {closeButton && (
                    <button
                      onClick={onClose}
                      className="ml-auto p-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-50 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      aria-label="Close modal"
                    >
                      <X size={24} />
                    </button>
                  )}
                </div>
              )}

              {/* Body */}
              <div className="p-6">{children}</div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
