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
  IconCheck,
  IconEye,
  IconEyeOff,
  IconHome,
  IconLock,
  IconMail,
  IconShieldCheck,
  IconSparkles,
  IconUser,
  IconUserPlus,
  IconX
} from '@tabler/icons-react';
import {buttonHover, buttonTap, fadeInUp, scaleIn} from '@/lib/animations';
import {Spinner} from "@/components/ui/spinner";

const RegisterSkeleton = lazy(() => import("@/components/register-skeleton"));
const MotionCard = motion.create(Card);
const MotionButton = motion.create(Button);

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const {register, isAuthenticated} = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const calculatePasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 12.5;
    if (/[^a-zA-Z\d]/.test(password)) strength += 12.5;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength();

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return 'bg-destructive';
    if (passwordStrength < 60) return 'bg-yellow-500';
    if (passwordStrength < 90) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 30) return 'Weak';
    if (passwordStrength < 60) return 'Fair';
    if (passwordStrength < 90) return 'Good';
    return 'Strong';
  };

  const passwordRequirements = [
    {met: password.length >= 6, text: 'At least 6 characters'},
    {met: /[A-Z]/.test(password), text: 'One uppercase letter'},
    {met: /[a-z]/.test(password), text: 'One lowercase letter'},
    {met: /\d/.test(password), text: 'One number'},
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (name.length < 2) {
      setError('Name must be at least 2 characters');
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!agreeToTerms) {
      setError('Please agree to the terms and conditions');
      setLoading(false);
      return;
    }

    const result = await register(name, email, password);

    if (!result.success) {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <Suspense fallback={<RegisterSkeleton/>}>
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

        {/* Register Form */}
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
                <IconUserPlus className="w-8 h-8"/>
              </motion.div>
              <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
              <p className="text-muted-foreground mt-2">
                Join thousands of users managing tasks efficiently
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
                <form onSubmit={handleSubmit} className="space-y-4">
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

                  {/* Name Field */}
                  <motion.div
                    className="space-y-2"
                    variants={fadeInUp}
                  >
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative group">
                      <IconUser
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10"/>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        className="pl-10 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-0 transition-all duration-200"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                  </motion.div>

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
                        type="email"
                        placeholder="john@example.com"
                        className="pl-10 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-0 transition-all duration-200"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                  </motion.div>

                  {/* Password Field */}
                  <motion.div
                    className="space-y-2"
                    variants={fadeInUp}
                  >
                    <Label htmlFor="password">Password</Label>
                    <div className="relative group">
                      <IconLock
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10"/>
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        className="pl-10 pr-12 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-0 transition-all duration-200"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
                        disabled={loading}
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

                    {/* Password Strength Indicator */}
                    <AnimatePresence>
                      {password && (
                        <motion.div
                          className="space-y-2"
                          initial={{opacity: 0, height: 0}}
                          animate={{opacity: 1, height: "auto"}}
                          exit={{opacity: 0, height: 0}}
                          transition={{duration: 0.3}}
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Password strength</span>
                            <motion.span
                              className={`font-medium ${
                                passwordStrength >= 90 ? 'text-green-500' :
                                  passwordStrength >= 60 ? 'text-blue-500' :
                                    passwordStrength >= 30 ? 'text-yellow-500' :
                                      'text-destructive'
                              }`}
                              initial={{scale: 0}}
                              animate={{scale: 1}}
                              transition={{type: "spring", stiffness: 200}}
                            >
                              {getPasswordStrengthText()}
                            </motion.span>
                          </div>
                          <div className="relative h-1 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full ${getPasswordStrengthColor()}`}
                              initial={{width: 0}}
                              animate={{width: `${passwordStrength}%`}}
                              transition={{duration: 0.5, ease: "easeOut"}}
                            />
                          </div>

                          {/* Password Requirements */}
                          <motion.div
                            className="grid grid-cols-2 gap-1 mt-2"
                            initial="hidden"
                            animate="visible"
                            variants={{
                              hidden: {opacity: 0},
                              visible: {
                                opacity: 1,
                                transition: {staggerChildren: 0.05}
                              }
                            }}
                          >
                            {passwordRequirements.map((req, index) => (
                              <motion.div
                                key={index}
                                className="flex items-center gap-1 text-xs"
                                variants={{
                                  hidden: {opacity: 0, x: -10},
                                  visible: {opacity: 1, x: 0}
                                }}
                              >
                                <motion.div
                                  animate={req.met ? {scale: [0, 1.2, 1]} : {}}
                                  transition={{duration: 0.3}}
                                >
                                  {req.met ? (
                                    <IconCheck className="w-3 h-3 text-green-500"/>
                                  ) : (
                                    <IconX className="w-3 h-3 text-muted-foreground"/>
                                  )}
                                </motion.div>
                                <span className={req.met ? 'text-green-500' : 'text-muted-foreground'}>
                                                                    {req.text}
                                </span>
                              </motion.div>
                            ))}
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Confirm Password Field */}
                  <motion.div
                    className="space-y-2"
                    variants={fadeInUp}
                  >
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative group">
                      <IconLock
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10"/>
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Re-enter your password"
                        className="pl-10 pr-12 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-0 transition-all duration-200"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10"
                        disabled={loading}
                        tabIndex={-1}
                      >
                        <motion.div
                          whileHover={{scale: 1.1}}
                          whileTap={{scale: 0.9}}
                        >
                          {showConfirmPassword ? (
                            <IconEyeOff className="w-4 h-4"/>
                          ) : (
                            <IconEye className="w-4 h-4"/>
                          )}
                        </motion.div>
                      </button>
                    </div>
                    <AnimatePresence>
                      {confirmPassword && password !== confirmPassword && (
                        <motion.p
                          className="text-xs text-destructive flex items-center gap-1"
                          initial={{opacity: 0, y: -5}}
                          animate={{opacity: 1, y: 0}}
                          exit={{opacity: 0, y: -5}}
                        >
                          <IconAlertCircle className="w-3 h-3"/>
                          Passwords do not match
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Terms and Conditions */}
                  <motion.div
                    className="flex items-start space-x-2"
                    variants={fadeInUp}
                  >
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={setAgreeToTerms}
                      className="mt-1"
                      disabled={loading}
                    />
                    <Label
                      htmlFor="terms"
                      className="text-sm font-normal cursor-pointer leading-relaxed"
                    >
                      I agree to the{' '}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div variants={fadeInUp}>
                    <MotionButton
                      type="submit"
                      className="w-full group"
                      disabled={loading || !agreeToTerms}
                      whileHover={{scale: 1.02}}
                      whileTap={{scale: 0.98}}
                    >
                      {loading ? (
                        <>
                          <Spinner className="w-4 h-4 mr-2"/>
                          Creating account...
                        </>
                      ) : (
                        <>
                          Create Account
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
                </form>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 pb-6">
                <motion.div
                  className="relative w-full"
                  variants={fadeInUp}
                >
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"/>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  className="text-center text-sm text-muted-foreground"
                  variants={fadeInUp}
                >
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="text-primary font-medium hover:underline"
                  >
                    Sign in instead
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
                <IconLock className="w-3 h-3"/>
                <span>Encrypted data</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-1"
                whileHover={{scale: 1.1}}
              >
                <IconShieldCheck className="w-3 h-3"/>
                <span>GDPR compliant</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Suspense>
  );
}