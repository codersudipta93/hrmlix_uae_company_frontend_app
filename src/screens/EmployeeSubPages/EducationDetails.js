
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
  Animated
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
import Loader from '../../component/Loader';
import CustomImageViewer from '../../component/PinchableImage';

const EducationDetails = props => {
  const isFocused = useIsFocused();
  const route = useRoute();
  const dispatch = useDispatch();
  const { userDetails,companyData, token, needRefresh, masterData } = useSelector(state => state.project);
  const { t, i18n } = useTranslation();

  const [imageUrl, setImageurl] = useState("");
  const [imageModalVisible, setImageModalVisibility] = useState(false);
  const sampleData = [1, 1, 1, 1, 1];

  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setIndex] = useState(null);

  useEffect(() => {
    if (isFocused == true) {
      console.log(i18n.language);
      console.log(I18nManager.isRTL);
    }
  }, [isFocused]);


  useEffect(() => {
    if (props?.route?.params) {
      console.log("Train details page paramData ======> ")
      console.log(props?.route?.params?.paramData?.emp_det?.training);
    }
  }, []);


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


  const showImage = (item) => {

    if (item?.education_file_image) {
      setIsLoading(true);
      let param = { image_path: item?.education_file_image }
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

  const ListRender = ({ index, item }) => (
    <>
      <Pressable style={[styles.listCard, { paddingVertical: 15, marginBottom: 0, backgroundColor: index == selectedIndex ? '#1E2538' : '#fff' }]}>
        <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <View>
              <Text style={{ textTransform: 'capitalize', fontFamily: FontFamily.medium, color: index == selectedIndex ? '#fff' : '#4E525E', fontSize: sizes.md + 1, textAlign: 'left' }}>
                {item?.level ? "Level: " + item?.level : "N/A"}
              </Text>
              {/* <Text style={{ fontFamily: FontFamily.regular, color: index == selectedIndex ? '#fff' : '#8A8E9C', fontSize: sizes.sm, textAlign: 'left', marginTop: 4, lineHeight: 12 }}>ID:</Text> */}
            </View>
          </View>
        </View>
        <View style={{ paddingLeft: 12, width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
         
            <Pressable onPress={() => {
              index == selectedIndex ? setIndex(null) : setIndex(index);
            }} >
              <Text style={{ fontFamily: FontFamily.medium, color: index == selectedIndex ? '#fff' : '#4E525E', fontSize: sizes.h2 }}>{index == selectedIndex ? '-' : '+'}</Text>
            </Pressable> 
        </View>

      </Pressable>
      {index == selectedIndex ?
        <View style={{ paddingLeft: 6 }}>
          <View style={styles.listContainer}>
            <View>
              <Text style={[styles.optionname, { marginTop: 8, fontFamily: FontFamily.medium }]}>Specialisation
              </Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={[styles.optionVal, { textTransform: 'uppercase', fontSize: sizes.md, marginTop: 6, fontFamily: FontFamily.regular }]}>
                {item?.level ? item?.specialisation : "N/A"}
              </Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={[styles.optionname, { marginTop: 8, fontFamily: FontFamily.medium }]}>Stream</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={[styles.optionVal, { textTransform: 'capitalize', fontSize: sizes.md, marginTop: 6, fontFamily: FontFamily.regular }]}>
                {item?.stream ? item?.stream : "N/A"}
              </Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={[styles.optionname, { marginTop: 8, fontFamily: FontFamily.medium }]}>University</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={[styles.optionVal, { textTransform: 'capitalize', fontSize: sizes.md, marginTop: 6, fontFamily: FontFamily.regular }]}>
                {item?.university ? item?.university : "N/A"}
              </Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={[styles.optionname, { marginTop: 8, fontFamily: FontFamily.medium }]}>Institute</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={[styles.optionVal, { textTransform: 'capitalize', fontSize: sizes.md, marginTop: 6, fontFamily: FontFamily.regular }]}>
                {item?.institute ? item?.institute : "N/A"}
              </Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={[styles.optionname, { marginTop: 8, fontFamily: FontFamily.medium }]}>Completion</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={[styles.optionVal, { textTransform: 'capitalize', fontSize: sizes.md, marginTop: 6, fontFamily: FontFamily.regular }]}>
                {item?.completion ? item?.completion : "N/A"}
              </Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View>
              <Text style={[styles.optionname, { marginTop: 8, fontFamily: FontFamily.medium }]}>Action</Text>
            </View>
            <View style={{ paddingRight: 12, marginTop: 6 }}>
              <Pressable onPress={() => { showImage(item) }} >
                <Text style={{ fontFamily: FontFamily.semibold, color: colors.primary, fontSize: sizes.md, textAlign: 'left', textDecorationLine: 'underline' }}>
                  View Certificate
                </Text>
              </Pressable>
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
       <CustomHeader hideUserIcon={true}
          buttonText={t('Educational Details')}
          style={{ flexDirection: 'row' }}
          iconStyle={{ height: 30, width: 30, borderRadius: 50 }}
          icon={LOCAL_IMAGES.user}
          searchIcon={false}
          buttonTextStyle={{ lineHeight: 23 }}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 12 }}>
            {isLoading ? (
              <FlatList
                data={sampleData}
                renderItem={placeholderRenderList} // Adjust rendering logic as per your data structure
              />
            ) : (
              // Show actual data
              props?.route?.params?.paramData?.emp_det?.education != "" ?
                <>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={props?.route?.params?.paramData?.emp_det?.education}
                    renderItem={ListRender}
                    contentContainerStyle={{ marginBottom: 30 }}
                  />
                </> :

                <NoDataFound />
            )}
          </View>
        </ScrollView>
      </View>

      <Loader isLoading={isLoading} />

      <CustomImageViewer
        backgroundColor={'#fff'}
        images={[{
          url: imageUrl,
        }]}
        isVisible={imageModalVisible}
        onClose={() => {
          setImageModalVisibility(false);
        }}
      />
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
export default EducationDetails;