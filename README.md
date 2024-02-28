Thank you [@raman-at-pieces](https://github.com/raman-at-pieces) for the extension template and an amazing tutorial [on Youtube](https://www.youtube.com/watch?v=0n809nd4Zu4)!

## Note
Currently assumes semester lasts 16 weeks.

# How to use
1. Access the extension at \[TBD\] \
2. Navigate to Student Link --> Academics --> Current Schedule \
3. Then, open the Chrome extension (From the extensions icon on the top right of Chrome) \
4. Select the first day of classes on the popup and click the download button (botten right of the popup) \
5. Go to your downloads file to see the calendar file! \
This can be imported to most major calendar platform, e.g.: \
[Google Import Instructions](https://www.youtube.com/watch?v=0n809nd4Zu4) \
Windows Calendar: Right click on the file --> Open with.. --> Calendar (or Outlook) \
[Apple](https://support.apple.com/guide/calendar/import-or-export-calendars-icl1023/mac) (Note: This is not yet tested. Sorry I don't have a Mac)

# Development
Tech stack: Manifest.js V3, Node.js (Webpack and ics package)
### Installing dependencies
After installing node.js, paste and run this command on project folder level (same level README, package.json, etc.). This installs the necessary packages to run locally. \
```npm i -D ics webpack webpack-cli```
### Build Script
Runs the webpack command and creates a /dist folder, which is the one to open in Chrome extensions
```npm run build```
