import { pseudoRandomNumBySeed } from '@/lib/utils';
import React from 'react';

// Dummy images for obscured profiles
const DUMMY_IMAGES = [
  '/obscure-profilepics/ObscureDummyImage1.png',
  '/obscure-profilepics/ObscureDummyImage2.png',
  '/obscure-profilepics/ObscureDummyImage3.png',
  '/obscure-profilepics/ObscureDummyImage4.png',
  '/obscure-profilepics/ObscureDummyImage5.png',
  '/obscure-profilepics/ObscureDummyImage6.png',
];

/**
 * Returns a random dummy image URL from the predefined list
 */
export function getRandomDummyImage(seed?: string): string {
  if (seed) {
    const index = Math.floor(pseudoRandomNumBySeed(seed) * DUMMY_IMAGES.length);
    return DUMMY_IMAGES[index];
  }
  return DUMMY_IMAGES[Math.floor(Math.random() * DUMMY_IMAGES.length)];
}

/**
 * CSS class to use for blurring elements
 */
export const BLUR_CLASS = 'blur-sm select-none';

/**
 * Determines the appropriate image URL based on obscured status
 * @param profilePicture The original profile picture URL
 * @param isObscured Whether the profile should be obscured
 * @returns The URL to display (either original or dummy)
 */
export function getProfileImageUrl(
  profilePicture: string | undefined | null,
  retireeId: string,
  isObscured: boolean,
): string {
  if (profilePicture === 'hiddenProfilePicture' || isObscured) {
    return getRandomDummyImage(retireeId);
  } else {
    return profilePicture ?? '';
  }
}

/**
 * Get CSS class string for profile elements that should be blurred
 * @param isObscured Whether the element should be obscured
 * @param additionalClasses Additional CSS classes to apply
 * @returns CSS class string
 */
export function getBlurClass(isObscured: boolean, additionalClasses = ''): string {
  return isObscured ? `${BLUR_CLASS} ${additionalClasses}`.trim() : additionalClasses;
}

/**
 * Creates a React element with appropriate styling for a name based on obscured status
 * @param firstName First name
 * @param lastName Last name
 * @param isObscured Whether the profile should be obscured
 * @returns React element with appropriate styling
 */
export function getNameDisplay(
  firstName: string | undefined,
  lastName: string | undefined,
  isObscured: boolean,
): React.ReactNode {
  return (
    <span className={getBlurClass(isObscured)}>
      {firstName} {lastName}
    </span>
  );
}

/**
 * Wraps an image component with blur styling when needed
 * @param imageUrl The URL of the image to display
 * @param isObscured Whether the image should be obscured
 * @param alt Alt text for the image
 * @param className Additional CSS classes for the image
 * @returns React image element with appropriate styling
 */
export function getProfileImage(
  imageUrl: string,
  isObscured: boolean,
  alt = 'Profile picture',
  className = '',
): React.ReactNode {
  return <img src={imageUrl} alt={alt} className={getBlurClass(isObscured, className)} />;
}

/**
 * Complete profile image handling - gets the correct URL and applies blur if needed
 * @param profilePicture Original profile picture URL
 * @param isObscured Whether to obscure the image
 * @param alt Alt text for the image
 * @param className Additional CSS classes
 * @returns React image element with appropriate URL and styling
 */
export function getObscuredProfileImage(
  profilePicture: string | undefined | null,
  retireeId: string,
  isObscured: boolean,
  alt = 'Profile picture',
  className = '',
): React.ReactNode {
  const url = getProfileImageUrl(profilePicture, retireeId, isObscured);
  return getProfileImage(url, isObscured, alt, className);
}
