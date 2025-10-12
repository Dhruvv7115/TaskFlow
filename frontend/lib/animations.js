export const fadeIn = {
  hidden: {opacity: 0},
  visible: {
    opacity: 1,
    transition: {duration: 0.5, ease: "easeOut"}
  }
};

export const fadeInUp = {
  hidden: {opacity: 0, y: 40},
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // Custom bezier curve for smooth motion
    }
  }
};

export const fadeInDown = {
  hidden: {opacity: 0, y: -40},
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const fadeInLeft = {
  hidden: {opacity: 0, x: -40},
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const fadeInRight = {
  hidden: {opacity: 0, x: 40},
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const scaleIn = {
  hidden: {opacity: 0, scale: 0.8},
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const springIn = {
  hidden: {opacity: 0, scale: 0.6, y: 20},
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      mass: 1
    }
  }
};

export const slideInUp = {
  hidden: {y: 60, opacity: 0},
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const staggerContainer = {
  hidden: {opacity: 0},
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      when: "beforeChildren"
    }
  }
};

export const staggerItem = {
  hidden: {opacity: 0, y: 30, scale: 0.95},
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Enhanced hover animations with spring physics
export const hoverScale = {
  scale: 1.05,
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 10
  }
};

export const hoverLift = {
  y: -8,
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 10
  }
};

export const hoverGlow = {
  scale: 1.02,
  filter: "brightness(1.05)",
  transition: {
    duration: 0.2,
    ease: "easeOut"
  }
};

export const tapScale = {
  scale: 0.95,
  transition: {
    duration: 0.1,
    ease: "easeOut"
  }
};

// Advanced card animations
export const cardHover = {
  scale: 1.02,
  boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.15)",
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 20
  }
};

export const cardTilt = {
  rotateX: -5,
  rotateY: 5,
  scale: 1.02,
  transition: {
    duration: 0.3,
    ease: "easeOut"
  }
};

// Enhanced button animations
export const buttonHover = {
  scale: 1.05,
  boxShadow: "0 5px 20px -5px rgba(0, 0, 0, 0.2)",
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 15
  }
};

export const buttonTap = {
  scale: 0.95,
  boxShadow: "0 2px 10px -2px rgba(0, 0, 0, 0.1)",
  transition: {
    duration: 0.1,
    ease: "easeOut"
  }
};

// Magnetic hover effect for interactive elements
export const magneticHover = {
  x: 0,
  y: 0,
  transition: {
    type: "spring",
    stiffness: 150,
    damping: 15,
    mass: 0.1
  }
};

// Input focus animations with glow
export const inputFocus = {
  scale: 1.02,
  boxShadow: "0 0 0 3px rgba(var(--primary), 0.1)",
  transition: {
    duration: 0.2,
    ease: "easeOut"
  }
};

// Smooth page transitions
export const pageTransition = {
  hidden: {opacity: 0, y: 30},
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren"
    }
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

// Enhanced modal animations
export const modalBackdrop = {
  hidden: {opacity: 0},
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

export const modalContent = {
  hidden: {
    opacity: 0,
    scale: 0.85,
    y: 50,
    rotateX: -15
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    y: 50,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

// Alert/Toast animations with bounce
export const alertSlideIn = {
  hidden: {x: 300, opacity: 0, scale: 0.9},
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 25,
      mass: 0.5
    }
  },
  exit: {
    x: 300,
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

// Smooth progress animations
export const progressBar = {
  hidden: {width: 0, opacity: 0},
  visible: (value) => ({
    width: `${value}%`,
    opacity: 1,
    transition: {
      width: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1]
      },
      opacity: {
        duration: 0.3
      }
    }
  })
};

// Advanced skeleton loading
export const shimmer = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 2.5,
      ease: "linear",
      repeat: Infinity
    }
  }
};

// Icon animations with physics
export const rotate = {
  animate: {
    rotate: 360,
    transition: {
      duration: 2,
      ease: "linear",
      repeat: Infinity
    }
  }
};

export const iconHover = {
  rotate: [0, -10, 10, -10, 10, 0],
  scale: 1.2,
  transition: {
    rotate: {
      duration: 0.5,
      ease: "easeInOut"
    },
    scale: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

export const pulse = {
  animate: {
    scale: [1, 1.08, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity
    }
  }
};

export const bounce = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 0.8,
      ease: [0.42, 0, 0.58, 1],
      repeat: Infinity,
      repeatDelay: 1
    }
  }
};

// Floating animation for decorative elements
export const float = {
  animate: {
    y: [0, -20, 0],
    x: [0, 10, 0],
    transition: {
      duration: 6,
      ease: "easeInOut",
      repeat: Infinity
    }
  }
};

// Notification badge animations
export const badgePulse = {
  animate: {
    scale: [1, 1.15, 1],
    boxShadow: [
      "0 0 0 0 rgba(var(--primary), 0.4)",
      "0 0 0 10px rgba(var(--primary), 0)",
      "0 0 0 0 rgba(var(--primary), 0)"
    ],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity
    }
  }
};

// Glow effect for highlights
export const glow = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(var(--primary), 0)",
      "0 0 30px rgba(var(--primary), 0.3)",
      "0 0 20px rgba(var(--primary), 0)"
    ],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity
    }
  }
};

// Text reveal animation
export const textReveal = {
  hidden: {
    opacity: 0,
    y: 20,
    clipPath: "inset(100% 0 0 0)"
  },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0% 0 0 0)",
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Morphing shapes
export const morph = {
  animate: {
    borderRadius: ["20% 80% 70% 30%", "70% 30% 30% 70%", "20% 80% 70% 30%"],
    rotate: [0, 90, 0],
    transition: {
      duration: 8,
      ease: "easeInOut",
      repeat: Infinity
    }
  }
};

// Parallax scroll effect
export const parallax = (offset = 50) => ({
  animate: {
    y: [-offset, offset],
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
});