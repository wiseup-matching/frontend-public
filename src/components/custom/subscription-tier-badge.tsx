import { BadgeCheckIcon } from 'lucide-react';

type TierType = 'free' | 'silver' | 'gold';

interface SubscriptionTierBadgeProps {
  tier?: TierType;
  className?: string;
  minimal: boolean;
}

export function SubscriptionTierBadge({
  tier = 'free',
  className = '',
  minimal = false,
}: SubscriptionTierBadgeProps) {
  function getBadgeStyles(tierType: TierType): string {
    switch (tierType) {
      case 'free':
        return 'bg-tier-free text-tier-free-foreground';
      case 'silver':
        return 'bg-tier-silver text-tier-silver-foreground';
      case 'gold':
        return 'bg-tier-gold text-tier-gold-foreground';
      default:
        return 'bg-background text-gray-800';
    }
  }

  function getDisplayText(tierType: TierType): string {
    switch (tierType) {
      case 'free':
        return 'Free Member';
      case 'silver':
        return 'Silver Member';
      case 'gold':
        return 'Gold Member';
      default:
        return 'Unknown Member';
    }
  }

  if (tier === 'free') {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center rounded-full ${minimal ? 'p-1.5' : 'px-2.5 py-0.5'} text-xs font-medium ${getBadgeStyles(tier)} ${className}`}
      title={getDisplayText(tier)}
    >
      <BadgeCheckIcon className="h-4 w-4" />
      {!minimal && <span className="ml-1">{getDisplayText(tier)}</span>}
    </span>
  );
}
