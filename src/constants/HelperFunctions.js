// import Toast from 'react-native-simple-toast';
import NetInfo from "@react-native-community/netinfo";
import Snackbar from 'react-native-snackbar';


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

  copyArrayOfObj(data){
    return JSON.parse(JSON.stringify(data));
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