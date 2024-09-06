import axios from "axios";
import { useSelector } from "react-redux";
import { AllSourcePath } from '../constants/PathConfig';

//== Post without token API
const postApi = (endpoint, data, token, deviceToken) => {
  console.log(endpoint, "api called =====>")
  console.log("Endpoint", AllSourcePath.API_BASE_URL_DEV + endpoint);
  console.log("Resquested params =========> ", data)
  console.log("Token", token)
  //console.log("Devicetoken", deviceToken)
  console.log("==============================");

  return new Promise((resolve, reject) => {

    try {
      axios.post(AllSourcePath.API_BASE_URL_DEV + endpoint, data, {
        headers: {
          'Accept': "*",
          "Content-Type": "application/json",
          'x-access-token': token ? token : ""
         // 'device-token': deviceToken
        }
      }).then((response) => {
        console.log('API response ==========================================>')
        resolve(response.data);
      })
        .catch((error) => {
          console.error('error', error);
          reject(error);
        });

    }
    catch(err) {
      console.error('err', err);
    }                            

  });

};


const profilePhotoUpload = (endpoint, bodyData, token) => {

  console.log(endpoint, "api endpoint and params and tokenss =====>")
  console.log("Endpoint", AllSourcePath.API_BASE_URL_DEV + endpoint);
  console.log("params", bodyData)
 
  let body = new FormData();
  body.append('com_logo', bodyData);
  body.append('establishment_type', "pvt_ltd");
 
  
  // console.log("==============================", JSON.stringify(body));
  return new Promise((resolve, reject) => {
    axios.post(AllSourcePath.API_BASE_URL_DEV + endpoint, body, {
      headers: {
        "Accept": "application/json",
        "content-type": "multipart/form-data",
        'x-access-token': token ? token : ""
      }
    })
      .then((response) => {
        console.log(response.data)
        resolve(response.data);
      })
      .catch((error) => {
        console.log("error");
        reject(error);
      });
  });
}



export {
  postApi,
  profilePhotoUpload,
};
