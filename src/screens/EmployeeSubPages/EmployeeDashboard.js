
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
  ImageBackground
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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

const EmployeeDashboard = props => {

  const isFocused = useIsFocused();
  const route = useRoute();
  const dispatch = useDispatch();
  const { userDetails,companyData, token, needRefresh } = useSelector(state => state.project);
  const { t, i18n } = useTranslation();
  const BackgroundImage = require('../../assets/imgs/bg1.png');
  const [empdata, setempdata] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  
  useEffect(() => {
    if (isFocused == true) {
      console.log(i18n.language);
      console.log(I18nManager.isRTL);
      if (props?.route?.params) {
        console.log("paramData ======> ")
        console.log(props?.route?.params?.empID)
        getMasterData()
      }
    }
  }, [isFocused]);


  const getMasterData = () => {
    setIsLoading(true);
    postApi("company/get-employee-details", { employee_id: props?.route?.params?.empID }, token)
      .then((resp) => {
        if (resp?.status == 'success') {
          setempdata(resp?.employee_det);
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



  const placeholderRenderList = ({ index, item }) => (
    <SkeletonLoader width={width} height={90} borderRadius={10} style={{ marginBottom: 6, }} />
  );

   

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.main}>
        <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
       <CustomHeader hideUserIcon={true}
          buttonText={t('Employee')}
          style={{ flexDirection: 'row' }}
          iconStyle={{ height: 30, width: 30, borderRadius: 50 }}
          icon={LOCAL_IMAGES.user}
          searchIcon={false}
        />
        <ScrollView showsVerticalScrollIndicator={false}>

          {isLoading == true ?

            <FlatList
              data={[1,1,1,1,1,1,1]}
              renderItem={placeholderRenderList} // Adjust rendering logic as per your data structure
            />
            :
            <View style={{ marginTop: 18, paddingHorizontal: 12 }}>
              <Pressable onPress={() => { props.navigation.navigate('EmployeePersonalDetails', { paramData: empdata }) }} style={[styles.cardContainer, { backgroundColor: '#C9EEFC' }]}>
                <View style={[styles.leftSection, {}]}>
                  <ImageBackground source={LOCAL_IMAGES.attendanceCardBG1} style={[styles.background, { width: 75, height: 80 }]}>
                    <View style={styles.container}>
                      <Image source={LOCAL_ICONS.bulletPoint} style={{ height: 35, width: 37, objectFit: 'contain' }} />
                    </View>
                  </ImageBackground>
                </View>
                <View style={styles.rightSection}>
                  <Text style={styles.cardText}>Personal Details</Text>
                </View>
              </Pressable>

              <Pressable onPress={() => { props.navigation.navigate('EmployeeAddress', { paramData: empdata }) }} style={[styles.cardContainer, { backgroundColor: '#FCE8E9' }]}>
                <View style={[styles.leftSection, {}]}>
                  <ImageBackground source={LOCAL_IMAGES.attendanceCardBG2} style={[styles.background, { width: 75, height: 80 }]}>
                    <View style={styles.container}>
                      <Image source={LOCAL_ICONS.bulletPoint} style={{ height: 35, width: 37, objectFit: 'contain' }} />
                    </View>
                  </ImageBackground>
                </View>
                <View style={styles.rightSection}>
                  <Text style={styles.cardText}>Address</Text>
                </View>
              </Pressable>

              <Pressable onPress={() => { props.navigation.navigate('EmployeeBankDetails', { paramData: empdata }) }} style={[styles.cardContainer, { backgroundColor: '#DBDAFE' }]}>
                <View style={[styles.leftSection, {}]}>
                  <ImageBackground source={LOCAL_IMAGES.attendanceCardBG3} style={[styles.background, { width: 75, height: 80 }]}>
                    <View style={styles.container}>
                      <Image source={LOCAL_ICONS.bulletPoint} style={{ height: 35, width: 37, objectFit: 'contain' }} />
                    </View>
                  </ImageBackground>
                </View>
                <View style={styles.rightSection}>
                  <Text style={styles.cardText}>Bank Details</Text>
                </View>
              </Pressable>

              <Pressable onPress={() => { props.navigation.navigate('EmployeeHrDetails', { paramData: empdata }) }} style={[styles.cardContainer, { backgroundColor: '#C9EEFC' }]}>
                <View style={[styles.leftSection, {}]}>
                  <ImageBackground source={LOCAL_IMAGES.attendanceCardBG1} style={[styles.background, { width: 75, height: 80 }]}>
                    <View style={styles.container}>
                      <Image source={LOCAL_ICONS.bulletPoint} style={{ height: 35, width: 37, objectFit: 'contain' }} />
                    </View>
                  </ImageBackground>
                </View>
                <View style={styles.rightSection}>
                  <Text style={styles.cardText}>HR Details</Text>
                </View>
              </Pressable>

              <Pressable onPress={() => {  props.navigation.navigate('ShortcutsDashboard' , { paramData: empdata }) }} style={[styles.cardContainer, { backgroundColor: '#FCE8E9' }]}>
                <View style={[styles.leftSection, {}]}>
                  <ImageBackground source={LOCAL_IMAGES.attendanceCardBG2} style={[styles.background, { width: 75, height: 80 }]}>
                    <View style={styles.container}>
                      <Image source={LOCAL_ICONS.bulletPoint} style={{ height: 35, width: 37, objectFit: 'contain' }} />
                    </View>
                  </ImageBackground>
                </View>
                <View style={styles.rightSection}>
                  <Text style={styles.cardText}>Shortcuts</Text>
                </View>
              </Pressable>

              <Pressable onPress={() => { props.navigation.navigate('OtherInfoDashboard' , { paramData: empdata }) }} style={[styles.cardContainer, { backgroundColor: '#DBDAFE' }]}>
                <View style={[styles.leftSection, {}]}>
                  <ImageBackground source={LOCAL_IMAGES.attendanceCardBG3} style={[styles.background, { width: 75, height: 80 }]}>
                    <View style={styles.container}>
                      <Image source={LOCAL_ICONS.bulletPoint} style={{ height: 35, width: 37, objectFit: 'contain' }} />
                    </View>
                  </ImageBackground>
                </View>
                <View style={styles.rightSection}>
                  <Text style={styles.cardText}>Other Info</Text>
                </View>
              </Pressable>

              <Pressable onPress={() => {  props.navigation.navigate('EmployeeDocumentVault' , { paramData: empdata })}} style={[styles.cardContainer, { backgroundColor: '#C9EEFC' }]}>
                <View style={[styles.leftSection, {}]}>
                  <ImageBackground source={LOCAL_IMAGES.attendanceCardBG1} style={[styles.background, { width: 75, height: 80 }]}>
                    <View style={styles.container}>
                      <Image source={LOCAL_ICONS.bulletPoint} style={{ height: 35, width: 37, objectFit: 'contain' }} />
                    </View>
                  </ImageBackground>
                </View>
                <View style={styles.rightSection}>
                  <Text style={styles.cardText}>Document Vault</Text>
                </View>
              </Pressable>

            </View>
          }
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
  }
});
export default EmployeeDashboard;