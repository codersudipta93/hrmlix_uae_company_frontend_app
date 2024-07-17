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

  copyArrayOfObj(data) {
    return JSON.parse(JSON.stringify(data));
  },

  getCurrentYear() {
    const currentDate = new Date();
    return currentDate.getFullYear();
  },

  getCurrentMonth() {
    const currentDate = new Date();
    return currentDate.getMonth() + 1;
  },

  getMonthName(index) {
    let months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return months[index - 1]
  },

  getCurrentDatenumber() {
    const currentDate = new Date();
    return currentDate.getDate();
  },



  getAllDatesAndDays(month, year) {
    // Initialize an empty array to store the results
    let result = [];

    // Get the current date
    let currentDate = new Date();

    // Helper function to get the day name from the day of the week number
    const getDayName = (dayOfWeek) => {
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return daysOfWeek[dayOfWeek];
    };

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
        formatedDate: moment([year, month - 1, day]).format('YYYY-MM-DD'),
        selected: false // Default value for the selected key
      };

      // Check if the current date matches the date in the loop
      if (date.toDateString() === currentDate.toDateString()) {
        dateObject.selected = true; // Set selected to true for the current date
      }

      // Add the object to the result array
      result.push(dateObject);
    }

    return result;
  },

  getColorCode(type) {
    if (type == 'P') {
      return { bgColor: '#F0F7EF', textColor: "#60B057" }
    } else if (type == 'A') {
      return { bgColor: '#FFEFEF', textColor: "#FC6860" }
    } else {
      return { bgColor: '#decafc', textColor: "#9d5bff" }
    }
  },

  getTypeFullName(attendanceCode, singleShiftStatus) {
    if (attendanceCode == 'P' && singleShiftStatus == true) {
      return "Full Shift (Present)"
    } else if (attendanceCode == 'A' && singleShiftStatus == true) {
      return "Full Shift (Absent)"
    } else if (attendanceCode == 'P' && singleShiftStatus == false) {
      return "Break Shift (Present)"
    } else if (attendanceCode == 'A' && singleShiftStatus == false) {
      return "Break Shift (Absent)"
    } else if (attendanceCode == 'L' && singleShiftStatus == true) {
      return "Full day Leave"
    } else if (attendanceCode == 'L' && singleShiftStatus == false) {
      return "Break Shift (Leave)"
    }else if (attendanceCode == 'WO' && singleShiftStatus == true) {
      return "Week Off (WO)"
    } else if (attendanceCode == 'PDL' && singleShiftStatus == true) {
      return "Full day PDL"
    } else if (attendanceCode == 'PDL' && singleShiftStatus == false) {
      return "Break Shift (PDL)"
    }
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

}

export default HelperFunctions;