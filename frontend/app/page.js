'use client';

import {Suspense, useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/context/AuthContext';
import {CardContent} from '@/components/ui/card';
import {MotionButton, MotionCard, MotionBadge} from '@/components/ui/motion';
import Link from 'next/link';
import {ModeToggle} from '@/components/theme-toggle';
import {motion, useInView, useMotionValue, useScroll, useSpring, useTransform} from 'motion/react';
import {
  IconArrowRight,
  IconBolt,
  IconChartBar,
  IconChecklist,
  IconCloud,
  IconShieldCheck,
  IconSparkles,
  IconStar,
  IconUsers
} from '@tabler/icons-react';
import HomeSkeleton from "@/components/home-skeleton";
import {
  cardHover,
  fadeInUp,
  float,
  glow,
  iconHover,
  morph,
  pulse,
  springIn,
  staggerContainer,
  staggerItem,
  textReveal
} from '@/lib/animations';


// Magnetic button component
const MagneticButton = ({children, ...props}) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({x: 0, y: 0});

  const handleMouse = (e) => {
    const {clientX, clientY} = e;
    const element = ref.current;
    if (!element) return;

    const {height, width, left, top} = element.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({x: middleX * 0.15, y: middleY * 0.15});
  };

  const reset = () => {
    setPosition({x: 0, y: 0});
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={position}
      transition={{type: "spring", stiffness: 150, damping: 15, mass: 0.1}}
    >
      <MotionButton {...props}>{children}</MotionButton>
    </motion.div>
  );
};

// Animated counter component
const AnimatedCounter = ({value, suffix = ""}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, {once: true});

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = value === "99.9" ? 99.9 : parseInt(value);
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start > end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(value === "99.9" ? Math.round(start * 10) / 10 : Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [inView, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

// Scroll-aware hero section component
const HeroSection = ({children}) => {
  const [isMounted, setIsMounted] = useState(false);
  const heroRef = useRef(null);

  // Motion values for mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Initialize all hooks unconditionally
  const {scrollYProgress} = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
    layoutEffect: false
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const springX = useSpring(mouseX, {stiffness: 100, damping: 20});
  const springY = useSpring(mouseY, {stiffness: 100, damping: 20});
  const parallaxX = useTransform(springX, (value) => value * 50);
  const parallaxY = useTransform(springY, (value) => value * 50);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    if (isMounted) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isMounted, mouseX, mouseY]);

  return (
    <section ref={heroRef} className="relative overflow-hidden">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32"
        style={isMounted ? {y, opacity, scale} : {}}
      >
        {children}
      </motion.div>

      {/* Enhanced Background with Parallax */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] w-[150%] h-[150%]"
          style={isMounted ? {x: parallaxX, y: parallaxY} : {}}
        >
          <motion.div
            className="absolute inset-0 opacity-5"
            animate={morph.animate}
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_200%] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"/>
          </motion.div>
        </motion.div>

        {/* Floating particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`
            }}
            animate={float.animate}
            transition={{
              ...float.animate.transition,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default function Home() {
  const router = useRouter();
  const {isAuthenticated, loading} = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          className="relative"
          animate={{rotate: 360}}
          transition={{duration: 2, repeat: Infinity, ease: "linear"}}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
            animate={pulse.animate}
          />
          <IconBolt className="w-8 h-8 text-primary relative z-10"/>
        </motion.div>
      </div>
    );
  }

  const features = [
    {
      icon: IconChecklist,
      title: "Smart Task Management",
      description: "Organize and prioritize your tasks with our intuitive interface",
      color: "text-blue-500"
    },
    {
      icon: IconChartBar,
      title: "Track Progress",
      description: "Visualize your productivity with detailed analytics and insights",
      color: "text-green-500"
    },
    {
      icon: IconUsers,
      title: "Collaborate",
      description: "Share tasks and work together seamlessly with your team",
      color: "text-purple-500"
    },
    {
      icon: IconShieldCheck,
      title: "Secure & Reliable",
      description: "Your data is protected with enterprise-grade security",
      color: "text-orange-500"
    },
    {
      icon: IconBolt,
      title: "Lightning Fast",
      description: "Optimized performance for smooth task management",
      color: "text-yellow-500"
    },
    {
      icon: IconCloud,
      title: "Cloud Sync",
      description: "Access your tasks from anywhere, anytime",
      color: "text-cyan-500"
    }
  ];

  return (
    <Suspense fallback={<HomeSkeleton/>}>
      <div className="min-h-screen bg-background overflow-hidden">
        {/* Enhanced Navigation */}
        <motion.nav
          className="border-b backdrop-blur-sm bg-background/80 sticky top-0 z-50"
          initial={{y: -100, opacity: 0}}
          animate={{y: 0, opacity: 1}}
          transition={{duration: 0.6, ease: [0.22, 1, 0.36, 1]}}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <motion.div
                className="flex items-center gap-2 cursor-pointer"
                whileHover={{scale: 1.05}}
                whileTap={{scale: 0.95}}
              >
                <motion.div
                  className="relative"
                  animate={{
                    rotate: [0, 15, -15, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut"
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-primary/20 blur-lg"
                    animate={glow.animate}
                  />
                  <IconSparkles className="w-6 h-6 text-primary relative z-10"/>
                </motion.div>
                <span className="text-xl font-semibold">TaskFlow</span>
              </motion.div>
              <div className="flex items-center gap-4">
                <ModeToggle/>
                <Link href="/login" className="hidden sm:block">
                  <MagneticButton variant="ghost">
                    Login
                  </MagneticButton>
                </Link>
                <Link href="/register">
                  <MagneticButton>
                    Get Started
                  </MagneticButton>
                </Link>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Enhanced Hero Section */}
        <HeroSection>
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={springIn}>
                <MotionBadge
                  variant="secondary"
                  className="mb-4 relative overflow-hidden hover:scale-[1.05]"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{x: [-100, 100]}}
                    transition={{duration: 2, repeat: Infinity, repeatDelay: 1}}
                  />
                  <IconSparkles className="w-3 h-3 mr-1"/>
                  Version 1.0 TaskFlow Now Available
                </MotionBadge>
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
                variants={textReveal}
              >
                Manage tasks with
                <motion.span
                  className="block text-primary relative"
                  initial={{opacity: 0, x: -50}}
                  animate={{opacity: 1, x: 0}}
                  transition={{delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1]}}
                >
                  unmatched simplicity
                  <motion.div
                    className="absolute -inset-1 bg-primary/20 blur-2xl -z-10"
                    animate={pulse.animate}
                  />
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed"
                variants={fadeInUp}
              >
                Streamline your workflow, boost productivity, and achieve your goals
                with our powerful yet simple task management platform.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                variants={staggerItem}
              >
                <Link href="/register">
                  <motion.div
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    className="group relative"
                  >
                    <motion.div
                      className="absolute inset-0 bg-primary/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
                      animate={glow.animate}
                    />
                    <MotionButton size="lg" className="relative">
                      Start Free Trial
                      <motion.div
                        className="ml-2"
                        animate={{x: [0, 5, 0]}}
                        transition={{duration: 1.5, repeat: Infinity}}
                      >
                        <IconArrowRight className="w-4 h-4"/>
                      </motion.div>
                    </MotionButton>
                  </motion.div>
                </Link>
                <Link href="/login">
                  <MagneticButton size="lg" variant="outline">
                    Sign In to Your Account
                  </MagneticButton>
                </Link>
              </motion.div>

              {/* Enhanced Trust Indicators */}
              <motion.div
                className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
                variants={staggerItem}
              >
                {[
                  {icon: IconShieldCheck, text: "SSL Secured", color: "text-green-500"},
                  {icon: IconUsers, text: "10k+", suffix: " Active Users", color: "text-blue-500"},
                  {icon: IconBolt, text: "99.9", suffix: "% Uptime", color: "text-yellow-500"}
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-2 group cursor-default"
                    whileHover={{scale: 1.1, y: -3}}
                    transition={{type: "spring", stiffness: 400, damping: 10}}
                  >
                    <motion.div
                      whileHover={iconHover}
                      className={item.color}
                    >
                      <item.icon className="w-4 h-4"/>
                    </motion.div>
                    <span>
                      {item.text === "10k+" || item.text === "99.9" ? (
                        <AnimatedCounter value={item.text === "10k+" ? "10000" : "99.9"} suffix={item.suffix || ""}/>
                      ) : (
                        item.text
                      )}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </HeroSection>

        {/* Enhanced Features Grid */}
        <section className="py-20 border-t relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.6, ease: [0.22, 1, 0.36, 1]}}
            >
              <motion.h2
                className="text-3xl font-bold mb-4"
                initial={{opacity: 0, scale: 0.9}}
                whileInView={{opacity: 1, scale: 1}}
                viewport={{once: true}}
                transition={{delay: 0.2, duration: 0.5}}
              >
                Everything you need to stay organized
              </motion.h2>
              <motion.p
                className="text-muted-foreground text-lg"
                initial={{opacity: 0}}
                whileInView={{opacity: 1}}
                viewport={{once: true}}
                transition={{delay: 0.3, duration: 0.5}}
              >
                Powerful features designed to help you manage tasks effortlessly
              </motion.p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{once: true, margin: "-100px"}}
              variants={staggerContainer}
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div key={index} variants={springIn}>
                    <MotionCard
                      className="h-full group relative overflow-hidden"
                      whileHover={cardHover}
                      onHoverStart={() => {
                      }}
                      onHoverEnd={() => {
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      <CardContent className="p-6 relative">
                        <motion.div
                          className={`mb-4 inline-flex p-3 rounded-xl bg-background shadow-sm ${feature.color}`}
                          whileHover={iconHover}
                        >
                          <Icon className="w-6 h-6"/>
                        </motion.div>
                        <motion.h3
                          className="font-semibold text-lg mb-2"
                          initial={{opacity: 0}}
                          whileInView={{opacity: 1}}
                          viewport={{once: true}}
                          transition={{delay: 0.1}}
                        >
                          {feature.title}
                        </motion.h3>
                        <motion.p
                          className="text-muted-foreground"
                          initial={{opacity: 0}}
                          whileInView={{opacity: 1}}
                          viewport={{once: true}}
                          transition={{delay: 0.2}}
                        >
                          {feature.description}
                        </motion.p>
                        <motion.div
                          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100"
                          initial={{scale: 0}}
                          whileHover={{scale: 1}}
                          transition={{type: "spring", stiffness: 400, damping: 10}}
                        >
                          <IconArrowRight className="w-4 h-4 text-muted-foreground"/>
                        </motion.div>
                      </CardContent>
                    </MotionCard>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Decorative background element */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-5 -z-10"
            animate={{rotate: 360}}
            transition={{duration: 60, repeat: Infinity, ease: "linear"}}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-r from-primary to-purple-500 blur-3xl"/>
          </motion.div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-20 border-t relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{opacity: 0, scale: 0.9}}
              whileInView={{opacity: 1, scale: 1}}
              viewport={{once: true}}
              transition={{duration: 0.6, ease: [0.22, 1, 0.36, 1]}}
            >
              <MotionCard
                className="bg-secondary-foreground text-primary-foreground relative overflow-hidden"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 30px 60px -20px rgba(0, 0, 0, 0.4)"
                }}
                transition={{type: "spring", stiffness: 300, damping: 20}}
              >
                <motion.div
                  className="absolute inset-0 opacity-10"
                  style={{
                    background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 70%)",
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <CardContent className="p-12 relative">
                  <motion.div
                    className="absolute top-4 right-4"
                    animate={{rotate: 360}}
                    transition={{duration: 20, repeat: Infinity, ease: "linear"}}
                  >
                    <IconStar className="w-6 h-6 text-yellow-400"/>
                  </motion.div>
                  <motion.h2
                    className="text-3xl font-bold mb-4"
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{delay: 0.2}}
                  >
                    Ready to boost your productivity?
                  </motion.h2>
                  <motion.p
                    className="text-lg mb-8 opacity-90"
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{delay: 0.3}}
                  >
                    Join thousands of users who are already managing their tasks efficiently.
                  </motion.p>
                  <Link href="/register">
                    <motion.div
                      className="inline-block"
                      whileHover={{scale: 1.05}}
                      whileTap={{scale: 0.95}}
                    >
                      <MotionButton
                        size="lg"
                        variant="secondary"
                        className="group relative overflow-hidden"
                      >
                        <motion.span className="relative z-10">
                          Get Started Free
                        </motion.span>
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          initial={{x: "-100%"}}
                          whileHover={{x: "100%"}}
                          transition={{duration: 0.5}}
                        />
                        <motion.div
                          className="ml-2 inline-block"
                          animate={{x: [0, 5, 0]}}
                          transition={{duration: 1.5, repeat: Infinity}}
                        >
                          <IconArrowRight className="w-4 h-4"/>
                        </motion.div>
                      </MotionButton>
                    </motion.div>
                  </Link>
                </CardContent>
              </MotionCard>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Footer */}
        <motion.footer
          className="border-t py-8"
          initial={{opacity: 0}}
          whileInView={{opacity: 1}}
          viewport={{once: true}}
          transition={{duration: 0.5}}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <motion.div
                className="flex items-center gap-2"
                whileHover={{scale: 1.05}}
              >
                <motion.div
                  animate={{rotate: [0, 360]}}
                  transition={{duration: 10, repeat: Infinity, ease: "linear"}}
                >
                  <IconSparkles className="w-5 h-5 text-primary"/>
                </motion.div>
                <span className="font-semibold">TaskFlow</span>
              </motion.div>
              <motion.p
                className="text-sm text-muted-foreground"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 0.2}}
              >
                © 2024 TaskFlow. Build with ❤️ by Dhruv
              </motion.p>
            </div>
          </div>
        </motion.footer>
      </div>
    </Suspense>
  );
}