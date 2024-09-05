
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
import Filter from '../../assets/icons/Filter';
import BootomSheet from '../../component/BootomSheet';
import CustomButton from '../../component/CustomButton';
import FloatingTimePicker from '../../component/FloatingTimePicker';
import Loader from '../../component/Loader';
import NoDataFound from '../../component/NoDataFound';

const PurchaseHistory = props => {
    const isFocused = useIsFocused();
    const route = useRoute();
    const dispatch = useDispatch();
    const { userDetails, token } = useSelector(state => state.project);

    const { t, i18n } = useTranslation();

    const sampleData = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    const [isModalVisible, setModalVisible] = useState(false);
    const [isFilterModalVisible, setFilterModalVisible] = useState(false);

    const [startdate, setStartdate] = useState("");
    const [enddate, setEnddate] = useState("");
    const [purchaseHistory, setPurchaseHistory] = useState("");
    const [selectedPurchaseHistory, setSelectedPurchaseHistory] = useState("");

    const [loadingView, setloadingView] = useState(false);
    const [isBtnLoading, setBtnLoading] = useState(false);

    // Animation state
    const [animValue] = useState(new Animated.Value(1000)); // Start off-screen

    useEffect(() => {
        if (isFocused == true) {
            console.log(i18n.language);
            console.log(I18nManager.isRTL);
            let formatedDate = (new Date()).toISOString().split('T')[0];
            setStartdate(formatedDate);
            setEnddate(HelperFunctions.getLastDateOfCurrentMonth());
            getPurchaseHistoryList(formatedDate, HelperFunctions.getLastDateOfCurrentMonth())

        }
    }, [isFocused]);

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


    const getPurchaseHistoryList = (fromDate, todate) => {
        setloadingView(true)
        let paramData = {
            "pageno": 1,
            "perpage": 20,
            "start_date": fromDate,
            "end_date": todate,
            "corporate_id": userDetails?.corporate_id
        }
        postApi("company/get-purchase-history", paramData, token)
            .then((resp) => {
                console.log(resp);
                if (resp?.status == 'success') {
                    setPurchaseHistory(resp?.credit?.docs);
                    setloadingView(false)
                    //HelperFunctions.showToastMsg(resp.message);
                } else if (resp?.status == 'val_err') {
                    let message = ""
                    for (const key in resp.val_msg) {
                        if (resp.val_msg[key].message) {
                            message = resp.val_msg[key].message;
                            break;
                        }
                    }
                    HelperFunctions.showToastMsg(message);
                    setloadingView(false)
                } else {
                    HelperFunctions.showToastMsg(resp.message);
                    setloadingView(false)
                }

            }).catch((err) => {
                console.log(err);
                setloadingView(false);
                HelperFunctions.showToastMsg(err.message);
            })
    }

    const toggleModal = () => {
        if (isModalVisible) {
            // Hide modal
            Animated.timing(animValue, {
                toValue: 1000,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setModalVisible(false));
        } else {
            // Show modal
            setModalVisible(true);
            Animated.timing(animValue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };


    const toggleFilter = () => {
        if (isFilterModalVisible) {
            // Hide modal
            Animated.timing(animValue, {
                toValue: 1000,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setFilterModalVisible(false));
        } else {
            // Show modal
            setFilterModalVisible(true);
            Animated.timing(animValue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    const ApplyFilter = () => {
        let paramData = {
            "pageno": 1,
            "perpage": 20,
            "start_date": startdate,
            "end_date": enddate,
            "corporate_id": userDetails?.corporate_id
        }
        postApi("company/get-purchase-history", paramData, token)
            .then((resp) => {
                console.log(resp);
                if (resp?.status == 'success') {
                    setPurchaseHistory(resp?.credit?.docs);
                    HelperFunctions.showToastMsg(resp.message);
                    setBtnLoading(false)
                    toggleFilter();
                   
                } else if (resp?.status == 'val_err') {
                    let message = ""
                    for (const key in resp.val_msg) {
                        if (resp.val_msg[key].message) {
                            message = resp.val_msg[key].message;
                            break;
                        }
                    }
                    HelperFunctions.showToastMsg(message);
                    setBtnLoading(false)
                } else {
                    HelperFunctions.showToastMsg(resp.message);
                    setBtnLoading(false)
                }

            }).catch((err) => {
                console.log(err);
                setBtnLoading(false)
                HelperFunctions.showToastMsg(err.message);
            })
    }

    const ListRender = ({ index, item }) => (
        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: index == 0 ? 8 : 0, borderTopLeftRadius: index == 0 ? 8 : 0, borderBottomLeftRadius: sampleData.length - 1 == index ? 8 : 0, borderBottomRightRadius: sampleData.length - 1 == index ? 8 : 0 }]}>
            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <View style={{ paddingHorizontal: 12 }}>
                    <Text style={{ fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md - 1, textAlign: 'left' }}>Invoice No</Text>
                    <Text onPress={() => {
                        toggleModal()
                        setSelectedPurchaseHistory(item)
                    }} style={{ fontFamily: FontFamily.medium, color: '#60B057', fontSize: sizes.h6 - 1, textAlign: 'left', marginTop: 6 }}>{item?.inv_id}</Text>
                </View>
            </View>
            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <View style={{ paddingHorizontal: 12 }}>
                    <Text style={{ fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md - 1, textAlign: 'left' }}>Date</Text>
                    <Text style={{ fontFamily: FontFamily.medium, color: '#4E525E', fontSize: sizes.h6 - 1, textAlign: 'left', marginTop: 6 }}>{HelperFunctions.getDateDDMMYY(item?.created_at)}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.main}>
                <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
                <CustomHeader
                    buttonText={t('Purchase History')}
                    buttonTextStyle={{ lineHeight: 21 }}
                    style={{ flexDirection: 'row' }}
                    iconStyle={{ height: 30, width: 30, borderRadius: 50 }}
                    icon={LOCAL_IMAGES.user}
                    searchIcon={false}
                    customIcon={true}
                    children={<Filter />}
                    onPressCustomIcon={() => { toggleFilter() }}
                />

                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 12 }}>
                        {purchaseHistory != "" ?
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={purchaseHistory}
                                renderItem={ListRender}
                                contentContainerStyle={{ marginBottom: 30 }}
                            />
                            :

                            <NoDataFound />
                        }
                    </View>
                </ScrollView>

                <BootomSheet
                    toggleModal={toggleModal}
                    isModalVisible={isModalVisible}
                    animValue={animValue}
                    modalContainerStyle={{
                        backgroundColor: 'white',
                        //padding: 20,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                    }}
                >
                    <View>
                        <View style={{
                            backgroundColor: '#1E2538', paddingVertical: 15, paddingHorizontal: 12, borderTopLeftRadius: 10,
                            borderTopRightRadius: 10, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <Text style={[styles.modalheadingText,{color:'#fff'}]}>Purchase History</Text>
                            <IonIcon
                                name="close"
                                size={20}
                                color="#fff"
                            />
                        </View>
                        <View style={{ paddingHorizontal: 20 }}>
                            <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: '#E7EAF1', borderBottomWidth: 1, paddingBottom: 8 }}>
                                <View><Text style={styles.leftText}>Invoice Date</Text></View>
                                <View><Text style={styles.rightText}>{HelperFunctions?.getDateDDMMYY(selectedPurchaseHistory?.created_at)}</Text></View>
                            </View>
                            <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: '#E7EAF1', borderBottomWidth: 1, paddingBottom: 8 }}>
                                <View><Text style={styles.leftText}>Invoice No</Text></View>
                                <View><Text style={styles.rightText}>{selectedPurchaseHistory?.inv_id}</Text></View>
                            </View>
                            <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: '#E7EAF1', borderBottomWidth: 1, paddingBottom: 8 }}>
                                <View><Text style={styles.leftText}>Transaction ID</Text></View>
                                <View><Text style={styles.rightText}>{selectedPurchaseHistory?.razorpay_payment_id}</Text></View>
                            </View>
                            <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: '#E7EAF1', borderBottomWidth: 1, paddingBottom: 8 }}>
                                <View><Text style={styles.leftText}>Qty Credits</Text></View>
                                <View><Text style={styles.rightText}>{parseFloat((selectedPurchaseHistory?.credit_qty)).toLocaleString('en-US')}</Text></View>
                            </View>
                            <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: '#E7EAF1', borderBottomWidth: 1, paddingBottom: 8 }}>
                                <View><Text style={styles.leftText}>SAC No</Text></View>
                                <View><Text style={styles.rightText}>N/A</Text></View>
                            </View>
                            <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: '#E7EAF1', borderBottomWidth: 1, paddingBottom: 8 }}>
                                <View><Text style={styles.leftText}>Inv Value</Text></View>
                                <View><Text style={styles.rightText}>{parseFloat((selectedPurchaseHistory?.credit_amount)).toLocaleString('en-US')}</Text></View>
                            </View>


                            <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}>
                                <CustomButton
                                    style={{ width: '20%', height: 40, backgroundColor: colors.primary }}
                                    buttonText="OK"
                                    onPress={() => { toggleModal() }}
                                />
                            </View>
                        </View>
                    </View>
                </BootomSheet>



                <BootomSheet
                    toggleModal={toggleFilter}
                    isModalVisible={isFilterModalVisible}
                    animValue={animValue}
                    modalContainerStyle={{
                        backgroundColor: 'white',
                        //padding: 20,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                    }}
                >
                    <View>
                        <View style={{
                            backgroundColor: '#E7EAF1', paddingVertical: 15, paddingHorizontal: 12, borderTopLeftRadius: 10,
                            borderTopRightRadius: 10, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <Text style={styles.modalheadingText}>Filter</Text>
                            <IonIcon
                                name="close"
                                size={20}
                                color="#0E1F33"
                            />
                        </View>
                        <View style={{ paddingHorizontal: 20 }}>
                            <View style={{ marginBottom: 8, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 0 }}>
                                <FloatingTimePicker
                                    pickerType="date"
                                    pickerIconStyle={{ height: 20, width: 20, tintColor: '#60B057' }}
                                    pickerIcon={LOCAL_ICONS.calender}
                                    editableStatus={true}
                                    labelName={'From Date'}
                                    inputContainerColor="#CACDD4"
                                    labelBg={colors.white}
                                    labelColor="#007AFF"
                                    placeholderColor="#8A8E9C"
                                    inputColor="#5A5B5B"
                                    //selectedValue={loginTime ? HelperFunctions.convertTo12HourFormat(loginTime) : ""}
                                    selectedValue={startdate}
                                    inputMargin={20}
                                    confirmDateClick={(timestamp) => {
                                        let formatedDate = (timestamp).toISOString().split('T')[0];
                                        setStartdate(formatedDate)
                                    }}
                                />
                            </View>
                            <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 0 }}>
                                <FloatingTimePicker
                                    pickerType="date"
                                    pickerIconStyle={{ height: 20, width: 20, tintColor: '#60B057' }}
                                    pickerIcon={LOCAL_ICONS.calender}
                                    editableStatus={true}
                                    labelName={'To Date'}
                                    inputContainerColor="#CACDD4"
                                    labelBg={colors.white}
                                    labelColor="#007AFF"
                                    placeholderColor="#8A8E9C"
                                    inputColor="#5A5B5B"
                                    //selectedValue={loginTime ? HelperFunctions.convertTo12HourFormat(loginTime) : ""}
                                    selectedValue={enddate}
                                    inputMargin={20}
                                    confirmDateClick={(timestamp) => {
                                        let formatedDate = (timestamp).toISOString().split('T')[0];
                                        setEnddate(formatedDate)
                                    }}
                                />
                            </View>


                            <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 20, flexDirection: 'row' }}>
                                <CustomButton
                                    style={{ width: '40%', height: 40, backgroundColor: "#F5F7FB", borderWidth: 1, borderColor: colors.primary }}
                                    buttonTextStyle={{ color: colors.primary }}
                                    buttonText="Cancel"
                                    onPress={() => { toggleFilter() }}
                                />
                                <CustomButton
                                    isLoading={isBtnLoading}
                                    style={{ width: '40%', height: 40, backgroundColor: colors.primary, marginLeft: 18 }}
                                    buttonText="Apply"
                                    onPress={() => { 
                                        setBtnLoading(true)
                                        ApplyFilter() 
                                    
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </BootomSheet>
            </View>
            <Loader isLoading={loadingView} />
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
    modalheadingText: {
        fontSize: sizes.h6,
        fontFamily: FontFamily.semibold,
        color: '#0E1F33'
    },
    leftText: {
        fontSize: sizes.h6 - 2,
        marginBottom: 10,
        fontFamily: FontFamily.regular,
        color: '#868F9A'
    },
    rightText: {
        fontSize: sizes.h6 - 1,
        marginBottom: 10,
        fontFamily: FontFamily.medium,
        color: '#1E2538'
    },

});
export default PurchaseHistory;