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


const signUp = (endpoint, bodyData, token, deviceToken) => {

  console.log(endpoint, "api endpoint and params and tokenss =====>")
  console.log("Endpoint", AllSourcePath.API_BASE_URL_DEV + endpoint);
  console.log("params", bodyData)
  console.log("Token ===>", token)
  console.log("==============================");

  let body = new FormData();
  body.append('firstName', bodyData?.firstName);
  body.append('lastName', bodyData?.lastName);
  body.append('email', bodyData?.email);
  body.append('phone', bodyData?.phone);
  body.append('password', bodyData?.password);
  body.append('role', bodyData?.role);
  if (bodyData.role == '3') {
    body.append('gst_image', {
      uri: bodyData?.gst_image?.uri,
      type: bodyData?.gst_image?.type,
      name: bodyData?.gst_image?.fileName,
    });
    body.append('tradelicense_image', {
      uri: bodyData?.tradelicense_image?.uri,
      type: bodyData?.tradelicense_image?.type,
      name: bodyData?.tradelicense_image?.fileName,
    });
  }

  // console.log("==============================", JSON.stringify(body));
  return new Promise((resolve, reject) => {
    axios.post(AllSourcePath.API_BASE_URL_DEV + endpoint, body, {
      headers: {
        "Accept": "application/json",
        "content-type": "multipart/form-data",
        //'Authorization': 'Bearer ' + token
        'Token': token,
        'Device-Token': deviceToken
      }
    })
      .then((response) => {
        console.log(response.data)
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}


const updateProfile = (endpoint, bodyData, token, deviceToken) => {

  console.log(endpoint, "api endpoint and params and tokenss =====>")
  console.log("Endpoint", AllSourcePath.API_BASE_URL_DEV + endpoint);
  console.log("params", bodyData)
  console.log("Token ===>", token)
  console.log("==============================");

  let body = new FormData();
  body.append('firstName', bodyData?.firstName);
  body.append('lastName', bodyData?.lastName);
  body.append('email', bodyData?.email);
  body.append('phone', bodyData?.phone);
  body.append('pincode', bodyData?.pincode);
  body.append('country', bodyData?.country);
  body.append('state', bodyData?.state);
  body.append('city', bodyData?.city);
  body.append('address', bodyData?.address);
  body.append('update', true);
  if (bodyData.role == '3') {
    if (bodyData.gst_image != '') {
      body.append('gst_image', {
        uri: bodyData?.gst_image?.uri,
        type: bodyData?.gst_image?.type,
        name: bodyData?.gst_image?.fileName,
      });
    }
    if (bodyData.tradelicense_image != '') {
      body.append('tradelicense_image', {
        uri: bodyData?.tradelicense_image?.uri,
        type: bodyData?.tradelicense_image?.type,
        name: bodyData?.tradelicense_image?.fileName,
      });
    }
  }

  // console.log("==============================", JSON.stringify(body));
  return new Promise((resolve, reject) => {
    axios.post(AllSourcePath.API_BASE_URL_DEV + endpoint, body, {
      headers: {
        "Accept": "application/json",
        "content-type": "multipart/form-data",
        //'Authorization': 'Bearer ' + token
        'Token': token,
        'Device-Token': deviceToken
      }
    })
      .then((response) => {
        console.log(response.data)
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}

const profilePhotoUpload = (endpoint, bodyData, keyName, token, deviceToken) => {

  console.log(endpoint, "api endpoint and params and tokenss =====>")
  console.log("Endpoint", AllSourcePath.API_BASE_URL_DEV + endpoint);
  console.log("params", bodyData)
  console.log("Token ===>", token)
  console.log("key Name ===>", keyName)
  console.log("==============================");

  let body = new FormData();
  body.append(keyName, bodyData);
  body.append('update', true);

  // console.log("==============================", JSON.stringify(body));
  return new Promise((resolve, reject) => {
    axios.post(AllSourcePath.API_BASE_URL_DEV + endpoint, body, {
      headers: {
        "Accept": "application/json",
        "content-type": "multipart/form-data",
        //'Authorization': 'Bearer ' + token
        'Token': token,
        'Device-Token': deviceToken
      }
    })
      .then((response) => {
        console.log(response.data)
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}

const updateRating = (endpoint, bodyData, token, deviceToken) => {

  console.log(endpoint, "api endpoint and params and tokens =====>")
  console.log("Endpoint", AllSourcePath.API_BASE_URL_DEV + endpoint);
  console.log("Token ===>", token)
  console.log("body data ===>", bodyData)
  console.log("==============================");

  let body = new FormData();
  if (bodyData.image) {
    body.append('image', {
      uri: bodyData?.image?.uri,
      type: bodyData?.image?.type,
      name: bodyData?.image?.fileName,
    });
  }
  body.append('product_id', bodyData?.product_id);
  body.append('rating', bodyData?.rating);
  body.append('review', bodyData?.review);

  // console.log("==============================", JSON.stringify(body));
  return new Promise((resolve, reject) => {
    axios.post(AllSourcePath.API_BASE_URL_DEV + endpoint, body, {
      headers: {
        "Accept": "application/json",
        "content-type": "multipart/form-data",
        'Token': token,
        'Device-Token': deviceToken
      }
    })
      .then((response) => {
        //console.log(response.data)
        resolve(response.data);
      })
      .catch((error) => {
        //console.log(error);
        reject(error);
      });
  });
}


export {
  postApi,
  signUp,
  profilePhotoUpload,
  updateProfile,
  updateRating
};
