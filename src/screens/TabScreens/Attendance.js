
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Image,
  Modal,
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { postApi } from '../../Service/service';

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



const Attendance = props => {
  const isFocused = useIsFocused();
  const route = useRoute();
  const dispatch = useDispatch();
  const { userDetails, token } = useSelector(state => state.project);

  const { t, i18n } = useTranslation();

  const [calenderdata, setCalenderdata] = useState([]);

  const [selectedDate, setSelectedDate] = useState();
  const [selectedMonth, setselectedMonth] = useState();

  const sampleData = [1,1,1,1,1]
  const [monthModalVisible, setMonthModalVisible] = useState(false);

  const [empData, setEmpdata] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isFocused == true) {
      console.log(i18n.language);
      console.log(I18nManager.isRTL)
    }
  }, [isFocused]);


  useEffect(() => {
    if(isFocused){
    let month = HelperFunctions.getCurrentMonth(); //(1-based index)
    let year = HelperFunctions.getCurrentYear();
    let datesAndDays = HelperFunctions.getAllDatesAndDays(month, year);

    setSelectedDate(HelperFunctions.getCurrentDatenumber());
    setselectedMonth(month);

    setCalenderdata(datesAndDays);
    console.log(datesAndDays);
    //setcurrentDateIndex(datesAndDays.findIndex(item => item.selected))
  }

  }, [isFocused]);

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
  }


  const calenderDateRender = ({ index, item }) => (
    <Pressable onPress={() => { onDatePress(item, index) }} style={[styles.datecard, { width: 55, height: 78, backgroundColor: item.selected == true ? '#007AFF' : '#fff', }]}>
      <View style={{ width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontFamily: FontFamily.bold, color: item.selected == true ? '#FFF' : '#8A8E9C', fontSize: sizes.h4, textAlign: 'left', marginTop: 4 }}>{item?.date}</Text>
        <Text style={{ fontFamily: FontFamily.regular, color: item.selected == true ? '#FFF' : '#8A8E9C', fontSize: sizes.md, textAlign: 'left', marginTop: 4 }}>{item?.dayName}</Text>
      </View>
    </Pressable>
  );

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
  };

  const ListRender = ({ index, item }) => (
    <Pressable onPress={() => { props.navigation.navigate('EployeeAttendanceView', { paramData: item, filterData: { seletedMonth: 7, seletedYear: 2024 } }) }} style={[styles.listCard, { paddingVertical: 15, marginBottom: 0, borderRadius: 0, borderTopRightRadius: index == 0 ? 8 : 0, borderTopLeftRadius: index == 0 ? 8 : 0, borderBottomLeftRadius: sampleData.length - 1 == index ? 8 : 0, borderBottomRightRadius: sampleData.length - 1 == index ? 8 : 0 }]}>
      <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', height: 32, width: 32, backgroundColor: '#007AFF', borderRadius: 50 }}>
          <Image source={{ uri: 'https://uaedemo.hrmlix.com/assets/images/user.jpg' }} style={{ height: '100%', width: '100%', borderRadius: 50, objectFit: 'cover' }} />
        </View>
        <View style={{ paddingLeft: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <View>
            <Text style={{ fontFamily: FontFamily.medium, color: '#4E525E', fontSize: sizes.md, textAlign: 'left' }}>{item?.emp_first_name} {item?.emp_last_name}</Text>
            <Text style={{ fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.sm, textAlign: 'left', marginTop: 4, lineHeight: 12 }}>ID: {item?.emp_id}</Text>
          </View>
          {/* <Image source={LOCAL_ICONS.newIcon} style={{ height: 25, width: 35, marginBottom: 15, marginLeft: 8 }} /> */}

        </View>
      </View>
      {/* <View style={{ paddingLeft: 12, width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Pressable onPress={() => { console.log('delete action') }}>
          <Action />
        </Pressable>
      </View> */}
    </Pressable>
  );

  const placeholderRenderList = ({ index, item }) => (
     <SkeletonLoader width={width} height={80} borderRadius={10} style={{marginBottom: 6,}} />
);


  const _openFilter = () => {
    props.navigation.navigate('FilterEmployeePage')
  }


  useEffect(() => {
    setIsLoading(true)
    if (isFocused == true) {
    console.log("api")
    let paramData = {
      "pageno": 1,
      "search_month": "6",
      "search_year": "2024",
      "attendance_type": "time",
      "branch_id": "",
      "designation_id": "",
      "department_id": "",
      "hod_id": "",
      "client_id": ""
    }
    postApi("company/get-attendance-data", paramData, token)
      .then((resp) => {
        console.log(resp);

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
  }, [isFocused]);

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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, marginBottom:12 }}>
              <View style={{flex:1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6 }}>{HelperFunctions.getMonthName(selectedMonth)}<Text style={{fontSize: sizes.h6+1}}>{selectedDate}</Text></Text>
              </View>
              <Pressable onPress={() => { toggleModal(!monthModalVisible) }} style={{flex:1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', }}>
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
            <FlatList
              ref={flatListRef}
              data={calenderdata}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={calenderDateRender}
              getItemLayout={getItemLayout} // Provide getItemLayout to calculate item dimensions and offsets
              initialScrollIndex={0} // Optionally set initialScrollIndex to start from the first item
            />

          </View>

          <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 12 }}>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, }}>
              <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6 }}>Employees List</Text>
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
              <FlatList
                showsVerticalScrollIndicator={false}
                data={empData?.docs}
                renderItem={ListRender}
                contentContainerStyle={{ marginBottom: 30 }}
              />
            )}


          </View>
        </ScrollView>

        <MonthModal selectedIndex={selectedMonth} visible={monthModalVisible} onClose={handleMonthSelect} />
      </View>


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
});
export default Attendance;