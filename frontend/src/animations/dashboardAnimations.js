export const enhancedAnimations = {
  containerVariants: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  },

  cardVariants: {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  },

  glowVariants: {
    initial: { opacity: 0.3 },
    animate: {
      opacity: [0.3, 0.6, 0.3],
      scale: [1, 1.1, 1],
      transition: { 
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }
}; 