
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
  Share,
  Animated
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
import NoDataFound from '../../component/NoDataFound';
import Eye from '../../assets/icons/Eye';
import BootomSheet from '../../component/BootomSheet';

const ShiftingEarningReport = props => {
  const isFocused = useIsFocused();
  const route = useRoute();
  const dispatch = useDispatch();
  const { userDetails, token, needRefresh, masterData } = useSelector(state => state.project);

  const { t, i18n } = useTranslation();

  const sampleData = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  const [empData, setEmpdata] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filterdata, setFilterData] = useState(null);

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedShift, setSelectedShift] = useState("");
  const [animValue] = useState(new Animated.Value(1000)); // Start off-screen

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
        "wage_from_date": props?.route?.params?.paramData?.doj_from ? props?.route?.params?.paramData?.doj_from : "",
        "wage_to_date": props?.route?.params?.paramData?.doj_to ? props?.route?.params?.paramData?.doj_to : "",
        "length": 20,
        "department_id": props?.route?.params?.paramData?.department_id != "" ? JSON.stringify(props?.route?.params?.paramData?.department_id.map(item => item._id)) : "",
        "hod_id": props?.route?.params?.paramData?.hod_id != "" ? JSON.stringify(props?.route?.params?.paramData?.hod_id.map(item => item._id)) : "",
        "designation_id": props?.route?.params?.paramData?.designation_id != "" ? JSON.stringify(props?.route?.params?.paramData?.designation_id.map(item => item._id)) : "",
        "branch_id": props?.route?.params?.paramData?.branch_id != "" ? JSON.stringify(props?.route?.params?.paramData?.branch_id.map(item => item._id)) : "",
        "client_id": props?.route?.params?.paramData?.client_id != "" ? JSON.stringify(props?.route?.params?.paramData?.client_id.map(item => item._id)) : "",

      }

      setFilterData(apiParam);

    } else {

      let apiParam = {

        "department_id": "",
        "designation_id": "",
        "branch_id": "",
        "hod_id": "",
        "client_id": "",
        "client_code": "",
        "wage_from_date": new Date(),
        "wage_to_date": new Date(),

        "pageno": 1,
        "perpage": 20
      }

      setFilterData(apiParam);
    }
  }





  useEffect(() => {

    if (filterdata != null) {
      // let apiParam = { ...filterdata };
      // apiParam.gender = apiParam?.gender ? apiParam?.gender.value : "";
      // apiParam.religion = apiParam?.religion ? apiParam?.religion.value : "";
      // apiParam.emp_status = apiParam?.emp_status ? apiParam?.emp_status.value : "";
      // console.log(apiParam);
      setIsLoading(true);
      postApi("company/shift-earning-report", filterdata, token)
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
      "department_id": props?.route?.params?.paramData?.department_id,
      "hod_id": props?.route?.params?.paramData?.hod_id,
      "designation_id": props?.route?.params?.paramData?.designation_id,
      "branch_id": props?.route?.params?.paramData?.branch_id,
      "client_id": props?.route?.params?.paramData?.client_id,
      "doj_from": props?.route?.params?.paramData?.doj_from,
      "doj_to": props?.route?.params?.paramData?.doj_to,
      "page_component_name": "ShiftingEarningReport"
    }

    console.log("filter data paramData ====> ", pData)
    console.log("filter data paramData ======================= ")
    props.navigation.navigate('ShiftFilter', { paramData: pData })

  }


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

  const toggleModal = (item) => {

    if (isModalVisible) {
      setSelectedShift("")
      // Hide modal
      Animated.timing(animValue, {
        toValue: 1000,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setModalVisible(false));
    } else {
      setSelectedShift(item)
      // Show modal
      setModalVisible(true);
      Animated.timing(animValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

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
      <View style={{ paddingLeft: 12, width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Pressable onPress={() => { toggleModal(item) }}>
          <Eye fillColor='#FC6860' style={{ transform: [{ rotate: '-90deg' }] }} />
        </Pressable>
      </View>
    </View>
  );

  const shiftRateRender = ({ index, item }) => (
    <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View><Text style={styles.leftText}>{item?.shift_data?.shift_name}</Text></View>
            <View><Text style={[styles.rightText, { textTransform: 'uppercase' }]}>{item?.rate ? item?.rate : "N/A"} AED</Text></View>
          </View>

  )

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.main}>
        <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
        <CustomHeader
          buttonText={t('Shift Earning Report')}
          style={{ flexDirection: 'row' }}
          iconStyle={{ height: 30, width: 30, borderRadius: 50 }}
          icon={LOCAL_IMAGES.user}
          searchIcon={false}
          buttonTextStyle={{ lineHeight: 23 }}
        />

        <ScrollView showsVerticalScrollIndicator={false}>

          <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 10, }}>

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

              empData != "" ?
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={empData}
                  renderItem={ListRender}
                  contentContainerStyle={{ marginBottom: 30 }}
                />
                : <NoDataFound />

            }
          </View>
        </ScrollView>
      </View>

      <BootomSheet
        toggleModal={toggleModal}
        isModalVisible={isModalVisible}
        animValue={animValue}
      >
        <View>
          <View style={{ marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.modalheadingText, {}]}>Shift Details</Text>
            <IonIcon
              name="close"
              size={20}
              color="#4E525E"
            />
          </View>

          <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View><Text style={styles.leftText}>Department</Text></View>
            <View><Text style={[styles.rightText, { textTransform: 'uppercase' }]}>{selectedShift?.department?.department_name ? selectedShift?.department?.department_name : 'N/A'}</Text></View>
          </View>

          <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View><Text style={styles.leftText}>Designation</Text></View>
            <View><Text style={[styles.rightText, { textTransform: 'uppercase' }]}>{selectedShift?.designation?.designation_name ? selectedShift?.designation?.designation_name : 'N/A'}</Text></View>
          </View>

          <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View><Text style={styles.leftText}>Branch</Text></View>
            <View><Text style={[styles.rightText, { textTransform: 'uppercase' }]}>{selectedShift?.branch?.branch_name ? selectedShift?.branch?.branch_name : 'N/A'}</Text></View>
          </View>

          <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View><Text style={styles.leftText}>Client</Text></View>
            <View><Text style={[styles.rightText, { textTransform: 'uppercase' }]}>{selectedShift?.client?.client_code ? selectedShift?.client?.client_code : 'N/A'}</Text></View>
          </View>

          <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View><Text style={styles.leftText}>HOD</Text></View>
            <View><Text style={[styles.rightText, { textTransform: 'uppercase' }]}>{selectedShift?.hod?.first_name ? selectedShift?.hod?.first_name + ' ' + selectedShift?.hod?.last_name : "N/A"} </Text></View>
          </View>

          <FlatList
            showsVerticalScrollIndicator={false}
            data={selectedShift?.shift_rate}
            renderItem={shiftRateRender}
            contentContainerStyle={{ marginBottom: 10 }}
          />


          <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View><Text style={styles.leftText}>Total Earning</Text></View>
            <View><Text style={[styles.rightText, { textTransform: 'uppercase' }]}>{selectedShift?.shift_total ? selectedShift?.shift_total : "N/A"} AED</Text></View>
          </View>


        </View>
      </BootomSheet>


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
  modalheadingText: {
    fontSize: sizes.h6,
    marginBottom: 10,
    fontFamily: FontFamily.semibold,
    color: '#000'
  },
  leftText: {
    fontSize: sizes.h6 - 2,
    marginBottom: 10,
    fontFamily: FontFamily.regular,
    color: '#868F9A',
    textTransform:'capitalize'
  },
  rightText: {
    fontSize: sizes.h6 - 1,
    marginBottom: 10,
    fontFamily: FontFamily.medium,
    color: '#1E2538',
    textTransform:'capitalize'
  },
});
export default ShiftingEarningReport;