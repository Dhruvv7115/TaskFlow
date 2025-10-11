'use client';

import {lazy, Suspense, useEffect, useState} from 'react';
import {useAuth} from '@/context/AuthContext';
import {tasksAPI, userAPI} from '@/lib/api';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Avatar, AvatarFallback} from '@/components/ui/avatar';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {Separator} from '@/components/ui/separator';
import {Badge} from '@/components/ui/badge';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {
  IconAlertCircle,
  IconCalendar,
  IconCheck,
  IconChecklist,
  IconClock,
  IconDeviceFloppy,
  IconEdit,
  IconKey,
  IconMail,
  IconSettings,
  IconShield,
  IconTrendingUp,
  IconTrophy,
  IconUser
} from '@tabler/icons-react';
import {AnimatePresence, motion} from 'framer-motion';
import {buttonHover, buttonTap, cardHover, inputFocus, staggerContainer, staggerItem} from '@/lib/animations';
import {Spinner} from "@/components/ui/spinner";

const ProfileSkeleton = lazy(() => import('@/components/profile-skeleton'));
const MotionCard = motion(Card);
const MotionButton = motion(Button);
const MotionInput = motion(Input);
const MotionBadge = motion(Badge);
const MotionAvatar = motion(Avatar);

export default function ProfilePage() {
  const {user} = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState({type: '', text: ''});
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await tasksAPI.getTasks();
        console.log(response)
        const tasks = Array.isArray(response.data) ? response.data : [];

        const completedTasks = tasks.filter(task => task.status === 'completed').length;
        const pendingTasks = tasks.filter(task => task.status === 'pending' || task.status === 'in-progress').length;
        const totalTasks = tasks.length;

        setStats({
          totalTasks: totalTasks,
          completedTasks: completedTasks,
          pendingTasks: pendingTasks,
          inProgressTasks: tasks.filter(task => task.status === 'in-progress').length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setMessage({type: 'error', text: 'Failed to load task statistics'});
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats().catch(error => {
      console.error('Unhandled error in fetchUserStats:', error);
      setMessage({type: 'error', text: 'An unexpected error occurred'});
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({type: '', text: ''});
    setLoading(true);

    if (!formData.name || !formData.email) {
      setMessage({type: 'error', text: 'Please fill in all fields'});
      setLoading(false);
      return;
    }

    if (formData.name.length < 2) {
      setMessage({type: 'error', text: 'Name must be at least 2 characters'});
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setMessage({type: 'error', text: 'Please enter a valid email'});
      setLoading(false);
      return;
    }

    try {
      const response = await userAPI.updateProfile(formData);
      if (response.success || response.data) {
        user.name = response.data.name;
        user.email = response.data.email;
        setMessage({
          type: 'success',
          text: 'Profile updated successfully'
        });
        setEditing(false);
        setFormData({
          name: response.data.name || formData.name,
          email: response.data.email || formData.email,
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile'
      });
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage({
          type: '',
          text: ''
        })
      }, [5000]);
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const completionRate = stats.totalTasks > 0
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  return (
    <Suspense fallback={<ProfileSkeleton/>}>
      <motion.div
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Header */}
        <motion.div variants={staggerItem}>
          <motion.h1
            className="text-3xl font-bold tracking-tight"
            initial={{opacity: 0, x: -20}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.5}}
          >
            Profile Settings
          </motion.h1>
          <motion.p
            className="text-muted-foreground mt-2"
            initial={{opacity: 0, x: -20}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.5, delay: 0.1}}
          >
            Manage your account settings and preferences
          </motion.p>
        </motion.div>

        {/* Profile Overview Card */}
        <motion.div variants={staggerItem}>
          <MotionCard
            className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent"
            whileHover={cardHover}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <MotionAvatar
                  className="h-24 w-24 border-4 border-background shadow-lg"
                  initial={{scale: 0, rotate: -180}}
                  animate={{scale: 1, rotate: 0}}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2
                  }}
                  whileHover={{scale: 1.1, rotate: 5}}
                >
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </MotionAvatar>
                <div className="flex-1 space-y-2">
                  <motion.h2
                    className="text-2xl font-bold"
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.3}}
                  >
                    {user?.name}
                  </motion.h2>
                  <motion.div
                    className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-muted-foreground"
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.4}}
                  >
                    <div className="flex items-center gap-2">
                      <IconMail className="h-4 w-4"/>
                      {user?.email}
                    </div>
                    <div className="hidden sm:block">•</div>
                    <div className="flex items-center gap-2">
                      <IconCalendar className="h-4 w-4"/>
                      Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    }) : 'Recently'}
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex gap-2 pt-2"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={staggerItem}>
                      <MotionBadge
                        variant="secondary"
                        className="gap-1"
                        whileHover={{scale: 1.05, y: -2}}
                      >
                        <IconTrophy className="h-3 w-3"/>
                        {stats.completedTasks} Completed
                      </MotionBadge>
                    </motion.div>
                    <motion.div variants={staggerItem}>
                      <MotionBadge
                        variant="outline"
                        className="gap-1"
                        whileHover={{scale: 1.05, y: -2}}
                      >
                        <IconChecklist className="h-3 w-3"/>
                        {stats.totalTasks} Total Tasks
                      </MotionBadge>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </MotionCard>
        </motion.div>

        {/* Activity Stats */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          variants={staggerContainer}
        >
          {[
            {
              icon: IconChecklist,
              value: stats.totalTasks,
              label: 'Total Tasks',
              color: 'text-muted-foreground',
              trend: IconTrendingUp,
              trendColor: 'text-green-500'
            },
            {
              icon: IconCheck,
              value: stats.completedTasks,
              label: 'Completed',
              color: 'text-green-600',
              percent: completionRate
            },
            {icon: IconClock, value: stats.pendingTasks, label: 'Pending', color: 'text-yellow-600'},
            {icon: IconTrendingUp, value: stats.inProgressTasks, label: 'In Progress', color: 'text-blue-600'}
          ].map((stat, index) => (
            <motion.div key={index} variants={staggerItem}>
              <MotionCard
                whileHover={{y: -4, boxShadow: "0 10px 20px -5px rgba(0, 0, 0, 0.1)"}}
                transition={{duration: 0.2}}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <stat.icon className={`h-5 w-5 ${stat.color}`}/>
                      {stat.trend && <stat.trend className={`h-4 w-4 ${stat.trendColor}`}/>}
                      {stat.percent !== undefined && (
                        <motion.span
                          className="text-xs font-medium text-green-600"
                          initial={{scale: 0}}
                          animate={{scale: 1}}
                          transition={{delay: 0.5 + index * 0.1, type: "spring"}}
                        >
                          {stat.percent}%
                        </motion.span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <motion.p
                        className="text-2xl font-bold"
                        initial={{opacity: 0, scale: 0.5}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{delay: 0.3 + index * 0.1, type: "spring"}}
                      >
                        {stat.value}
                      </motion.p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </MotionCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div variants={staggerItem}>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {[
                {value: 'general', icon: IconUser, label: 'General'},
                {value: 'security', icon: IconShield, label: 'Security'},
                {value: 'account', icon: IconSettings, label: 'Account'}
              ].map((tab, index) => (
                <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
                  <tab.icon className="h-4 w-4"/>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-4">
              <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.3}}
              >
                <MotionCard whileHover={cardHover}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your profile details</CardDescription>
                      </div>
                      <AnimatePresence mode="wait">
                        {!editing && (
                          <motion.div
                            initial={{opacity: 0, scale: 0}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, scale: 0}}
                          >
                            <MotionButton
                              variant="outline"
                              size="sm"
                              onClick={() => setEditing(true)}
                              whileHover={buttonHover}
                              whileTap={buttonTap}
                            >
                              <IconEdit className="mr-2 h-4 w-4"/>
                              Edit
                            </MotionButton>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Message Alert */}
                      <AnimatePresence mode="wait">
                        {message.text && (
                          <motion.div
                            initial={{opacity: 0, y: -10, height: 0}}
                            animate={{opacity: 1, y: 0, height: "auto"}}
                            exit={{opacity: 0, y: -10, height: 0}}
                            transition={{duration: 0.2}}
                          >
                            <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
                              {message.type === 'success' ? (
                                <IconCheck className="h-4 w-4"/>
                              ) : (
                                <IconAlertCircle className="h-4 w-4"/>
                              )}
                              <AlertDescription>{message.text}</AlertDescription>
                            </Alert>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Name Field */}
                      <motion.div
                        className="space-y-2"
                        initial={{opacity: 0, x: -20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{delay: 0.1}}
                      >
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                          <MotionInput
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            className="pl-10"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            disabled={loading || !editing}
                            required
                            whileFocus={editing ? inputFocus : {}}
                          />
                        </div>
                      </motion.div>

                      {/* Email Field */}
                      <motion.div
                        className="space-y-2"
                        initial={{opacity: 0, x: -20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{delay: 0.2}}
                      >
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                          <MotionInput
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            className="pl-10"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            disabled={loading || !editing}
                            required
                            whileFocus={editing ? inputFocus : {}}
                          />
                        </div>
                      </motion.div>

                      {/* Action Buttons */}
                      <AnimatePresence>
                        {editing && (
                          <motion.div
                            className="flex gap-3 pt-2"
                            initial={{opacity: 0, height: 0}}
                            animate={{opacity: 1, height: "auto"}}
                            exit={{opacity: 0, height: 0}}
                            transition={{duration: 0.2}}
                          >
                            <MotionButton
                              type="submit"
                              disabled={loading}
                              className="flex-1"
                              whileHover={buttonHover}
                              whileTap={buttonTap}
                            >
                              {loading ? (
                                <>
                                  <Spinner className="w-4 h-4 mr-2"/>
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <IconDeviceFloppy className="mr-2 h-4 w-4"/>
                                  Save Changes
                                </>
                              )}
                            </MotionButton>
                            <MotionButton
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setEditing(false);
                                setFormData({
                                  name: user?.name || '',
                                  email: user?.email || '',
                                });
                                setMessage({type: '', text: ''});
                              }}
                              disabled={loading}
                              whileHover={buttonHover}
                              whileTap={buttonTap}
                            >
                              Cancel
                            </MotionButton>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </form>
                  </CardContent>
                </MotionCard>
              </motion.div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-4">
              <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.3}}
                className="space-y-4"
              >
                <MotionCard whileHover={cardHover}>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Manage your password settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <motion.div
                      className="flex items-start gap-4 p-4 border rounded-lg"
                      whileHover={{scale: 1.01, borderColor: "hsl(var(--primary) / 0.5)"}}
                    >
                      <motion.div
                        className="p-2 rounded-lg bg-primary/10"
                        whileHover={{rotate: [0, -10, 10, 0]}}
                        transition={{duration: 0.3}}
                      >
                        <IconKey className="h-5 w-5 text-primary"/>
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="font-medium">Password</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Last changed on {new Date().toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" disabled>
                        Change Password
                      </Button>
                    </motion.div>
                    <Alert>
                      <IconShield className="h-4 w-4"/>
                      <AlertDescription>
                        Password change functionality coming soon. Contact support if you need to reset your password.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </MotionCard>

                <MotionCard whileHover={cardHover}>
                  <CardHeader>
                    <CardTitle>Active Sessions</CardTitle>
                    <CardDescription>Manage your active login sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      className="flex items-center justify-between p-4 border rounded-lg"
                      whileHover={{scale: 1.01, borderColor: "hsl(var(--primary) / 0.5)"}}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          className="w-2 h-2 bg-green-500 rounded-full"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [1, 0.7, 1]
                          }}
                          transition={{duration: 2, repeat: Infinity}}
                        />
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date().toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </motion.div>
                  </CardContent>
                </MotionCard>
              </motion.div>
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account" className="space-y-4">
              <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.3}}
              >
                <MotionCard whileHover={cardHover}>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>View your account details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <motion.div
                      className="grid gap-4"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      {[
                        {label: 'User ID', value: user?.id || 'N/A'},
                        {label: 'Account Status', badge: true},
                        {
                          label: 'Member Since',
                          value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          }) : 'N/A'
                        }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center justify-between p-4 border rounded-lg"
                          variants={staggerItem}
                          whileHover={{scale: 1.01, borderColor: "hsl(var(--primary) / 0.5)"}}
                        >
                          <div>
                            <p className="text-sm font-medium">{item.label}</p>
                            {console.log(user)}
                            {item.badge ? (
                              <div className="flex items-center gap-2 mt-1">
                                <MotionBadge
                                  variant="secondary"
                                  className="gap-1"
                                  whileHover={{scale: 1.05}}
                                >
                                  <motion.div
                                    className="w-2 h-2 bg-green-500 rounded-full"
                                    animate={{scale: [1, 1.2, 1]}}
                                    transition={{duration: 1.5, repeat: Infinity}}
                                  />
                                  Active
                                </MotionBadge>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground mt-1">{item.value}</p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>

                    <Separator/>

                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-destructive">Danger Zone</h4>
                      <motion.div
                        className="border border-destructive/20 rounded-lg p-4"
                        whileHover={{borderColor: "hsl(var(--destructive) / 0.5)"}}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">Delete Account</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Permanently delete your account and all associated data
                            </p>
                          </div>
                          <Button variant="destructive" size="sm" disabled>
                            Delete
                          </Button>
                        </div>
                      </motion.div>
                    </div>
                  </CardContent>
                </MotionCard>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </Suspense>
  );
}