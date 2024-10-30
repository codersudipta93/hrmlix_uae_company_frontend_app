
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
import { _setreffeshStatus, _setmasterData, _setUserData, _setToken } from '../../Store/Reducers/ProjectReducer';
import FloatingDropdown from '../../component/FloatingDropdown';
import Clipboard from '@react-native-clipboard/clipboard';

import Payrollmenu from '../../assets/icons/Payrollmenu';
import DeleteAccount from '../../assets/icons/DeleteAccount';
import ChangePassword from '../../assets/icons/ChangePassword';
import SettingsMenu from '../../assets/icons/SettingsMenu';
import ValutMenu from '../../assets/icons/ValutMenu';
import BillingMenu from '../../assets/icons/BillingMenu';
import AnnouncementMenu from '../../assets/icons/AnnouncementMenu';
import SallaryRevisionMenu from '../../assets/icons/SallaryRevisionMenu';
import LeaveMenu from '../../assets/icons/LeaveMenu';
import ApprovalMenu from '../../assets/icons/ApprovalMenu';
import LogoutMenu from '../../assets/icons/LogoutMenu';

const MenuPage = props => {
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
      console.log(userDetails);
      getMasterData()
    }
  }, [isFocused]);



  const _logout = () => {
    if (token) {
      Acknoledge_logout()
    } else {
      props.navigation.navigate('Signin')
    }
  }

  const Acknoledge_logout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout from this app?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'YES', onPress: () => {
          dispatch(_setUserData(""));
          dispatch(_setToken(""));
          deleteData();

          HelperFunctions.showToastMsg('Successfully logout');
          props.navigation.navigate('Signin');
        }
      },
    ]);
    return true;
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



  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.main}>
        <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
       <CustomHeader hideUserIcon={true}
          buttonText={t('Menu')}
          style={{ flexDirection: 'row' }}
          iconStyle={{ height: 30, width: 30, borderRadius: 50 }}
          icon={{ uri: companyData?.com_logo ? companyData?.com_logo : AllSourcePath?.API_IMG_URL_DEV + 'user.jpg' }}
          searchIcon={false}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 12 }}>
            <Pressable 
            onPress={() => {
              props.navigation.navigate("CompanyProfileDashboard")
            }}
            style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 8 }]}>
              <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: 35, width: 35, backgroundColor: '#007AFF', borderRadius: 50 }}>
                  <Image source={{ uri: companyData?.com_logo ? companyData?.com_logo : AllSourcePath?.API_IMG_URL_DEV + 'user.jpg' }} style={{ height: '100%', width: '100%', borderRadius: 50, objectFit: 'cover' }} />
                </View>
                <View style={{ paddingLeft: 12 }}>
                  <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6, textAlign: 'left' }}>{companyData?.establishment_name ? companyData?.establishment_name : ""}</Text>
                  <Text style={{ fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md, textAlign: 'left', marginTop: 6 }}>Corporate ID - {companyData?.corporate_id}</Text>
                </View>
              </View>
              <View style={{ paddingLeft: 12, paddingRight: 8, width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                <IonIcon
                  name="chevron-forward-outline"
                  size={16}
                  color={'#A0A8AD'}
                  
                />
              </View>
            </Pressable>

          </View>

          <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 12, marginBottom: 12 }}>

            <Text style={{ fontFamily: FontFamily.medium, color: '#989898', fontSize: sizes.h6 - 1, textAlign: 'left', marginVertical: 16 }}>General Settings</Text>

            <Pressable
              onPress={() => {
                props.navigation.navigate('PayrollMaster')
              }}
              style={[styles.listCard, { paddingVertical: 12, marginBottom: 0, borderRadius: 8, }]}
            >
              <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: 30, width: 30, }}>
                  {/* <Image source={LOCAL_ICONS.payroll} style={{ height: '100%', width: '100%', objectFit: 'contain' }} /> */}
                  <Payrollmenu />
                </View>
                <View style={{ paddingLeft: 8 }}>
                  <Text style={{ fontFamily: FontFamily.medium, color: '#191B1F', fontSize: sizes.h6, textAlign: 'left' }}>Payroll</Text>
                </View>
              </View>
              <View style={{ paddingLeft: 12, paddingRight: 8, width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                <IonIcon
                  name="chevron-forward-outline"
                  size={16}
                  color={'#A0A8AD'}
                />
              </View>
            </Pressable>


            <Pressable
              onPress={() => {
                props.navigation.navigate('SallaryRevisionDashboard')
              }}
              style={[styles.listCard, { paddingVertical: 12, marginBottom: 0, borderRadius: 8, marginTop: 8 }]}>
              <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: 30, width: 30, }}>
                  {/* <Image source={LOCAL_ICONS.payroll} style={{ height: '100%', width: '100%', objectFit: 'contain' }} /> */}
                  <SallaryRevisionMenu />
                </View>
                <View style={{ paddingLeft: 8 }}>
                  <Text style={{ fontFamily: FontFamily.medium, color: '#191B1F', fontSize: sizes.h6, textAlign: 'left' }}>Salary Revision</Text>
                </View>
              </View>
              <View style={{ paddingLeft: 12, paddingRight: 8, width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                <IonIcon
                  name="chevron-forward-outline"
                  size={16}
                  color={'#A0A8AD'}
                />
              </View>
            </Pressable>

            <Pressable style={[styles.listCard, { paddingVertical: 12, marginBottom: 0, borderRadius: 8, marginTop: 8 }]}>
              <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: 30, width: 30, }}>
                  {/* <Image source={LOCAL_ICONS.payroll} style={{ height: '100%', width: '100%', objectFit: 'contain' }} /> */}
                  <LeaveMenu />
                </View>
                <View style={{ paddingLeft: 8 }}>
                  <Text style={{ fontFamily: FontFamily.medium, color: '#191B1F', fontSize: sizes.h6, textAlign: 'left' }}>Leave</Text>
                </View>
              </View>
              <View style={{ paddingLeft: 12, paddingRight: 8, width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                <IonIcon
                  name="chevron-forward-outline"
                  size={16}
                  color={'#A0A8AD'}
                  onPress={() => {
                    // props.navigation.navigate('EmployeeDashboard', { empID: item?._id })

                  }}
                />
              </View>
            </Pressable>

            <Pressable style={[styles.listCard, { paddingVertical: 12, marginBottom: 0, borderRadius: 8, marginTop: 8 }]}>
              <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: 30, width: 30, }}>
                  {/* <Image source={LOCAL_ICONS.payroll} style={{ height: '100%', width: '100%', objectFit: 'contain' }} /> */}
                  <ApprovalMenu />
                </View>
                <View style={{ paddingLeft: 8 }}>
                  <Text style={{ fontFamily: FontFamily.medium, color: '#191B1F', fontSize: sizes.h6, textAlign: 'left' }}>Approval</Text>
                </View>
              </View>
              <View style={{ paddingLeft: 12, paddingRight: 8, width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                <IonIcon
                  name="chevron-forward-outline"
                  size={16}
                  color={'#A0A8AD'}
                  onPress={() => {
                    // props.navigation.navigate('EmployeeDashboard', { empID: item?._id })

                  }}
                />
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                props.navigation.navigate('AnnouncementList')
              }}
              style={[styles.listCard, { paddingVertical: 12, marginBottom: 0, borderRadius: 8, marginTop: 8 }]}>
              <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: 30, width: 30, }}>
                  {/* <Image source={LOCAL_ICONS.payroll} style={{ height: '100%', width: '100%', objectFit: 'contain' }} /> */}
                  <AnnouncementMenu />
                </View>
                <View style={{ paddingLeft: 8 }}>
                  <Text style={{ fontFamily: FontFamily.medium, color: '#191B1F', fontSize: sizes.h6, textAlign: 'left' }}>Announcement</Text>
                </View>
              </View>
              <View style={{ paddingLeft: 12, paddingRight: 8, width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                <IonIcon
                  name="chevron-forward-outline"
                  size={16}
                  color={'#A0A8AD'}

                />
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                props.navigation.navigate('BillingList')
              }}
              style={[styles.listCard, { paddingVertical: 12, marginBottom: 0, borderRadius: 8, marginTop: 8 }]}>
              <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: 30, width: 30, }}>
                  {/* <Image source={LOCAL_ICONS.payroll} style={{ height: '100%', width: '100%', objectFit: 'contain' }} /> */}
                  <BillingMenu />
                </View>
                <View style={{ paddingLeft: 8 }}>
                  <Text style={{ fontFamily: FontFamily.medium, color: '#191B1F', fontSize: sizes.h6, textAlign: 'left' }}>Billing</Text>
                </View>
              </View>
              <View style={{ paddingLeft: 12, paddingRight: 8, width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                <IonIcon
                  name="chevron-forward-outline"
                  size={16}
                  color={'#A0A8AD'}
                />
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                props.navigation.navigate('DocumentVault')
              }}
              style={[styles.listCard, { paddingVertical: 12, marginBottom: 0, borderRadius: 8, marginTop: 8 }]}
            >
              <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: 30, width: 30, }}>
                  {/* <Image source={LOCAL_ICONS.payroll} style={{ height: '100%', width: '100%', objectFit: 'contain' }} /> */}
                  <ValutMenu />
                </View>
                <View style={{ paddingLeft: 8 }}>
                  <Text style={{ fontFamily: FontFamily.medium, color: '#191B1F', fontSize: sizes.h6, textAlign: 'left' }}>Vault</Text>
                </View>
              </View>
              <View style={{ paddingLeft: 12, paddingRight: 8, width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                <IonIcon
                  name="chevron-forward-outline"
                  size={16}
                  color={'#A0A8AD'}
                />
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                props.navigation.navigate('CompanySettingsDashboard')
              }}
              style={[styles.listCard, { paddingVertical: 12, marginBottom: 0, borderRadius: 8, marginTop: 8 }]}
            >
              <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: 30, width: 30, }}>
                  {/* <Image source={LOCAL_ICONS.payroll} style={{ height: '100%', width: '100%', objectFit: 'contain' }} /> */}
                  <SettingsMenu />
                </View>
                <View style={{ paddingLeft: 8 }}>
                  <Text style={{ fontFamily: FontFamily.medium, color: '#191B1F', fontSize: sizes.h6, textAlign: 'left' }}>Settings</Text>
                </View>
              </View>
              <View style={{ paddingLeft: 12, paddingRight: 8, width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                <IonIcon
                  name="chevron-forward-outline"
                  size={16}
                  color={'#A0A8AD'}
                />
              </View>
            </Pressable>

            <Text style={{ fontFamily: FontFamily.medium, color: '#989898', fontSize: sizes.h6 - 1, textAlign: 'left', marginVertical: 16 }}>Account Related</Text>

            <View style={[styles.listCard, { paddingVertical: 12, marginBottom: 0, borderRadius: 8, marginTop: 8 }]}>
              <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: 30, width: 30, }}>
                  {/* <Image source={LOCAL_ICONS.payroll} style={{ height: '100%', width: '100%', objectFit: 'contain' }} /> */}
                  <ChangePassword />
                </View>
                <View style={{ paddingLeft: 8 }}>
                  <Text style={{ fontFamily: FontFamily.medium, color: '#191B1F', fontSize: sizes.h6, textAlign: 'left' }}>Change Password</Text>
                </View>
              </View>
              <View style={{ paddingLeft: 12, paddingRight: 8, width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                <IonIcon
                  name="chevron-forward-outline"
                  size={16}
                  color={'#A0A8AD'}
                  onPress={() => {
                    // props.navigation.navigate('EmployeeDashboard', { empID: item?._id })

                  }}
                />
              </View>
            </View>

            <View style={[styles.listCard, { paddingVertical: 12, marginBottom: 0, borderRadius: 8, marginTop: 8 }]}>
              <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: 30, width: 30, }}>
                  {/* <Image source={LOCAL_ICONS.payroll} style={{ height: '100%', width: '100%', objectFit: 'contain' }} /> */}
                  <DeleteAccount />
                </View>
                <View style={{ paddingLeft: 8 }}>
                  <Text style={{ fontFamily: FontFamily.medium, color: '#191B1F', fontSize: sizes.h6, textAlign: 'left' }}>Delete Account</Text>
                </View>
              </View>
              <View style={{ paddingLeft: 12, paddingRight: 8, width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                <IonIcon
                  name="chevron-forward-outline"
                  size={16}
                  color={'#A0A8AD'}
                  onPress={() => {
                    // props.navigation.navigate('EmployeeDashboard', { empID: item?._id })

                  }}
                />
              </View>
            </View>

            <Pressable onPress={() => { _logout() }} style={[styles.listCard, { paddingVertical: 12, marginBottom: 0, borderRadius: 8, marginTop: 14, backgroundColor: '#F0662E' }]}>
              <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: 30, width: 30, }}>
                  {/* <Image source={LOCAL_ICONS.payroll} style={{ height: '100%', width: '100%', objectFit: 'contain' }} /> */}
                  <LogoutMenu />
                </View>
                <View style={{ paddingLeft: 8 }}>
                  <Text style={{ fontFamily: FontFamily.medium, color: '#fff', fontSize: sizes.h6, textAlign: 'left' }}>Logout</Text>
                </View>
              </View>
              <View style={{ paddingLeft: 12, paddingRight: 8, width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
              </View>
            </Pressable>
          </View>
        </ScrollView>
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
export default MenuPage;