
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
  ScrollView
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
} from '../constants/Theme';

import { LOCAL_IMAGES, LOCAL_ICONS, AllSourcePath } from '../constants/PathConfig';
import { HelperFunctions } from '../constants';
import { useRoute } from '@react-navigation/native';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { postApi } from '../Service/service';
import { _setreffeshStatus } from '../Store/Reducers/ProjectReducer';
import { getData, setData, deleteData } from '../Service/localStorage';
import { useDispatch, useSelector } from 'react-redux';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from 'react-native/Libraries/NewAppScreen';
import CustomHeader from '../component/Header';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useTranslation } from 'react-i18next'; //for translation service
import IonIcon from 'react-native-vector-icons/Ionicons';
import Delete from '../assets/icons/Delete';
import Filter from '../assets/icons/Filter';
import Action from '../assets/icons/Action';
import MonthModal from '../component/MonthModal';
import SkeletonLoader from '../component/SkeletonLoader';
import NoDataFound from '../component/NoDataFound';

const AttendanceListingConsole = props => {
  const isFocused = useIsFocused();
  const route = useRoute();
  const dispatch = useDispatch();
  const { userDetails, token, needRefresh } = useSelector(state => state.project);

  const { t, i18n } = useTranslation();

  const [calenderdata, setCalenderdata] = useState([]);

  const [selectedDate, setSelectedDate] = useState();
  const [selectedMonth, setselectedMonth] = useState();
  const [selectedYear, setselectedYear] = useState();

  const sampleData = [1, 1, 1, 1, 1];

  const [monthModalVisible, setMonthModalVisible] = useState(false);
  const [empData, setEmpdata] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [filterdata, setFilterData] = useState(null)
  const [selectedIndex, setIndex] = useState(null)

  useEffect(() => {
    if (isFocused == true) {
      console.log(i18n.language);
      console.log(I18nManager.isRTL);
    }
  }, [isFocused]);


  useEffect(() => {
    // if (needRefresh == true) {
    let month = HelperFunctions.getCurrentMonth(); //(1-based index)
    let year = HelperFunctions.getCurrentYear();
    let datesAndDays = HelperFunctions.getAllDatesAndDays(month, year);

    setSelectedDate(HelperFunctions.getCurrentDatenumber());
    setselectedMonth(month);
    setselectedYear(year);
    setCalenderdata(datesAndDays);
    //console.log(datesAndDays);
    _updatefilterData(HelperFunctions.getCurrentDatenumber(), month, year, 'default');
    //}
  }, []);

  useEffect(() => {
    if (needRefresh == true) {
      _updatefilterData(HelperFunctions.getCurrentDatenumber(), "", "a", 'default');
    }
  }, [isFocused]);



  const _updatefilterData = (dd, mm, yyyy, type) => {
    dispatch(_setreffeshStatus(false))
    if (props?.route?.params) {

      let pdata = props?.route?.params?.paramData;
      setselectedMonth(pdata?.search_month?.value);
      setselectedYear(pdata?.search_year?.value);

      let apiParam = {
        "pageno": 1,
        "search_month": type == "MONTH_CHANGE" ? (mm).toString() : pdata?.search_month?.value,
        "search_year": pdata?.search_year?.value,
        "search_day": type == "DATE_CHANGE" ? dd.toString() : pdata?.search_day,
        "attendance_type": pdata?.attendance_type,
        "branch_id": JSON.stringify(pdata?.branchData.map(item => item._id)),
        "designation_id": JSON.stringify(pdata?.designationData.map(item => item._id)),
        "department_id": JSON.stringify(pdata?.departmentData.map(item => item._id)),
        "hod_id": JSON.stringify(pdata?.hodData.map(item => item._id)),
        "client_id": JSON.stringify(pdata?.clientData.map(item => item._id)),
        "searchkey": props?.route?.params?.paramData?.searchkey
      }
      setFilterData(apiParam);

    } else {

      let apiParam = {
        "pageno": 1,
        "search_month": (mm).toString(),
        "search_year": (HelperFunctions.getCurrentYear()).toString(),
        "search_day": dd.toString(),
        "attendance_type": { label: "time", value: 'time' },
        "branch_id": JSON.stringify([]),
        "designation_id": JSON.stringify([]),
        "department_id": JSON.stringify([]),
        "hod_id": JSON.stringify([]),
        "client_id": JSON.stringify([]),
        "searchkey": ""
      }
                                                                                                                                                            setFilterData(apiParam);
    }
  }




  const _openFilter = () => {
    //alert(filterdata?.search_month)
    let pData = {
      "pageno": 1,
      "search_month": { label: HelperFunctions.getMonthName(filterdata?.search_month), value: (filterdata?.search_month).toString() },
      "search_year": { label: (filterdata?.search_year).toString(), value: (filterdata?.search_year).toString() },
      "attendance_type": filterdata?.attendance_type,
      "branchData": props?.route?.params?.paramData?.branchData ? props?.route?.params?.paramData?.branchData : [],
      "designationData": props?.route?.params?.paramData?.designationData ? props?.route?.params?.paramData?.designationData : [],
      "departmentData": props?.route?.params?.paramData?.departmentData ? props?.route?.params?.paramData?.departmentData : [],
      "hodData": props?.route?.params?.paramData?.hodData ? props?.route?.params?.paramData?.hodData : [],
      "clientData": props?.route?.params?.paramData?.clientData ? props?.route?.params?.paramData?.clientData : [],
      "search_day": filterdata?.search_day,
      "searchkey": props?.route?.params?.paramData?.searchkey
    }

    console.log("filter data paramData ====> ", pData)
    console.log("filter data paramData ======================= ")
    props.navigation.navigate('FilterEmployeePage', { paramData: pData, from: 'attendance_page' })
  }




  useEffect(() => {
    console.log(filterdata);
    let data = { ...filterdata };
    data.attendance_type = data?.attendance_type != "" ? data?.attendance_type?.value : "time";
    data.branch_id = data?.branch_id != "[]" ? data?.branch_id : "";
    data.hod_id = data?.hod_id != "[]" ? data?.hod_id : "";
    data.designation_id = data?.designation_id != "[]" ? data?.designation_id : "";
    data.client_id = data?.client_id != "[]" ? data?.client_id : "";
    data.department_id = data?.department_id != "[]" ? data?.department_id : "";
    data.search_day = data?.attendance_type != "monthly" ? data?.search_day : ""
    if (filterdata != null) {
      setIsLoading(true)
      postApi("company/get-attendance-data", data, token)
        .then((resp) => {
          if (resp?.status == 'success') {
            setEmpdata(resp?.employees);
            setIsLoading(false)
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



  // Reference for FlatList
  const flatListRef = useRef(null);

  // Function to get item layout
  const getItemLayout = (data, index) => ({
    length: 55, // Width of each item (including margin)
    offset: 55 * index, // Offset of each item
    index,
  });

  // Effect to scroll to current date after layout
  useEffect(() => {
    if (flatListRef.current) {
      const currentDateIndex = calenderdata.findIndex(item => item.selected);
      if (currentDateIndex !== -1) {
        console.log(currentDateIndex)
        flatListRef.current.scrollToIndex({ index: currentDateIndex, animated: true });
      }
    }
  }, [calenderdata]);

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

  const onDatePress = (item, index) => {
    const updatedDates = calenderdata.map((item, i) => ({
      ...item,
      selected: i === index
    }));
    setCalenderdata(updatedDates);
    setSelectedDate(item?.date);
    _updatefilterData(item?.date, selectedMonth, HelperFunctions.getCurrentYear(), 'DATE_CHANGE')
  }


  const toggleModal = () => {
    setMonthModalVisible(!monthModalVisible);
  };

  const handleMonthSelect = (selecteddata) => {
    // Do something with the selected month name
    console.log('Selected month:', selecteddata);
    toggleModal(); // Close modal after selecting

    let month = selecteddata?.monthIndex; //(1-based index)
    let year = HelperFunctions.getCurrentYear();
    let datesAndDays = HelperFunctions.getAllDatesAndDays(month, year);
    setCalenderdata(datesAndDays);
    setselectedMonth(month);
    _updatefilterData(selectedDate, month, HelperFunctions.getCurrentYear(), 'MONTH_CHANGE')
  };



  const ListRender = ({ index, item }) => (
    <>
      <Pressable style={[styles.listCard, { paddingVertical: 15, marginBottom: 0, backgroundColor: index == selectedIndex ? '#1E2538' : '#fff' }]}>
        <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', height: 32, width: 32, backgroundColor: '#007AFF', borderRadius: 50 }}>
            <Image source={{ uri: AllSourcePath?.API_IMG_URL_DEV + 'user.jpg' }} style={{ height: '100%', width: '100%', borderRadius: 50, objectFit: 'cover' }} />
          </View>
          <View style={{ paddingLeft: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <View>
              <Text style={{textTransform:'capitalize', fontFamily: FontFamily.medium, color: index == selectedIndex ? '#fff' : '#4E525E', fontSize: sizes.md, textAlign: 'left' }}>{item?.emp_first_name} {item?.emp_last_name}</Text>
              <Text style={{ fontFamily: FontFamily.regular, color: index == selectedIndex ? '#fff' : '#8A8E9C', fontSize: sizes.sm, textAlign: 'left', marginTop: 4, lineHeight: 12 }}>ID: {item?.emp_id}</Text>
            </View>
          </View>
        </View>
        <View style={{ paddingLeft: 12, width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Pressable onPress={() => {

            if (index == selectedIndex) {
              setIndex(null);

            } else {
              setIndex(index)
            }

          }} >
            <Text style={{ fontFamily: FontFamily.medium, color: index == selectedIndex ? '#fff' : '#4E525E', fontSize: sizes.h2 }}>{index == selectedIndex ? '-' : '+'}</Text>
          </Pressable>
        </View>

      </Pressable>
      {index == selectedIndex ?
          <View>
            <View style={styles.listContainer}>
              <View>
                <Text style={styles.optionname}>Register Type</Text>
              </View>
              <View style={{ paddingRight: 12 }}>
                <Text style={styles.optionVal}>Time</Text>
              </View>
            </View>

            <View style={styles.listContainer}>
              <View>
                <Text style={styles.optionname}>Avail Attend Record</Text>
              </View>
              <View style={{ paddingRight: 12 }}>
                <Text style={styles.optionVal}>5/28</Text>
              </View>
            </View>

           

          </View>
         : null}
    </>
  );

  const placeholderRenderList = ({ index, item }) => (
    <SkeletonLoader width={width} height={80} borderRadius={10} style={{ marginBottom: 6, }} />
  );


  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.main}>
        <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
        <CustomHeader
          buttonText={t('Attendance')}
          style={{ flexDirection: 'row' }}
          iconStyle={{ height: 30, width: 30, borderRadius: 50 }}
          icon={LOCAL_IMAGES.user}
          searchIcon={true}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginTop: 18 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, marginBottom: 12 }}>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6 }}>
                  {/* {HelperFunctions.getMonthName(selectedMonth)} */}
                  <Text style={{ fontSize: sizes.h6 + 1 }}>{selectedYear}</Text></Text>

              </View>
              <Pressable onPress={() => { toggleModal(!monthModalVisible) }} style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', }}>
                <Image
                  style={{
                    height: 14,
                    width: 14,
                    tintColor: '#4E525E',
                  }}
                  source={LOCAL_ICONS.calender}
                />
                <Text style={{ marginLeft: 4, fontFamily: FontFamily.medium, color: '#4E525E', fontSize: sizes.h6 }}>{HelperFunctions.getMonthName(selectedMonth)}</Text>
              </Pressable>
            </View>

          </View>

          <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 12 }}>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, }}>
              <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6, lineHeight: 35 }}>Attendance Listing Console</Text>
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
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={empData?.docs}
                  renderItem={ListRender}
                  contentContainerStyle={{ marginBottom: 30 }}
                />
                :<NoDataFound />
            )}
          </View>
        </ScrollView>

        <MonthModal selectedIndex={selectedMonth} visible={monthModalVisible} onClose={handleMonthSelect} onPressClose={() => { setMonthModalVisible(false) }} />
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
  optionVal: { color: '#202020', fontFamily: FontFamily.medium, fontSize: 14 }
});
export default AttendanceListingConsole;