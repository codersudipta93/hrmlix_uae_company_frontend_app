
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
    ScrollView,
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
import Loader from '../../component/Loader';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import FileViewer from 'react-native-file-viewer';


const EmployeeAddress = props => {
    const isFocused = useIsFocused();
    const route = useRoute();
    const dispatch = useDispatch();
    const { userDetails,companyData, token } = useSelector(state => state.project);

    const { t, i18n } = useTranslation();

    const [empdata, setempdata] = useState("");
    const [loadingView, setloadingView] = useState(false);
    // Animation state
    const [animValue] = useState(new Animated.Value(1000)); // Start off-screen




    useEffect(() => {
        if (isFocused == true) {
            console.log(i18n.language);
            console.log(I18nManager.isRTL);

            if (props?.route?.params) {
                console.log("paramData for address ======> ")
                console.log(props?.route?.params?.paramData);
                setempdata(props?.route?.params?.paramData);

            }


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







    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.main}>
                <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
               <CustomHeader hideUserIcon={true}
                    buttonText={t('Employee')}
                    buttonTextStyle={{ lineHeight: 21 }}
                    style={{ flexDirection: 'row' }}
                    iconStyle={{ height: 30, width: 30, borderRadius: 50 }}
                    icon={LOCAL_IMAGES.user}
                    searchIcon={false}
                    customIcon={false}

                />

                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={{ paddingHorizontal: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, marginTop: 6 }}>
                        <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6, lineHeight: 35 }}>Employee Address Details</Text>
                    </View>

                    <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 6 }}>
                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 8, borderTopLeftRadius: 8, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>Residence no</Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>{empdata?.emp_det?.emp_address?.resident_no ? empdata?.emp_det?.emp_address?.resident_no : "N/A"}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>Residence name </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>{empdata?.emp_det?.emp_address?.residential_name ? empdata?.emp_det?.emp_address?.residential_name : "N/A"}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>Road/road</Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>{empdata?.emp_det?.emp_address?.road ? empdata?.emp_det?.emp_address?.road : "N/A"}</Text>
                                </View>
                            </View>
                        </View>


                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>Locality/Area </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>{empdata?.emp_det?.emp_address?.locality ? empdata?.emp_det?.emp_address?.locality : "N/A"}</Text>
                                </View>
                            </View>
                        </View>



                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>City/Town</Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>{empdata?.emp_det?.emp_address?.city ? empdata?.emp_det?.emp_address?.city : "N/A"}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>District</Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>{empdata?.emp_det?.emp_address?.district ? empdata?.emp_det?.emp_address?.district : "N/A"}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>State</Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>{empdata?.emp_det?.emp_address?.state ? empdata?.emp_det?.emp_address?.state : "N/A"}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>Pincode</Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>{empdata?.emp_det?.emp_address?.pincode ? empdata?.emp_det?.emp_address?.pincode : "N/A"}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>Country</Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.semibold, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>{empdata?.emp_det?.emp_address?.country ? empdata?.emp_det?.emp_address?.country : "N/A"}</Text>
                                </View>
                            </View>
                        </View>

                    </View>

                    {/* ====================   Current Address Section  ========================== */}

                    <View style={{ paddingHorizontal: 14, marginBottom: 4, marginTop: 6, width: '100%', marginLeft: 4 }}>
                        <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6, lineHeight: 35 }}>Is current Residential Address is different from the above </Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <IonIcon
                                    name={empdata?.emp_det?.emp_address?.diff_current_add == "yes" ? "checkbox-outline" : "square-outline"}
                                    size={18}
                                    color={empdata?.emp_det?.emp_address?.diff_current_add == "yes" ? '#333' : '#333'}

                                />
                                <Text style={{ fontFamily: FontFamily.medium, color: '#4E525E', fontSize: sizes.h6, lineHeight: 35, marginLeft: 6 }}>Yes</Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginLeft: 14 }}>
                                <IonIcon
                                    name={empdata?.emp_det?.emp_address?.diff_current_add == "no" ? "checkbox-outline" : "square-outline"}
                                    size={18}
                                    color={empdata?.emp_det?.emp_address?.diff_current_add == "no" ? '#333' : '#333'}

                                />
                                <Text style={{ fontFamily: FontFamily.medium, color: '#4E525E', fontSize: sizes.h6, lineHeight: 35, marginLeft: 6 }}>No</Text>
                            </View>
                        </View>
                    </View>

                    {/* ====================   Current Address Section Details ========================== */}

                  {  empdata?.emp_det?.emp_address?.diff_current_add == "yes" ?
                    <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 6, marginBottom: 20 }}>
                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 8, borderTopLeftRadius: 8, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>Residence no</Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>{empdata?.emp_det?.emp_curr_address?.resident_no ? empdata?.emp_det?.emp_curr_address?.resident_no : "N/A"}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>Residence name </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>{empdata?.emp_det?.emp_curr_address?.residential_name ? empdata?.emp_det?.emp_curr_address?.residential_name : "N/A"}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>Road/road</Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>{empdata?.emp_det?.emp_curr_address?.road ? empdata?.emp_det?.emp_curr_address?.road : "N/A"}</Text>
                                </View>
                            </View>
                        </View>


                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>Locality/Area </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>{empdata?.emp_det?.emp_curr_address?.locality ? empdata?.emp_det?.emp_curr_address?.locality : "N/A"}</Text>
                                </View>
                            </View>
                        </View>



                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>City/Town</Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>{empdata?.emp_det?.emp_curr_address?.city ? empdata?.emp_det?.emp_curr_address?.city : "N/A"}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>District</Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>{empdata?.emp_det?.emp_curr_address?.district ? empdata?.emp_det?.emp_curr_address?.district : "N/A"}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>State</Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>{empdata?.emp_det?.emp_curr_address?.state ? empdata?.emp_det?.emp_curr_address?.state : "N/A"}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>Pincode</Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>{empdata?.emp_det?.emp_curr_address?.pincode ? empdata?.emp_det?.emp_curr_address?.pincode : "N/A"}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>Country</Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.semibold, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>{empdata?.emp_det?.emp_curr_address?.country ? empdata?.emp_det?.emp_curr_address?.country : "N/A"}</Text>
                                </View>
                            </View>
                        </View>

                    </View> : null}
                </ScrollView>

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
        marginBottom: 10,
        fontFamily: FontFamily.semibold,
        color: '#fff'
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
export default EmployeeAddress;