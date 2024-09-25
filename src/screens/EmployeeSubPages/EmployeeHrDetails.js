
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

const EmployeeHrDetails = props => {

    const isFocused = useIsFocused();
    const route = useRoute();
    const dispatch = useDispatch();
    const { userDetails, token, needRefresh, masterData } = useSelector(state => state.project);
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

                    <View style={{ paddingHorizontal: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, marginTop: 6 }}>
                        <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6, lineHeight: 35 }}>
                            Employee Hr Details
                        </Text>
                    </View>

                    <View style={{ paddingHorizontal: 12, flexDirection: 'column', justifyContent: 'space-between', marginTop: 6 }}>
                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 8, borderTopLeftRadius: 8, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingRight: 8 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        Department
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingLeft: 4 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        {empdata?.emp_det?.employment_hr_details?.department ? empdata?.emp_det?.employment_hr_details?.department : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingRight: 8 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        Designation
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingLeft: 4 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        {empdata?.emp_det?.employment_hr_details?.designation ? empdata?.emp_det?.employment_hr_details?.designation : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingRight: 8 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        Branch
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingLeft: 4 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        {empdata?.emp_det?.employment_hr_details?.branch ? empdata?.emp_det?.employment_hr_details?.branch : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingRight: 8 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        Date of Join
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingLeft: 4 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        {empdata?.emp_det?.employment_hr_details?.date_of_join ? HelperFunctions.getDateDDMMYY(empdata?.emp_det?.employment_hr_details?.date_of_join) : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>


                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingRight: 8 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        HOD
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingLeft: 4 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left', textTransform: 'capitalize' }}>
                                        {empdata?.emp_det?.employment_hr_details?.hod ? HelperFunctions.getNameById(masterData?.hod, empdata?.emp_det?.employment_hr_details?.hod, "first_name") + " " + HelperFunctions.getNameById(masterData?.hod, empdata?.emp_det?.employment_hr_details?.hod, "last_name") : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>


                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingRight: 8 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        Client
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingLeft: 4 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        {empdata?.emp_det?.employment_hr_details?.client ? HelperFunctions.getNameById(masterData?.clients, empdata?.emp_det?.employment_hr_details?.client, "client_name") + " (" + HelperFunctions.getNameById(masterData?.clients, empdata?.emp_det?.employment_hr_details?.client, "client_code") + " )" : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingRight: 8 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        Employment Type
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingLeft: 4 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left', textTransform: 'capitalize' }}>
                                        {empdata?.emp_det?.employment_hr_details?.emp_type ? empdata?.emp_det?.employment_hr_details?.emp_type : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingRight: 8 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        Work Type
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingLeft: 4 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        {empdata?.emp_det?.employment_hr_details?.work_type ? empdata?.emp_det?.employment_hr_details?.work_type : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingRight: 8 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        Pension Applicable
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingLeft: 4 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        {empdata?.emp_det?.employment_hr_details?.pension_applicable ? empdata?.emp_det?.employment_hr_details?.pension_applicable : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingRight: 8 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        Gross Salary(AED)
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingLeft: 4 }}>
                                    <Text style={{ fontFamily: FontFamily.medium, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        {empdata?.emp_det?.employment_hr_details?.gross_salary ? empdata?.emp_det?.employment_hr_details?.gross_salary : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingRight: 8 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        User ID
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingLeft: 4 }}>
                                    <Text style={{ fontFamily: FontFamily.semibold, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        {empdata?.emp_det?.employment_hr_details?.iban ? empdata?.emp_det?.employment_hr_details?.iban : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingRight: 8 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        Current Job Offer ID
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingLeft: 4 }}>
                                    <Text style={{ fontFamily: FontFamily.semibold, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        {empdata?.emp_det?.employment_hr_details?.current_job_offer_id ? empdata?.emp_det?.employment_hr_details?.current_job_offer_id : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingRight: 8 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        Personal Number
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingLeft: 4 }}>
                                    <Text style={{ fontFamily: FontFamily.semibold, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        {empdata?.emp_det?.employment_hr_details?.personal_number ? empdata?.emp_det?.employment_hr_details?.personal_number : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingRight: 8 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        Probation Status
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingLeft: 4 }}>
                                    <Text style={{ fontFamily: FontFamily.semibold, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        {empdata?.emp_det?.employment_hr_details?.date_of_probation ? empdata?.emp_det?.employment_hr_details?.date_of_probation : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingRight: 8 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        Self Service
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingLeft: 4 }}>
                                    <Text style={{ fontFamily: FontFamily.semibold, color: '#202020', fontSize: sizes.md, textAlign: 'left', textTransform:'capitalize' }}>
                                        {empdata?.emp_det?.employment_hr_details?.emp_self_service ? empdata?.emp_det?.employment_hr_details?.emp_self_service : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>


                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingRight: 8 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        Manage Role
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingLeft: 4 }}>
                                    <Text style={{ fontFamily: FontFamily.semibold, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        {empdata?.emp_det?.employment_hr_details?.emp_role_data ? empdata?.emp_det?.employment_hr_details?.emp_role_data?.role_name : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingRight: 8 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        Holiday
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingLeft: 4 }}>
                                    <Text style={{ fontFamily: FontFamily.semibold, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        {empdata?.emp_det?.employment_hr_details?.yearly_holiday ? empdata?.emp_det?.employment_hr_details?.yearly_holiday : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingRight: 8 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        Salary Template
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingLeft: 4 }}>
                                    <Text style={{ fontFamily: FontFamily.semibold, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        {empdata?.emp_det?.employment_hr_details?.salary_temp ? HelperFunctions.getNameById(masterData?.salarytemp, empdata?.emp_det?.employment_hr_details?.salary_temp, "template_name") : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, marginBottom: 20 }]}>
                            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingRight: 8 }}>
                                    <Text style={{ fontFamily: FontFamily.regular, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        Package
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{ paddingLeft: 4 }}>
                                    <Text style={{ fontFamily: FontFamily.semibold, color: '#202020', fontSize: sizes.md, textAlign: 'left' }}>
                                        {empdata?.emp_det?.employment_hr_details?.package_id ? HelperFunctions.getNameById(masterData?.packages, empdata?.emp_det?.employment_hr_details?.package_id, "package_name") : "N/A"}
                                    </Text>
                                </View>
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
export default EmployeeHrDetails;