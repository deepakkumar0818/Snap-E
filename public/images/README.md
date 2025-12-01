# Images Folder

This folder contains static image assets for the Snap-e Cabs application.

## Usage

Images placed in this folder can be referenced in your Next.js components using:

```tsx
import Image from 'next/image';

<Image src="/images/your-image.png" alt="Description" width={500} height={300} />
```

Or using regular HTML img tags:

```tsx
<img src="/images/your-image.png" alt="Description" />
```

## Folder Structure

- `/public/images/` - Root images folder
- Place all static images here (logos, icons, vehicle images, etc.)

## Notes

- Files in the `public` folder are served statically by Next.js
- Reference them with paths starting from `/` (e.g., `/images/logo.png`)
- The `public` folder is the root for static assets in Next.js

