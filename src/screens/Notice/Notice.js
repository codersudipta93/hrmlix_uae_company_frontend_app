
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
import CustomImageViewer from '../../component/PinchableImage';

const Notice = props => {
  const isFocused = useIsFocused();
  const route = useRoute();
  const dispatch = useDispatch();
  const { userDetails,companyData, token, needRefresh, masterData } = useSelector(state => state.project);

  const { t, i18n } = useTranslation();

  const sampleData = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  const [expiringnotice, setexpiringnotice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageurl] = useState("");
  const [imageModalVisible, setImageModalVisibility] = useState(false);

  useEffect(() => {
    if (isFocused == true) {
      console.log(i18n.language);
      console.log(I18nManager.isRTL);
      //alert(JSON.stringify(masterData));
      if (props?.route?.params) {

        console.log("page paramData ======> ")
        console.log(props?.route?.params?.type);
        _getNoticeData();
      }
    }
  }, [isFocused]);


  useEffect(() => {

  }, []);

  const _getNoticeData = () => {
    setIsLoading(true)
    postApi("company/company-dashboard-expire-and-expiring-documents", { pageno: 1, perpage: 10, type: props?.route?.params?.type }, token)
      .then((resp) => {
        console.log(resp);
        if (resp?.status == 'success') {
          console.log(resp?.data?.docs)
          setexpiringnotice(resp?.data?.docs)
          setIsLoading(false)
        } else if (resp?.status == 'val_err') {
          setIsLoading(false)
          HelperFunctions.showToastMsg(message);
        } else {
          setIsLoading(false)
          HelperFunctions.showToastMsg(resp.message);
        }

      }).catch((err) => {
        setIsLoading(false)
        console.log(err);
        HelperFunctions.showToastMsg(err.message);
      })
  }


  const showImage = (item) => {

    if (item?.file) {
      setIsLoading(true);
      let param = { image_path: item?.file }
      postApi("/company/single-view-image", param, token)
        .then((resp) => {
          if (resp?.status == 'success') {
            setImageurl(resp?.image)
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
    } else { HelperFunctions.showToastMsg('Sorry! No Photo found') }
  }


  useEffect(() => { if (imageUrl != "") { setImageModalVisibility(true) } }, [imageUrl]);

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
    <SkeletonLoader width={width} height={80} borderRadius={10} style={{ marginBottom: 6, }} />
  );

  const ListRender = ({ index, item }) => (
    <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: index == 0 ? 8 : 0, borderTopLeftRadius: index == 0 ? 8 : 0, borderBottomLeftRadius: sampleData.length - 1 == index ? 8 : 0, borderBottomRightRadius: sampleData.length - 1 == index ? 8 : 0 }]}>
      <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', height: 35, width: 35, backgroundColor: '#007AFF', borderRadius: 50 }}>
          <Image source={{ uri: item?.profile_pic ? item?.profile_pic : 'https://uaedemo.hrmlix.com/assets/images/user.jpg' }} style={{ height: '100%', width: '100%', borderRadius: 50, objectFit: 'cover' }} />
        </View>
        <View style={{ paddingLeft: 12 }}>
          <Text style={{ fontFamily: FontFamily.medium, color: '#4E525E', fontSize: sizes.h6, textAlign: 'left' }}>{item?.emp_first_name} {item?.emp_last_name}</Text>
          <Text style={{ fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md, textAlign: 'left', marginTop: 6 }}>{HelperFunctions.getDateDDMMYY(item?.valid_to)}</Text>
        </View>
      </View>
      <View style={{ paddingLeft: 12, paddingRight: 8, width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
        <IonIcon
          name="eye"
          size={18}
          color={colors.primary}
          onPress={() => {
            showImage(item)

          }}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.main}>
        <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
       <CustomHeader hideUserIcon={true}
          buttonText={t('Notice')}
          style={{ flexDirection: 'row' }}
          iconStyle={{ height: 30, width: 30, borderRadius: 50 }}
          icon={LOCAL_IMAGES.user}
          searchIcon={false}
        />

        <ScrollView showsVerticalScrollIndicator={false}>

          <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, }}>
              <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h5, lineHeight: 15, textTransform: 'capitalize' }}>{props?.route?.params?.type} Documents</Text>

            </View>

            {isLoading ?

              <FlatList
                data={sampleData}
                renderItem={placeholderRenderList} // Adjust rendering logic as per your data structure
              />
              :

              <FlatList
                showsVerticalScrollIndicator={false}
                data={expiringnotice}
                renderItem={ListRender}
                contentContainerStyle={{ marginBottom: 30 }}
              />

            }
          </View>

          <CustomImageViewer
            images={[{
              url: imageUrl,
            }]}
            isVisible={imageModalVisible}
            onClose={() => {
              // setRoomImageZoom([]);
              setImageModalVisibility(false);
            }}
          />

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
  }

});
export default Notice;