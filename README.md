### Thank you [@raman-at-pieces](https://github.com/raman-at-pieces) for the extension template and an amazing tutorial [on Youtube](https://www.youtube.com/watch?v=0n809nd4Zu4)!

# Overview
This is a light weight Chrome extension that converts the "Current Schedule" page on Boston University's student link into an .ics file, which can be imported to most calendar platforms.  
The project is created in Spring 2024 for the intern process of UPE ([check us out!](http://upebu.byethost7.com)).

## Note
* Currently assumes semester lasts 16 weeks.
* Some classes with unique formats may be excluded from the schedule, e.g. a class with "Arranged" time. (You can also let me know in the Issues.)

# How to use
1. Access the extension by downloading the /dist folder and upload it at ```chrome://extensions``` (For more info, follow [this set of instructions](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked)).
2. Navigate to BU's Student Link --> Academics --> Current Schedule
3. Then, open the Chrome extension (From the extensions icon on the top right of Chrome)
4. Select the first day of classes on the popup and click the download button (bottom right of the popup)
5. A file named "Class Schedule.ics" should be downloaded and is ready to be imported!

&ensp;&ensp;&ensp; This can be imported to most major calendar platforms, e.g.:
* [Google Calendar Import Instructions](https://support.google.com/calendar/answer/37118?hl=en&co=GENIE.Platform%3DDesktop)
* Windows Calendar: Right click on the file --> Open with.. --> Calendar (or Outlook)
* Apple Calendar Import Instructions: Double-clicking on the file should open the schedule in the Calendar app. If not, [here are more instructions from Apple](https://support.apple.com/guide/calendar/import-or-export-calendars-icl1023/mac).

# Development
Tech stack: Manifest.js V3, [Chrome Extension API](https://developer.chrome.com/docs/extensions/reference/api), and Node.js (Webpack and [ics](https://www.npmjs.com/package/ics) packages)
### Installing dependencies
After installing node.js, paste and run this command on project folder level (same level as the README, package.json, etc.). This installs the necessary packages to run locally. \
```npm i -D ics webpack webpack-cli```
### Build Script
```npm run build```: Runs the webpack command and creates/updates the dist folder with the most recent changes (/dist is the folder to open in Chrome extensions)

