
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
import CustomImageViewer from '../../component/PinchableImage';


const EmployeePersonalDetails = props => {

    const isFocused = useIsFocused();
    const route = useRoute();
    const dispatch = useDispatch();
    const { userDetails, token } = useSelector(state => state.project);
    const [isLoading, setIsLoading] = useState(false);
    const { t, i18n } = useTranslation();

    const [empdata, setempdata] = useState("");
    const [imageUrl, setImageurl] = useState("");
    const [imageModalVisible, setImageModalVisibility] = useState(false);
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



    const showImage = (url) => {

        if (url) {
            setIsLoading(true);
            let param = { image_path: url}
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


    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.main}>
                <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
                <CustomHeader
                    buttonText={t('Employee')}
                    buttonTextStyle={{ lineHeight: 21 }}
                    style={{ flexDirection: 'row' }}
                    iconStyle={{ height: 30, width: 30, borderRadius: 50 }}
                    icon={LOCAL_IMAGES.user}
                    searchIcon={false}
                    customIcon={false}

                />

                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 6, marginBottom:12 }}>

                        <View style={[styles.listCard, { flexDirection: 'column', backgroundColor: '#1E2538', paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 8, borderTopLeftRadius: 8, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }]}>

                            {/* =====  Image Section  ====== */}

                            <View style={styles.container}>
                                <Image
                                    style={styles.user}
                                    source={{uri:empdata?.profile_pic_view ? empdata?.profile_pic_view : 'https://uaedemo.hrmlix.com/assets/images/user.jpg'}}
                                />
                                <Text style={styles.text}>
                                    {empdata?.emp_first_name ? empdata?.emp_first_name : "N/A"} {empdata?.emp_last_name ? empdata?.emp_last_name : "N/A"}
                                </Text>
                                <Text style={{ fontFamily: FontFamily.regular, color: '#FFFFFF', fontSize: sizes.md, textAlign: 'left', marginTop: 6 }}>
                                Emp ID: {empdata?.emp_id ? empdata?.emp_id : "N/A"} 
                                </Text>
                               
                            </View>

                            {/* =====  Image Section End  ====== */}


                            <View style={{ width: "95%", marginVertical: 20 }}>
                                <View style={{ height: 1, width: '100%', backgroundColor: '#4F5B7B' }}></View>
                            </View>

                            {/* ======= ID section Start ======== */}

                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    {/* <View style={{ paddingHorizontal: 12, borderBottomWidth: 1, paddingBottom: 10, borderBottomColor: '#4F5B7B' }}> */}
                                    <View style={{ paddingHorizontal: 12, }}>
                                        <Text style={{ fontFamily: FontFamily.regular, color: '#FFFFFF', fontSize: sizes.md, textAlign: 'left' }}>
                                            Email:
                                        </Text>
                                        <Text style={{ fontFamily: FontFamily.regular, color: '#FFFFFF', fontSize: sizes.md, textAlign: 'left', marginTop: 6 }}>
                                        {empdata?.email_id ? empdata?.email_id : "N/A"}
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ width: "20%", justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ height: 35, width: 1, backgroundColor: '#4F5B7B' }}></View>
                                </View>

                                <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    {/* <View style={{ paddingHorizontal: 12,borderBottomWidth:1,paddingBottom:10, borderBottomColor:'#4F5B7B' }}> */}
                                    <View style={{ paddingHorizontal: 12, }}>
                                        <Text style={{ fontFamily: FontFamily.regular, color: '#FFFFFF', fontSize: sizes.md, textAlign: 'left' }}>
                                            Date Of Birth:
                                        </Text>
                                        <Text style={{ fontFamily: FontFamily.regular, color: '#FFFFFF', fontSize: sizes.md, textAlign: 'left', marginTop: 6 }}>
                                            {empdata?.emp_dob ? HelperFunctions.getDateDDMMYY(empdata?.emp_dob) : "N/A"}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    {/* <View style={{ paddingHorizontal: 12, borderBottomWidth: 1, paddingBottom: 10, borderBottomColor: '#4F5B7B' }}> */}
                                    <View style={{ paddingHorizontal: 12 }}>
                                        <Text style={{ fontFamily: FontFamily.regular, color: '#FFFFFF', fontSize: sizes.md, textAlign: 'left' }}>
                                           Mobile Number
                                        </Text>
                                        <Text style={{ fontFamily: FontFamily.regular, color: '#FFFFFF', fontSize: sizes.md, textAlign: 'left', marginTop: 6 }}>
                                       
                                        {empdata?.alternate_mob_no ? empdata?.mobile_no : "N/A"}
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ width: "20%", justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ height: 35, width: 1, backgroundColor: '#4F5B7B' }}></View>
                                </View>

                                <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    {/* <View style={{ paddingHorizontal: 12, borderBottomWidth: 1, paddingBottom: 10, borderBottomColor: '#4F5B7B' }}> */}
                                    <View style={{ paddingHorizontal: 12, }}>
                                        <Text style={{ fontFamily: FontFamily.regular, color: '#FFFFFF', fontSize: sizes.md, textAlign: 'left' }}>
                                            Gender
                                        </Text>
                                        <Text style={{ fontFamily: FontFamily.regular, color: '#FFFFFF', fontSize: sizes.md, textAlign: 'left', marginTop: 6 }}>
                                        {empdata?.sex ? HelperFunctions.getGenderName(empdata?.sex) : "N/A"}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* ======= ID section End ======== */}

                        <View style={{ paddingHorizontal: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, marginTop: 6 }}>
                            <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6, lineHeight: 35 }}>
                                Personal Details
                            </Text>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        Employee First Name(Eng)
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        {empdata?.emp_first_name ? empdata?.emp_first_name : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        Employee Last Name(Eng)
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        {empdata?.emp_last_name ? empdata?.emp_last_name : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        Employee First Name(Ar)
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        {empdata?.emp_first_name_uae ? empdata?.emp_first_name_uae : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        Employee Last Name(Ar)
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left', textTransform: 'capitalize' }}>
                                        {empdata?.emp_last_name_uae ? empdata?.emp_last_name_uae : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        Blood Group
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                    
                                    {empdata?.blood_group ? empdata?.blood_group : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                    Marital status 
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.semibold, color: '#202020', fontSize: sizes.md, textAlign: 'left',textTransform:'capitalize' }}>
                                    {empdata?.marital_status ? empdata?.marital_status : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                    Nationality
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.semibold, color: '#202020', fontSize: sizes.md, textAlign: 'left',textTransform:'capitalize' }}>
                                    {empdata?.nationality ? empdata?.nationality : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                    Domicile
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.semibold, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                    {empdata?.domicile ? empdata?.domicile : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>


                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                    Height
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.semibold, color: '#202020', fontSize: sizes.md, textAlign: 'left',textTransform:'capitalize' }}>
                                    {empdata?.height ? empdata?.height : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                    Physical Disability 
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.semibold, color: '#202020', fontSize: sizes.md, textAlign: 'left',textTransform:'capitalize' }}>
                                    {empdata?.physical_disability ? empdata?.physical_disability : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        Gross(AED)
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        {empdata?.emp_det?.employment_hr_details?.gross_salary ? empdata?.emp_det?.employment_hr_details?.gross_salary : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        Official Mobile No
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        {empdata?.mobile_no ? empdata?.mobile_no : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        Alternate Mobile No
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        {empdata?.alternate_mob_no ? empdata?.alternate_mob_no : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        Official Email
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        {empdata?.email_id ? empdata?.email_id : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                       Personal Email
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        {empdata?.personal_email_id ? empdata?.personal_email_id : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                    Emergency contact name
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.semibold, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                    {empdata?.emergency_contact_name ? empdata?.emergency_contact_name : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                    Emergency contact number
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.semibold, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                    {empdata?.emergency_contact_no ? empdata?.emergency_contact_no : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        
                        

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                    Father Name
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.semibold, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                    {empdata?.emp_father_name ? empdata?.emp_father_name : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                   Mother Name
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.semibold, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                    {empdata?.emp_mother_name ? empdata?.emp_mother_name : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>


                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                    Passport Number
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Pressable onPress={() => { showImage(empdata?.emp_passport_image) }} style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.semibold, color: colors.primary, fontSize: sizes.md, textAlign: 'left', textDecorationLine: 'underline' }}>
                                    {empdata?.passport_no ? empdata?.passport_no : "N/A"}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                    Passport Validity
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Pressable  style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.semibold,  color: '#202020', fontSize: sizes.md, textAlign: 'left'}}>
                                    {empdata?.passport_val_form != "" ? HelperFunctions.getDateDDMMYY(empdata?.passport_val_form) : "N/A"} - {empdata?.passport_val_to ? HelperFunctions.getDateDDMMYY(empdata?.passport_val_to) : "N/A"}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                    Emirates ID
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Pressable onPress={() => { showImage(empdata?.emirates_image) }} style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.semibold, color: colors.primary, fontSize: sizes.md, textAlign: 'left', textDecorationLine: 'underline' }}>
                                    {empdata?.emirates_id ? empdata?.emirates_id : "N/A"}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                    Emirates ID Validity
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Pressable  style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.semibold,  color: '#202020', fontSize: sizes.md, textAlign: 'left'}}>
                                    {empdata?.emirates_valid_to ? HelperFunctions.getDateDDMMYY(empdata?.emirates_valid_to) : "N/A"}  
                                    </Text>
                                </Pressable>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                    Aditional ID
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Pressable onPress={() => { showImage(empdata?.additional_id_image) }} style={{ paddingHorizontal: 12 }}>
                                    <Text style={{ fontFamily: FontFamily.semibold, color: colors.primary, fontSize: sizes.md, textAlign: 'left', textDecorationLine: 'underline' }}>
                                    View Photo
                                    </Text>
                                </Pressable>
                            </View>
                        </View>

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
        backgroundColor: '#F5F7FB'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

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
    user: {
        width: 84,
        height: 84,
        borderRadius: 50,
        //borderWidth: 2.5,
        borderColor: colors.white
    },
    text: {
        color: '#ffff',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 8
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
export default EmployeePersonalDetails;