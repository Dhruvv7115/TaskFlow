"use client";

import { motion } from "motion/react";
import { Button } from "./button";
import { Card } from "./card";
import { Badge } from "./badge";
import { Progress } from "./progress";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Avatar } from "./avatar";

// Create motion versions of all components at once
export const MotionButton = motion.create(Button);
export const MotionCard = motion.create(Card);
export const MotionBadge = motion.create(Badge);
export const MotionProgress = motion.create(Progress);
export const MotionInput = motion.create(Input);
export const MotionTextarea = motion.create(Textarea);
export const MotionAvatar = motion.create(Avatar);

// Export motion itself for convenience
export { motion };
