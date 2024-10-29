
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
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
  Animated,
  Linking
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
import { useRoute } from '@react-navigation/native';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { postApi } from '../../Service/service';
import { _setreffeshStatus } from '../../Store/Reducers/ProjectReducer';
import { getData, setData, deleteData } from '../../Service/localStorage';
import { useDispatch, useSelector } from 'react-redux';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from 'react-native/Libraries/NewAppScreen';
import CustomHeader from '../../component/Header';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useTranslation } from 'react-i18next'; //for translation service
import IonIcon from 'react-native-vector-icons/Ionicons';
import Delete from '../../assets/icons/Delete';
import Filter from '../../assets/icons/Filter';
import Action from '../../assets/icons/Action';
import MonthModal from '../../component/MonthModal';
import SkeletonLoader from '../../component/SkeletonLoader';
import NoDataFound from '../../component/NoDataFound';

import { _setmasterData } from '../../Store/Reducers/ProjectReducer';
import BootomSheet from '../../component/BootomSheet';
import CustomButton from '../../component/CustomButton';
import Employees from '../TabScreens/Employees';

const ArrearSlip = props => {
  const isFocused = useIsFocused();
  const route = useRoute();
  const dispatch = useDispatch();
  const { userDetails,companyData, token, needRefresh, masterData } = useSelector(state => state.project);

  const { t, i18n } = useTranslation();

  const sampleData = [1, 1, 1, 1, 1];

  const [empData, setEmpdata] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [filterdata, setFilterData] = useState(null);
  const [selectedIndex, setIndex] = useState(null);
  //const [masterData, setMasterData] = useState(null);

  useEffect(() => {
    if (isFocused == true) {
      console.log(i18n.language);
      console.log(I18nManager.isRTL);
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
        "department_id": props?.route?.params?.paramData?.department_id != "" ? JSON.stringify(props?.route?.params?.paramData?.department_id.map(item => item._id)) : "",
        "hod_id": props?.route?.params?.paramData?.hod_id != "" ? JSON.stringify(props?.route?.params?.paramData?.hod_id.map(item => item._id)) : "",
        "designation_id": props?.route?.params?.paramData?.designation_id != "" ? JSON.stringify(props?.route?.params?.paramData?.designation_id.map(item => item._id)) : "",
        "branch_id": props?.route?.params?.paramData?.branch_id != "" ? JSON.stringify(props?.route?.params?.paramData?.branch_id.map(item => item._id)) : "",
        "searchkey": props?.route?.params?.paramData?.searchkey,
        "wage_month": parseFloat(props?.route?.params?.paramData?.attendance_month),
        "wage_year": parseFloat(props?.route?.params?.paramData?.attendance_year),
      }
      setFilterData(apiParam);


    } else {

      let apiParam = {
        "pageno": 1,
        "perpage": 20,
        "wage_month": 6,
        "wage_year": 2024,
        "hod_id": "",
        "department_id": "",
        "searchkey": "",
        "designation_id": "",
        "branch_id": "",
        "client_id": "",
        "wage_month": HelperFunctions.getCurrentMonth(),
        "wage_year": HelperFunctions.getCurrentYear(),
      }

      setFilterData(apiParam);
    }
  }



  useEffect(() => {
    console.log(filterdata);
    if (filterdata != null) {
      setIsLoading(true);
      postApi("company/get-arrear-payslip-data", filterdata, token)
        .then((resp) => {
          console.log(JSON.stringify(resp?.employees?.docs[0]))
          if (resp?.status == 'success') {
            setEmpdata(resp?.master_data);
            setIsLoading(false)
            //getMasterData()
          } else {
            HelperFunctions.showToastMsg(resp.message);
            setIsLoading(false)
          }
        }).catch((err) => {
          console.log(err);
          setIsLoading(false)
          HelperFunctions.showToastMsg(err.message);
        })

    }

  }, [filterdata]);


  const showPdf = (item) =>{
    setIsLoading(true);
    let param = {image_path: item?.pdf_link}
    postApi("/company/single-view-image", param, token)
      .then((resp) => {
        if (resp?.status == 'success') {
          //openLink(resp?.image)
          resp?.image != "" ? Linking.openURL(resp?.image).catch(err => console.error('An error occurred', err)) : null;
          console.log(resp?.image)
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


  const _openFilter = () => {
    let pData = {
      "perpage": 20,
      "pageno": 1,
      "searchkey": "",
      "department_id": props?.route?.params?.paramData?.department_id,
      "hod_id": props?.route?.params?.paramData?.hod_id,
      "designation_id": props?.route?.params?.paramData?.designation_id,
      "branch_id": props?.route?.params?.paramData?.branch_id,
      "attendance_month": { label: HelperFunctions.getMonthName(filterdata?.wage_month), value: (filterdata?.wage_month).toString() },
      "attendance_year": { label: (filterdata?.wage_year).toString(), value: (filterdata?.wage_year).toString() },
  
    }

    console.log("filter data paramData ====> ", pData)
    console.log("filter data paramData ======================= ")
    setIndex(null)
    props.navigation.navigate('RevisionReportFilter', { paramData: pData, revision_report_type:"arearSlip" })
  }
 
 // useFocusEffect(
  //   React.useCallback(() => {
  //     const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
  //     return () => {
  //       backHandler.remove();
  //     };
  //     return () => { };
  //   }, [])
  // );

  // const handleBackButton = () => {
  //   Alert.alert('Hold on!', 'Are you sure you want to go back?', [
  //     {
  //       text: 'Cancel',
  //       onPress: () => null,
  //       style: 'cancel',
  //     },
  //     { text: 'YES', onPress: () => BackHandler.exitApp() },
  //   ]);
  //   return true;
  // };




  const ListRender = ({ index, item }) => (
    <>
      <Pressable style={[styles.listCard, { paddingVertical: 15, marginBottom: 0, backgroundColor: index == selectedIndex ? '#1E2538' : '#fff' }]}>
        <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
          {/* <IonIcon
            name={item.selected ? "checkbox-outline" : "square-outline"}
            size={18}
            color={item?.selected == true ? '#333' : '#333'}
            onPress={() => {
              let tempData = HelperFunctions.copyArrayOfObj(empData?.docs);
              tempData[index].selected = !tempData[index].selected;
              let finalData = { docs: tempData }
              setEmpdata(finalData)
            }}
          /> */}
          <View style={{ marginLeft: 8, justifyContent: 'center', alignItems: 'center', height: 32, width: 32, backgroundColor: '#007AFF', borderRadius: 50 }}>
            <Image source={{ uri: 'https://uaedemo.hrmlix.com/assets/images/user.jpg' }} style={{ height: '100%', width: '100%', borderRadius: 50, objectFit: 'cover' }} />
          </View>
          <View style={{ paddingLeft: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <View>
              <Text style={{ textTransform: 'capitalize', fontFamily: FontFamily.medium, color: index == selectedIndex ? '#fff' : '#4E525E', fontSize: sizes.md, textAlign: 'left' }}>{item?.emp_first_name} {item?.emp_last_name}</Text>
              <Text style={{ fontFamily: FontFamily.regular, color: index == selectedIndex ? '#fff' : '#8A8E9C', fontSize: sizes.sm, textAlign: 'left', marginTop: 4, lineHeight: 12 }}>ID: {item?.emp_id}</Text>
            </View>
          </View>
        </View>
        <View style={{ paddingLeft: 12, width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
          {item?.attendance_summ != "" ?
            <Pressable onPress={() => {

              if (index == selectedIndex) {
                setIndex(null);

              } else {
                setIndex(index)
              }

            }} >
              <Text style={{ fontFamily: FontFamily.medium, color: index == selectedIndex ? '#fff' : '#4E525E', fontSize: sizes.h2 }}>{index == selectedIndex ? '-' : '+'}</Text>
            </Pressable> : null}
        </View>

      </Pressable>
      {index == selectedIndex ?
        <View>
          <View style={styles.listContainer}>
            <View>
              <Text style={styles.optionname}>Client</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={[styles.optionVal, { textTransform: 'capitalize' }]}>
                {item?.client?.client_code ? item?.client?.client_code : 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={styles.optionname}>Branch</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={styles.optionVal}>
                {item?.emp_data?.branch?.branch_name ? item?.emp_data?.branch?.branch_name : 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={styles.optionname}>Department</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={styles.optionVal}>
                {item?.department?.department_name ? item?.department?.department_name : 'N/A'}
              </Text>
            </View>
          </View>
          <View style={styles.listContainer}>
            <View>
              <Text style={styles.optionname}>Action</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <IonIcon
                name="eye"
                size={18}
                color={ '#333'}
                onPress={() => {
                  showPdf(item)
                }}
              />
            </View>
          </View>
        </View>
        : null}
    </>
  );

  const placeholderRenderList = ({ index, item }) => (
    <SkeletonLoader width={width} height={60} borderRadius={10} style={{ marginBottom: 6, }} />
  );


  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.main}>
        <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
       <CustomHeader hideUserIcon={true}
          buttonText={t('Sallary Revision')}
          style={{ flexDirection: 'row' }}
          iconStyle={{ height: 30, width: 30, borderRadius: 50 }}
          icon={LOCAL_IMAGES.user}
          searchIcon={false}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginTop: 18 }}>
          </View>

          <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, }}>
              <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6, lineHeight: 35, }}>Arrear Slip</Text>
                <TouchableOpacity onPress={() => { _openFilter() }} style={{ padding: 6, paddingHorizontal: 10 }}>
                  <Filter />
                </TouchableOpacity>
            </View>

            {isLoading ? (
              <FlatList
                data={sampleData}
                renderItem={placeholderRenderList} // Adjust rendering logic as per your data structure
              />
            ) : (
              // Show actual data
              empData?.docs != "" ?
                <>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={empData?.docs}
                    renderItem={ListRender}
                    contentContainerStyle={{ marginBottom: 30 }}
                  />

                </> :

                <NoDataFound />
            )}
          </View>
        </ScrollView>



      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff'
  },

  listCard: {
    padding: 12,
    //paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#B5B6BB',
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    //marginBottom: 8
  },
  datecard: {
    padding: 12,
    margin: 10,
    marginLeft: 0,
    marginRight: 10,
    borderRadius: 8,
    elevation: 10, // for Android
    shadowColor: '#007AFF80', // for iOS
    shadowOffset: { width: 0, height: 2 }, // for iOS
    shadowOpacity: 0.8, // for iOS
    shadowRadius: 2, // for iOS
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  listItem: {
    paddingHorizontal: 12,
    marginBottom: 10
  },
  listContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20 },
  optionname: { color: '#202020', fontFamily: FontFamily.regular, fontSize: 12 },
  optionVal: { color: '#202020', fontFamily: FontFamily.medium, fontSize: 14, textTransform: 'capitalize' }
});
export default ArrearSlip;