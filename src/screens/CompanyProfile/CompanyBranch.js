
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

const CompanyBranch = props => {
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
                    console.log(resp?.company_det?.com_det?.company_branch[0])

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
                    {/* <View style={{ justifyContent: 'center', alignItems: 'center', height: 32, width: 32, backgroundColor: '#007AFF', borderRadius: 50 }}>
                        <Image source={{ uri: item?.profile_image ? item?.profile_image : 'https://uaedemo.hrmlix.com/assets/images/user.jpg' }} style={{ height: '100%', width: '100%', borderRadius: 50, objectFit: 'cover' }} />
                    </View> */}
                    <View style={{ paddingLeft: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <View>
                            <View style={{ paddingLeft: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ textTransform: 'capitalize', fontFamily: FontFamily.medium, color: index == selectedIndex ? '#fff' : '#4E525E', fontSize: sizes.md, textAlign: 'left' }}> Branch {index + 1} </Text>
                                <View style={{marginLeft:6, paddingVertical: 2, paddingHorizontal: 6, backgroundColor: item?.status == 'active' ? colors.primary : "#FC6860", borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#fff', fontSize: 11,textTransform:'uppercase' }}>{item?.status}</Text>
                                </View>
                            </View>

                            <Text style={{marginTop:6, fontFamily: FontFamily.regular, color: index == selectedIndex ? '#fff' : '#8A8E9C', fontSize: sizes.sm, textAlign: 'left', lineHeight: 12 }}>Designation: {item?.branch_name}</Text>
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
                            <Text style={styles.optionname}>Branch Name</Text>
                        </View>
                        <View style={{ paddingRight: 12 }}>
                            <Text style={styles.optionVal}>{item?.branch_name}</Text>
                        </View>
                    </View>

                    <View style={styles.listContainer}>
                        <View>
                            <Text style={styles.optionname}>Branch Contact Person</Text>
                        </View>
                        <View style={{ paddingRight: 12 }}>
                            <Text style={styles.optionVal}>{item?.branch_contact_person}</Text>
                        </View>
                    </View>

                    <View style={styles.listContainer}>
                        <View>
                            <Text style={styles.optionname}>Contact Person Number</Text>
                        </View>
                        <View style={{ paddingRight: 12 }}>
                            <Text style={styles.optionVal}>{item?.contact_person_number}</Text>
                        </View>
                    </View>

                    <View style={styles.listContainer}>
                        <View>
                            <Text style={styles.optionname}>Contact Person Email</Text>
                        </View>
                        <View style={{ paddingRight: 12 }}>
                            <Text style={[styles.optionVal, { textTransform: 'lowercase' }]}>{item?.contact_person_email}</Text>
                        </View>
                    </View>

                    <View style={styles.listContainer}>
                        <View>
                            <Text style={styles.optionname}>Establishment Labour License</Text>
                        </View>
                        <View style={{ paddingRight: 12 }}>
                            <Text style={styles.optionVal}>{item?.establishment_labour_license}</Text>
                        </View>
                    </View>

                    <View style={styles.listContainer}>
                        <View>
                            <Text style={styles.optionname}>Branch Address</Text>
                        </View>
                        <View style={{ paddingRight: 12 }}>
                            <Text style={styles.optionVal}>{item?.branch_address}</Text>
                        </View>
                    </View>

                    <View style={styles.listContainer}>
                        <View>
                            <Text style={styles.optionname}>Branch Status</Text>
                        </View>
                        <View style={{ paddingRight: 12 }}>
                            <Text style={styles.optionVal}>{item?.status}</Text>
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
                <CustomHeader
                    buttonText={t('Company Branch')}
                    style={{ flexDirection: 'row' }}
                    iconStyle={{ height: 30, width: 30, borderRadius: 50 }}
                    icon={LOCAL_IMAGES.user}
                    searchIcon={false}
                    hideUserIcon={true}
                    buttonTextStyle={{lineHeight: 23 }}
                />

                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 0 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, }}>
                            <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6, lineHeight: 35 }}>Branch Details</Text>
                        </View>

                        {isLoading ? (
                            <FlatList
                                data={sampleData}
                                renderItem={placeholderRenderList} // Adjust rendering logic as per your data structure
                            />
                        ) : (
                            // Show actual data
                            companyData?.company_branch != "" ?
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={companyData?.company_branch}
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
    optionVal: { color: '#202020', fontFamily: FontFamily.medium, fontSize: 14, textTransform: 'capitalize' }
});
export default CompanyBranch;