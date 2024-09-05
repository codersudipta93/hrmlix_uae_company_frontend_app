
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

const AttendanceSummary = props => {
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
    _updatefilterData( month,year, 'default');
    //}
  }, []);

  useEffect(() => {
    if (needRefresh == true) {
      _updatefilterData( "", "", 'default');
    }
  }, [isFocused]);



  const _updatefilterData = (mm, yyyy, type) => {
    dispatch(_setreffeshStatus(false));
    
    if (props?.route?.params) {
     
      let pdata = props?.route?.params?.paramData;
      setselectedMonth(pdata?.attendance_month?.value);
      setselectedYear(pdata?.attendance_year?.value);

      let apiParam = {
        "pageno": 1,
        "perpage": 100,
        "attendance_month": type == "MONTH_CHANGE" ? (mm).toString() : pdata?.attendance_month?.value,
        "attendance_year": pdata?.attendance_year?.value,
        "searchkey": props?.route?.params?.paramData?.searchkey
      }
      setFilterData(apiParam);

    } else {

      let apiParam = {
        "pageno": 1,
        "perpage": 100,
        "attendance_month": (mm).toString(),
        "attendance_year": yyyy,
        "searchkey": ""
      }
      setFilterData(apiParam);
    }
  }




  const _openFilter = () => {
    let pData = {
      "pageno": 1,
      "attendance_month": { label: HelperFunctions.getMonthName(filterdata?.attendance_month), value: (filterdata?.attendance_month).toString() },
      "attendance_year": { label: (filterdata?.attendance_year).toString(), value: (filterdata?.attendance_year).toString() },
      "searchkey": props?.route?.params?.paramData?.searchkey
    }

    console.log("filter data paramData ====> ", pData)
    console.log("filter data paramData ======================= ")
    setIndex(null)
    props.navigation.navigate('AttendanceSummaryFilter', { paramData: pData })
  }




  useEffect(() => {
    console.log(filterdata);

    if (filterdata != null) {
      setIsLoading(true)
      postApi("company/get-attendance-summary", filterdata, token)
        .then((resp) => {
          // console.log(resp?.attendance_summ)
          if (resp?.status == 'success') {
            setEmpdata(resp?.attendance_summ);
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



  const toggleModal = () => {
    setMonthModalVisible(!monthModalVisible);
  };

 



  const ListRender = ({ index, item }) => (
    <>
      <Pressable style={[styles.listCard, { paddingVertical: 15, marginBottom: 0, backgroundColor: index == selectedIndex ? '#1E2538' : '#fff' }]}>
        <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', height: 32, width: 32, backgroundColor: '#007AFF', borderRadius: 50 }}>
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
          </Pressable> : null }
        </View>

      </Pressable>
      {index == selectedIndex ?
        <View>
          <View style={styles.listContainer}>
            <View>
              <Text style={styles.optionname}>Pay Days</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={styles.optionVal}>{item?.attendance_summ[0]?.paydays}</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={styles.optionname}>Rollover Attendance</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={styles.optionVal}>{item?.attendance_summ[0]?.adjust_day}</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={styles.optionname}>Assumed Present Day</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={styles.optionVal}>{item?.attendance_summ[0]?.assumed_pre_day}</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={styles.optionname}>Total Attendance</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={styles.optionVal}>{item?.attendance_summ[0]?.total_attendance}</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={styles.optionname}>Total ANL</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={styles.optionVal}>{item?.attendance_summ[0]?.total_ANL}</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={styles.optionname}>Total AWP</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={styles.optionVal}>{item?.attendance_summ[0]?.total_AWP}</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={styles.optionname}>Total CSL</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={styles.optionVal}>{item?.attendance_summ[0]?.total_CSL}</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={styles.optionname}>Total ERL</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={styles.optionVal}>{item?.attendance_summ[0]?.total_ERL}</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={styles.optionname}>Total LE1</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={styles.optionVal}>{item?.attendance_summ[0]?.total_LE1}</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={styles.optionname}>Total LE2</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={styles.optionVal}>{item?.attendance_summ[0]?.total_LE2}</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={styles.optionname}>Total LP1</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={styles.optionVal}>{item?.attendance_summ[0]?.total_LP1}</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={styles.optionname}>Total LP2</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={styles.optionVal}>{item?.attendance_summ[0]?.total_LP2}</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={styles.optionname}>Total LP3</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={styles.optionVal}>{item?.attendance_summ[0]?.total_LP3}</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={styles.optionname}>Total MDL</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={styles.optionVal}>{item?.attendance_summ[0]?.total_MDL}</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={styles.optionname}>Total MTL</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={styles.optionVal}>{item?.attendance_summ[0]?.total_MTL}</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={styles.optionname}>Total PDL</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={styles.optionVal}>{item?.attendance_summ[0]?.total_PDL}</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={styles.optionname}>Total PTL</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={styles.optionVal}>{item?.attendance_summ[0]?.total_PTL}</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={styles.optionname}>Total PVL</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={styles.optionVal}>{item?.attendance_summ[0]?.total_PVL}</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={styles.optionname}>Total SKL</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={styles.optionVal}>{item?.attendance_summ[0]?.total_SKL}</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={styles.optionname}>Total UWP</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={styles.optionVal}>{item?.attendance_summ[0]?.total_UWP}</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={styles.optionname}>Total Late</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={styles.optionVal}>{item?.attendance_summ[0]?.total_late}</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={styles.optionname}>Total LOP</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={styles.optionVal}>{item?.attendance_summ[0]?.total_lop}</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={styles.optionname}>Total OT</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={styles.optionVal}>{item?.attendance_summ[0]?.total_overtime ? (item?.attendance_summ[0]?.total_overtime).toFixed(2) : parseFloat(item?.attendance_summ[0]?.total_overtime).toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={styles.optionname}>Total WO</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={styles.optionVal}>{item?.attendance_summ[0]?.total_wo}</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={styles.optionname}>Total Absent</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={styles.optionVal}>{item?.attendance_summ[0]?.total_absent}</Text>
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
              <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6, lineHeight: 35 }}>Attendance Summary</Text>
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
                : <NoDataFound />
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
  optionVal: { color: '#202020', fontFamily: FontFamily.medium, fontSize: 14 }
});
export default AttendanceSummary;