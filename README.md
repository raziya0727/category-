# Daily Basket — Expo cross-platform app

## Run locally
```bash
npm install
npx expo start
```
- Press `a` for Android
- Press `i` for iOS (requires macOS/Xcode)
- Press `w` for Web

## Publish to Expo Snack
1. Open https://snack.expo.dev/
2. Create a new Snack.
3. Upload/copy `App.js`, `app.json`, `package.json`, and the `src/` directory.
4. Ensure the dependency versions in `package.json` are selected.
5. Test Android, iOS and Web previews, then use Share to copy the Snack URL.

## Implementation notes
- React Context + reducer centralizes cart state.
- Product `+` / `−` is a single toggle action.
- Category section coordinates are recorded with `onLayout`.
- Scroll position updates the active category; selecting a category scrolls to its section.
- Layout switches at 760px: left sidebar on wide web, horizontal category panel on mobile.
- Demo catalog/images/prices are placeholder content pending access to the supplied Figma design.
# category-
