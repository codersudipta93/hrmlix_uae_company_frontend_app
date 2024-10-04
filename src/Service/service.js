import axios from "axios";
import { useSelector } from "react-redux";
import { AllSourcePath } from '../constants/PathConfig';

//== Post without token API


const postApi = (endpoint, data, token, deviceToken) => {
  console.log(endpoint, "API called =====>");
  console.log("Endpoint", AllSourcePath.API_BASE_URL_DEV + endpoint);
  console.log("Requested params =========> ", data);
  console.log("Token", token);
  console.log("Device token", deviceToken);
  console.log("==============================");

  return new Promise((resolve, reject) => {
    axios.post(AllSourcePath.API_BASE_URL_DEV + endpoint, data, {
      headers: {
        'Accept': "*/*",
        "Content-Type": "application/json",
        'x-access-token': token ? token : "",
        'device-token': deviceToken || ""  // Optional, will pass empty string if deviceToken is null or undefined
      }
    })
    .then((response) => {
      console.log('API response ==========================================>');
      resolve(response.data);
    })
    .catch((error) => {
      console.error('API error', error);
      reject(error);
    });
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

const saveDocumentApi = (endpoint, bodyData, token) => {

  console.log(endpoint, "api endpoint and params and tokenss =====>")
  console.log("Endpoint", AllSourcePath.API_BASE_URL_DEV + endpoint);
  console.log("params", bodyData)
 
  let body = new FormData();
  body.append('document_type_id', bodyData?.document_type_id);
  body.append('emp_id', bodyData?.emp_id);
  body.append('document_name', bodyData?.document_name);
  body.append('valid_from', bodyData?.valid_from);
  body.append('valid_to', bodyData?.valid_to);
  body.append('file', bodyData?.file);
  body.append('description', bodyData?.description);
  
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
  saveDocumentApi
};
