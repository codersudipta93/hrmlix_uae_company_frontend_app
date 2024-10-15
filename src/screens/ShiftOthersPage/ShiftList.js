
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Image,
  Animated,
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
import Eye from '../../assets/icons/Eye';
import BootomSheet from '../../component/BootomSheet';
import CustomButton from '../../component/CustomButton';


const ShiftList = props => {
  const isFocused = useIsFocused();
  const route = useRoute();

  const dispatch = useDispatch();
  const { userDetails, token, needRefresh } = useSelector(state => state.project);

  const { t, i18n } = useTranslation();

  const sampleData = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  const [isModalVisible, setModalVisible] = useState(false);
  const [getShiftData, setShiftData] = useState(false);
  const [selectedShift, setSelectedShift] = useState("");

  // Animation state
  const [animValue] = useState(new Animated.Value(1000)); // Start off-screen

  useEffect(() => {
    if (isFocused == true) {
      console.log(i18n.language);
      console.log(I18nManager.isRTL);
      getShiftList();
    }
  }, [isFocused]);


  useEffect(() => {

  }, []);


  const getShiftList = () => {
    // setIsLoading(true);
    postApi("company/get-shift", { pageno: 1, perpage: 20 }, token)
      .then((resp) => {
        if (resp?.status == 'success') {
          setShiftData(resp?.shift?.docs);
          //setIsLoading(false);
        } else {
          HelperFunctions.showToastMsg(resp.message);
          //setIsLoading(false);
        }
      }).catch((err) => {
        console.log(err);
        //setIsLoading(false)
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

  const toggleModal = (item) => {
    if (isModalVisible) {
      setSelectedShift("")
      // Hide modal
      Animated.timing(animValue, {
        toValue: 1000,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setModalVisible(false));
    } else {
      setSelectedShift(item)
      // Show modal
      setModalVisible(true);
      Animated.timing(animValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };


  const ListRender = ({ index, item }) => (
    <View style={[styles.listCard, { marginBottom: 0, borderRadius: 0, borderTopRightRadius: index == 0 ? 8 : 0, borderTopLeftRadius: index == 0 ? 8 : 0, borderBottomLeftRadius: sampleData.length - 1 == index ? 8 : 0, borderBottomRightRadius: sampleData.length - 1 == index ? 8 : 0 }]}>
      <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

        <View style={{ paddingLeft: 12 }}>
          <Text style={{ fontFamily: FontFamily.medium, color: '#4E525E', fontSize: sizes.h6, textAlign: 'left' }}>{item?.shift_name}</Text>
          <Text style={{ fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md, textAlign: 'left', marginTop: 6 }}>
            Shift Time: {item?.shift1_start_time} - {item?.shift1_end_time}
          </Text>
        </View>
      </View>
      <View style={{ paddingLeft: 12, width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

        <Pressable onPress={() => { toggleModal(item) }}>
          <Eye fillColor='#FC6860' style={{ transform: [{ rotate: '-90deg' }] }} />
        </Pressable>

        {/* <Pressable style={{ marginLeft: 14 }} onPress={() => { console.log('delete action') }}>
          <Delete fillColor='#FC6860' style={{ transform: [{ rotate: '-90deg' }] }} />
        </Pressable> */}
      </View>
    </View>
  );



  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.main}>
        <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
        <CustomHeader
          buttonText={t('Shifts')}
          style={{ flexDirection: 'row' }}
          iconStyle={{ height: 30, width: 30, borderRadius: 50 }}
          icon={LOCAL_IMAGES.user}
          searchIcon={false}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 12 }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={getShiftData}
              renderItem={ListRender}
              contentContainerStyle={{ marginBottom: 30 }}
            />
          </View>
        </ScrollView>
      </View>
      <BootomSheet
        toggleModal={toggleModal}
        isModalVisible={isModalVisible}
        animValue={animValue}
      >
        <View>
          <View style={{ marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.modalheadingText}>Shift Details</Text>
            <IonIcon
              name="close"
              size={20}
              color="#4E525E"
            />
          </View>

          <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View><Text style={styles.leftText}>Shift Allowance</Text></View>
            <View><Text style={[styles.rightText,{textTransform:'uppercase'}]}>{selectedShift?.shift_allowance ? selectedShift?.shift_allowance + ' AED' : ""}</Text></View>
          </View>

          <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View><Text style={styles.leftText}>Overtime</Text></View>
            <View><Text style={[styles.rightText,{textTransform:'uppercase'}]}>{selectedShift?.overtime ? selectedShift?.overtime + ' AED' : ""}</Text></View>
          </View>
          <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View><Text style={styles.leftText}>Break Shift</Text></View>
            <View><Text style={styles.rightText}>{selectedShift?.break_shift ? selectedShift?.break_shift: ""}</Text></View>
          </View>
          <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View><Text style={styles.leftText}>Company Late Allowed</Text></View>
            <View><Text style={styles.rightText}>{selectedShift?.company_late_allowed ? selectedShift?.company_late_allowed : ""}</Text></View>
          </View>
          <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View><Text style={styles.leftText}>Early Arrival</Text></View>
            <View><Text style={styles.rightText}>{selectedShift?.company_early_arrival ? selectedShift?.company_early_arrival  : ""}</Text></View>
          </View>

          <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View><Text style={styles.leftText}>Created Date</Text></View>
            <View><Text style={styles.rightText}>{selectedShift?.created_at ? HelperFunctions.getDateDDMMYY(selectedShift?.created_at)  : ""}</Text></View>
          </View>

          <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View><Text style={styles.leftText}>Effective From</Text></View>
            <View><Text style={styles.rightText}>{selectedShift?.effective_date ? HelperFunctions.getDateDDMMYY(selectedShift?.effective_date)  : ""}</Text></View>
          </View>

          <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View><Text style={styles.leftText}>Last Modified</Text></View>
            <View><Text style={styles.rightText}>{selectedShift?.updated_at ? HelperFunctions.getDateDDMMYY(selectedShift?.updated_at)  : ""}</Text></View>
          </View>

          {/* <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
            <CustomButton
              style={{ width: '20%', height: 40, backgroundColor: colors.primary }}
              buttonText="OK"
              onPress={() => { toggleModal() }}
            />
          </View> */}


        </View>
      </BootomSheet>

    </SafeAreaView >
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


  modalheadingText: {
    fontSize: sizes.h5,
    marginBottom: 10,
    fontFamily: FontFamily.semibold,
    color: '#4E525E'
  },
  leftText: {
    fontSize: sizes.h6,
    marginBottom: 10,
    fontFamily: FontFamily.regular,
    color: '#868F9A'
  },
  rightText: {
    fontSize: sizes.h6,
    marginBottom: 10,
    fontFamily: FontFamily.medium,
    color: '#4E525E',
    textTransform:'capitalize'
  },


});
export default ShiftList;