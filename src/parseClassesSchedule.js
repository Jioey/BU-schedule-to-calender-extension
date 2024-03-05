import * as ics from 'ics'

// HELPER FUNCTIONS -------------------------------------------
/**
 * Removes weird HTML formatting from student link.
 * (It's a separate function so if they update student link this can be easily updated)
 * @param {Array} tableArr Array form of the HTML table
 * @returns {Array}        Same array but cleaner and ready to be parsed
 * 
 * @note Update this immediately after student link updates!!!
 *       This cleaning is HARDCODED
 * @todo Potential misc feat: extract semester name
 */
const cleanTableArray = (tableArr) => {
   // Removes the top row bc it's the titles
   // (easier to do so after converted to array)
   tableArr.shift()

   // Removes sidebar html that is in the first row element 
   // (yea it's weird formatting I know)
   tableArr.at(0).shift()

   // remove empty rows at the bottom
   let lastRow = tableArr[tableArr.length - 1]
   // (only empty rows are of lenth 14 for some reason?)
   while (lastRow.length == 14) {
      tableArr.pop() // remove last row
      lastRow = tableArr[tableArr.length - 1] // update last row
   }

   // like srsly what is this formatting T_T

   return tableArr
}


/**
 * Converts cleaned HTML table into a nested array
 * @param {HTMLCollection} htmlTable 
 * @returns A nested array where each element is a <td> tag
 */
const convertHTMLTableToArray = (htmlTable) => {
   // turn table into array
   let tableArr = Array.from(htmlTable.children)

   // turn each row also into an array (of <td> tags)
   for (let index = 0; index < tableArr.length; index++) {
      tableArr[index] = Array.from(tableArr[index].children)
   }

   // remove weird formatting
   tableArr = cleanTableArray(tableArr)

   return tableArr
}

/**
 * Converts 12hr time to 24hr time
 * Courtesy Chris Dąbrowski on Stack Overflow
 * @param {String} time12h 
 * @returns 
 */
const convertTime12to24 = (time12h) => {
   let time = time12h.slice(0, -2)
   let modifier = time12h.slice(-2)  // gets last two characters of string

   let [hours, minutes] = time.split(':');

   if (hours === '12') {
      hours = '00';
   }

   if (modifier === 'pm') {
      hours = parseInt(hours, 10) + 12;
   }

   return `${hours}:${minutes}`;
}


/**
 * Adds weeks to a date 
 * Courtesy Avnish Jayaswal on Stack Overflow
 * @param {Date} date Starting date to add to
 * @param {number} weeksToAdd Number of weeks to add
 * @returns {Date} Date after weeks added
 */
const addWeekstoDate = (date, weeksToAdd) => {
   // Convert weeks to milliseconds (1 week = 7 days)
   let millisecondsInAWeek = 7 * 24 * 60 * 60 * 1000;
   let totalMillisecondsToAdd = weeksToAdd * millisecondsInAWeek;

   // Get the current timestamp of the date
   let currentTimestamp = date.getTime();

   // Calculate the new timestamp by adding milliseconds
   let newTimestamp = currentTimestamp + totalMillisecondsToAdd;

   // Set the new timestamp to the date
   let endDate = new Date()
   endDate.setTime(newTimestamp);

   return endDate
}

/**
 * Finds the first day of the week starting from @param date that is in @param weekdayMatchList
 * @param {Date} date Starting date of the search
 * @param {Array[String]} weekdayMatchList List of string representing days of the week (e.g. ["Tue", "Thu"])
 */
const shiftDateToDayOfWeek = (date, weekdayMatchList) => {
   // deep clone the date object
   let dateClone = structuredClone(date)

   // Converts day in week to its numeric representation in Date datatype
   weekdayMatchList.forEach((o, i, a) => {
      switch (a[i]) {
         case "Sun":
            a[i] = 0
            break;
         case "Mon":
            a[i] = 1
            break;
         case "Tue":
            a[i] = 2
            break;
         case "Wed":
            a[i] = 3
            break;
         case "Thu":
            a[i] = 4
            break;
         case "Fri":
            a[i] = 5
            break;
         case "Sat":
            a[i] = 6
            break;
         default:
            throw "Day match failed in shiftDateToDayOfWeek()"
      }
   })

   // Increment date until finds a matching day
   while (!weekdayMatchList.includes(dateClone.getDay())) {
      dateClone.setDate(dateClone.getDate() + 1)
   }

   return dateClone
}


// MAIN FUNCTIONS -------------------------------------------
/**
 * Parse one row of HTML element and returns an event object for ics package
 * NOTE: This function is very messy and hard-coded. I recommend looking over the student link page's html structure
 *    before trying to understand this mess. 
 * @param {Array[<td>]} rowArr An array of a row in the table, 
 *    each input element is in the following format:
 * <td>
 *    <font size="-1" color="#330000" face="Verdana, Helvetica, Arial, sans-serif">text</font>
 * </td>
 */
const createClassEvent = (rowArr) => {
   let classEvent = {}  // init event

   // Init strings from list of html tags
   let classCode = rowArr[0].lastChild.innerHTML.replaceAll("&nbsp;", " ")  // "CAS CS210 A1" (.innerText was buggy)
   let titleAndProf = rowArr[4].innerText.split("\n")    // ["Comp Systems", "Narayanan"]
   let classType = rowArr[6].innerText                   // "Lecture"

   let classLocation = rowArr[7].innerText + " " + rowArr[8].innerText  // "LAW 101"

   let dayOfWeek = rowArr[9].innerText.split(",")              // ["Tue", "Thu"]
   let startTime = convertTime12to24(rowArr[10].innerText)// "12:30pm" but in 24hr
   let endTime = convertTime12to24(rowArr[11].innerText) // "1:45pm" but in 24hr

   // Assign Class Name + Type
   // classCode.substr(classCode.indexOf("&nbsp;") + 1) removes the College from the name
   classEvent["title"] = classCode.substr(classCode.indexOf(" ") + 1) + " " + titleAndProf[0] + " " + classType

   // Assign Class Location
   classEvent["location"] = classLocation

   // Assign Recurrence Rule
   // Turn "day" list into rrule fragment (visit https://freetools.textmagic.com/rrule-generator to learn more)
   let dayOfWeekClone = structuredClone(dayOfWeek);   // make deep copy of dayOfWeek to use for rrule
   let rrule = dayOfWeekClone.shift().slice(0, 2).toUpperCase()   // pops first day-of-week and converts to rrule format
   // Adds the rest of the days in dayOfWeekClone
   while (dayOfWeekClone.length != 0) {
      rrule += "," + dayOfWeekClone.shift().slice(0, 2).toUpperCase()   
   }
   let numWeeks = 16; // Assumes 16 weeks in a semester
   let endRepeat = addWeekstoDate(startDateDate, numWeeks)    // startDate injected from popup.js
   endRepeat = endRepeat.toISOString().split('T')[0].replaceAll("-", "")  // turn into "yyyymmdd" format

   // Creates and adds rrule string
   classEvent["recurrenceRule"] = "FREQ=WEEKLY;BYDAY=" + rrule + ";INTERVAL=1;UNTIL=" + endRepeat + "T000000Z"

   // Assign Class Start Time
   let classFirstDate = shiftDateToDayOfWeek(startDateDate, dayOfWeek) // Moves starting day to correct day of week
   let startDateList = classFirstDate.toISOString().split('T')[0].split("-")   // turns date into ["2024", "2", "28"]
   let start = startDateList.concat(startTime.split(":"))    // adds time (e.g. ["8", "55"]) to startDate
   start.forEach((o, i, a) => a[i] = +a[i])                  // turns each element to number
   classEvent["start"] = start                               // assigns start to class event object

   // Assign Class End Time
   let end = startDateList.concat(endTime.split(":"))        // same parse as above
   end.forEach((o, i, a) => a[i] = +a[i])
   classEvent["end"] = end

   // Assign alert (10 min before)
   classEvent["alarms"] = [{
      action: 'display',
      description: 'Reminder',
      trigger: { minutes: 10, before: true }
   }]

   return classEvent
}


/**
 * Main function to be called: Converts raw HTML to ics then sends url to background for download.
 */
const generateClassesCalender = () => {
   // init
   let classes = [] // list for all classes

   // Gets corresbonding html table from current tab
   let scheduleTable = document.getElementsByTagName("table")[4].lastChild

   // Convert table and its rows to a 2-d array
   // (Each element is a cell of a single <td> element)
   let tableArr = convertHTMLTableToArray(scheduleTable)

   // console.log(tableArr);

   // Create class from each row in tableArr
   tableArr.forEach(row => {
      try {
         // runs createClassEvent on every html row and add to classes list
         classes.push(createClassEvent(row))
      } catch (error) {
         // handles when class fails to be created from the html
         console.log("Failed to add class: " + error);
      }
   })

   // Logs final results
   console.log("Classes: ");
   console.log(classes);

   // Converts classes array to ics formatting
   let { error, value } = ics.createEvents(classes)

   // Sends url to background.js for download
   if (error) {
      // Handles ics package error
      console.log(error)
   } else {
      // Create ics file
      let blob = new Blob([value], { type: "text/calendar" });
      // Create url to host file
      let url = URL.createObjectURL(blob)

      // Sends message to background, with url
      chrome.runtime.sendMessage({
         type: "downloadFile",
         url: url
      })
   }
}


// Main function calls
console.log("Parse classes script injected");

var startDateDate = new Date(startDate)  // converts string from popup to Date type
startDateDate.setDate(startDateDate.getDate() + 1)  // need to increment date bc Date constructor is weird
console.log("Start date input: " + startDateDate);

generateClassesCalender()  // calls main question


// ics input format:
// for more info, look at ics's npm documentation
// const event = {
//    start: [2018, 5, 30, 6, 30],
//    duration: { hours: 6, minutes: 30 },
//    title: 'Bolder Boulder',
//    description: 'Annual 10-kilometer run in Boulder, Colorado',
//    location: 'Folsom Field, University of Colorado (finish line)',
//    url: 'http://www.bolderboulder.com/',
//    geo: { lat: 40.0095, lon: 105.2669 },
//    categories: ['10k races', 'Memorial Day Weekend', 'Boulder CO'],
//    status: 'CONFIRMED',
//    busyStatus: 'BUSY',
//    organizer: { name: 'Admin', email: 'Race@BolderBOULDER.com' },
//    attendees: [
//       { name: 'Adam Gibbons', email: 'adam@example.com', rsvp: true, partstat: 'ACCEPTED', role: 'REQ-PARTICIPANT' },
//       { name: 'Brittany Seaton', email: 'brittany@example2.org', dir: 'https://linkedin.com/in/brittanyseaton', role: 'OPT-PARTICIPANT' }
//    ]
// }