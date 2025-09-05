export const subscriptionColor = (subscriptionTier?: string): string => {
  if (!subscriptionTier) return '#edeaff';
  const id = subscriptionTier.toLowerCase();

  if (id.includes('silver')) return '#d8d8d8';
  if (id.includes('gold')) return '#ebb866';

  return '#edeaff';
};
