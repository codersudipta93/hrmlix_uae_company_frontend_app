
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


const Dashboard = props => {
  const isFocused = useIsFocused();
  const route = useRoute();
  const dispatch = useDispatch();

  const { userDetails, token } = useSelector(state => state.project);

  const { t, i18n } = useTranslation();

  const sampleData = [1, 1, 1];
  const [menuVisible, setMenuVisible] = useState(false);

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
      props.navigation.navigate('FnfReport') 
    }
  }, [isFocused]);


  useEffect(() => {
    console.log(userDetails)
  }, []);


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
        <Text style={{ fontFamily: FontFamily.medium, color: colors.white, fontSize: sizes.h6 }}>02</Text>
        <Text style={{ fontFamily: FontFamily.medium, color: colors.white, fontSize: sizes.md, marginTop: 1 }}>Jun</Text>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 14, paddingRight: 50 }}>
        <Text style={{ fontFamily: FontFamily.regular, color: '#4E525E', fontSize: sizes.md + 1, textAlign: 'left' }}>Ivan Infotech has announce 5% bonus to the Employees.</Text>
      </View>
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


  const upcommingAppraisalRender = ({ index, item }) => (
    <View style={[styles.listCard, { paddingVertical: 18, marginBottom: 0, borderRadius: 0, borderTopRightRadius: index == 0 ? 8 : 0, borderTopLeftRadius: index == 0 ? 8 : 0, borderBottomLeftRadius: sampleData.length - 1 == index ? 8 : 0, borderBottomRightRadius: sampleData.length - 1 == index ? 8 : 0 }]}>
      <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', height: 35, width: 35, backgroundColor: '#007AFF', borderRadius: 50 }}>
          <Image source={LOCAL_IMAGES.user} style={{ height: '100%', width: '100%', borderRadius: 50, objectFit: 'cover' }} />
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


  const birthDayListRender = ({ index, item }) => (
    <View style={[styles.card, { width: 210 }]}>
      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', height: 48, width: 48, backgroundColor: '#007AFF', borderRadius: 50 }}>
          <Image source={LOCAL_IMAGES.user} style={{ height: '100%', width: '100%', borderRadius: 50, objectFit: 'cover' }} />
        </View>
        <View style={{ paddingLeft: 12 }}>
          <Text style={{ fontFamily: FontFamily.medium, color: '#4E525E', fontSize: sizes.h6, textAlign: 'left' }}>Brent Farrell DVM</Text>
          <Text style={{ fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md - 1, textAlign: 'left', marginTop: 4 }}>UI/UX Designer</Text>
          <Text style={{ fontFamily: FontFamily.regular, color: '#60B057', fontSize: sizes.md, textAlign: 'left', marginTop: 4 }}>Today</Text>
        </View>
      </View>
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
          <View style={{ paddingHorizontal: 14, flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>

            <View style={[styles.cardMain, { backgroundColor: '#FFE0BB' }]}>
              <View style={styles.cardSection1}>
                <View style={styles.cardIconContainer}>
                  {/* <Image source={LOCAL_ICONS.employees} style={{ height: 19, width: 26, tintColor: '#DF8C29' }} /> */}
                  <Totalemp height={18.5} width={24.5} />
                </View>
                <View><Text style={styles.cardBigLabel}>560</Text></View>
              </View>
              <View>
                <Text style={styles.cardLabel}>Total Employees</Text>
              </View>
              <View style={[styles.backgroundImage]}>
                <Totalemp height={40} width={47} />
              </View>

              {/* <Image source={LOCAL_ICONS.employees} style={[styles.backgroundImage, { tintColor: '#DF8C29', }]} /> */}
            </View>

            <View style={[styles.cardMain, { backgroundColor: '#C9EEFC' }]}>
              <View style={styles.cardSection1}>
                <View style={styles.cardIconContainer}>
                  <LeaveApplicationIcon height={26} width={28} />
                  {/* <Image source={LOCAL_ICONS.employees} style={{ height: 19, width: 26, tintColor: '#005495' }} /> */}
                </View>
                <View><Text style={styles.cardBigLabel}>03</Text></View>
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
                <View><Text style={styles.cardBigLabel}>18</Text></View>
              </View>
              <View>
                <Text style={styles.cardLabel}>New Employees</Text>
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
                <View><Text style={styles.cardBigLabel}>05</Text></View>
              </View>
              <View>
                <Text style={styles.cardLabel}>On Notice Period</Text>
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
                <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.md, marginTop: 6 }}>Plan 1</Text>
              </View>
              <View style={{ width: 1.2, height: 42, backgroundColor: '#E7EAF1' }}></View>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: FontFamily.regular, color: colors.yellow, fontSize: sizes.h6 - 1 }}>Credit Balance</Text>
                <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.md, marginTop: 6 }}>6002</Text>
              </View>

            </View>
          </View>

          <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 30 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, }}>
              <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6 }}>Announcement</Text>
              <TouchableOpacity style={{ borderWidth: 1, borderColor: '#007AFF', borderRadius: 4, padding: 5, paddingHorizontal: 8 }}><Text style={{ color: '#007AFF', fontFamily: FontFamily.medium, fontSize: sizes.md }}>View All</Text></TouchableOpacity>
            </View>

            <FlatList
              showsVerticalScrollIndicator={false}
              data={sampleData}
              renderItem={announcementListRender}
              contentContainerStyle={{ marginBottom: 0 }}
            />

          </View>

          <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 30 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, }}>
              <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6 }}>Upcoming Birthday</Text>
              <TouchableOpacity style={{ borderWidth: 1, borderColor: '#007AFF', borderRadius: 4, padding: 5, paddingHorizontal: 8 }}><Text style={{ color: '#007AFF', fontFamily: FontFamily.medium, fontSize: sizes.md }}>View All</Text></TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={sampleData}
                renderItem={birthDayListRender}
                contentContainerStyle={{ marginBottom: 0 }}
              />
            </View>
          </View>

          <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 30 }}>
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
          </View>

          <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, }}>
              <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6 }}>Work Anniversary</Text>
              <TouchableOpacity style={{ borderWidth: 1, borderColor: '#007AFF', borderRadius: 4, padding: 5, paddingHorizontal: 8 }}><Text style={{ color: '#007AFF', fontFamily: FontFamily.medium, fontSize: sizes.md }}>View All</Text></TouchableOpacity>
            </View>

            <FlatList
              showsVerticalScrollIndicator={false}
              data={sampleData}
              renderItem={ListRender}
              contentContainerStyle={{ marginBottom: 30 }}
            />

          </View>

          <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, }}>
              <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6 }}>Upcoming Appraisal</Text>
              <TouchableOpacity style={{ borderWidth: 1, borderColor: '#007AFF', borderRadius: 4, padding: 5, paddingHorizontal: 8 }}><Text style={{ color: '#007AFF', fontFamily: FontFamily.medium, fontSize: sizes.md }}>View All</Text></TouchableOpacity>
            </View>

            <FlatList
              showsVerticalScrollIndicator={false}
              data={sampleData}
              renderItem={upcommingAppraisalRender}
              contentContainerStyle={{ marginBottom: 30 }}
            />

          </View>

          <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between' }}>
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

          </View>

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
          </View>

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
  cardLabel: { fontFamily: FontFamily.semibold, fontSize: sizes.md, color: '#2B2B2B', marginTop: 15, textAlign: 'left' },
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