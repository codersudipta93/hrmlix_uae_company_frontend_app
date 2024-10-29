
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

const ProfileAndPartnerdetails = props => {
    const isFocused = useIsFocused();
    const route = useRoute();
    const dispatch = useDispatch();
    const { userDetails, token, needRefresh } = useSelector(state => state.project);

    const { t, i18n } = useTranslation();

    const [calenderdata, setCalenderdata] = useState([]);


    const sampleData = [1, 1, 1, 1, 1];

    const [companyData, setCompanyData] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const [selectedIndex, setIndex] = useState(null)

    useEffect(() => {
        if (isFocused == true) {
            console.log(i18n.language);
            console.log(I18nManager.isRTL);
            showPartnerDetails();
        }
    }, [isFocused]);


    const showPartnerDetails = (() => {
            setIsLoading(true)
            postApi("company/get-company-data", {}, token)
                .then((resp) => {
                    // console.log(resp?.attendance_summ)
                    if (resp?.status == 'success') {
                        setCompanyData(resp?.company_det?.com_det);
                        setIsLoading(false)
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



    // Reference for FlatList
    const flatListRef = useRef(null);


    // Effect to scroll to current date after layout
    useEffect(() => {
        if (flatListRef.current) {
            const currentDateIndex = calenderdata.findIndex(item => item.selected);
            if (currentDateIndex !== -1) {
                console.log(currentDateIndex)
                flatListRef.current.scrollToIndex({ index: currentDateIndex, animated: true });
            }
        }
    }, [calenderdata]);

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





    const ListRender = ({ index, item }) => (
        <>
            <Pressable style={[styles.listCard, { paddingVertical: 15, marginBottom: 0, backgroundColor: index == selectedIndex ? '#1E2538' : '#fff' }]}>
                <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', height: 32, width: 32, backgroundColor: '#007AFF', borderRadius: 50 }}>
                        <Image source={{ uri: item?.profile_image ? item?.profile_image : 'https://uaedemo.hrmlix.com/assets/images/user.jpg' }} style={{ height: '100%', width: '100%', borderRadius: 50, objectFit: 'cover' }} />
                    </View>
                    <View style={{ paddingLeft: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <View>
                            <Text style={{ textTransform: 'capitalize', fontFamily: FontFamily.medium, color: index == selectedIndex ? '#fff' : '#4E525E', fontSize: sizes.md, textAlign: 'left' }}>{item?.first_name} {item?.last_name}</Text>
                            <Text style={{ fontFamily: FontFamily.regular, color: index == selectedIndex ? '#fff' : '#8A8E9C', fontSize: sizes.sm, textAlign: 'left', marginTop: 4, lineHeight: 12 }}>Designation: {item?.designation}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ paddingLeft: 12, width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                    {item?.attendance_summ != "" ?
                        <Pressable onPress={() => {

                            if (index == selectedIndex) {
                                setIndex(null);

                            } else {
                                setIndex(index)
                            }

                        }} >
                            <Text style={{ fontFamily: FontFamily.medium, color: index == selectedIndex ? '#fff' : '#4E525E', fontSize: sizes.h2 }}>{index == selectedIndex ? '-' : '+'}</Text>
                        </Pressable> : null}
                </View>

            </Pressable>
            {index == selectedIndex ?
                <View>
                    <View style={styles.listContainer}>
                        <View>
                            <Text style={styles.optionname}>First Name</Text>
                        </View>
                        <View style={{ paddingRight: 12 }}>
                            <Text style={styles.optionVal}>{item?.first_name}</Text>
                        </View>
                    </View>

                    <View style={styles.listContainer}>
                        <View>
                            <Text style={styles.optionname}>Last Name</Text>
                        </View>
                        <View style={{ paddingRight: 12 }}>
                            <Text style={styles.optionVal}>{item?.last_name}</Text>
                        </View>
                    </View>

                    <View style={styles.listContainer}>
                        <View>
                            <Text style={styles.optionname}>Appointment Date</Text>
                        </View>
                        <View style={{ paddingRight: 12 }}>
                            <Text style={styles.optionVal}>{HelperFunctions.getDateDDMMYY(item?.date_of_appointment)}</Text>
                        </View>
                    </View>

                    <View style={styles.listContainer}>
                        <View>
                            <Text style={styles.optionname}>DIN Number</Text>
                        </View>
                        <View style={{ paddingRight: 12 }}>
                            <Text style={styles.optionVal}>{item?.din_no}</Text>
                        </View>
                    </View>

                    <View style={styles.listContainer}>
                        <View>
                            <Text style={styles.optionname}>Mobile Number</Text>
                        </View>
                        <View style={{ paddingRight: 12 }}>
                            <Text style={styles.optionVal}>{item?.mobile_no}</Text>
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
                    buttonText={t('Profile & Partner Details')}
                    style={{ flexDirection: 'row' }}
                    iconStyle={{ height: 30, width: 30, borderRadius: 50 }}
                    icon={LOCAL_IMAGES.user}
                    searchIcon={false}
                    hideUserIcon={true}
                    buttonTextStyle={{lineHeight: 23 }}
                />

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ marginTop: 18 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, marginBottom: 12 }}>
                            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>

                                <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6 }}>Profile Details</Text>

                                <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, width: '100%' }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#4E525E', fontSize: sizes.h6 - 1, marginTop: 4 }}>Establishment Name</Text>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#000', fontSize: sizes.h6-1, marginTop: 4, paddingRight: 10,textTransform:'capitalize' }}>{companyData?.details?.establishment_name}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, width: '100%' }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#4E525E', fontSize: sizes.h6 - 1, marginTop: 4 }}>Company type </Text>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#000', fontSize: sizes.h6-1, marginTop: 4, paddingRight: 10,textTransform:'capitalize' }}>{companyData?.details?.establishment_type}</Text>
                                </View>
                                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, width: '100%' }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#4E525E', fontSize: sizes.h6 - 1, marginTop: 4 }}>Corporate ID</Text>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#000', fontSize: sizes.h6-1, marginTop: 4, paddingRight: 30,textTransform:'capitalize' }}>{companyData?.details?.corporate_id}</Text>
                                </View> */}

                            </View>

                        </View>

                    </View>

                    <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 12 }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, }}>
                            <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6, lineHeight: 35 }}>Partner Details</Text>
                            
                        </View>

                        {isLoading ? (
                            <FlatList
                                data={sampleData}
                                renderItem={placeholderRenderList} // Adjust rendering logic as per your data structure
                            />
                        ) : (
                            // Show actual data
                            companyData?.partners != "" ?
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={companyData?.partners}
                                    renderItem={ListRender}
                                    contentContainerStyle={{ marginBottom: 30 }}
                                />
                                : <NoDataFound />
                        )}
                    </View>
                </ScrollView>


            </View>
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
export default ProfileAndPartnerdetails;