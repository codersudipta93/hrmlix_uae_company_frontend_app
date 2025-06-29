
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
import CustomButton from '../../component/CustomButton';

const Fnf = props => {

  const isFocused = useIsFocused();
  const route = useRoute();
  const dispatch = useDispatch();
  const { userDetails,companyData, token, needRefresh, masterData } = useSelector(state => state.project);
  const { t, i18n } = useTranslation();

  const [imageUrl, setImageurl] = useState("");
  const [imageModalVisible, setImageModalVisibility] = useState(false);
  const sampleData = [1, 1, 1, 1, 1];

  const [isLoading, setIsLoading] = useState(false);
  const [btnLoading, setbtnLoading] = useState(false);
  const [selectedIndex, setIndex] = useState(null);

  useEffect(() => {
    if (isFocused == true) {
      console.log(i18n.language);
      console.log(I18nManager.isRTL);
    }
  }, [isFocused]);


  useEffect(() => {
    if (props?.route?.params) {
      console.log("Employee assets paramData ======> ")
      //console.log(props?.route?.params?.paramData?.emp_det?.assets);
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


  const fetchReport = () => {
    setbtnLoading(true);
    postApi("company/employee-full-and-final-report", { employee_id: props?.route?.params?.paramData?.emp_det?.employee_id }, token)
      .then((resp) => {
        if (resp?.status == 'success') {
          setbtnLoading(false);
          props.navigation.navigate('FnfReport', { paramData: resp?.doc })
        } else {
          HelperFunctions.showToastMsg(resp.message);
          setbtnLoading(false);
        }
      }).catch((err) => {
        console.log(err);
        setbtnLoading(false)
        HelperFunctions.showToastMsg(err.message);
      })
  }

  useEffect(() => { if (imageUrl != "") { setImageModalVisibility(true) } }, [imageUrl]);

  const ListRender = ({ index, item }) => (
    <>
      <Pressable style={[styles.listCard, { paddingVertical: 15, marginBottom: 0, backgroundColor: index == selectedIndex ? '#1E2538' : '#fff' }]}>
        <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <View>
              <Text style={{ textTransform: 'capitalize', fontFamily: FontFamily.medium, color: index == selectedIndex ? '#fff' : '#4E525E', fontSize: sizes.md + 1, textAlign: 'left' }}>
                Asset No: {item?.asset_no ? item?.asset_no : "N/A"}
              </Text>
              {/* <Text style={{ fontFamily: FontFamily.regular, color: index == selectedIndex ? '#fff' : '#8A8E9C', fontSize: sizes.sm, textAlign: 'left', marginTop: 4, lineHeight: 12 }}>ID:</Text> */}
            </View>
          </View>
        </View>
        <View style={{ paddingLeft: 12, width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
          {item?.attendance_summ != "" ?
            <Pressable onPress={() => {
              if (index == selectedIndex) {
                setIndex(null);
              } else {
                setIndex(index);
              }

            }}>
              <Text style={{ fontFamily: FontFamily.medium, color: index == selectedIndex ? '#fff' : '#4E525E', fontSize: sizes.h2 }}>{index == selectedIndex ? '-' : '+'}</Text>
            </Pressable> : null}
        </View>

      </Pressable>
      {index == selectedIndex ?
        <View style={{ paddingLeft: 6 }}>
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: 12 }}>
            <View>
              <Text style={[styles.optionname, { marginTop: 8, fontFamily: FontFamily.medium }]}>Description</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={[styles.optionVal, { textTransform: 'capitalize', fontSize: sizes.md, marginTop: 6, fontFamily: FontFamily.regular }]}>
                {item?.asset_details ? item?.asset_details : "N/A"}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: 12 }}>
            <View>
              <Text style={[styles.optionname, { marginTop: 8, fontFamily: FontFamily.medium }]}>Asset Qty</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={[styles.optionVal, { textTransform: 'capitalize', fontSize: sizes.md, marginTop: 6, fontFamily: FontFamily.regular }]}>
                {item?.asset_qty ? item?.asset_qty : "N/A"}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: 12 }}>
            <View>
              <Text style={[styles.optionname, { marginTop: 8, fontFamily: FontFamily.medium }]}>Asset value</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={[styles.optionVal, { textTransform: 'capitalize', fontSize: sizes.md, marginTop: 6, fontFamily: FontFamily.regular }]}>
                {item?.asset_value ? item?.asset_value : "N/A"}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: 12 }}>
            <View>
              <Text style={[styles.optionname, { marginTop: 8, fontFamily: FontFamily.medium }]}>Asset issue date</Text>
            </View>
            <View style={{ paddingRight: 12 }}>
              <Text style={[styles.optionVal, { textTransform: 'capitalize', fontSize: sizes.md, marginTop: 6, fontFamily: FontFamily.regular }]}>
                {item?.asset_issue_date ? item?.asset_issue_date : "N/A"}
              </Text>
            </View>
          </View>
          {item?.asset_receive_date ?
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: 12 }}>
              <View>
                <Text style={[styles.optionname, { marginTop: 8, fontFamily: FontFamily.medium }]}>Received Date</Text>
              </View>
              <View style={{ paddingRight: 12 }}>
                <Text style={[styles.optionVal, { textTransform: 'capitalize', fontSize: sizes.md, marginTop: 6, fontFamily: FontFamily.regular }]}>
                  {item?.asset_receive_date ? item?.asset_receive_date : "N/A"}
                </Text>
              </View>
            </View>
            : null}

          {item?.asset_receive_by ?
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: 12 }}>
              <View>
                <Text style={[styles.optionname, { marginTop: 8, fontFamily: FontFamily.medium }]}>Received By</Text>
              </View>
              <View style={{ paddingRight: 12 }}>
                <Text style={[styles.optionVal, { textTransform: 'capitalize', fontSize: sizes.md, marginTop: 6, fontFamily: FontFamily.regular }]}>
                  {item?.asset_receive_by ? item?.asset_receive_by : "N/A"}
                </Text>
              </View>
            </View> : null}
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
          buttonText={t('Employee Full & Final')}
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

              <>
                <View style={{ paddingLeft: 0 }}>

                  <View style={[styles.listContainer, { paddingLeft: 12, paddingTop: 0 }]}>
                    <View>
                      <Text style={[styles.optionname, { marginTop: 0, fontFamily: FontFamily.medium }]}>
                        Date of Resignation
                      </Text>
                    </View>
                    <View style={{ paddingRight: 12 }}>
                      <Text style={[styles.optionVal, { textTransform: 'capitalize', fontSize: sizes.md, marginTop: 6, fontFamily: FontFamily.regular }]}>
                        {props?.route?.params?.paramData?.emp_det?.full_and_final?.do_resignation ? HelperFunctions.getDateDDMMYY(props?.route?.params?.paramData?.emp_det?.full_and_final?.do_resignation) : "N/A"}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.listContainer, { paddingLeft: 12 }]}>
                    <View>
                      <Text style={[styles.optionname, { marginTop: 8, fontFamily: FontFamily.medium }]}>
                        Is notice pay
                      </Text>
                    </View>
                    <View style={{ paddingRight: 12 }}>
                      <Text style={[styles.optionVal, { textTransform: 'capitalize', fontSize: sizes.md, marginTop: 6, fontFamily: FontFamily.regular }]}>
                        {props?.route?.params?.paramData?.emp_det?.full_and_final?.is_notice_pay ? props?.route?.params?.paramData?.emp_det?.full_and_final?.is_notice_pay == true ? 'Yes' : 'No' : "N/A"}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.listContainer, { paddingLeft: 12 }]}>
                    <View>
                      <Text style={[styles.optionname, { marginTop: 8, fontFamily: FontFamily.medium }]}>
                        Is accumulated bonus
                      </Text>
                    </View>
                    <View style={{ paddingRight: 12 }}>
                      <Text style={[styles.optionVal, { textTransform: 'capitalize', fontSize: sizes.md, marginTop: 6, fontFamily: FontFamily.regular }]}>
                        {props?.route?.params?.paramData?.emp_det?.full_and_final?.is_accumulated_bonus ? props?.route?.params?.paramData?.emp_det?.full_and_final?.is_accumulated_bonus == true ? 'Yes' : 'No' : "N/A"}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.listContainer, { paddingLeft: 12 }]}>
                    <View>
                      <Text style={[styles.optionname, { marginTop: 8, fontFamily: FontFamily.medium }]}>
                        Is final ettlement
                      </Text>
                    </View>
                    <View style={{ paddingRight: 12 }}>
                      <Text style={[styles.optionVal, { textTransform: 'capitalize', fontSize: sizes.md, marginTop: 6, fontFamily: FontFamily.regular }]}>
                        {props?.route?.params?.paramData?.emp_det?.full_and_final?.is_final_settlement ? props?.route?.params?.paramData?.emp_det?.full_and_final?.is_final_settlement == true ? 'Yes' : 'No' : "N/A"}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.listContainer, { paddingLeft: 12 }]}>
                    <View>
                      <Text style={[styles.optionname, { marginTop: 8, fontFamily: FontFamily.medium }]}>
                        Is gratuity
                      </Text>
                    </View>
                    <View style={{ paddingRight: 12 }}>
                      <Text style={[styles.optionVal, { textTransform: 'capitalize', fontSize: sizes.md, marginTop: 6, fontFamily: FontFamily.regular }]}>
                        {props?.route?.params?.paramData?.emp_det?.full_and_final?.is_gratuity ? props?.route?.params?.paramData?.emp_det?.full_and_final?.is_gratuity == true ? 'Yes' : 'No' : "N/A"}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.listContainer, { paddingLeft: 12 }]}>
                    <View>
                      <Text style={[styles.optionname, { marginTop: 8, fontFamily: FontFamily.medium }]}>
                        Is leave encashment
                      </Text>
                    </View>
                    <View style={{ paddingRight: 12 }}>
                      <Text style={[styles.optionVal, { textTransform: 'capitalize', fontSize: sizes.md, marginTop: 6, fontFamily: FontFamily.regular }]}>
                        {props?.route?.params?.paramData?.emp_det?.full_and_final?.is_leave_encashment ? props?.route?.params?.paramData?.emp_det?.full_and_final?.is_leave_encashment == true ? 'Yes' : 'No' : "N/A"}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.listContainer, { paddingLeft: 12 }]}>
                    <View>
                      <Text style={[styles.optionname, { marginTop: 8, fontFamily: FontFamily.medium }]}>
                        Is less outstanding advance
                      </Text>
                    </View>
                    <View style={{ paddingRight: 12 }}>
                      <Text style={[styles.optionVal, { textTransform: 'capitalize', fontSize: sizes.md, marginTop: 6, fontFamily: FontFamily.regular }]}>
                        {props?.route?.params?.paramData?.emp_det?.full_and_final?.is_less_outstanding_advance ? props?.route?.params?.paramData?.emp_det?.full_and_final?.is_less_outstanding_advance == true ? 'Yes' : 'No' : "N/A"}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.listContainer, { paddingLeft: 12 }]}>
                    <View>
                      <Text style={[styles.optionname, { marginTop: 8, fontFamily: FontFamily.medium }]}>
                        Is net pay
                      </Text>
                    </View>
                    <View style={{ paddingRight: 12 }}>
                      <Text style={[styles.optionVal, { textTransform: 'capitalize', fontSize: sizes.md, marginTop: 6, fontFamily: FontFamily.regular }]}>
                        {props?.route?.params?.paramData?.emp_det?.full_and_final?.is_net_pay ? props?.route?.params?.paramData?.emp_det?.full_and_final?.is_net_pay == true ? 'Yes' : 'No' : "N/A"}
                      </Text>
                    </View>
                  </View>



                  <View style={[styles.listContainer, { paddingLeft: 12 }]}>
                    <View>
                      <Text style={[styles.optionname, { marginTop: 8, fontFamily: FontFamily.medium }]}>
                        Is outstanding incentive
                      </Text>
                    </View>
                    <View style={{ paddingRight: 12 }}>
                      <Text style={[styles.optionVal, { textTransform: 'capitalize', fontSize: sizes.md, marginTop: 6, fontFamily: FontFamily.regular }]}>
                        {props?.route?.params?.paramData?.emp_det?.full_and_final?.is_outstanding_incentive ? props?.route?.params?.paramData?.emp_det?.full_and_final?.is_outstanding_incentive == true ? 'Yes' : 'No' : "N/A"}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.listContainer, { paddingLeft: 12 }]}>
                    <View>
                      <Text style={[styles.optionname, { marginTop: 8, fontFamily: FontFamily.medium }]}>
                        Reason For Leaving
                      </Text>
                    </View>
                    <View style={{ paddingRight: 12 }}>
                      <Text style={[styles.optionVal, { textTransform: 'capitalize', fontSize: sizes.md, marginTop: 6, fontFamily: FontFamily.regular }]}>
                        {props?.route?.params?.paramData?.emp_det?.full_and_final?.reason_code ? props?.route?.params?.paramData?.emp_det?.full_and_final?.reason_code : "N/A"}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.listContainer, { paddingLeft: 12 }]}>
                    <View>
                      <Text style={[styles.optionname, { marginTop: 8, fontFamily: FontFamily.medium }]}>
                        Last Working Day
                      </Text>
                    </View>
                    <View style={{ paddingRight: 12 }}>
                      <Text style={[styles.optionVal, { textTransform: 'uppercase', fontSize: sizes.md, marginTop: 6, fontFamily: FontFamily.regular }]}>
                        {props?.route?.params?.paramData?.emp_det?.full_and_final?.last_working_date ? HelperFunctions.getDateDDMMYY(props?.route?.params?.paramData?.emp_det?.full_and_final?.last_working_date) : "N/A"}
                      </Text>
                    </View>
                  </View>
                </View>

                {props?.route?.params?.paramData?.emp_det?.assets != "" ?
                  <>
                    <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', marginVertical: 20 }}>
                      <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6, lineHeight: 35, textTransform: 'capitalize' }}>Assets Details</Text>
                      <View style={{ width: '100%', height: 1, backgroundColor: '#E7EAF1' }}></View>
                    </View>

                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={props?.route?.params?.paramData?.emp_det?.assets}
                      renderItem={ListRender}
                      contentContainerStyle={{ marginBottom: 30 }}
                    />
                  </> : null}

                {/* <NoDataFound /> */}
                <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center'}}>
                  <CustomButton
                    isLoading={btnLoading}
                    backgroundColor={colors.primary}
                    buttonText={t('View Final Report')}
                    buttonTextStyle={{ textAlign: 'center', letterSpacing: 1.2, fontFamily: FontFamily.medium, color: '#fff', fontSize: sizes.h6 }}
                    requireBorder={false}
                    borderColor={colors.white}
                    style={{ marginTop: 40, width: '60%', borderRadius: 8, opacity: 1, marginBottom: 10  }}
                    onPress={() => {
                      fetchReport()
                    }}
                  />
                </View>
              </>
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
export default Fnf;