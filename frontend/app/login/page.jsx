'use client';

import {lazy, Suspense, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/context/AuthContext';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Card, CardContent, CardFooter} from '@/components/ui/card';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {Checkbox} from '@/components/ui/checkbox';
import Link from 'next/link';
import {AnimatePresence, motion} from 'motion/react';
import {
  IconAlertCircle,
  IconArrowRight,
  IconEye,
  IconEyeOff,
  IconHome,
  IconLock,
  IconMail,
  IconSparkles
} from '@tabler/icons-react';
import {buttonHover, buttonTap, fadeInUp, scaleIn} from '@/lib/animations';
import {Spinner} from "@/components/ui/spinner";

const LoginSkeleton = lazy(() => import('@/components/login-skeleton'));
const MotionCard = motion.create(Card);
const MotionButton = motion.create(Button);

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const {login, isAuthenticated} = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) {
      setError('');
    }
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      if (!result?.success) {
        setError(result?.message || 'Invalid email or password');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Suspense fallback={<LoginSkeleton/>}>
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <motion.nav
          className="border-b backdrop-blur-sm bg-background/80"
          initial={{y: -100}}
          animate={{y: 0}}
          transition={{duration: 0.5}}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/">
                <motion.div
                  className="flex items-center gap-2 group"
                  whileHover={{scale: 1.05}}
                >
                  <motion.div
                    whileHover={{rotate: 180}}
                    transition={{duration: 0.3}}
                  >
                    <IconSparkles className="w-6 h-6 text-primary"/>
                  </motion.div>
                  <span className="text-xl font-semibold">TaskFlow</span>
                </motion.div>
              </Link>
              <Link href="/">
                <MotionButton
                  variant="ghost"
                  size="sm"
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                >
                  <IconHome className="w-4 h-4 mr-2"/>
                  Back to Home
                </MotionButton>
              </Link>
            </div>
          </div>
        </motion.nav>

        {/* Login Form */}
        <div className="flex items-center justify-center px-4 py-20">
          <motion.div
            className="w-full max-w-md"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {opacity: 0},
              visible: {
                opacity: 1,
                transition: {staggerChildren: 0.1}
              }
            }}
          >
            {/* Header */}
            <motion.div
              className="text-center mb-8"
              variants={fadeInUp}
            >
              <motion.div
                className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4"
                initial={{scale: 0, rotate: -180}}
                animate={{scale: 1, rotate: 0}}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2
                }}
              >
                <IconLock className="w-8 h-8"/>
              </motion.div>
              <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
              <p className="text-muted-foreground mt-2">
                Enter your credentials to access your account
              </p>
            </motion.div>

            {/* Card */}
            <MotionCard
              variants={scaleIn}
              whileHover={{
                boxShadow: "0 20px 60px -10px rgba(0, 0, 0, 0.2)",
                y: -4
              }}
              transition={{duration: 0.2}}
            >
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Error Alert */}
                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div
                        initial={{opacity: 0, y: -10, scale: 0.95}}
                        animate={{opacity: 1, y: 0, scale: 1}}
                        exit={{opacity: 0, y: -10, scale: 0.95}}
                        transition={{duration: 0.2}}
                      >
                        <Alert variant="destructive">
                          <IconAlertCircle className="h-4 w-4"/>
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email Field */}
                  <motion.div
                    className="space-y-2"
                    variants={fadeInUp}
                  >
                    <Label htmlFor="email">Email</Label>
                    <div className="relative group">
                      <IconMail
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10"/>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        className="pl-10 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-0 transition-all duration-200"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !isSubmitting) {
                            e.preventDefault();
                            handleLogin();
                          }
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Password Field */}
                  <motion.div
                    className="space-y-2"
                    variants={fadeInUp}
                  >
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative group">
                      <IconLock
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10"/>
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="pl-10 pr-12 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-0 transition-all duration-200"
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !isSubmitting) {
                            e.preventDefault();
                            handleLogin();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
                        disabled={isSubmitting}
                        tabIndex={-1}
                      >
                        <motion.div
                          whileHover={{scale: 1.1}}
                          whileTap={{scale: 0.9}}
                        >
                          {showPassword ? (
                            <IconEyeOff className="w-4 h-4"/>
                          ) : (
                            <IconEye className="w-4 h-4"/>
                          )}
                        </motion.div>
                      </button>
                    </div>
                  </motion.div>

                  {/* Remember Me */}
                  <motion.div
                    className="flex items-center space-x-2"
                    variants={fadeInUp}
                  >
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={setRememberMe}
                      disabled={isSubmitting}
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Remember me for 30 days
                    </Label>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div variants={fadeInUp}>
                    <MotionButton
                      type="button"
                      className="w-full group"
                      disabled={isSubmitting}
                      onClick={handleLogin}
                      whileHover={{scale: 1.02}}
                      whileTap={{scale: 0.98}}
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner className="mr-2"/>
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <motion.div
                            animate={{x: [0, 3, 0]}}
                            transition={{duration: 1.5, repeat: Infinity}}
                          >
                            <IconArrowRight className="w-4 h-4 ml-2"/>
                          </motion.div>
                        </>
                      )}
                    </MotionButton>
                  </motion.div>

                  {/* Divider */}
                  <motion.div
                    className="relative"
                    variants={fadeInUp}
                  >
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t"/>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </motion.div>

                  {/* Demo Account Info */}
                  <motion.div variants={fadeInUp}>
                    <Alert>
                      <IconSparkles className="h-4 w-4"/>
                      <AlertDescription>
                        <strong>Demo Account:</strong> Use email "john@example.com" and password "1234567890" to explore
                        the app
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 pb-6">
                <motion.div
                  className="text-center text-sm text-muted-foreground"
                  variants={fadeInUp}
                >
                  Don't have an account?{' '}
                  <Link
                    href="/register"
                    className="text-primary font-medium hover:underline"
                  >
                    Create an account
                  </Link>
                </motion.div>
              </CardFooter>
            </MotionCard>

            {/* Trust Indicators */}
            <motion.div
              className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground"
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.6}}
            >
              <motion.div
                className="flex items-center gap-1"
                whileHover={{scale: 1.1}}
              >
                <motion.div
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1]
                  }}
                  transition={{duration: 2, repeat: Infinity}}
                />
                <span>Secure connection</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-1"
                whileHover={{scale: 1.1}}
              >
                <IconLock className="w-3 h-3"/>
                <span>256-bit encryption</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Suspense>
  );
}