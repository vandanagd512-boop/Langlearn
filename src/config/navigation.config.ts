import {
  BookOpen,
  Globe2,
  GraduationCap,
  Sparkles,
  Layers,
  Activity,
  User,
  Settings,
  Languages,
  HelpCircle,
  ShieldAlert,
  Compass,
  Home,
  SlidersHorizontal,
  LucideIcon,
} from 'lucide-react';
import { ROUTES } from './constants';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
  category?: 'core' | 'learning' | 'tools' | 'account' | 'admin';
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    path: ROUTES.HOME,
    icon: Home,
    category: 'core',
  },
  {
    id: 'learn',
    label: 'Learn',
    path: ROUTES.LEARN,
    icon: Compass,
    badge: 'AI',
    category: 'learning',
  },
  {
    id: 'languages',
    label: 'Languages',
    path: ROUTES.LANGUAGES,
    icon: Globe2,
    category: 'learning',
  },
  {
    id: 'courses',
    label: 'Courses',
    path: ROUTES.COURSES,
    icon: BookOpen,
    category: 'learning',
  },
  {
    id: 'lessons',
    label: 'Lessons',
    path: ROUTES.LESSONS,
    icon: GraduationCap,
    category: 'learning',
  },
  {
    id: 'vocabulary',
    label: 'Vocabulary',
    path: ROUTES.VOCABULARY,
    icon: Layers,
    category: 'tools',
  },
  {
    id: 'practice',
    label: 'Practice',
    path: ROUTES.PRACTICE,
    icon: Sparkles,
    category: 'tools',
  },
  {
    id: 'quiz',
    label: 'Quiz',
    path: ROUTES.QUIZ,
    icon: HelpCircle,
    category: 'tools',
  },
  {
    id: 'translator',
    label: 'Translator',
    path: ROUTES.TRANSLATOR,
    icon: Languages,
    category: 'tools',
  },
  {
    id: 'progress',
    label: 'Progress',
    path: ROUTES.PROGRESS,
    icon: Activity,
    category: 'account',
  },
  {
    id: 'profile',
    label: 'Profile',
    path: ROUTES.PROFILE,
    icon: User,
    category: 'account',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: ROUTES.SETTINGS,
    icon: Settings,
    category: 'account',
  },
  {
    id: 'admin',
    label: 'Admin Portal',
    path: ROUTES.ADMIN,
    icon: ShieldAlert,
    badge: 'Staff',
    category: 'admin',
  },
];

export const FLOW_ROUTES = [
  { id: 'splash', label: 'Splash Screen', path: ROUTES.SPLASH, icon: Sparkles },
  { id: 'onboarding', label: 'Onboarding Flow', path: ROUTES.ONBOARDING, icon: SlidersHorizontal },
  { id: 'auth', label: 'Authentication', path: ROUTES.AUTH, icon: User },
];
