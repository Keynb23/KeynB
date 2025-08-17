// 1. Use import.meta.glob to find all .png and .svg files in the target directory.
// The `{ eager: true }` option imports the modules directly, which is simpler for assets.
const modules = import.meta.glob('../assets/Cred/*.{png,svg}', { eager: true });

// 2. Process the imported modules into a more useful object format.
const icons = {};
for (const path in modules) {
  // The key for each icon will be its filename without the extension (e.g., "Python", "Css").
  const key = path.split('/').pop().split('.')[0];
  // The value will be the URL to the image.
  icons[key] = modules[path].default;
}

export default icons;