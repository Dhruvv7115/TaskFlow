'use client';

import {lazy, Suspense, useEffect, useState} from 'react';
import {useAuth} from '@/context/AuthContext';
import {tasksAPI} from '@/lib/api';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Progress} from '@/components/ui/progress';
import Link from 'next/link';
import {motion} from 'motion/react';
import {
  IconAlertCircle,
  IconArrowRight,
  IconChecklist,
  IconCircleCheck,
  IconClock,
  IconPlus,
  IconSparkles,
  IconTrendingUp
} from '@tabler/icons-react';
import {buttonHover, buttonTap, cardHover, staggerContainer, staggerItem} from '@/lib/animations';

const DashboardSkeleton = lazy(() => import("@/components/dashboard-skeleton"));
const MotionCard = motion(Card);
const MotionButton = motion(Button);
const MotionBadge = motion(Badge);
const MotionProgress = motion(Progress);

export default function DashboardPage() {
  const {user} = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    recentTasks: []
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await tasksAPI.getTasks();
      const tasks = response.data || [];

      const statsData = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        recentTasks: tasks.slice(0, 5)
      };

      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const completionRate = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      description: 'All tasks in your workspace',
      icon: IconChecklist,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Pending',
      value: stats.pending,
      description: 'Waiting to be started',
      icon: IconClock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      description: 'Currently working on',
      icon: IconTrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Completed',
      value: stats.completed,
      description: 'Successfully finished',
      icon: IconCircleCheck,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    }
  ];

  return (
    <Suspense fallback={<DashboardSkeleton/>}>
      <motion.div
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Welcome Section */}
        <motion.div variants={staggerItem}>
          <motion.h1
            className="text-3xl font-bold tracking-tight"
            initial={{opacity: 0, x: -20}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.5}}
          >
            {getGreeting()}, {user?.name?.split(' ')[0]}!
          </motion.h1>
          <motion.p
            className="text-muted-foreground mt-2"
            initial={{opacity: 0, x: -20}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.5, delay: 0.1}}
          >
            Here's what's happening with your tasks today.
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
        >
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div key={index} variants={staggerItem}>
                <MotionCard
                  className="shadow-sm"
                  whileHover={{
                    y: -8,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    transition: {duration: 0.2}
                  }}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <motion.div
                      className={`p-2 rounded-lg ${stat.bgColor}`}
                      whileHover={{
                        scale: 1.1,
                        rotate: [0, -10, 10, 0]
                      }}
                      transition={{duration: 0.3}}
                    >
                      <Icon className={`h-4 w-4 ${stat.color}`}/>
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      className="text-2xl font-bold"
                      initial={{opacity: 0, scale: 0.5}}
                      animate={{opacity: 1, scale: 1}}
                      transition={{
                        delay: 0.2 + index * 0.1,
                        type: "spring",
                        stiffness: 200
                      }}
                    >
                      {stat.value}
                    </motion.div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </CardContent>
                </MotionCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Progress Overview */}
        <motion.div variants={staggerItem}>
          <MotionCard
            className="shadow-sm"
            whileHover={cardHover}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Progress Overview</CardTitle>
                  <CardDescription>
                    Your task completion rate this month
                  </CardDescription>
                </div>
                <MotionBadge
                  variant="secondary"
                  className="text-lg px-3 py-1"
                  initial={{scale: 0}}
                  animate={{scale: 1}}
                  transition={{
                    delay: 0.5,
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{scale: 1.1}}
                >
                  {completionRate}%
                </MotionBadge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <MotionProgress
                value={completionRate}
                className="h-3"
                initial={{width: 0}}
                animate={{width: "100%"}}
                transition={{duration: 1, delay: 0.3}}
              />
              <motion.div
                className="grid grid-cols-3 gap-4 text-center"
                variants={staggerContainer}
              >
                {[
                  {label: 'Pending', value: stats.pending, color: 'text-yellow-500'},
                  {label: 'In Progress', value: stats.inProgress, color: 'text-blue-500'},
                  {label: 'Completed', value: stats.completed, color: 'text-green-500'}
                ].map((item, index) => (
                  <motion.div key={index} variants={staggerItem}>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <motion.p
                      className={`text-xl font-semibold ${item.color}`}
                      initial={{opacity: 0, y: 10}}
                      animate={{opacity: 1, y: 0}}
                      transition={{delay: 0.5 + index * 0.1}}
                    >
                      {item.value}
                    </motion.p>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </MotionCard>
        </motion.div>

        {/* Quick Actions & Recent Tasks */}
        <motion.div
          className="grid gap-4 md:grid-cols-2"
          variants={staggerContainer}
        >
          {/* Quick Actions */}
          <motion.div variants={staggerItem}>
            <MotionCard
              className="shadow-sm"
              whileHover={cardHover}
            >
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks you can do right now</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/dashboard/tasks">
                  <MotionButton
                    className="w-full group"
                    size="lg"
                    whileHover={{scale: 1.02}}
                    whileTap={{scale: 0.98}}
                  >
                    <IconPlus className="mr-2 h-4 w-4"/>
                    Create New Task
                    <motion.div
                      animate={{x: [0, 5, 0]}}
                      transition={{duration: 1.5, repeat: Infinity}}
                      className="ml-auto"
                    >
                      <IconArrowRight className="h-4 w-4"/>
                    </motion.div>
                  </MotionButton>
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/dashboard/tasks?filter=pending">
                    <MotionButton
                      variant="outline"
                      className="w-full"
                      whileHover={buttonHover}
                      whileTap={buttonTap}
                    >
                      <IconClock className="mr-2 h-4 w-4"/>
                      View Pending
                    </MotionButton>
                  </Link>
                  <Link href="/dashboard/tasks?filter=in-progress">
                    <MotionButton
                      variant="outline"
                      className="w-full"
                      whileHover={buttonHover}
                      whileTap={buttonTap}
                    >
                      <IconTrendingUp className="mr-2 h-4 w-4"/>
                      In Progress
                    </MotionButton>
                  </Link>
                </div>
              </CardContent>
            </MotionCard>
          </motion.div>

          {/* Recent Tasks */}
          <motion.div variants={staggerItem}>
            <MotionCard
              className="shadow-sm"
              whileHover={cardHover}
            >
              <CardHeader>
                <CardTitle>Recent Tasks</CardTitle>
                <CardDescription>Your latest task activities</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.recentTasks.length > 0 ? (
                  <motion.div
                    className="space-y-3"
                    variants={staggerContainer}
                  >
                    {stats.recentTasks.map((task) => (
                      <motion.div
                        key={task._id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-secondary/10 transition-colors"
                        variants={staggerItem}
                        whileHover={{x: 4, scale: 1.02}}
                        transition={{duration: 0.2}}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{task.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <MotionBadge
                              variant="outline"
                              className="text-xs"
                              whileHover={{scale: 1.05}}
                            >
                              {task.status}
                            </MotionBadge>
                            {task.priority && (
                              <MotionBadge
                                variant="secondary"
                                className="text-xs"
                                whileHover={{scale: 1.05}}
                              >
                                {task.priority}
                              </MotionBadge>
                            )}
                          </div>
                        </div>
                        <Link href={`/dashboard/tasks?taskId=${task._id}`}>
                          <MotionButton
                            variant="ghost"
                            size="sm"
                            whileHover={{scale: 1.1, x: 3}}
                            whileTap={{scale: 0.9}}
                          >
                            <IconArrowRight className="h-4 w-4"/>
                          </MotionButton>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    className="text-center py-6"
                    initial={{opacity: 0, scale: 0.9}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{duration: 0.3}}
                  >
                    <IconAlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2"/>
                    <p className="text-sm text-muted-foreground">No tasks yet</p>
                    <Link href="/dashboard/tasks">
                      <MotionButton
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        whileHover={buttonHover}
                        whileTap={buttonTap}
                      >
                        Create your first task
                      </MotionButton>
                    </Link>
                  </motion.div>
                )}
              </CardContent>
            </MotionCard>
          </motion.div>
        </motion.div>

        {/* Productivity Tip */}
        <motion.div variants={staggerItem}>
          <MotionCard
            className="border-primary/20 bg-primary/5 shadow-sm"
            whileHover={{
              scale: 1.01,
              boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.2)"
            }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  <IconSparkles className="h-5 w-5 text-primary"/>
                </motion.div>
                Productivity Tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed dark:text-primary-foreground/90 text-primary">
                Break down large tasks into smaller, manageable pieces. This makes them less overwhelming
                and helps you track progress more effectively. Try using priority levels to focus on what matters most!
              </p>
            </CardContent>
          </MotionCard>
        </motion.div>
      </motion.div>
    </Suspense>
  );
}