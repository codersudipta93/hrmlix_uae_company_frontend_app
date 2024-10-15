
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
  ScrollView
} from 'react-native'

import React, {
  useEffect,
  useState,
  useRef
} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';

import {
  colors,
  height,
  sizes,
  width,
  FontFamily
} from '../../constants/Theme';

import { LOCAL_IMAGES, LOCAL_ICONS, AllSourcePath } from '../../constants/PathConfig';
import { HelperFunctions } from '../../constants';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { getData, setData, deleteData } from '../../Service/localStorage';
import { useDispatch, useSelector } from 'react-redux';

import CustomHeader from '../../component/Header';
import SideMenu from '../../component/SideMenu';

import { useTranslation } from 'react-i18next'; //for translation service

import Totalemp from '../../assets/icons/Totalemp';
import LeaveApplicationIcon from '../../assets/icons/LeaveApplicationIcon';
import NoticePeriod from '../../assets/icons/NoticePeriod';
import NewEmp from '../../assets/icons/NewEmp';
import Clock from '../../assets/icons/Clock';

import { postApi } from '../../Service/service';
import SkeletonLoader from '../../component/SkeletonLoader';

const Dashboard = props => {
  const isFocused = useIsFocused();
  const route = useRoute();
  const dispatch = useDispatch();

  const { userDetails, token } = useSelector(state => state.project);

  const { t, i18n } = useTranslation();

  const sampleData = [1, 1, 1];
  const [menuVisible, setMenuVisible] = useState(false);

  const [birthdayLoader, setbirthdayLoader] = useState(false);
  const [birthdayList, setBirthdayList] = useState("");

  const [dashboardCounterLoader, setdashboardCounterLoader] = useState(false);
  const [dashboardCounterdata, setDashboardCounterdata] = useState("");

  const [newlyEmployeeJoinLoader, setnewlyEmployeeJoinLoader] = useState(false);
  const [newJoinemp, setnewJoinemp] = useState("");

  const [announcementLoader, setannouncementLoader] = useState(false);
  const [announcementData, setannouncementData] = useState("");

  const [anniversaryloader, setanniversaryloader] = useState(false);
  const [anniversarydata, setanniversarydata] = useState("");

  const [noticeLoader, setnoticeloader] = useState(false);
  const [noticeData, setnoticeData] = useState("");


  const openMenu = () => {
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };


  useEffect(() => {
    if (isFocused == true) {
      console.log(i18n.language);
      console.log(I18nManager.isRTL);
      _getUpcommingBirthday();
      _getdashboardCardData();
      _getNewJoinEmpCount();
      _getAnnouncemnetData();
      _getWorkanniversary()
      _getNoticeData()
    }
  }, [isFocused]);


  useEffect(() => {
    console.log(userDetails)
  }, []);

  const _getdashboardCardData = () => {
    setdashboardCounterLoader(true)
    postApi("company/company-dashboard-total-data", {}, token)
      .then((resp) => {
        console.log(resp);
        if (resp?.status == 'success') {
          console.log(resp?.dashboard_data)
          setDashboardCounterdata(resp?.dashboard_data)
          setdashboardCounterLoader(false)
        } else if (resp?.status == 'val_err') {
          setdashboardCounterLoader(false)
          HelperFunctions.showToastMsg(message);
        } else {
          setdashboardCounterLoader(false)
          HelperFunctions.showToastMsg(resp.message);
        }

      }).catch((err) => {
        setdashboardCounterLoader(false)
        console.log(err);
        HelperFunctions.showToastMsg(err.message);
      })
  }

  const _getNewJoinEmpCount = () => {
    setnewlyEmployeeJoinLoader(true)
    postApi("company/company-dashboard-get-new-joined-employees", {}, token)
      .then((resp) => {
        console.log(resp);
        if (resp?.status == 'success') {
          console.log(resp?.data);
          setnewJoinemp(resp?.data);
          setnewlyEmployeeJoinLoader(false)
        } else if (resp?.status == 'val_err') {
          setnewlyEmployeeJoinLoader(false)
          HelperFunctions.showToastMsg(message);
        } else {
          setnewlyEmployeeJoinLoader(false)
          HelperFunctions.showToastMsg(resp.message);
        }

      }).catch((err) => {
        setnewlyEmployeeJoinLoader(false)
        console.log(err);
        HelperFunctions.showToastMsg(err.message);
      })
  }

  const _getAnnouncemnetData = () => {
    setannouncementLoader(true)
    postApi("company/company-dashboard-latest-announcement", {}, token)
      .then((resp) => {
        console.log(resp);
        if (resp?.status == 'success') {
          console.log(resp?.dashboard_data)
          setannouncementData(resp?.data?.docs)
          setannouncementLoader(false)
        } else if (resp?.status == 'val_err') {
          setannouncementLoader(false)
          HelperFunctions.showToastMsg(resp?.message);
        } else {
          setannouncementLoader(false)
          HelperFunctions.showToastMsg(resp?.message);
        }

      }).catch((err) => {
        setdashboardCounterLoader(false)
        console.log(err);
        HelperFunctions.showToastMsg(err?.message);
      })
  }


  const _getUpcommingBirthday = () => {
    setbirthdayLoader(true)
    postApi("company/company-dashboard-upcoming-birthdays", { "page": 1, "perpage": 10 }, token)
      .then((resp) => {
        console.log(resp);
        if (resp?.status == 'success') {
          console.log(resp?.data?.docs)
          setBirthdayList(resp?.data?.docs)
          setbirthdayLoader(false)
        } else if (resp?.status == 'val_err') {
          setbirthdayLoader(false)
          HelperFunctions.showToastMsg(message);
        } else {
          setbirthdayLoader(false)
          HelperFunctions.showToastMsg(resp.message);
        }

      }).catch((err) => {
        setbirthdayLoader(false)
        console.log(err);
        HelperFunctions.showToastMsg(err.message);
      })
  }

  const _getWorkanniversary = () => {
    setanniversaryloader(true)
    postApi("company/company-dashboard-upcoming-work-aniversary", { page: 1, perpage: 10 }, token)
      .then((resp) => {
        console.log(resp);
        if (resp?.status == 'success') {
          console.log(resp?.data?.docs)
          setanniversarydata(resp?.data?.docs)
          setanniversaryloader(false)
        } else if (resp?.status == 'val_err') {
          setanniversaryloader(false)
          HelperFunctions.showToastMsg(message);
        } else {
          setanniversaryloader(false)
          HelperFunctions.showToastMsg(resp.message);
        }

      }).catch((err) => {
        setanniversaryloader(false)
        console.log(err);
        HelperFunctions.showToastMsg(err.message);
      })
  }

  const _getNoticeData = () => {
    setnoticeloader(true)
    postApi("company/company-dashboard-expire-and-expiring-documents", { pageno: 1, perpage: 5, type: "expiring" }, token)
      .then((resp) => {
        console.log(resp);
        if (resp?.status == 'success') {
          console.log(resp?.data?.docs)
          setnoticeData(resp?.data?.docs)
          setnoticeloader(false)
        } else if (resp?.status == 'val_err') {
          setnoticeloader(false)
          HelperFunctions.showToastMsg(message);
        } else {
          setnoticeloader(false)
          HelperFunctions.showToastMsg(resp.message);
        }

      }).catch((err) => {
        setnoticeloader(false)
        console.log(err);
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

  const announcementListRender = ({ index, item }) => (
    <View style={styles.listCard}>
      <View style={{ justifyContent: 'center', alignItems: 'center', padding: 12, paddingHorizontal: 16, backgroundColor: '#007AFF', borderRadius: 8 }}>
        <Text style={{ fontFamily: FontFamily.medium, color: colors.white, fontSize: sizes.h6 }}>{HelperFunctions.getmonthYear(item?.updated_at)?.day}</Text>
        <Text style={{ fontFamily: FontFamily.medium, color: colors.white, fontSize: sizes.md, marginTop: 1 }}>{HelperFunctions.getshortMonthName(item?.updated_at)}</Text>
      </View>
      <View style={{ flexDirection: 'column', paddingHorizontal: 14, paddingRight: 50, flex: 1, height: '100%' }}>
        <Text style={{ fontFamily: FontFamily.regular, color: '#4E525E', fontSize: sizes.md + 1, textAlign: 'left' }}>{item?.title}</Text>
      </View>
    </View>
  );

  const noticeListRender = ({ index, item }) => (
    <View style={styles.listCard}>
      <View style={{ justifyContent: 'center', alignItems: 'center', padding: 6, backgroundColor: '#007AFF', borderRadius: 8 }}>
      </View>
      <Pressable onPress={() => {

        let param = {
          "system": "document_user_vault",
          "document_id": item?.document_type_id,
          "emp_id": item?.emp_db_id,
          "name": item?.document_name,
          "action_type": 'all',
          "validity_req": item?.validity_req,
          "expire_in_days": item?.expire_in_days
        }
        props.navigation.navigate('EmployeeDocuments', { paramData: param });

      }} style={{ flexDirection: 'column', paddingHorizontal: 14, paddingRight: 50, flex: 1, height: '100%' }}>
        <Text style={{ fontFamily: FontFamily.regular, color: '#4E525E', fontSize: sizes.md + 1, textAlign: 'left' }}>{item?.document_name + ' document will be expire with in ' + item?.expire_in_days + ' for ' + item?.emp_first_name + ' ' + item?.emp_last_name} </Text>
      </Pressable>
    </View>
  );

  const ListRender = ({ index, item }) => (
    <View style={[styles.listCard, { paddingVertical: 18, marginBottom: 0, borderRadius: 0, borderTopRightRadius: index == 0 ? 8 : 0, borderTopLeftRadius: index == 0 ? 8 : 0, borderBottomLeftRadius: sampleData.length - 1 == index ? 8 : 0, borderBottomRightRadius: sampleData.length - 1 == index ? 8 : 0 }]}>
      <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', height: 30, width: 30, backgroundColor: '#007AFF', borderRadius: 50 }}>
          <Image source={LOCAL_IMAGES.user} style={{ height: '100%', width: '100%', borderRadius: 50, objectFit: 'cover' }} />
        </View>
        <View style={{ paddingLeft: 12 }}>
          <Text style={{ fontFamily: FontFamily.medium, color: '#4E525E', fontSize: sizes.md, textAlign: 'left' }}>Brent Farrell DVM</Text>
          <Text style={{ fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md - 1, textAlign: 'left', marginTop: 6 }}>UI/UX Designer</Text>
        </View>
      </View>
      <View style={{ paddingLeft: 12, width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Text style={{ fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md - 1, textAlign: 'left', lineHeight: 19 }}>02 Aug 2024</Text>
      </View>
    </View>
  );


  //Ruhul told anniversary will be as birthday

  const anniversaryListRender = ({ index, item }) => (
    <View style={[styles.listCard, { paddingVertical: 18, marginBottom: 0, borderRadius: 0, borderTopRightRadius: index == 0 ? 8 : 0, borderTopLeftRadius: index == 0 ? 8 : 0, borderBottomLeftRadius: sampleData.length - 1 == index ? 8 : 0, borderBottomRightRadius: sampleData.length - 1 == index ? 8 : 0 }]}>
      <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', height: 30, width: 30, backgroundColor: '#007AFF', borderRadius: 50 }}>
          <Image source={{ uri: item?.profile_pic ? item?.profile_pic : 'https://uaedemo.hrmlix.com/assets/images/user.jpg' }} style={{ height: '100%', width: '100%', borderRadius: 50, objectFit: 'cover' }} />
        </View>
        <View style={{ paddingLeft: 12 }}>
          <Text style={{ fontFamily: FontFamily.medium, color: '#4E525E', fontSize: sizes.md, textAlign: 'left' }}>{item?.emp_first_name} {item?.emp_last_name}</Text>
          <Text style={{ fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md - 1, textAlign: 'left', marginTop: 6 }}>{item?.designation ? item?.designation : "N/A"}</Text>
        </View>
      </View>
      <View style={{ paddingLeft: 12, width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Text style={{ fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md - 1, textAlign: 'left', lineHeight: 19 }}>{HelperFunctions.isToday(item?.dob) ? 'Today' : HelperFunctions.getmonthYear(item?.dob)?.day + ' ' + HelperFunctions.getshortMonthName(item?.dob) + ', ' + HelperFunctions.getmonthYear(item?.dob)?.year} </Text>
      </View>
    </View>
  );

  const upcommingAppraisalRender = ({ index, item }) => (
    <View style={[styles.listCard, { paddingVertical: 18, marginBottom: 0, borderRadius: 0, borderTopRightRadius: index == 0 ? 8 : 0, borderTopLeftRadius: index == 0 ? 8 : 0, borderBottomLeftRadius: sampleData.length - 1 == index ? 8 : 0, borderBottomRightRadius: sampleData.length - 1 == index ? 8 : 0 }]}>
      <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', height: 35, width: 35, backgroundColor: '#007AFF', borderRadius: 50 }}>
          <Image source={{ uri: 'https://uaedemo.hrmlix.com/assets/images/user.jpg' }} style={{ height: '100%', width: '100%', borderRadius: 50, objectFit: 'cover' }} />
        </View>
        <View style={{ paddingLeft: 12 }}>
          <Text style={{ fontFamily: FontFamily.medium, color: '#4E525E', fontSize: sizes.h6, textAlign: 'left' }}>Brent Farrell DVM</Text>
          <Text style={{ fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md - 1, textAlign: 'left', marginTop: 6 }}>UI/UX Designer</Text>
        </View>
      </View>
      <View style={{ paddingLeft: 12, width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Text style={{ fontFamily: FontFamily.regular, color: '#60B057', fontSize: sizes.md - 1, textAlign: 'left', marginTop: 6 }}>Today</Text>
      </View>
    </View>
  );



  const FNFRender = ({ index, item }) => (
    <View style={[styles.listCard, { paddingVertical: 18, marginBottom: 0, borderRadius: 0, borderTopRightRadius: index == 0 ? 8 : 0, borderTopLeftRadius: index == 0 ? 8 : 0, borderBottomLeftRadius: sampleData.length - 1 == index ? 8 : 0, borderBottomRightRadius: sampleData.length - 1 == index ? 8 : 0 }]}>
      <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', height: 30, width: 30, backgroundColor: '#007AFF', borderRadius: 50 }}>
          <Image source={{ uri: item?.profile_pic ? item?.profile_pic : 'https://uaedemo.hrmlix.com/assets/images/user.jpg' }} style={{ height: '100%', width: '100%', borderRadius: 50, objectFit: 'cover' }} />
        </View>
        <View style={{ paddingLeft: 12 }}>
          <Text style={{ fontFamily: FontFamily.medium, color: '#4E525E', fontSize: sizes.md, textAlign: 'left' }}>{item?.emp_first_name} {item?.emp_last_name}</Text>
          <Text style={{ fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md - 1, textAlign: 'left', marginTop: 6 }}>{item?.emp_id ? item?.emp_id : "N/A"}</Text>
        </View>
      </View>
      {/* <View style={{ paddingLeft: 12, width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Text style={{ fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md - 1, textAlign: 'left', lineHeight: 19 }}>{HelperFunctions.isToday(item?.dob) ? 'Today' : HelperFunctions.getmonthYear(item?.dob)?.day + ' ' + HelperFunctions.getshortMonthName(item?.dob) + ', ' + HelperFunctions.getmonthYear(item?.dob)?.year} </Text>
      </View> */}
    </View>
  );


  const birthDayListRender = ({ index, item }) => (
    <View style={[styles.card, { width: 210 }]}>
      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', height: 48, width: 48, backgroundColor: '#007AFF', borderRadius: 50 }}>
          <Image source={LOCAL_IMAGES.user} style={{ height: '100%', width: '100%', borderRadius: 50, objectFit: 'cover' }} />
        </View>
        <View style={{ paddingLeft: 12 }}>
          <Text style={{ fontFamily: FontFamily.medium, color: '#4E525E', fontSize: sizes.h6, textAlign: 'left' }}>{item?.emp_first_name} {item?.emp_last_name}</Text>
          <Text style={{ fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md - 1, textAlign: 'left', marginTop: 4 }}>{item?.designation}</Text>
          <Text style={{ fontFamily: FontFamily.regular, color: '#60B057', fontSize: sizes.md, textAlign: 'left', marginTop: 4 }}>{HelperFunctions.getDateDDMMYY(item?.dob)}</Text>
        </View>
      </View>
    </View>
  );

  const horizontalPlaceholderRenderList = ({ index, item }) => (
    <SkeletonLoader width={250} height={80} borderRadius={10} style={{ marginBottom: 6, marginRight: 10 }} />
  );

  const verticalPlaceholderRenderList = ({ index, item }) => (
    <View style={{ flexDirection: 'row' }}>
      <SkeletonLoader width={'15%'} height={60} borderRadius={50} style={{ marginBottom: 6, marginRight: 10 }} />
      <SkeletonLoader width={'85%'} height={60} borderRadius={10} style={{ marginBottom: 6, marginRight: 10 }} />
    </View>

  );



  const recruitmentListRender = ({ index, item }) => (
    <View style={[styles.card, { width: 290, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }]}>
      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ paddingLeft: 12, width: '60%' }}>
          <Text style={{ fontFamily: FontFamily.medium, color: '#4E525E', fontSize: sizes.md, textAlign: 'left' }}>Anjali Mukherjee</Text>
          <Text style={{ fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.sm + 1, textAlign: 'left', marginTop: 4 }}>UI/UX Designer</Text>
        </View>
        <View style={{ width: '40%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', height: 4, width: 4, backgroundColor: '#FFAC10', borderRadius: 50 }}>
          </View>
          <Text style={{ marginLeft: 6, fontFamily: FontFamily.semibold, color: '#FFAC10', fontSize: sizes.md, textAlign: 'left' }}>Tech interview</Text>
        </View>
      </View>
      <View style={{ width: '100%' }}>

        <View style={{ padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

          <View style={{ width: '45%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Image source={LOCAL_ICONS.calendarCheck} style={{ height: 14, width: 14, tintColor: colors.primary, marginBottom: 12 }} />
              <View style={{ marginLeft: 8 }}>
                <Text style={{ fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md, textAlign: 'left' }}>Date</Text>
                <Text style={{ fontFamily: FontFamily.medium, color: '#4E525E', fontSize: sizes.md, textAlign: 'left', marginTop: 2 }}>Jun 7, 2024</Text>
              </View>
            </View>
          </View>

          <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: 1, height: 34, backgroundColor: '#E7EAF1' }}></View>
          </View>

          <View style={{ width: '45%', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start' }}>
            <Clock />
            {/* <Image source={LOCAL_ICONS.calendarCheck} style={{ height: 19, width: 19, tintColor: colors.primary, marginBottom: 12 }} /> */}
            <View style={{ marginLeft: 8 }}>
              <Text style={{ fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md, textAlign: 'left' }}>Time</Text>
              <Text style={{ fontFamily: FontFamily.medium, color: '#4E525E', fontSize: sizes.md, textAlign: 'left', marginTop: 2 }}>10:30 AM</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );


  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.main}>
        <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
        <CustomHeader
          backClickHide={true}
          buttonText={t('dashboard')}
          style={{ flexDirection: 'row' }}
          iconStyle={{ height: 28, width: 28, borderRadius: 50 }}
          icon={LOCAL_IMAGES.user}
          searchIcon={true}
          onPressUser={() => { openMenu() }}
        />

        <ScrollView showsVerticalScrollIndicator={false}>

          {dashboardCounterLoader == true ?
            <>
              <View style={{ paddingHorizontal: 14, flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                <SkeletonLoader width={"48%"} height={90} borderRadius={10} style={{ marginBottom: 6, marginRight: 10 }} />
                <SkeletonLoader width={"48%"} height={90} borderRadius={10} style={{ marginBottom: 6, marginRight: 10 }} />
              </View>
              <View style={{ paddingHorizontal: 14, flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                <SkeletonLoader width={"48%"} height={90} borderRadius={10} style={{ marginBottom: 6, marginRight: 10 }} />
                <SkeletonLoader width={"48%"} height={90} borderRadius={10} style={{ marginBottom: 6, marginRight: 10 }} />
              </View>
              <View style={{ paddingHorizontal: 14, flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                <SkeletonLoader width={"100%"} height={90} borderRadius={10} style={{ marginBottom: 6, marginRight: 10 }} />
              </View>
            </>
            : <>
              <View style={{ paddingHorizontal: 14, flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                <View style={[styles.cardMain, { backgroundColor: '#FFE0BB' }]}>
                  <View style={styles.cardSection1}>
                    <View style={styles.cardIconContainer}>
                      {/* <Image source={LOCAL_ICONS.employees} style={{ height: 19, width: 26, tintColor: '#DF8C29' }} /> */}
                      <Totalemp height={18.5} width={24.5} />
                    </View>
                    <View><Text style={styles.cardBigLabel}>{dashboardCounterdata?.approved_emp_count ? (dashboardCounterdata?.approved_emp_count + dashboardCounterdata?.pending_emp_count + dashboardCounterdata?.inactive_emp_count) : 0}</Text></View>
                  </View>
                  <View>
                    <Text style={styles.cardLabel}>Total Employees</Text>
                  </View>
                  <View style={[styles.backgroundImage]}>
                    <Totalemp height={40} width={47} />
                  </View>
                </View>


                <View style={[styles.cardMain, { backgroundColor: '#C9EEFC' }]}>
                  <View style={styles.cardSection1}>
                    <View style={styles.cardIconContainer}>
                      <LeaveApplicationIcon height={26} width={28} />
                      {/* <Image source={LOCAL_ICONS.employees} style={{ height: 19, width: 26, tintColor: '#005495' }} /> */}
                    </View>
                    <View><Text style={styles.cardBigLabel}>{dashboardCounterdata?.approved_emp_count ? dashboardCounterdata?.approved_emp_count : 0}</Text></View>
                  </View>
                  <View>
                    <Text style={styles.cardLabel}>Leave Application</Text>
                  </View>
                  <View style={[styles.backgroundImage, { right: 20, bottom: 25 }]}>
                    <LeaveApplicationIcon height={53} width={64} />
                  </View>
                </View>

              </View>

              <View style={{ paddingHorizontal: 14, flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                <View style={[styles.cardMain, { backgroundColor: '#FCE8E9' }]}>
                  <View style={styles.cardSection1}>
                    <View style={styles.cardIconContainer}>
                      <NewEmp height={24} width={24} />
                    </View>
                    <View><Text style={styles.cardBigLabel}>{newJoinemp ? newJoinemp : 0}</Text></View>
                  </View>
                  <View>
                    <Text style={styles.cardLabel}>Newly Joined Employees</Text>
                  </View>
                  <View style={[styles.backgroundImage, { right: 6, bottom: 8 }]}>
                    <NewEmp height={38} width={43} />
                  </View>
                </View>

                <View style={[styles.cardMain, { backgroundColor: '#DBDAFE' }]}>
                  <View style={styles.cardSection1}>
                    <View style={styles.cardIconContainer}>
                      <NoticePeriod height={24} width={24} />
                    </View>
                    <View><Text style={styles.cardBigLabel}>{dashboardCounterdata?.pending_emp_count ? dashboardCounterdata?.pending_emp_count : 0}</Text></View>
                  </View>
                  <View>
                    <Text style={styles.cardLabel}>Joining Approval</Text>
                  </View>
                  <View style={[styles.backgroundImage, { right: 7, bottom: 12 }]}>
                    <NoticePeriod height={40} width={47} />
                  </View>
                </View>
              </View>

              <View style={{ paddingHorizontal: 14, flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>

                <View style={{
                  backgroundColor: '#FFFFFF', // Background color for the rectangle
                  width: '100%',
                  borderRadius: 8,
                  padding: 12,
                  paddingVertical: 20,
                  borderWidth: 1,
                  borderColor: '#FFAC10',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center'
                }}>

                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontFamily: FontFamily.regular, color: colors.green, fontSize: sizes.h6 - 1 }}>Current Plan</Text>
                    <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.md, marginTop: 6 }}>{dashboardCounterdata?.plan_name}</Text>
                  </View>
                  <View style={{ width: 1.2, height: 42, backgroundColor: '#E7EAF1' }}></View>
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontFamily: FontFamily.regular, color: colors.yellow, fontSize: sizes.h6 - 1 }}>Credit Balance</Text>
                    <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.md, marginTop: 6 }}>{dashboardCounterdata?.credit_stat}</Text>
                  </View>

                </View>
              </View>

            </>}


          <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 30 }}>

            {announcementLoader == true ? <>

              <SkeletonLoader width={'85%'} height={60} borderRadius={10} style={{ marginBottom: 6, marginRight: 10 }} />
              <FlatList
                showsVerticalScrollIndicator={false}
                data={[1, 1, 1]}
                renderItem={verticalPlaceholderRenderList}
                contentContainerStyle={{ marginBottom: 0 }}
              />

            </> :

              <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, }}>
                  <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6 }}>Announcement</Text>
                  <TouchableOpacity onPress={() => { props.navigation.navigate('AnnouncementListPublic') }} style={{ borderWidth: 1, borderColor: '#007AFF', borderRadius: 4, padding: 5, paddingHorizontal: 8 }}>
                    <Text style={{ color: '#007AFF', fontFamily: FontFamily.medium, fontSize: sizes.md }}>View All</Text>
                  </TouchableOpacity>
                </View>

                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={announcementData}
                  renderItem={announcementListRender}
                  contentContainerStyle={{ marginBottom: 0 }}
                />
              </>

            }

          </View>

          <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 30 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, }}>
              <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6 }}>Notice</Text>
              <TouchableOpacity onPress={() => { props.navigation.navigate('NoticeMaster') }} style={{ borderWidth: 1, borderColor: '#007AFF', borderRadius: 4, padding: 5, paddingHorizontal: 8 }}>
                <Text style={{ color: '#007AFF', fontFamily: FontFamily.medium, fontSize: sizes.md }}>View All</Text>
              </TouchableOpacity>
            </View>

            {noticeLoader == true ?
              <FlatList
                showsVerticalScrollIndicator={false}
                data={[1, 1, 1]}
                renderItem={verticalPlaceholderRenderList}
                contentContainerStyle={{ marginBottom: 0 }}
              /> :
              <FlatList
                showsVerticalScrollIndicator={false}
                data={noticeData}
                renderItem={noticeListRender}
                contentContainerStyle={{ marginBottom: 0 }}
              />
            }

          </View>

          <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 30 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, }}>
              <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6 }}>Upcoming Birthday</Text>
              {/* <TouchableOpacity style={{ borderWidth: 1, borderColor: '#007AFF', borderRadius: 4, padding: 5, paddingHorizontal: 8 }}><Text style={{ color: '#007AFF', fontFamily: FontFamily.medium, fontSize: sizes.md }}>View All</Text></TouchableOpacity> */}
            </View>
            <View style={{ flex: 1 }}>
              {birthdayLoader == true ?
                <FlatList
                  data={[1, 1, 1]}
                  renderItem={horizontalPlaceholderRenderList} // Adjust rendering logic as per your data structure
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
                :
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={birthdayList}
                  renderItem={birthDayListRender}
                  contentContainerStyle={{ marginBottom: 0 }}
                />

              }
            </View>
          </View>

          <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, }}>
              <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6, lineHeight: 15 }}>FNF Pending</Text>
              {/* <TouchableOpacity style={{ borderWidth: 1, borderColor: '#007AFF', borderRadius: 4, padding: 5, paddingHorizontal: 8 }}><Text style={{ color: '#007AFF', fontFamily: FontFamily.medium, fontSize: sizes.md }}>View All</Text></TouchableOpacity> */}
            </View>



            {dashboardCounterLoader == true ?
              <FlatList
                showsVerticalScrollIndicator={false}
                data={[1, 1, 1]}
                renderItem={verticalPlaceholderRenderList}
                contentContainerStyle={{ marginBottom: 0 }}
              /> :
              <FlatList
                showsVerticalScrollIndicator={false}
                data={dashboardCounterdata?.inactive_employees}
                renderItem={FNFRender}
                contentContainerStyle={{ marginBottom: 0 }}
              />
            }

          </View>

          {/* <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 30 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, }}>
              <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6, lineHeight: 21 }}>Employee On Leave</Text>
              <TouchableOpacity style={{ borderWidth: 1, borderColor: '#007AFF', borderRadius: 4, padding: 5, paddingHorizontal: 8 }}><Text style={{ color: '#007AFF', fontFamily: FontFamily.medium, fontSize: sizes.md }}>View All</Text></TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={sampleData}
                renderItem={birthDayListRender}
                contentContainerStyle={{ marginBottom: 30 }}
              />
            </View>
          </View> */}

          <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, }}>
              <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6, lineHeight: 15 }}>Work Anniversary</Text>
              {/* <TouchableOpacity style={{ borderWidth: 1, borderColor: '#007AFF', borderRadius: 4, padding: 5, paddingHorizontal: 8 }}><Text style={{ color: '#007AFF', fontFamily: FontFamily.medium, fontSize: sizes.md }}>View All</Text></TouchableOpacity> */}
            </View>



            {anniversaryloader == true ?
              <FlatList
                showsVerticalScrollIndicator={false}
                data={[1, 1, 1]}
                renderItem={verticalPlaceholderRenderList}
                contentContainerStyle={{ marginBottom: 0 }}
              /> :
              <FlatList
                showsVerticalScrollIndicator={false}
                data={anniversarydata}
                renderItem={anniversaryListRender}
                contentContainerStyle={{ marginBottom: 0 }}
              />
            }

          </View>

          <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, }}>
              <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6, lineHeight: 15 }}>Upcoming Appraisal</Text>
              {/* <TouchableOpacity style={{ borderWidth: 1, borderColor: '#007AFF', borderRadius: 4, padding: 5, paddingHorizontal: 8 }}><Text style={{ color: '#007AFF', fontFamily: FontFamily.medium, fontSize: sizes.md }}>View All</Text></TouchableOpacity> */}
            </View>

            {anniversaryloader == true ?
              <FlatList
                showsVerticalScrollIndicator={false}
                data={[1, 1, 1]}
                renderItem={verticalPlaceholderRenderList}
                contentContainerStyle={{ marginBottom: 20 }}
              /> :
              <FlatList
                showsVerticalScrollIndicator={false}
                data={anniversarydata}
                renderItem={anniversaryListRender}
                contentContainerStyle={{ marginBottom: 20 }}
              />
            }

          </View>

          {/* <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, }}>
              <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6 }}>Upcoming Holiday</Text>
              <TouchableOpacity style={{ borderWidth: 1, borderColor: '#007AFF', borderRadius: 4, padding: 5, paddingHorizontal: 8 }}><Text style={{ color: '#007AFF', fontFamily: FontFamily.medium, fontSize: sizes.md }}>View All</Text></TouchableOpacity>
            </View>

            <FlatList
              showsVerticalScrollIndicator={false}
              data={sampleData}
              renderItem={ListRender}
              contentContainerStyle={{ marginBottom: 0 }}
            />

          </View> */}
          {/* 
          <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 30 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, }}>
              <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6, lineHeight: 21 }}>Recruitment Progress</Text>
              <TouchableOpacity style={{ borderWidth: 1, borderColor: '#007AFF', borderRadius: 4, padding: 5, paddingHorizontal: 8 }}><Text style={{ color: '#007AFF', fontFamily: FontFamily.medium, fontSize: sizes.md }}>View All</Text></TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={sampleData}
                renderItem={recruitmentListRender}
                contentContainerStyle={{ marginBottom: 30 }}
              />
            </View>
          </View> */}

        </ScrollView>
      </View>

      <SideMenu visible={menuVisible} onClose={closeMenu} />
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
  cardIconContainer: { height: 45, width: 45, borderRadius: 50, backgroundColor: '#F9F5F5', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  cardBigLabel: { fontFamily: FontFamily.semibold, fontSize: sizes.h4, color: '#000000', marginLeft: 10 },
  cardLabel: { fontFamily: FontFamily.semibold, fontSize: sizes.md, color: '#2B2B2B', marginTop: 15, textAlign: 'left', lineHeight: 15 },
  backgroundImage: {
    width: 40, // Adjust as needed
    height: 30, // Adjust as needed
    position: 'absolute',
    bottom: 9,
    right: 8,
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
  }

});
export default Dashboard;