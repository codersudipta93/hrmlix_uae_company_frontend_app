
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


import { useTranslation } from 'react-i18next'; //for translation service
import IonIcon from 'react-native-vector-icons/Ionicons';
import Delete from '../../assets/icons/Delete';
import Eye from '../../assets/icons/Eye';
import BootomSheet from '../../component/BootomSheet';
import CustomButton from '../../component/CustomButton';
import InfoRow from '../../component/InfoRow';


const FnfReport = props => {
    const isFocused = useIsFocused();
    const route = useRoute();
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const sampleData = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    const [reportData, setReportData] = useState("");

    // Animation state
    const [animValue] = useState(new Animated.Value(1000)); // Start off-screen

    useEffect(() => {
        if (isFocused == true) {
            console.log(i18n.language);
            console.log(I18nManager.isRTL);
            if (props?.route?.params) {
                console.log("Employee assets paramData ======> ")
                console.log(props?.route?.params?.paramData);
                setReportData(props?.route?.params?.paramData)
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
                    buttonText={t('FNF Report')}
                    style={{ flexDirection: 'row' }}
                    iconStyle={{ height: 30, width: 30, borderRadius: 50 }}
                    icon={LOCAL_IMAGES.user}
                    searchIcon={false}
                />

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 12 }}>
                        <View style={styles.header}>
                            <Text style={styles.headerText}>Full & Final Settlement of Accounts</Text>
                        </View>

                        {/* Settlement Date */}
                        <View style={styles.row}>
                            <Text style={styles.label}>Settlement Date:</Text>
                            <Text style={styles.value}></Text>
                        </View>

                        {/* Employee Information */}
                        <View style={styles.infoSection}>
                            <InfoRow label="Employee Name" value={ reportData?.emp_first_name + " " + reportData?.emp_last_name}  />
                            <InfoRow label="Designation" value="N/A" />
                            <InfoRow label="Date Of Joining" value={reportData?.date_of_join ? HelperFunctions.getDateDDMMYY(reportData?.date_of_join) : "N/A"} />
                            <InfoRow label="Date Of Leaving" value={reportData?.full_and_final_data?.last_working_date ? HelperFunctions.getDateDDMMYY(reportData?.full_and_final_data?.last_working_date): "N/A"} />
                            <InfoRow label="Working Tenure" value={reportData?.date_of_join && reportData?.full_and_final_data?.last_working_date ? HelperFunctions.dateDiff(reportData?.date_of_join, reportData?.full_and_final_data?.last_working_date) : 'N/A'} />
                            <InfoRow label="Last Working Month" value={reportData?.full_and_final_data?.last_working_date ? HelperFunctions.getmonthYear(reportData?.full_and_final_data?.last_working_date)?.month_name + ', ' + HelperFunctions.getYear(reportData?.full_and_final_data?.last_working_date) : 'N/A'} />
                            <InfoRow label="Month Days" value="N/A" />
                            <InfoRow label="Pay days" value="N/A" borderBottom={true}/>
                        </View>

                        <View style={styles.infoSection}>
                            <InfoRow label="COMPONENTS" value="RATE" labelStyle={{fontFamily:FontFamily.bold}} valueStyle={{fontFamily:FontFamily.bold}}/>
                            <InfoRow label="Earned Gross" value="0.00" borderBottom={true} />
                        </View>


                        {/* Earned Gross Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>EARNINGS</Text>
                            <View style={styles.infoSection}>
                            <InfoRow label="COMPONENTS" value="Amount" labelStyle={{fontFamily:FontFamily.bold}} valueStyle={{fontFamily:FontFamily.bold}}/>
                            <InfoRow label="Earned Gross" value="0.00" borderBottom={true} />
                        </View>
                        </View>

                        {/* Earnings Section */}
                        <View style={styles.section}>
                            
                            {/* Other Components */}
                            <InfoRow label="Other Components" value="Amount" labelStyle={{fontFamily:FontFamily.bold}} valueStyle={{fontFamily:FontFamily.bold}}/>
                            <InfoRow label="Annual Bonus/ Leave Encashment" value="" />
                            <InfoRow label="Gratuity" value="" />
                            <InfoRow label="Other payments" value="" />
                            <InfoRow label="Total Income" value=""  />
                            <InfoRow label="Net Payable" value="" borderBottom={true} />
                        </View>

                    </View>
                </ScrollView>
            </View>


        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#fff'
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        borderBottomWidth: 0,
        borderColor: '#4E525E',
        paddingBottom: 10,
        marginBottom:10
    },
    headerText: {
        fontSize: 16,
        fontFamily:FontFamily.bold,
        textAlign: 'left',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 0,
        paddingVertical: 8,
        borderColor: '#ccc',
    },
    label: {
        fontSize: 13,
        fontFamily:FontFamily.bold,
    },
    value: {
        fontSize: 13,
        fontFamily:FontFamily.regular,
    },
    infoSection: {
        marginTop: 10,
    },
    section: {
        marginTop: 6,
        borderTopWidth: 0,
        borderColor: '#000',
        paddingVertical: 10,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 10,
    },

});
export default FnfReport;