
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Image,
  FlatList,
  RefreshControl,
  Pressable,
  ActivityIndicator,
  Dimensions,
  BackHandler,
  Alert,
  I18nManager,
  ScrollView,
  Modal,
  Share
} from 'react-native'

import React, {
  useEffect,
  useState,
  useRef
} from 'react';

import {
  colors,
  height,
  sizes,
  width,
  FontFamily
} from '../../constants/Theme';

import { LOCAL_IMAGES, LOCAL_ICONS, AllSourcePath } from '../../constants/PathConfig';
import { HelperFunctions } from '../../constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { getData, setData, deleteData } from '../../Service/localStorage';
import { useDispatch, useSelector } from 'react-redux';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from 'react-native/Libraries/NewAppScreen';
import CustomHeader from '../../component/Header';

import { postApi } from '../../Service/service';
import { useTranslation } from 'react-i18next'; //for translation service
import IonIcon from 'react-native-vector-icons/Ionicons';
import Delete from '../../assets/icons/Delete';
import Filter from '../../assets/icons/Filter';
import SkeletonLoader from '../../component/SkeletonLoader';
import { _setreffeshStatus, _setmasterData } from '../../Store/Reducers/ProjectReducer';
import FloatingDropdown from '../../component/FloatingDropdown';
import Clipboard from '@react-native-clipboard/clipboard';

const Employees = props => {
  const isFocused = useIsFocused();
  const route = useRoute();
  const dispatch = useDispatch();
  const { userDetails,companyData, token, needRefresh, masterData } = useSelector(state => state.project);

  const { t, i18n } = useTranslation();

  const sampleData = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  const [empData, setEmpdata] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filterdata, setFilterData] = useState(null);

  const [hodData, setHod] = useState([]);
  const [selectedHod, setSelectedHod] = useState([]);
  const [inviteModalVisibile, setinviteModalVisibile] = useState(false);

  const [linkModalVisibile, setlinkModalVisibile] = useState(false);
  const [shareLink, setshareLink] = useState("");
  const [btnLoading, setbtnLoading] = useState(false);


  useEffect(() => {
    if (isFocused == true) {
      console.log(i18n.language);
      console.log(I18nManager.isRTL);
      console.log("JSON.stringify(masterData)");
      // console.log(JSON.stringify(masterData));
    }
  }, [isFocused]);


  useEffect(() => {
    _updatefilterData();
  }, []);

  useEffect(() => {
    if (needRefresh == true) {
      _updatefilterData();
    }
  }, [isFocused]);



  const _updatefilterData = () => {
    dispatch(_setreffeshStatus(false));

    if (props?.route?.params) {
      let apiParam = {
        "pageno": 1,
        "perpage": 100,
        "advance_filter": props?.route?.params?.paramData?.advance_filter,
        "department_id": props?.route?.params?.paramData?.department_id != "" ? JSON.stringify(props?.route?.params?.paramData?.department_id.map(item => item._id)) : "",
        "hod_id": props?.route?.params?.paramData?.hod_id != "" ? JSON.stringify(props?.route?.params?.paramData?.hod_id.map(item => item._id)) : "",
        "designation_id": props?.route?.params?.paramData?.designation_id != "" ? JSON.stringify(props?.route?.params?.paramData?.designation_id.map(item => item._id)) : "",
        "branch_id": props?.route?.params?.paramData?.branch_id != "" ? JSON.stringify(props?.route?.params?.paramData?.branch_id.map(item => item._id)) : "",
        "client_id": props?.route?.params?.paramData?.client_id != "" ? JSON.stringify(props?.route?.params?.paramData?.client_id.map(item => item._id)) : "",
        "searchkey": props?.route?.params?.paramData?.searchkey,
        "wage_month_from": HelperFunctions.getCurrentMonth(),
        "wage_year_from": HelperFunctions.getCurrentYear(),
        "wage_month_to": HelperFunctions.getCurrentMonth(),
        "wage_year_to": HelperFunctions.getCurrentYear(),
        "date_from": HelperFunctions.getCurrentYear() + '-' + HelperFunctions.getCurrentMonth(),
        "date_to": HelperFunctions.getCurrentYear() + '-' + HelperFunctions.getCurrentMonth(),
        "gender": props?.route?.params?.paramData?.gender,
        "religion": props?.route?.params?.paramData?.religion,
        "age_from": props?.route?.params?.paramData?.age_from,
        "age_to": props?.route?.params?.paramData?.age_to,
        "doj_from": props?.route?.params?.paramData?.doj_from,
        "doe_from": props?.route?.params?.paramData?.doe_from,
        "doj_to": props?.route?.params?.paramData?.doj_to,
        "doe_to": props?.route?.params?.paramData?.doe_to,
        "emp_status": props?.route?.params?.paramData?.emp_status,
        "search_type": "effective_date",
      }

      setFilterData(apiParam);

    } else {

      let apiParam = {
        "pageno": 1,
        "perpage": 100,
        "wage_month_from": HelperFunctions.getCurrentMonth(),
        "wage_year_from": HelperFunctions.getCurrentYear(),
        "wage_month_to": HelperFunctions.getCurrentMonth(),
        "wage_year_to": HelperFunctions.getCurrentYear(),
        "date_from": HelperFunctions.getCurrentYear() + '-' + HelperFunctions.getCurrentMonth(),
        "date_to": HelperFunctions.getCurrentYear() + '-' + HelperFunctions.getCurrentMonth(),
        "searchkey": "Inga",
        "department_id": "",
        "designation_id": "",
        "branch_id": "",
        "client_id": "",
        "hod_id": "",
        "emp_id": "",
        "gender": "",
        "religion": "",
        "client_code": "",
        "age_from": "",
        "age_to": "",
        "doj_from": "",
        "doe_from": "",
        "doj_to": "",
        "search_type": "effective_date",
        "date_start_from": HelperFunctions.getFormattedDate(new Date()),
        "date_end_to": HelperFunctions.getFormattedDate(new Date()),
        "bank_id": "",
        "emp_status": "",
        "advance_filter": "no"
      }

      setFilterData(apiParam);
    }
  }





  useEffect(() => {

    if (filterdata != null) {
      let apiParam = { ...filterdata };
      apiParam.gender = apiParam?.gender ? apiParam?.gender.value : "";
      apiParam.religion = apiParam?.religion ? apiParam?.religion.value : "";
      apiParam.emp_status = apiParam?.emp_status ? apiParam?.emp_status.value : "";
      console.log(apiParam);
      setIsLoading(true);
      postApi("company/get-employee", apiParam, token)
        .then((resp) => {
          console.log(resp);
          if (resp?.status == 'success') {
            setEmpdata(resp?.employees?.docs);
            masterData == "" ? getMasterData() : setIsLoading(false);
          } else if (resp?.status == 'val_err') {
            setIsLoading(false)
            let message = ""
            for (const key in resp.val_msg) {
              if (resp.val_msg[key].message) {
                message = resp.val_msg[key].message;
                break;
              }
            }
            HelperFunctions.showToastMsg(message);
          } else {
            HelperFunctions.showToastMsg(resp.message);
            setIsLoading(false)
          }

        }).catch((err) => {
          setIsLoading(false)
          console.log(err);
          HelperFunctions.showToastMsg(err.message);
        })
    }

  }, [filterdata]);


  const openFilter = () => {

    let pData = {
      "advance_filter": props?.route?.params?.paramData?.advance_filter,
      "department_id": props?.route?.params?.paramData?.department_id,
      "hod_id": props?.route?.params?.paramData?.hod_id,
      "designation_id": props?.route?.params?.paramData?.designation_id,
      "branch_id": props?.route?.params?.paramData?.branch_id,
      "client_id": props?.route?.params?.paramData?.client_id,
      "searchkey": props?.route?.params?.paramData?.searchkey,
      "gender": props?.route?.params?.paramData?.gender,
      "religion": props?.route?.params?.paramData?.religion,
      "age_from": props?.route?.params?.paramData?.age_from,
      "age_to": props?.route?.params?.paramData?.age_to,
      "doj_from": props?.route?.params?.paramData?.doj_from,
      "doe_from": props?.route?.params?.paramData?.doe_from,
      "doj_to": props?.route?.params?.paramData?.doj_to,
      "doe_to": props?.route?.params?.paramData?.doe_to,
      "emp_status": props?.route?.params?.paramData?.emp_status,
      "search_type": "effective_date",
    }

    console.log("filter data paramData ====> ", pData)
    console.log("filter data paramData ======================= ")
    props.navigation.navigate('EmployeeFilter', { paramData: pData })

  }



  const copyToClipboard =  () => {
    // Clipboard.setString(shareLink);
    // console.log(await Clipboard.getString())
   // Clipboard.setString('Text to copy');
    //Clipboard.setString(shareLink)
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
  }).catch(err => {
      console.error('Failed to copy: ', err);
  });
  };
 

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: shareLink,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const getMasterData = () => {
    postApi("company/get-employee-master", {}, token)
      .then((resp) => {
        if (resp?.status == 'success') {
          dispatch(_setmasterData(resp?.masters));
          setIsLoading(false);
        } else {
          HelperFunctions.showToastMsg(resp.message);
          setIsLoading(false);
        }
      }).catch((err) => {
        console.log(err);
        setIsLoading(false)
        HelperFunctions.showToastMsg(err.message);
      })
  }

  const generateLink = () => {
    setbtnLoading(true)
    postApi("company/generate_employee_invite_link", {
      "hod_id": selectedHod?._id,
      "lang": "en"
    }, token)
      .then((resp) => {
        if (resp?.status == 'success') {
          setshareLink(resp?.url);
          setbtnLoading(false);
          setinviteModalVisibile(false);
          setlinkModalVisibile(true);
          setSelectedHod("");
        } else {
          HelperFunctions.showToastMsg(resp.message);
          setbtnLoading(false);
        }
      }).catch((err) => {
        console.log(err);
        setbtnLoading(false)
        HelperFunctions.showToastMsg(err.message);
      })
  }

 useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
      return () => {
        backHandler.remove();
      };
      return () => { };
    }, [])
  );

  const handleBackButton = () => {
    Alert.alert('Hold on!', 'Are you sure you want to go back?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      { text: 'YES', onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };


  const placeholderRenderList = ({ index, item }) => (
    <SkeletonLoader width={width} height={80} borderRadius={10} style={{ marginBottom: 6, }} />
  );

  const ListRender = ({ index, item }) => (
    <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: index == 0 ? 8 : 0, borderTopLeftRadius: index == 0 ? 8 : 0, borderBottomLeftRadius: sampleData.length - 1 == index ? 8 : 0, borderBottomRightRadius: sampleData.length - 1 == index ? 8 : 0 }]}>
      <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', height: 35, width: 35, backgroundColor: '#007AFF', borderRadius: 50 }}>
          <Image source={{ uri: item?.profile_pic ? item?.profile_pic : AllSourcePath?.API_IMG_URL_DEV + 'user.jpg' }} style={{ height: '100%', width: '100%', borderRadius: 50, objectFit: 'cover' }} />
        </View>
        <View style={{ paddingLeft: 12 }}>
          <Text style={{ fontFamily: FontFamily.medium, color: '#4E525E', fontSize: sizes.h6, textAlign: 'left' }}>{item?.emp_first_name} {item?.emp_last_name}</Text>
          <Text style={{ fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md, textAlign: 'left', marginTop: 6 }}>ID: {item?.corporate_id}</Text>
        </View>
      </View>
      <View style={{ paddingLeft: 12, paddingRight: 8, width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
        <IonIcon
          name="eye"
          size={18}
          color={colors.primary}
          onPress={() => {
            props.navigation.navigate('EmployeeDashboard', { empID: item?._id })

          }}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.main}>
        <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
       <CustomHeader 
          buttonText={t('Employees')}
          style={{ flexDirection: 'row' }}
          iconStyle={{ height: 30, width: 30, borderRadius: 50 }}
          icon={{ uri: companyData?.com_logo ? companyData?.com_logo : AllSourcePath?.API_IMG_URL_DEV + 'user.jpg' }}
          searchIcon={false}
          onPressUser={() => { props.navigation.navigate("CompanyProfileDashboard") }}
        />

        <ScrollView showsVerticalScrollIndicator={false}>

          <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 10, }}>
              {masterData != "" ?
                <Pressable onPress={() => {
                  setinviteModalVisibile(!inviteModalVisibile)
                  setHod(masterData?.hod)
                }} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4, backgroundColor: colors.primary, marginRight: 10 }}>
                  <Text style={{ color: '#fff', fontSize: sizes.h6 - 1 }}>Invite</Text>
                </Pressable> : null}
              <TouchableOpacity onPress={() => { openFilter() }} style={{ padding: 6, paddingHorizontal: 10 }}>
                <Filter />
              </TouchableOpacity>
            </View>

            {isLoading ?

              <FlatList
                data={sampleData}
                renderItem={placeholderRenderList} // Adjust rendering logic as per your data structure
              />
              :

              <FlatList
                showsVerticalScrollIndicator={false}
                data={empData}
                renderItem={ListRender}
                contentContainerStyle={{ marginBottom: 30 }}
              />

            }
          </View>
        </ScrollView>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={inviteModalVisibile}
        onRequestClose={() => onClose(null)}

      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingVertical: 0 }}>

              <IonIcon
                name="close"
                size={24}
                color={'#8A8E9C'}
                onPress={() => { setinviteModalVisibile(!inviteModalVisibile) }}
              />
            </View>
            <View style={[styles.radioContainer, { marginTop: 20 }]}>
              <FloatingDropdown
                multiSelect={false}
                labelName="Select HOD"
                options={hodData}
                listLabelKeyName={['first_name', 'last_name']}
                selectedValueData={selectedHod}

                onSelect={(option) => {
                  let data = HelperFunctions.copyArrayOfObj(hodData);
                  for (let k = 0; k < data.length; k++) {
                    if (data[k]._id == option._id) {
                      data[k].selected = data[k].selected == true ? false : true;
                      setSelectedHod(data[k])
                    } else {
                      data[k].selected = false;
                    }
                  }

                  setHod(data)

                }}
                inputContainerColor="#CACDD4"
                labelBg={colors.white}
                labelColor="#007AFF"
                placeholderColor="#8A8E9C"
                inputColor={colors.primary}

                inputMargin={20}
                bracketAfterPositionIndex={1}
              />
            </View>

            <TouchableOpacity onPress={() => { generateLink() }} style={styles.submitButton}>
              {btnLoading ?
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator color="#fff" />
                  <Text style={[{ fontFamily: FontFamily.regular, color: colors.white, fontSize: sizes.h6 - 1, textAlign: 'center', textTransform: 'capitalize', marginLeft: 4 }]}>
                    Please Wait...
                  </Text>
                </View>
                : <Text style={styles.submitButtonText}>Generate Link</Text>
              }
            </TouchableOpacity>
          </View>

        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={linkModalVisibile}
        onRequestClose={() => onClose(null)}

      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingVertical: 0 }}>

              <IonIcon
                name="close"
                size={24}
                color={'#8A8E9C'}
                onPress={() => { setlinkModalVisibile(!linkModalVisibile) }}
              /> 
            </View>
            <View style={[styles.radioContainer, { marginTop: 20,flexDirection:'column' }]}>
              <Text style={{ color: '#000', fontSize: sizes.h6,marginBottom:4,fontFamily: FontFamily.bold }}>Invite Link - </Text>
              <Text style={{ color: '#000', fontSize: sizes.h6 - 1,fontFamily: FontFamily.regular }}>{shareLink}</Text>
            </View>

            <View style={{ width: '100%', justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => { onShare() }} style={[styles.submitButton,{width:'35%'}]}>
                <Text style={styles.submitButtonText}>Share</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={() => copyToClipboard()} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Copy</Text>
              </TouchableOpacity> */}
            </View>

          </View>

        </View>
      </Modal>


    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#F5F7FB'
  },

  card: {
    backgroundColor: 'white',
    padding: 12,
    margin: 10,
    marginLeft: 0,
    marginRight: 10,
    borderRadius: 8,
    elevation: 3, // for Android
    shadowColor: '#00000012', // for iOS
    shadowOffset: { width: 0, height: 2 }, // for iOS
    shadowOpacity: 0.8, // for iOS
    shadowRadius: 2, // for iOS
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
  },

  cardMain: {
    backgroundColor: '#FFE0BB', // Background color for the rectangle
    position: 'relative',
    width: '48%',
    borderRadius: 8,
    padding: 12
  },
  cardSection1: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' },
  cardIconContainer: { height: 53, width: 53, borderRadius: 50, backgroundColor: '#F9F5F5', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  cardBigLabel: { fontFamily: FontFamily.semibold, fontSize: sizes.h1 + 1, color: '#000000', marginLeft: 15 },
  cardLabel: { fontFamily: FontFamily.semibold, fontSize: sizes.h6, color: '#2B2B2B', marginTop: 15, textAlign: 'left' },
  backgroundImage: {
    width: 40, // Adjust as needed
    height: 30, // Adjust as needed
    position: 'absolute',
    bottom: 2,
    right: 6,
    opacity: 0.2
  },
  text: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  listCard: {
    backgroundColor: '#FFFFFF',
    //width: '100%',
    borderRadius: 8,
    padding: 12,
    //paddingVertical: 10,
    borderWidth: 0.5,
    borderColor: '#00000012',
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    //marginBottom: 8
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 10,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
    justifyContent: 'center',
    alignItems: 'center'
  },

  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 35,
    marginTop: 25,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: '45%',
    borderRadius: 4
  },
  submitButtonText: {
    color: 'white',
    fontSize: 13,
    textAlign: 'center'
  },
});
export default Employees;