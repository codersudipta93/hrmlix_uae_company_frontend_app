
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

const CommunicationAddress = props => {
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


    const placeholderRenderList = ({ index, item }) => (
        <SkeletonLoader width={width} height={80} borderRadius={10} style={{ marginBottom: 6, }} />
    );


    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.main}>
                <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
               <CustomHeader hideUserIcon={true}
                    buttonText={t('Communication Address')}
                    style={{ flexDirection: 'row' }}
                    iconStyle={{ height: 30, width: 30, borderRadius: 50 }}
                    icon={LOCAL_IMAGES.user}
                    searchIcon={false}
                    hideUserIcon={true}
                    buttonTextStyle={{lineHeight: 23 }}
                />

                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 4 }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, }}>
                            <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6, lineHeight: 35 }}>Communication Office Address Details</Text>

                        </View>

                        {isLoading ? (
                            <FlatList
                                data={sampleData}
                                renderItem={placeholderRenderList} // Adjust rendering logic as per your data structure
                            />
                        ) : (
                            // Show actual data
                            companyData?.communication_office_address != "" ?
                                <View>
                                    <View style={styles.listContainer}>
                                        <View>
                                            <Text style={styles.optionname}>Door No</Text>
                                        </View>
                                        <View style={{ paddingRight: 12 }}>
                                            <Text style={styles.optionVal}>{companyData?.communication_office_address?.door_no}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.listContainer}>
                                        <View>
                                            <Text style={styles.optionname}>Street Name</Text>
                                        </View>
                                        <View style={{ paddingRight: 12 }}>
                                            <Text style={styles.optionVal}>{companyData?.communication_office_address?.street_name}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.listContainer}>
                                        <View>
                                            <Text style={styles.optionname}>Locality</Text>
                                        </View>
                                        <View style={{ paddingRight: 12 }}>
                                            <Text style={styles.optionVal}>{companyData?.communication_office_address?.locality}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.listContainer}>
                                        <View>
                                            <Text style={styles.optionname}>District Name</Text>
                                        </View>
                                        <View style={{ paddingRight: 12 }}>
                                            <Text style={styles.optionVal}>{companyData?.communication_office_address?.district_name}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.listContainer}>
                                        <View>
                                            <Text style={styles.optionname}>State</Text>
                                        </View>
                                        <View style={{ paddingRight: 12 }}>
                                            <Text style={styles.optionVal}>{companyData?.communication_office_address?.state}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.listContainer}>
                                        <View>
                                            <Text style={styles.optionname}>Pin Code</Text>
                                        </View>
                                        <View style={{ paddingRight: 12 }}>
                                            <Text style={[styles.optionVal, { textTransform: 'lowercase' }]}>{companyData?.communication_office_address?.pin_code}</Text>
                                        </View>
                                    </View>
                                   

                                </View>
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
    listContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 10, borderBottomWidth:0.8,borderBottomColor:'#E3E3E3' },
    optionname: { color: '#202020', fontFamily: FontFamily.regular, fontSize: 13 },
    optionVal: { color: '#202020', fontFamily: FontFamily.medium, fontSize: 14, textTransform: 'capitalize' }
});
export default CommunicationAddress;