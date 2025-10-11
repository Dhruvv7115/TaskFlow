'use client';

import {lazy, Suspense, useEffect, useState} from 'react';
import {tasksAPI} from '@/lib/api';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {Separator} from '@/components/ui/separator';
import {
  IconAlertCircle,
  IconCalendar,
  IconCheckbox,
  IconCircleCheck,
  IconClock,
  IconEdit,
  IconFilter,
  IconLayoutGrid,
  IconLayoutList,
  IconPlus,
  IconSearch,
  IconTrash,
  IconTrendingUp,
  IconX
} from '@tabler/icons-react';
import TaskModal from '@/components/TaskModal';
import {Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty";
import {AnimatePresence, motion} from 'motion/react';
import {buttonHover, buttonTap, cardHover, staggerContainer, staggerItem} from '@/lib/animations';

const TasksSkeleton = lazy(() => import('@/components/tasks-skeleton.jsx'));
const MotionCard = motion(Card);
const MotionButton = motion(Button);
const MotionBadge = motion(Badge);

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterAndSortTasks();
  }, [tasks, searchQuery, statusFilter, priorityFilter, sortBy]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getTasks();
      setTasks(response.data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortTasks = () => {
    let filtered = [...tasks];

    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'priority':
          const priorityOrder = {high: 3, medium: 2, low: 1};
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        default:
          return 0;
      }
    });

    setFilteredTasks(filtered);
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;

    try {
      await tasksAPI.deleteTask(taskToDelete._id);
      setTasks(tasks.filter(t => t._id !== taskToDelete._id));
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  };

  const handleTaskSaved = () => {
    fetchTasks();
    setIsModalOpen(false);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSortBy('newest');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return IconClock;
      case 'in-progress':
        return IconTrendingUp;
      case 'completed':
        return IconCircleCheck;
      default:
        return IconCheckbox;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-500';
      case 'in-progress':
        return 'border-blue-500/50 bg-blue-500/10 text-blue-500';
      case 'completed':
        return 'border-green-500/50 bg-green-500/10 text-green-500';
      default:
        return 'border-border bg-secondary text-secondary-foreground';
    }
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    (statusFilter !== 'all' ? 1 : 0) +
    (priorityFilter !== 'all' ? 1 : 0);

  return (
    <Suspense fallback={<TasksSkeleton/>}>
      <motion.div
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          variants={staggerItem}
        >
          <div>
            <motion.h1
              className="text-3xl font-bold tracking-tight"
              initial={{opacity: 0, x: -20}}
              animate={{opacity: 1, x: 0}}
              transition={{duration: 0.5}}
            >
              Tasks
            </motion.h1>
            <motion.p
              className="text-muted-foreground mt-1"
              initial={{opacity: 0, x: -20}}
              animate={{opacity: 1, x: 0}}
              transition={{duration: 0.5, delay: 0.1}}
            >
              Manage and organize your tasks efficiently
            </motion.p>
          </div>
          <MotionButton
            onClick={handleCreateTask}
            size="lg"
            className="group shadow-sm"
            whileHover={{scale: 1.05, boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.3)"}}
            whileTap={{scale: 0.95}}
          >
            <IconPlus className="mr-2 h-4 w-4"/>
            Create Task
          </MotionButton>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          variants={staggerContainer}
        >
          {[
            {icon: IconCheckbox, value: tasks.length, label: 'Total', color: 'text-primary', bg: 'bg-primary/10'},
            {
              icon: IconClock,
              value: tasks.filter(t => t.status === 'pending').length,
              label: 'Pending',
              color: 'text-yellow-500',
              bg: 'bg-yellow-500/10'
            },
            {
              icon: IconTrendingUp,
              value: tasks.filter(t => t.status === 'in-progress').length,
              label: 'In Progress',
              color: 'text-blue-500',
              bg: 'bg-blue-500/10'
            },
            {
              icon: IconCircleCheck,
              value: tasks.filter(t => t.status === 'completed').length,
              label: 'Completed',
              color: 'text-green-500',
              bg: 'bg-green-500/10'
            }
          ].map((stat, index) => (
            <motion.div key={index} variants={staggerItem}>
              <MotionCard
                className="shadow-sm"
                whileHover={{y: -4, boxShadow: "0 10px 20px -5px rgba(0, 0, 0, 0.1)"}}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className={`p-2 rounded-lg ${stat.bg}`}
                      whileHover={{rotate: [0, -10, 10, 0], scale: 1.1}}
                      transition={{duration: 0.3}}
                    >
                      <stat.icon className={`h-5 w-5 ${stat.color}`}/>
                    </motion.div>
                    <div>
                      <motion.p
                        className="text-2xl font-bold"
                        initial={{opacity: 0, scale: 0.5}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{delay: 0.2 + index * 0.05, type: "spring"}}
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

        {/* Filters */}
        <motion.div variants={staggerItem}>
          <MotionCard className="shadow-sm" whileHover={cardHover}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconFilter className="h-5 w-5 text-muted-foreground"/>
                  <CardTitle className="text-lg">Filters</CardTitle>
                  <AnimatePresence>
                    {activeFiltersCount > 0 && (
                      <motion.div
                        initial={{scale: 0}}
                        animate={{scale: 1}}
                        exit={{scale: 0}}
                        transition={{type: "spring", stiffness: 200}}
                      >
                        <Badge variant="secondary">{activeFiltersCount} active</Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <AnimatePresence>
                  {activeFiltersCount > 0 && (
                    <motion.div
                      initial={{opacity: 0, x: 20}}
                      animate={{opacity: 1, x: 0}}
                      exit={{opacity: 0, x: 20}}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-muted-foreground"
                      >
                        <IconX className="mr-1 h-4 w-4"/>
                        Clear all
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardHeader>
            <CardContent>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
                variants={staggerContainer}
              >
                <motion.div className="lg:col-span-2" variants={staggerItem}>
                  <div className="relative group">
                    <IconSearch
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10"/>
                    <Input
                      id="searchQuery"
                      type="text"
                      placeholder="Search tasks..."
                      className="pl-10 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-0 transition-all duration-200"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </motion.div>

                {[
                  {
                    value: statusFilter, onChange: setStatusFilter, placeholder: "Status", options: [
                      {value: 'all', label: 'All Status'},
                      {value: 'pending', label: 'Pending'},
                      {value: 'in-progress', label: 'In Progress'},
                      {value: 'completed', label: 'Completed'}
                    ]
                  },
                  {
                    value: priorityFilter, onChange: setPriorityFilter, placeholder: "Priority", options: [
                      {value: 'all', label: 'All Priority'},
                      {value: 'low', label: 'Low'},
                      {value: 'medium', label: 'Medium'},
                      {value: 'high', label: 'High'}
                    ]
                  },
                  {
                    value: sortBy, onChange: setSortBy, placeholder: "Sort by", options: [
                      {value: 'newest', label: 'Newest First'},
                      {value: 'oldest', label: 'Oldest First'},
                      {value: 'title', label: 'Title (A-Z)'},
                      {value: 'priority', label: 'Priority'}
                    ]
                  }
                ].map((select, index) => (
                  <motion.div key={index} variants={staggerItem}>
                    <Select value={select.value} onValueChange={select.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={select.placeholder}/>
                      </SelectTrigger>
                      <SelectContent>
                        {select.options.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </MotionCard>
        </motion.div>

        {/* Results Header */}
        <motion.div
          className="flex items-center justify-between"
          variants={staggerItem}
        >
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredTasks.length}</span> of{' '}
            <span className="font-medium text-foreground">{tasks.length}</span> tasks
          </p>
          <div className="flex items-center gap-2">
            {['grid', 'list'].map(mode => (
              <MotionButton
                key={mode}
                variant={viewMode === mode ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode(mode)}
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                {mode === 'grid' ? <IconLayoutGrid className="h-4 w-4"/> : <IconLayoutList className="h-4 w-4"/>}
              </MotionButton>
            ))}
          </div>
        </motion.div>

        {/* Tasks Grid/List */}
        <AnimatePresence mode="wait">
          {!loading && filteredTasks.length === 0 ? (
            <motion.div
              key="empty"
              initial={{opacity: 0, scale: 0.9}}
              animate={{opacity: 1, scale: 1}}
              exit={{opacity: 0, scale: 0.9}}
              transition={{duration: 0.3}}
            >
              <Card>
                <CardContent className="py-16">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon" size="lg">
                        <IconAlertCircle className="h-12 w-12"/>
                      </EmptyMedia>
                      <EmptyTitle>No Tasks Yet</EmptyTitle>
                      <EmptyDescription>
                        {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                          ? 'Try adjusting your filters or search query'
                          : 'Create your first task to get started!'
                        }
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <MotionButton
                        onClick={activeFiltersCount > 0 ? clearFilters : handleCreateTask}
                        whileHover={buttonHover}
                        whileTap={buttonTap}
                      >
                        {activeFiltersCount > 0 ? (
                          <><IconX className="mr-2 h-4 w-4"/>Clear Filters</>
                        ) : (
                          <><IconPlus className="mr-2 h-4 w-4"/>Create Task</>
                        )}
                      </MotionButton>
                    </EmptyContent>
                  </Empty>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="tasks"
              className={`grid gap-4 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {filteredTasks.map((task, index) => {
                const StatusIcon = getStatusIcon(task.status);
                return (
                  <motion.div
                    key={task._id}
                    variants={staggerItem}
                    layout
                    initial={{opacity: 0, scale: 0.8}}
                    animate={{opacity: 1, scale: 1}}
                    exit={{opacity: 0, scale: 0.8}}
                    transition={{duration: 0.3}}
                  >
                    <MotionCard
                      className="group h-full"
                      whileHover={{
                        y: -8,
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                        borderColor: "hsl(var(--primary) / 0.5)"
                      }}
                      transition={{duration: 0.2}}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                              {task.title}
                            </CardTitle>
                            {task.description && (
                              <CardDescription className="mt-2 line-clamp-2">
                                {task.description}
                              </CardDescription>
                            )}
                          </div>
                          <motion.div
                            className="flex gap-1"
                            initial={{opacity: 0}}
                            animate={{opacity: 0}}
                            whileHover={{opacity: 1}}
                            transition={{duration: 0.2}}
                          >
                            <MotionButton
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditTask(task)}
                              whileHover={{scale: 1.1}}
                              whileTap={{scale: 0.9}}
                            >
                              <IconEdit className="h-4 w-4"/>
                            </MotionButton>
                            <MotionButton
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteClick(task)}
                              whileHover={{scale: 1.1}}
                              whileTap={{scale: 0.9}}
                            >
                              <IconTrash className="h-4 w-4"/>
                            </MotionButton>
                          </motion.div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <MotionBadge
                              variant="outline"
                              className={`${getStatusColor(task.status)} border`}
                              whileHover={{scale: 1.05}}
                            >
                              <StatusIcon className="mr-1 h-3 w-3"/>
                              {task.status}
                            </MotionBadge>
                            {task.priority && (
                              <MotionBadge
                                variant={getPriorityVariant(task.priority)}
                                whileHover={{scale: 1.05}}
                              >
                                {task.priority}
                              </MotionBadge>
                            )}
                          </div>
                          <Separator/>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <IconCalendar className="mr-1 h-3 w-3"/>
                            {new Date(task.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </MotionCard>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Task Modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleTaskSaved}
          task={editingTask}
        />

        {/* Delete Confirmation Dialog */}
        <AnimatePresence>
          {deleteDialogOpen && (
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the task
                    {taskToDelete && ` "${taskToDelete.title}"`}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteConfirm}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </AnimatePresence>
      </motion.div>
    </Suspense>
  );
}