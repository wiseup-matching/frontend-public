import type { Notification } from '@/api/openapi-client';
import { Button } from '../ui/button';
import { Bell, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useRetiree } from '@/hooks/useRetiree';
import { defaultApi } from '@/api/defaultapi';
import { socket } from '@/socket';
import { useCallback, useEffect, useState } from 'react';
import { useStartup } from '@/hooks/useStartup';
import type { KeyedMutator } from 'swr';
import { toast } from 'sonner';
import type { Retiree } from '@/api/openapi-client/models/Retiree';
import type { Startup } from '@/api/openapi-client/models/Startup';

function useNotifications(userId: string, isRetiree: boolean) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Only call the appropriate hook based on user type
  const { retiree, refreshRetiree, mutateRetiree } = useRetiree(isRetiree ? userId : undefined);
  const { startup, refreshStartup, mutateStartup } = useStartup(!isRetiree ? userId : undefined);

  // Determine which values to use based on isRetiree
  let user: Retiree | Startup | undefined;
  let refreshUser: () => Promise<Retiree | Startup | undefined>;
  let mutateUser: KeyedMutator<Retiree | Startup>;
  if (isRetiree) {
    user = retiree;
    refreshUser = refreshRetiree;
    mutateUser = mutateRetiree as KeyedMutator<Retiree | Startup>;
  } else {
    user = startup;
    refreshUser = refreshStartup;
    mutateUser = mutateStartup as KeyedMutator<Retiree | Startup>;
  }

  useEffect(() => {
    if (user?.notifications) {
      setNotifications(user.notifications);
    }
  }, [user]);

  return { notifications, setNotifications, refreshUser, mutateUser, user };
}

export default function NotificationsPopover({
  userId,
  isRetiree,
}: {
  userId: string;
  isRetiree: boolean;
}) {
  const { notifications, setNotifications, user, refreshUser, mutateUser } = useNotifications(
    userId,
    isRetiree,
  );
  // Track whether the pop‑over is open so we can style the bell like an “active” nav button
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleDeleteNotification = useCallback(
    async (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (!user) return;
      let newUser;
      if (isRetiree) {
        newUser = await defaultApi.retireeRetireeIdPut({
          retireeId: user.id,
          retireeUpdate: {
            ...user,
            notifications: (user.notifications ?? []).filter((n) => n.id !== id),
          },
        });
      } else {
        newUser = await defaultApi.startupStartupIdPut({
          startupId: user.id,
          startupUpdate: {
            ...user,
            notifications: (user.notifications ?? []).filter((n) => n.id !== id),
          },
        });
      }
      await mutateUser(newUser);
    },
    [isRetiree, mutateUser, setNotifications, user],
  );

  const handleAction = useCallback(
    (notificationId: string, url: string) => {
      handleDeleteNotification(notificationId).catch((error: unknown) => {
        console.error('Error deleting notification:', error);
        toast.error('Failed to delete notification');
      });
      window.location.href = url;
    },
    [handleDeleteNotification],
  );

  useEffect(() => {
    async function onNotification(notification: Notification, callback?: (msg: string) => unknown) {
      const newUser = await refreshUser();
      setNotifications((prev) => newUser?.notifications ?? [...prev, notification]);

      if (callback) {
        callback('online');
      }

      function onDelete(id: string) {
        handleDeleteNotification(id).catch((error: unknown) => {
          console.error('Error deleting notification:', error);
          toast.error('Failed to delete notification');
        });
        toast.dismiss();
      }

      toast.message(
        <div className="flex flex-row gap-4 w-full">
          <Bell className="h-5 w-5" />
          <Notification
            notification={notification}
            onDelete={null}
            handleAction={handleAction}
            minimalistic={true}
          />
          <X className="h-5 w-5 cursor-pointer" onClick={() => onDelete(notification.id)} />
        </div>,
        {
          closeButton: false,
        },
      );
    }

    if (!socket.listeners('notification').length) {
      socket.on('notification', onNotification);
    }

    return () => {
      socket.off('notification', onNotification);
    };
  }, [mutateUser, refreshUser, setNotifications, user, handleAction, handleDeleteNotification]);

  const hasNotifications = notifications.length > 0;

  const sortedNotifications = notifications.sort((a, b) => {
    if (!a.timestamp || !b.timestamp) return 0;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`
            relative inline-flex items-center justify-center
            h-10 w-10 rounded-full
            transition-transform duration-200 ease-out
            group
            hover:shadow-lg hover:scale-[1.05]
            cursor-pointer
            ${
              popoverOpen
                ? 'text-white bg-primary border border-primary text-primary-foreground shadow-md'
                : 'bg-white/40 border border-[rgba(255,255,255,0.3)] bg-clip-padding backdrop-filter backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:text-primary hover:border-primary hover:bg-primary/2'
            }
          `}
        >
          {/* bell */}
          <Bell
            className="
            relative z-10                       /* keep above bg layer if you add it */
            h-5 w-5 
            pointer-events-none
            ${popoverOpen
            ? 'text-white'
            : 'text-foreground group-hover:text-primary'}
          "
          />

          {/* badge */}
          <span
            className={`
            absolute -top-0 -right-0
            h-2 w-2 rounded-full
            ${hasNotifications ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
            bg-primary group-hover:bg-secondary
            transform transition-all duration-200 ease-in-out
            group-hover:scale-110               /* grows in sync */
            ${popoverOpen ? 'bg-secondary' : ''}
          `}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="w-full flex flex-col items-center justify-center h-full">
          {!hasNotifications && (
            <div className="text-gray-500 text-sm p-4">
              You are all caught up! No new notifications.
            </div>
          )}
          <div className="max-h-[400px] w-full overflow-y-auto">
            {sortedNotifications.map((notification) => (
              <Notification
                key={notification.id}
                notification={notification}
                onDelete={(id) => {
                  handleDeleteNotification(id).catch((error: unknown) => {
                    console.error('Error deleting notification:', error);
                    toast.error('Failed to delete notification');
                  });
                }}
                handleAction={handleAction}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function Notification({
  notification,
  onDelete,
  handleAction,
  minimalistic = false,
}: {
  notification: Notification;
  onDelete: ((id: string) => void) | null;
  handleAction: (notificationId: string, url: string) => void;
  minimalistic?: boolean;
}) {
  return (
    <div className={`rounded-md w-full max-w-md  ${minimalistic ? '' : 'p-4 border mb-2'}`}>
      <div className="flex justify-between items-center">
        <div className={`align-middle font-semibold`}>{notification.title}</div>

        {notification.id && onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary cursor-pointer"
            onClick={() => onDelete(notification.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="text-sm text-gray-600 mt-1">{notification.message}</div>
      {notification.timestamp && !minimalistic && (
        <div className="text-xs text-gray-400 mt-2">
          {new Date(notification.timestamp).toLocaleString('de-DE', {
            dateStyle: 'short',
            timeStyle: 'short',
          })}
        </div>
      )}
      {notification.actions.length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {notification.actions.map((action) => (
            <Button
              key={action.label + action.url}
              variant="outline"
              size="sm"
              className="text-sm cursor-pointer"
              onClick={() => {
                if (notification.id && onDelete) {
                  onDelete(notification.id);
                }
                if (action.url) {
                  handleAction(notification.id, action.url);
                }
              }}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
