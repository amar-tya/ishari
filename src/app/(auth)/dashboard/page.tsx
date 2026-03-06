'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/presentation/components/base';
import {
  UsersIcon,
  ChaptersIcon,
  VersesIcon,
  UserPlusIcon,
  BookPlusIcon,
  TranslationsIcon,
  SettingsIcon,
  ExportIcon,
  PlusIcon,
} from '@/presentation/components/base/icons';
import {
  StatCard,
  QuickActionCard,
  NotificationCard,
  PendingApprovalCard,
  RecentUpdatesTable,
} from '@/presentation/components/dashboard';
import { useUser, useStats } from '@/presentation/hooks';
import { DashboardStatsEntity } from '@/core/entities';

const quickActions = [
  {
    icon: <UserPlusIcon size={24} />,
    label: 'Add User',
    color: 'bg-[#EAF7ED]',
    iconColor: 'text-[#3AAF50]',
  },
  {
    icon: <BookPlusIcon size={24} />,
    label: 'Add Book',
    color: 'bg-[#FEF3C7]',
    iconColor: 'text-[#D97706]',
  },
  {
    icon: <TranslationsIcon size={24} />,
    label: 'New Translation',
    color: 'bg-[#DBEAFE]',
    iconColor: 'text-[#2563EB]',
  },
  {
    icon: <SettingsIcon size={24} />,
    label: 'Manage Roles',
    color: 'bg-[#EAF7ED]',
    iconColor: 'text-[#3AAF50]',
  },
];

const notificationsData = [
  { id: '1', message: 'System updates available', type: 'info' as const },
  { id: '2', message: 'New user registration', type: 'info' as const },
];

const recentUpdatesData = [
  {
    id: '1',
    entity: 'Verse #4023',
    action: 'Text Update',
    user: { name: 'John Doe', initials: 'JD' },
    time: '2 mins ago',
    status: 'completed' as const,
  },
  {
    id: '2',
    entity: 'Translation: EN_V2',
    action: 'New Registration',
    user: { name: 'Alice Smith', initials: 'AS' },
    time: '45 mins ago',
    status: 'pending' as const,
  },
  {
    id: '3',
    entity: 'User: M. Scott',
    action: 'Role Change',
    user: { name: 'Admin', initials: 'AD' },
    time: '2 hours ago',
    status: 'completed' as const,
  },
];

function buildStatsCards(stats: DashboardStatsEntity) {
  return [
    {
      icon: <UsersIcon size={28} />,
      label: 'Total Users',
      value: stats.totalUsers,
      href: '/users',
      iconBgColor: 'bg-[#EAF7ED]',
      iconColor: 'text-[#3AAF50]',
      labelColor: 'text-[#3AAF50]',
    },
    {
      icon: <ChaptersIcon size={28} />,
      label: 'Chapters',
      value: stats.totalChapter,
      href: '/chapters',
      iconBgColor: 'bg-[#DBEAFE]',
      iconColor: 'text-[#2563EB]',
      labelColor: 'text-[#2563EB]',
    },
    {
      icon: <VersesIcon size={28} />,
      label: 'Verses',
      value: stats.totalVerses,
      href: '/verses',
      iconBgColor: 'bg-[#FEF3C7]',
      iconColor: 'text-[#D97706]',
      labelColor: 'text-[#D97706]',
    },
    {
      icon: <ChaptersIcon size={28} />,
      label: 'Hadis',
      value: stats.totalHadis,
      href: '/hadi',
      iconBgColor: 'bg-[#EDE9FE]',
      iconColor: 'text-[#7C3AED]',
      labelColor: 'text-[#7C3AED]',
    },
    {
      icon: <VersesIcon size={28} />,
      label: 'Verse Media',
      value: stats.totalVerseMedia,
      href: '/verse-media',
      iconBgColor: 'bg-[#FEE2E2]',
      iconColor: 'text-[#DC2626]',
      labelColor: 'text-[#DC2626]',
    },
  ];
}

export default function DashboardPage() {
  const user = useUser();
  const { getDashboardStats } = useStats();

  const [stats, setStats] = useState<DashboardStatsEntity | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoadingStats(true);
      try {
        const result = await getDashboardStats();
        if (result.success) {
          setStats(result.data);
        }
      } finally {
        setIsLoadingStats(false);
      }
    };
    fetchStats();
  }, [getDashboardStats]);

  const statsCards = stats ? buildStatsCards(stats) : [];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-heading capitalize">
            Welcome back, {user?.username} 👋
          </h1>
          <p className="text-description mt-1">
            Here&apos;s what&apos;s happening with your master data today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={<ExportIcon size={18} />}>
            Export Report
          </Button>
          <Button variant="primary" icon={<PlusIcon size={18} />}>
            New Entry
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {isLoadingStats
          ? // Skeleton loading placeholders
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-xl bg-gray-100 h-28"
              />
            ))
          : statsCards.map((stat, index) => (
              <StatCard
                key={index}
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                href={stat.href}
                iconBgColor={stat.iconBgColor}
                iconColor={stat.iconColor}
                labelColor={stat.labelColor}
              />
            ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_clamp(280px,25vw,360px)] gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div>
            <h2 className="text-title mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <QuickActionCard
                  key={index}
                  icon={action.icon}
                  label={action.label}
                  iconBgColor={action.color}
                  iconColor={action.iconColor}
                />
              ))}
            </div>
          </div>

          {/* Recent Updates */}
          <RecentUpdatesTable data={recentUpdatesData} />
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Notifications */}
          <NotificationCard notifications={notificationsData} />

          {/* Pending Approvals */}
          <PendingApprovalCard
            count={3}
            message="new user registration requests pending your approval."
          />
        </div>
      </div>
    </div>
  );
}
