// import Toast from 'react-native-simple-toast';
import NetInfo from "@react-native-community/netinfo";
import Snackbar from 'react-native-snackbar';
import moment from 'moment';

const HelperFunctions = {

  sampleFunction: (data) => {
    return alert(data)
  },

  showToastMsg(msg) {
    // return Toast.show(msg, Toast.LONG);
    return Snackbar.show({
      text: msg,
      duration: Snackbar.LENGTH_LONG,
    })
  },

  numberWithCommas(x) {
    let amount = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return amount
  },

  isvalidEmailFormat(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  charecterValidation(text) {
    var charRegex = /^[A-Za-z0-9 ]+$/
    return charRegex.test(text);
  },

  onlyTextAllow(text) {
    var regex = /(^[a-z ]+$)/i
    return regex.test(text);
  },

  onlyNumberAllow(text) {
    var regex = /^[0-9]*$/
    return regex.test(text);
  },

  isvalidPasswordFormat(password) {
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
  },

  midiumPasswordCheck(password) {
    var re = /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,}))/;
    return re.test(password);
  },

  checkAlphaNemericPassword(password) {
    var re = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/
    return re.test(password);
  },

  addSpaceAfterCamelCase(inputString) {
    // Use regular expression to find camel case and insert a space
    var result = inputString.replace(/([a-z])([A-Z])/g, '$1 $2');
    return result;
  },

  removeUnderScore(input) {
    if (input) {
      return input.replace(/_/g, ' ')

    }
  },

  copyArrayOfObj(data) {
    return JSON.parse(JSON.stringify(data));
  },

  getCurrentYear() {
    const currentDate = new Date();
    return currentDate.getFullYear();
  },

  getCurrentMonth() {
    const currentDate = new Date();
    return currentDate.getMonth();
  },

  getMonthName(index) {
    //alert(index)
    let months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return months[index]
  },

  getCurrentDatenumber() {
    const currentDate = new Date();
    return currentDate.getDate();
  },


  getAllDatesAndDays(m, year) {

    // Initialize an empty array to store the results
    let month = m + 1; // JavaScript months are zero-indexed
    let result = [];

    // Get the current date
    let currentDate = new Date();
    let isCurrentMonth = (currentDate.getFullYear() === year && currentDate.getMonth() === m);

    // Helper function to get the day name from the day of the week number
    const getDayName = (dayOfWeek) => {
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return daysOfWeek[dayOfWeek];
    };

    // Determine the date to be selected based on the month
    let selectedDate = isCurrentMonth ? currentDate : new Date(year, m, 1); // First date of the month if not current month

    // Loop through each day of the month
    for (let day = 1; day <= 31; day++) {
      // Create a new Date object for the current day in the loop
      let date = new Date(year, month - 1, day); // month - 1 because months are zero-indexed in JavaScript

      // Check if the date is still within the same month and year
      if (date.getMonth() + 1 !== month) {
        break; // Break the loop if we've gone past the last day of the month
      }

      // Get the day of the week as a number (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
      let dayOfWeek = date.getDay();

      // Create an object with the date, day name, and selected key
      let dateObject = {
        year: year,
        month: month,
        date: day,
        dayName: getDayName(dayOfWeek),
        formattedDate: moment([year, month - 1, day]).format('YYYY-MM-DD'),
        selected: date.toDateString() === selectedDate.toDateString() // Set selected based on the condition
      };

      // Add the object to the result array
      result.push(dateObject);
    }

    return result;
  },


  getAllDatesAndDaysForAttendanceView(m, year) {
    // Initialize an empty array to store the results
    let month = m + 1; // JavaScript months are zero-indexed
    let result = [];

    // Get the current date
    let currentDate = new Date();
    let isCurrentMonth = (currentDate.getFullYear() === year && currentDate.getMonth() === m);

    // Helper function to get the day name from the day of the week number
    const getDayName = (dayOfWeek) => {
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return daysOfWeek[dayOfWeek];
    };

    // Determine the date to be selected based on the month
    let selectedDate = isCurrentMonth ? currentDate : new Date(year, m, 1); // First date of the month if not current month

    // Loop through each day of the month
    for (let day = 1; day <= 31; day++) {
      // Create a new Date object for the current day in the loop
      let date = new Date(year, month - 1, day); // month - 1 because months are zero-indexed in JavaScript

      // Check if the date is still within the same month and year
      if (date.getMonth() + 1 !== month) {
        break; // Break the loop if we've gone past the last day of the month
      }

      // Get the day of the week as a number (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
      let dayOfWeek = date.getDay();

      // Create an object with the date, day name, and selected key
      let dateObject = {
        year: year,
        month: month,
        date: day,
        dayName: getDayName(dayOfWeek),
        formattedDate: moment([year, month - 1, day]).format('YYYY-MM-DD'),
        selected: date.toDateString() === selectedDate.toDateString() // Set selected based on the condition
      };

      // Add the object to the result array
      result.push(dateObject);
    }

    return result;
  },

  isCurrentMonth(year, month) {
    // Get the current date

    const currentDate = new Date();

    // Get the current year and month (zero-indexed)
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0 for January, 1 for February, etc.

    // Compare provided year and month with the current year and month
    return year === currentYear && month === currentMonth;
  },


  getColorCode(type) {

    if (type == 'P') {
      return { bgColor: '#F0F7EF', textColor: "#60B057" }
    } else if (type == 'A') {
      return { bgColor: '#FFEFEF', textColor: "#FC6860" }
    } else if (type == undefined) {
      return { bgColor: '#FFAC10', textColor: "#FFAC10" }
    } else {
      return { bgColor: '#f4edff', textColor: "#9d5bff" }
    }
  },

  getGenderName(type) {
    if (type == 'm') {
      return "Male"
    } else if (type == 'f') {
      return "Female"
    } else if (type == 't') {
      return "Transgender"
    } else {
      return "Other"
    }
  },

  getDateDDMMYY(dateStamp) {
    const timestamp = new Date(dateStamp);

    const day = String(timestamp.getUTCDate()).padStart(2, '0');
    const month = String(timestamp.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
    const year = timestamp.getUTCFullYear();

    return `${day}-${month}-${year}`;
  },

  getLastDateOfCurrentMonth() {
    const timestamp = new Date();

    // Get the current year and month
    const year = timestamp.getUTCFullYear();
    const month = timestamp.getUTCMonth(); // 0-indexed, so September is 8

    // Create a date object for the first day of the next month
    const nextMonth = new Date(Date.UTC(year, month + 1, 1));

    // Subtract one day to get the last day of the current month
    const lastDayOfMonth = new Date(nextMonth - 1);

    // Extract the date in "YYYY-MM-DD" format
    const yearStr = lastDayOfMonth.getUTCFullYear();
    const monthStr = String(lastDayOfMonth.getUTCMonth() + 1).padStart(2, '0');
    const dayStr = String(lastDayOfMonth.getUTCDate()).padStart(2, '0');

    return `${yearStr}-${monthStr}-${dayStr}`;
  },

  getTypeFullName(attendanceCode, singleShiftStatus) {
    switch (attendanceCode) {
      case 'PDL':
        return "Paid (PDL)";
      case 'A':
        return "Absent (A)";
      case 'P':
        return "Present (P)";
      case 'L':
        return "Late (L)";
      case 'H':
        return "Holiday (H)";
      case 'OT':
        return "Over Time (OT)";
      case 'CSL':
        return "Casual Leave (CSL)";
      case 'PVL':
        return "Privilege Leave (PVL)";
      case 'ERL':
        return "Earned Leave (ERL)";
      case 'SKL':
        return "Sick Leave (SKL)";
      case 'MDL':
        return "Medical Leave (MDL)";
      case 'MTL':
        return "Maternity Leave (MTL)";
      case 'PTL':
        return "Paternity Leave (PTL)";
      case 'ANL':
        return "Annual Leave (ANL)";
      case 'AWP':
        return "Approved Without Pay (AWP)";
      case 'UWP':
        return "Unapproved Without Pay (UWP)";
      case 'LE1':
        return "Leave Earned (LE1)";
      case 'LE2':
        return "Leave Earned (LE2)";
      case 'LP1':
        return "Leave Paid (LP1)";
      case 'LP2':
        return "Leave Paid (LP2)";
      case 'WO':
        return "Weekly Off (WO)";
      default:
        return "Unknown attendance code";
    }

  },

  updateSelectedArrObjects(data, obj2, keyName) {
    // Create a set of IDs from obj2

    const obj2Ids = new Set(obj2.map(item => item[keyName]));

    // Update the original array with "selected: true" if the object exists in obj2
    return data.map(item => {
      if (obj2Ids.has(item[keyName])) {
        return { ...item, selected: true };
      }
      return item;
    });
  },

  updateSelectedObjects(data, obj2) {
    console.log(data)
    console.log(obj2)
    return data.map(item => {
      if (item.value === obj2.value) {
        return { ...item, selected: true };
      }
      return item;
    });
  },

  getLastFiveYears() {
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let i = 0; i < 5; i++) {
      const year = currentYear - i;
      years.push({ id: (i + 1).toString(), label: year.toString(), value: year.toString() });
    }

    return years;
  },

  getLastTwelveMonths() {
    const months = [
      { label: 'January', value: '0' },
      { label: 'February', value: '1' },
      { label: 'March', value: '2' },
      { label: 'April', value: '3' },
      { label: 'May', value: '4' },
      { label: 'June', value: '5' },
      { label: 'July', value: '6' },
      { label: 'August', value: '7' },
      { label: 'September', value: '8' },
      { label: 'October', value: '9' },
      { label: 'November', value: '10' },
      { label: 'December', value: '11' }
    ];

    // const currentMonth = new Date().getMonth();
    // const result = [];

    // for (let i = 0; i < 12; i++) {
    //   const monthIndex = (currentMonth - i + 12) % 12;
    //   result.unshift(months[monthIndex]);
    // }

    return months;
  },

  get24HourTime(isoString) {
    // Create a Date object from the ISO 8601 string
    const date = new Date(isoString);

    // Extract hours and minutes
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    // Return time in 24-hour format (HH:mm)
    return `${hours}:${minutes}`;
  },

  convertTo12HourFormat(timeString) {
    // Parse the time string assuming it's in HH:mm format
    const time = moment(timeString, 'HH:mm');

    // Format the time in 12-hour format with AM/PM
    return time.format('h:mm A');
  },

  networkStatus(props) {
    setInterval(() => {
      NetInfo.addEventListener(state => {
        //   console.log(state)
        if (state.isConnected == false) {
          props.navigation.navigate("NetworkErrorScreen")
        }

      })
    }, 1000)
  },

  networkStatusbol() {
    setInterval(() => {
      NetInfo.addEventListener(state => {
        return true

      })
    }, 1000)
  },

  jsonParse(data) {
    return JSON.parse(data)
  },

  formatHours(input) {
    // Separate the integer and decimal parts
    let hours = Math.floor(input);
    let minutes = Math.round((input - hours) * 60);

    // Format the hours and minutes to always have two digits
    let formattedHours = hours.toString().padStart(2, '0');
    let formattedMinutes = minutes.toString().padStart(2, '0');

    // Construct the final string
    return `${formattedHours}H:${formattedMinutes}M`;
  },

  formatWorkingHrs(total_logged_in) {
    // Split the input into hours and minutes
    const [hours, minutes] = total_logged_in.split('.').map(Number);

    // Ensure minutes is between 0 and 59
    const formattedMinutes = minutes >= 0 && minutes < 60 ? minutes : 0;

    // Return formatted time string
    return `${hours}H:${formattedMinutes}M`;
  },

  formatLoggedInTime(total_logged_in) {
    // Check if the input is valid
    if (typeof total_logged_in !== 'string' || !total_logged_in.trim()) {
      return 'Invalid input';
    }

    // Split the input into hours and minutes
    const parts = total_logged_in.split('.');

    if (parts.length !== 2) {
      return 'Invalid input format';
    }

    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);

    // Check if parsed values are valid numbers
    if (isNaN(hours) || isNaN(minutes)) {
      return 'Invalid input format';
    }

    // Return formatted time string
    return `${hours}H:${minutes}M`;
  },

  //,

  addTimes(a, b) {
    // Convert 'a' and 'b' into total minutes
    let totalMinutesA = Math.floor(a) * 60 + Math.round((a - Math.floor(a)) * 60);
    let totalMinutesB = Math.floor(b) * 60 + Math.round((b - Math.floor(b)) * 60);

    // Sum the total minutes
    let totalMinutes = totalMinutesA + totalMinutesB;

    // Calculate the resulting hours and minutes
    let totalHours = Math.floor(totalMinutes / 60);
    let totalRemainingMinutes = totalMinutes % 60;

    // Adjust the result to round up to the next hour if necessary
    if (totalRemainingMinutes >= 60) {
      totalHours += 1;
      totalRemainingMinutes -= 60;
    }

    // Format the result as "HHH:MM" 
    let hoursStr = totalHours.toString().padStart(2, '0');
    let minutesStr = totalRemainingMinutes.toString().padStart(2, '0');

    return `${hoursStr}H:${minutesStr}M`;
  },

  calculateWorkDuration(login_time, logout_time) {
    // Ensure both times are defined
    if (!login_time || !logout_time) {
      return ""; //Invalid input: Both login_time and logout_time are required.
    }

    // Ensure both times have the same format (add seconds if missing)
    if (logout_time.length === 5) {
      logout_time += ":00"; // Add seconds to logout_time
    }
    if (login_time.length === 5) {
      login_time += ":00"; // Add seconds to login_time
    }

    // Convert login and logout times to Date objects
    let login = new Date(`1970-01-01T${login_time}`);
    let logout = new Date(`1970-01-01T${logout_time}`);

    // Check for invalid date objects  
    if (isNaN(login.getTime()) || isNaN(logout.getTime())) {
      return "Invalid time format.";
    }

    // Calculate the difference in milliseconds
    let diffMs = logout - login;

    // If the difference is negative, return an error message
    if (diffMs < 0) {
      return "Invalid times: Logout time must be after login time.";
    }

    // Convert milliseconds to hours and minutes
    let diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    let diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    // Format the result as "HHH:MM"
    let hoursStr = diffHours.toString().padStart(2, '0');
    let minutesStr = diffMinutes.toString().padStart(2, '0');

    return `${hoursStr}H:${minutesStr}M`;
  },

  adjustColorContrast(hex, amount) {
    //  console.log(hex)
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    // Adjust brightness
    r = Math.min(255, Math.max(0, r + amount));
    g = Math.min(255, Math.max(0, g + amount));
    b = Math.min(255, Math.max(0, b + amount));

    // Convert RGB back to hex
    const toHex = (c) => c.toString(16).padStart(2, '0');
    //console.log(`#${toHex(r)}${toHex(g)}${toHex(b)}`)
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  },

  holidayDateCheck(data, year, inputDate) {
    console.log("data", JSON.stringify(data));
    console.log(year);
    console.log(inputDate);
    // Parse the input date to a Date object
    const parsedInputDate = new Date(inputDate);

    // Check if the year exists in the data
    const yearData = data.find(item => item.year === parseInt(year));

    if (!yearData) {
      return false; // Year not found
    }

    // Check if the input date is within the range of holiday_date and holiday_to_date
    return yearData.holiday_temp.some(holiday => {
      const holidayStartDate = new Date(holiday.holiday_date);
      const holidayEndDate = new Date(holiday.holiday_to_date);
      return parsedInputDate >= holidayStartDate && parsedInputDate <= holidayEndDate;
    });
  },

  calculateWorkingHours(login_time, logout_time, total_break_time) {
    // Helper function to parse time in HH:MM:SS or HH:MM format
    function parseTime(timeStr) {
      let [hours, minutes, seconds] = timeStr.split(':').map(Number);
      return {
        hours: hours || 0,
        minutes: minutes || 0,
        seconds: seconds || 0
      };
    }

    // Parse login and logout times
    let login = parseTime(login_time);
    let logout = parseTime(logout_time);

    // Create Date objects for login and logout times
    let loginDate = new Date(0, 0, 0, login.hours, login.minutes, login.seconds);
    let logoutDate = new Date(0, 0, 0, logout.hours, logout.minutes, logout.seconds);

    // Calculate the difference in milliseconds
    let diffMs = logoutDate - loginDate;

    // Convert break time from fractional hours to minutes, then to milliseconds
    let breakMinutes = total_break_time * 60; // Convert fractional hours to minutes
    let breakMs = breakMinutes * 60 * 1000; // Convert minutes to milliseconds

    // Calculate net working time in milliseconds
    let netMs = diffMs - breakMs;

    // Convert net working time to hours and minutes
    let netHours = Math.floor(netMs / (1000 * 60 * 60));
    let netMinutes = Math.floor((netMs % (1000 * 60 * 60)) / (1000 * 60));

    // Format the output as HH:MM
    let formattedHours = String(netHours).padStart(2, '0');
    let formattedMinutes = String(netMinutes).padStart(2, '0');

    return { displayHours: `${formattedHours}H:${formattedMinutes}M`, rawHours: `${formattedHours}.${formattedMinutes}` };
  },

  getLeaveTypes(attendance_type) {

    if (attendance_type == "time") {
      return [
        { label: 'Present', value: 'present' },
        { label: 'Full day', value: 'full_day' },
        { label: 'Half day', value: 'half_day' },
        { label: 'Partial', value: 'partial_day' }
      ]
    } else if (attendance_type == "halfday") {
      return [
        { label: 'Present', value: 'present' },
        { label: 'Half day', value: 'half_day' },
      ]
    } else if (attendance_type == "wholeday") {
      return [
        { label: 'Present', value: 'present' },
        { label: 'Full day', value: 'full_day' },
      ]
    }
  },

  getmonthYear(dateStr) {
    const dateString = dateStr;
    const date = new Date(dateString);
    // Get the month (0-based index, so add 1)
    const month = date.getMonth() + 1;
    // Get the year
    const year = date.getFullYear();
    return { day: `${date.getDate()}`, month: `${month}`, year: `${year}`, month_name: date.toLocaleString('default', { month: 'long' }) };
  },

  getparticularName(type) {
    switch (type) {
      case 'credit':
        return "Purchase";
      case 'consumed':
        return "Consumed";
      default:
        return "Promo";
    }

  },

  getDateandtime(isoDate) {
    const date = new Date(isoDate);

    // Format parts
    const day = String(date.getDate()).padStart(2, '0'); // 2-digit day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    // Format time
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // If hour is 0, make it 12

    // Get the month abbreviation
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthAbbrev = monthNames[date.getMonth()];

    // Final formatted string
    return `${month}/${day}/${year} ${monthAbbrev} ${hours}:${minutes} ${ampm}`;
  },

  getNameById(packages, id, keyName) {
    console.log(packages)
    console.log(id)
    const pkg = packages.find(item => item._id === id);
    return pkg ? pkg[keyName ? keyName : 'package_name'] : 'Not found';
  },

  getFormattedDate(dateString) {
    const date = new Date(dateString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  },

  getMonth(dateString) {
    const date = new Date(dateString);

    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based

    return month;
  },

  getshortMonthName(datestr) {
    let months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
      'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const currentDate = new Date(datestr);
    return months[currentDate.getMonth()]
  },

  getYear(dateString) {
    const date = new Date(dateString);

    const year = date.getUTCFullYear();

    return year;
  },

  convertToISOWithTime(dateString, timeString = "18:30:00") {
    // Combine the date and time
    const combinedDateTime = `${dateString}T${timeString}.000Z`;

    return new Date(combinedDateTime).toISOString();
  },

  dateDiff(startDateStr, endDateStr) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Calculate year, month, and day differences
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();

    // Adjust if days are negative
    if (days < 0) {
      months--;
      const previousMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0); // Previous month last day
      days += previousMonth.getDate();
    }

    // Adjust if months are negative
    if (months < 0) {
      years--;
      months += 12;
    }

    return `${years} Years ${months} Months ${days} Days`;
  },
  isToday(dateString) {
    const inputDate = new Date(dateString);
    const today = new Date();

    // Compare year, month, and day
    return inputDate.getDate() === today.getDate() &&
      inputDate.getMonth() === today.getMonth() &&
      inputDate.getFullYear() === today.getFullYear();
  },
  isEndDateGreater(shiftStartDate, shiftEndDate) {
    const startDate = new Date(shiftStartDate);
    const endDate = new Date(shiftEndDate);

    return endDate > startDate;
  }


}

export default HelperFunctions;
