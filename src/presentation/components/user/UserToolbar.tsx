import React from 'react';
import { Button } from '../base/Button';
import { SearchInput } from '../base/SearchInput';
import { TrashIcon, PlusIcon } from '../base/icons';

interface UserToolbarProps {
  onSearch: (query: string) => void;
  onNewUserClick: () => void;
  onBulkDeleteClick: () => void;
}

export const UserToolbar: React.FC<UserToolbarProps> = ({
  onSearch,
  onNewUserClick,
  onBulkDeleteClick,
}) => {
  const textStyle: React.CSSProperties = {
    maxWidth: 'clamp(0px, calc( ( 100vw - 600px ) * 1000 ), 100%)',
    opacity: 'clamp(0, calc( ( 100vw - 600px ) * 1000 ), 1)',
    fontSize: 'clamp(0px, calc( ( 100vw - 600px ) * 1000 ), 1em)',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s ease',
    display: 'inline-block',
    verticalAlign: 'middle',
  };

  const buttonPaddingStyle = {
    paddingLeft: 'clamp(8px, calc( ( 100vw - 600px ) * 1000 ), 1rem)',
    paddingRight: 'clamp(8px, calc( ( 100vw - 600px ) * 1000 ), 1rem)',
    gap: 'clamp(0px, calc( ( 100vw - 600px ) * 1000 ), 0.5rem)',
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-[clamp(0.75rem,2vw,1.5rem)] bg-white p-[clamp(0.75rem,1.5vw,1.25rem)] rounded-xl border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
      {/* Search Bar */}
      <div className="flex-[999_1_150px] w-full min-w-[150px]">
        <SearchInput
          placeholder="Search by Username or Email..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Actions Group */}
      <div className="flex flex-wrap items-center gap-[clamp(0.5rem,1vw,1rem)] flex-[1_1_auto] justify-end">
        <Button
          variant="secondary"
          className="!text-red-600 !border-red-100 hover:!bg-red-50 transition-all duration-300"
          style={buttonPaddingStyle}
          icon={<TrashIcon size={18} />}
          onClick={onBulkDeleteClick}
          title="Bulk Delete"
        >
          <span style={textStyle}>Bulk Delete</span>
        </Button>
        <Button
          variant="primary"
          className="!bg-[#22C55E] !border-[#22C55E] hover:!bg-[#1ea34d] transition-all duration-300"
          style={buttonPaddingStyle}
          onClick={onNewUserClick}
          icon={<PlusIcon size={18} />}
          title="New User"
        >
          <span style={textStyle}>New User</span>
        </Button>
      </div>
    </div>
  );
};
