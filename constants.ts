import { FileClock, BookOpenCheck , MessageSquare, Music, VideoIcon } from "lucide-react";

export const MAX_FREE_COUNTS = 5;
export const MAX_FREE_QUESTIONS = 10;
export const tools = [
  {
    label: 'Notrai',
    icon: MessageSquare,
    href: '/conversation',
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  // {
  //   label: 'Music Generation',
  //   icon: Music,
  //   href: '/music',
  //   color: "text-emerald-500",
  //   bgColor: "bg-emerald-500/10",
  // },
  // {
  //   label: 'Image Generation',
  //   icon: ImageIcon,
  //   color: "text-pink-700",
  //   bgColor: "bg-pink-700/10",
  //   href: '/Notrai',
  // },
  // {
  //   label: 'Video Generation',
  //   icon: VideoIcon,
  //   color: "text-orange-700",
  //   bgColor: "bg-orange-700/10",
  //   href: '/video',
  // },
  {
    label: 'Exam Prep',
    icon: FileClock,
    color: "text-green-700",
    bgColor: "bg-green-700/10",
    href: '/quiz',
  },
  {
    label: 'Notary Exam',
    icon: BookOpenCheck ,
    color: "text-green-700",
    bgColor: "bg-green-700/10",
    href: '/exam',
  },
];
