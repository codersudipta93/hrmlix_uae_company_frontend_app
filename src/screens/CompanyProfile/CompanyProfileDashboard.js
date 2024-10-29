
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
  Animated,
  I18nManager,
  ScrollView,
  ImageBackground,
  PermissionsAndroid
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
import { postApi, profilePhotoUpload } from '../../Service/service';
import { _setreffeshStatus } from '../../Store/Reducers/ProjectReducer';
import { getData, setData, deleteData } from '../../Service/localStorage';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from 'react-native/Libraries/NewAppScreen';
import CustomHeader from '../../component/Header';
import * as ImagePicker from "react-native-image-picker";
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useTranslation } from 'react-i18next'; //for translation service
import IonIcon from 'react-native-vector-icons/Ionicons';
import Delete from '../../assets/icons/Delete';
import Filter from '../../assets/icons/Filter';
import Action from '../../assets/icons/Action';
import MonthModal from '../../component/MonthModal';
import SkeletonLoader from '../../component/SkeletonLoader';
import EditIcon from '../../assets/icons/EditIcon';
import BootomSheet from '../../component/BootomSheet';

const CompanyProfileDashboard = props => {

  const isFocused = useIsFocused();
  const route = useRoute();
  const dispatch = useDispatch();
  const { userDetails, token, needRefresh } = useSelector(state => state.project);
  const { t, i18n } = useTranslation();
  const BackgroundImage = require('../../assets/imgs/bg1.png');
  const [companyData, setCompanyData] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [modalOpen, SetmodalOpen] = React.useState(false); // modal Open close

  const [uploadType, setUploadType] = React.useState('');

  const [animValue] = useState(new Animated.Value(1000)); // Start off-screen

  useEffect(() => {
    if (isFocused == true) {
      console.log(i18n.language);
      console.log(I18nManager.isRTL);
      showDetails()
    }
  }, [isFocused]);


  const openUploadModal = (type) => {
    setUploadType(type);
    if (modalOpen) {
      // Hide modal
      Animated.timing(animValue, {
        toValue: 1000,
        duration: 300,
        useNativeDriver: true,
      }).start(() => SetmodalOpen(false));
    } else {
      // Show modal
      SetmodalOpen(true);
      Animated.timing(animValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }


  async function uploadSource(mediaType) {
    //alert("await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA")
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
      quality: 1
    }
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);

    if (granted === PermissionsAndroid.RESULTS.GRANTED || Platform.OS === 'ios') {
      mediaType == 'camera' ? ImagePicker.launchCamera(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          SetmodalOpen(false);
          console.log(response?.assets[0])
          // uploadType == 'userimage' ? setimageLoader(true) : null
          savePhotoApi(response?.assets[0]);
        }
      },
      ) :
        ImagePicker.launchImageLibrary(options, (response) => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else {
            SetmodalOpen(false);
            //uploadType == 'userimage' ? setimageLoader(true) : null
            savePhotoApi(response?.assets[0]);
          }
        },
        )
    } else {
      HelperFunctions.showToastMsg("Permission denied")
    }
  }

  const savePhotoApi = (response) => {
    //alert(response)
    let data = {
      uri: response?.uri,
      type: response?.type,
      name: response?.fileName,
    }
    //"uploadType" check it is cover photo or profile picture

    profilePhotoUpload("company/update-company-details", data, token)
      .then((resp) => {
        console.log(resp)
        if (resp.status == "success") {
          HelperFunctions.showToastMsg(resp.message)
          showDetails();

        } else {
          HelperFunctions.showToastMsg(resp.message)
        }
      })
      .catch((error) => {

        savePhotoApi(response);
        console.log('try again...', error)
        //HelperFunctions.showToastMsg('Sorry! Something went to wrong');
      })
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



  const showDetails = (() => {
    setIsLoading(true)
    postApi("company/get-company-data", {}, token)
      .then((resp) => {
        // console.log(resp?.attendance_summ)
        if (resp?.status == 'success') {
          setCompanyData(resp?.company_det);
          setIsLoading(false);
          
        } else {
          HelperFunctions.showToastMsg(resp.message);
          setIsLoading(false)
        }
      }).catch((err) => {
        console.log(err);
        setIsLoading(false)
        HelperFunctions.showToastMsg(err.message);
      })
  });


  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.main}>
        <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
       <CustomHeader
          buttonText={t('Company Profile')}
          style={{ flexDirection: 'row' }}
          iconStyle={{ height: 30, width: 30, borderRadius: 50 }}
          icon={LOCAL_IMAGES.user}
          searchIcon={false}
          hideUserIcon={true}
          buttonTextStyle={{lineHeight: 23 }}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ backgroundColor: "#1E2538", paddingHorizontal: 12, width: '100%', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
            <View style={styles.Cardcontainer}>
              <Pressable style={{ position: 'relative' }} >
                <Image
                  style={styles.user} 
                  source={{ uri: companyData?.com_logo ? companyData?.com_logo : AllSourcePath?.API_IMG_URL_DEV + 'user.jpg' }}
                />
                <Pressable onPress={() => { openUploadModal('userimage') }} style={styles.editcontainer}>
                  <EditIcon />
                </Pressable>
                {isLoading ?
                  <ActivityIndicator size="small" color={colors.primary} style={{ position: 'absolute', top: 22, left: 20 }} />
                  : null}
              </Pressable>
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.text}>{companyData?.establishment_name}</Text>
                <Text style={styles.subtext}>{companyData?.corporate_id ? "ID: " + companyData?.corporate_id  : ""}</Text>
              </View>

            </View>
          </View>

          <View style={{ marginTop: 18, paddingHorizontal: 12 }}>
            <Pressable onPress={() => { props.navigation.navigate('ProfileAndPartnerdetails') }} style={[styles.cardContainer, { backgroundColor: '#C9EEFC' }]}>
              <View style={[styles.leftSection, {}]}>
                <ImageBackground source={LOCAL_IMAGES.attendanceCardBG1} style={[styles.background, { width: 75, height: 80 }]}>
                  <View style={styles.container}>
                    <Image source={LOCAL_ICONS.arrow} style={{ height: 28, width: 28, objectFit: 'contain' }} />
                  </View>
                </ImageBackground>
              </View>
              <View style={styles.rightSection}>
                <Text style={styles.cardText}>Profile & Partner Details</Text>
              </View>
            </Pressable>

            <Pressable onPress={() => { props.navigation.navigate('EstablishmentDetails') }} style={[styles.cardContainer, { backgroundColor: '#FCE8E9' }]}>
              <View style={[styles.leftSection, {}]}>
                <ImageBackground source={LOCAL_IMAGES.attendanceCardBG2} style={[styles.background, { width: 75, height: 80 }]}>
                  <View style={styles.container}>
                    <Image source={LOCAL_ICONS.arrow} style={{ height: 28, width: 28, objectFit: 'contain' }} />
                  </View>
                </ImageBackground>
              </View>
              <View style={styles.rightSection}>
                <Text style={styles.cardText}>Establishment Details</Text>
              </View>
            </Pressable> 

            <Pressable onPress={() => { props.navigation.navigate('RegisteredOfficeAddress') }} style={[styles.cardContainer, { backgroundColor: '#DBDAFE' }]}>
              <View style={[styles.leftSection, {}]}>
                <ImageBackground source={LOCAL_IMAGES.attendanceCardBG3} style={[styles.background, { width: 75, height: 80 }]}>
                  <View style={styles.container}>
                    <Image source={LOCAL_ICONS.arrow} style={{ height: 28, width: 28, objectFit: 'contain' }} />
                  </View>
                </ImageBackground>
              </View>
              <View style={styles.rightSection}>
                <Text style={styles.cardText}>Registered Office Address</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => { props.navigation.navigate('CommunicationAddress') }} style={[styles.cardContainer, { backgroundColor: '#FCE8E9' }]}>
              <View style={[styles.leftSection, {}]}>
                <ImageBackground source={LOCAL_IMAGES.attendanceCardBG2} style={[styles.background, { width: 75, height: 80 }]}>
                  <View style={styles.container}>
                    <Image source={LOCAL_ICONS.arrow} style={{ height: 28, width: 28, objectFit: 'contain' }} />
                  </View>
                </ImageBackground>
              </View>
              <View style={styles.rightSection}>
                <Text style={styles.cardText}>Communication Office Address</Text>
              </View>
            </Pressable> 

            <Pressable onPress={() => { props.navigation.navigate('CompanyBranch') }} style={[styles.cardContainer, { backgroundColor: '#DBDAFE' }]}>
              <View style={[styles.leftSection, {}]}>
                <ImageBackground source={LOCAL_IMAGES.attendanceCardBG3} style={[styles.background, { width: 75, height: 80 }]}>
                  <View style={styles.container}>
                    <Image source={LOCAL_ICONS.arrow} style={{ height: 28, width: 28, objectFit: 'contain' }} />
                  </View>
                </ImageBackground>
              </View>
              <View style={styles.rightSection}>
                <Text style={styles.cardText}>Company & Branch Details</Text>
              </View>
            </Pressable>

            <Pressable onPress={() => { props.navigation.navigate('PrefferanceSettings') }} style={[styles.cardContainer, { backgroundColor: '#C9EEFC' }]}>
              <View style={[styles.leftSection, {}]}>
                <ImageBackground source={LOCAL_IMAGES.attendanceCardBG1} style={[styles.background, { width: 75, height: 80 }]}>
                  <View style={styles.container}>
                    <Image source={LOCAL_ICONS.arrow} style={{ height: 28, width: 28, objectFit: 'contain' }} />
                  </View>
                </ImageBackground>
              </View>
              <View style={styles.rightSection}>
                <Text style={styles.cardText}>Preference Settings</Text>
              </View>
            </Pressable>

          </View>
        </ScrollView>

        {/* <ModalBottom
        modalHeaderText="Add your profie picture"
        modalVisible={modalOpen}
        modalCloseAction={() => SetmodalOpen(false)}
        modalHeight={Dimensions.get('window').height < 700 ? "25%" : "20%"}
      >
        <View style={{ marginTop: 15 }}>
          <Pressable style={styles.actionSheetContentWrapper} onPress={() => uploadSource("camera")}>
            <Image source={LOCAL_ICONS.camera} style={styles.uploadSourceIcon} />
            <Text style={styles.uploadSourceText}>Take a photo</Text>
          </Pressable>
          <Pressable style={styles.actionSheetContentWrapper} onPress={() => uploadSource("gallery")}>
            <Image source={LOCAL_ICONS.gallery} style={styles.uploadSourceIcon} />
            <Text style={styles.uploadSourceText}>Select from gallery</Text>
          </Pressable>
        </View>
      </ModalBottom> */}

        <BootomSheet
          toggleModal={openUploadModal}
          isModalVisible={modalOpen}
          animValue={animValue}
          modalContainerStyle={{
            backgroundColor: 'white',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        >

          <View style={{ marginTop: 15 }}>
            <Pressable style={styles.actionSheetContentWrapper} onPress={() => uploadSource("camera")}>
              <Image source={LOCAL_ICONS.camera} style={styles.uploadSourceIcon} />
              <Text style={styles.uploadSourceText}>Take a photo</Text>
            </Pressable>
            <Pressable style={styles.actionSheetContentWrapper} onPress={() => uploadSource("gallery")}>
              <Image source={LOCAL_ICONS.gallery} style={styles.uploadSourceIcon} />
              <Text style={styles.uploadSourceText}>Select from gallery</Text>
            </Pressable>
          </View>
        </BootomSheet>

      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#F5F7FB'
  },

  Cardcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 18
  },
  subtext: {
    color: '#D1D4DC',
    fontSize: sizes.h6 - 1,
    fontFamily: FontFamily.regular,
    marginTop: 9
  },
  text: {
    color: 'white',
    fontSize: sizes.h4,
    fontFamily: FontFamily.semibold,
    marginTop: 7
  },
  editcontainer: {
    position: 'absolute',
    width: 24,
    height: 24,
    right: -8,
    top: 0,
    bottom: 0,
    borderRadius: 40,
    //top: 50px;
    backgroundColor: "#0E1F33",
    // borderWidth:1,
    //display: flex;
    justifyContent: 'center',
    alignItems: 'center'
  },
  user: {
    width: 64,
    height: 64,
    borderRadius: 50,
    //borderWidth: 2.5,
    borderColor: colors.white
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
  cardText: { color: '#000', fontFamily: FontFamily.medium, fontSize: 16 },
  cardContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    // padding: 15,
    alignItems: 'center',
    marginBottom: 16
  },
  leftSection: {
    //backgroundColor: '#00BCD4',
    borderRadius: 8,
    //padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBadgeContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#FF69B4',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rightSection: {
    flex: 1,
    paddingLeft: 20,
  },
  cardText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  background: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch' depending on your needs
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionSheetContentWrapper: {
    flexDirection: 'row',
    justifyContent: "flex-start",
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  uploadSourceIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    marginRight: 8
  },
  uploadSourceText: {
    fontFamily: FontFamily.medium,
    color: colors.black,
    fontSize: sizes.h6,
  },
});
export default CompanyProfileDashboard;