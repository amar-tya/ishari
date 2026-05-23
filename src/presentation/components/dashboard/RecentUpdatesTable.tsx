import React from 'react';
import { Card, Avatar, Badge } from '../base';

interface UpdateEntry {
  id: string;
  entity: string;
  action: string;
  user: {
    name: string;
    avatar?: string;
    initials?: string;
  };
  time: string;
  status: 'completed' | 'pending' | 'failed';
}

interface RecentUpdatesTableProps {
  data: UpdateEntry[];
  isLoading?: boolean;
  className?: string;
}

export const RecentUpdatesTable: React.FC<RecentUpdatesTableProps> = ({
  data,
  isLoading = false,
  className = '',
}) => {
  const getStatusVariant = (status: UpdateEntry['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card className={className} padding="md">
      <h3 className="text-title mb-4">Recent Master Data Updates</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left text-label py-3 px-2 font-semibold">Entity</th>
              <th className="text-left text-label py-3 px-2 font-semibold">Action</th>
              <th className="text-left text-label py-3 px-2 font-semibold">User</th>
              <th className="text-left text-label py-3 px-2 font-semibold">Time</th>
              <th className="text-left text-label py-3 px-2 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-[var(--color-border-light)]">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="py-3 px-2">
                      <div className="animate-pulse h-4 bg-gray-100 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-description">
                  No recent updates found.
                </td>
              </tr>
            ) : (
              data.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-[var(--color-border-light)] hover:bg-[var(--color-bg-main)] transition-colors"
                >
                  <td className="py-3 px-2">
                    <p className="text-body font-medium">{entry.entity}</p>
                  </td>
                  <td className="py-3 px-2">
                    <p className="text-description">{entry.action}</p>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={entry.user.avatar}
                        initials={entry.user.initials || entry.user.name}
                        size="sm"
                      />
                      <span className="text-body">{entry.user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <p className="text-caption">{entry.time}</p>
                  </td>
                  <td className="py-3 px-2">
                    <Badge variant={getStatusVariant(entry.status)}>
                      {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RecentUpdatesTable;
