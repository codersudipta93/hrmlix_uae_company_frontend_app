import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { getData, setData, deleteData } from '../../Service/localStorage';
import { useDispatch, useSelector } from 'react-redux';
import { _setreffeshStatus } from '../../Store/Reducers/ProjectReducer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from 'react-native/Libraries/NewAppScreen';
import CustomHeader from '../../component/Header';

import { useTranslation } from 'react-i18next'; //for translation service

import FloatingLabelInput from '../../component/FloatingLabelInput';
import FloatingDropdown from '../../component/FloatingDropdown';
import CustomButton from '../../component/CustomButton';
import { postApi } from '../../Service/service';
import Loader from '../../component/Loader';
import FloatingTimePicker from '../../component/FloatingTimePicker';
import FloatingYearMonthPicker from '../../component/FloatingYearMonthPicker';
import DateTimePickerModal from '../../component/FloatingYearMonthPicker';

const EmployeeFilter = props => {
    const isFocused = useIsFocused();
    const route = useRoute();
    const dispatch = useDispatch();
    const { userDetails,companyData, token, needRefresh, masterData } = useSelector(state => state.project);
    const { t, i18n } = useTranslation();

    const [search, setSearchVal] = useState('');

    const [department_id, setdepartment_id] = useState("");
    const [department_ids, setdepartment_ids] = useState("");

    const [branch_id, setbranch_id] = useState("");
    const [branch_ids, setbranch_ids] = useState("");

    const [designation_id, setdesignation_id] = useState("");
    const [designation_ids, setdesignation_ids] = useState("");

    const [hod_id, sethod_id] = useState("");
    const [hod_ids, sethod_ids] = useState("");

    const [client_id, setclient_id] = useState("");
    const [client_ids, setclient_ids] = useState("");

    const [btnLoaderStatus, setBtnLoaderStatus] = useState(false);
    const [waitLoaderStatus, setWaitLoaderStatus] = useState(false);

    const [advanceFilter, setAdvance_filter] = useState('no');

    const [genders, setgenders] = useState([
        { label: 'Male', value: 'm' },
        { label: 'Female', value: 'f' },
        { label: 'Transgender', value: 't' },
        { label: 'Other', value: 'o' }
    ]);
    const [gender, setgender] = useState("");

    const [regions, setregions] = useState([
        { label: 'Islamic', value: 'muslim' },
        { label: 'Other', value: 'other' },
        { label: 'Hindu', value: 'hindu' },
        { label: 'Christian', value: 'chiristian' }
    ]);
    const [region, setregion] = useState("");

    const [age_from, setage_from] = useState("");
    const [age_to, setage_to] = useState("");

    const [doj_from, setdoj_from] = useState("");
    const [doj_to, setdoj_to] = useState("");

    const [doe_from, setdoe_from] = useState("");
    const [doe_to, setdoe_to] = useState("");

    const [startdate, setStartdate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [empStatusArr, setempStatusArr] = useState([
        { label: 'All', value: '' },
        { label: 'Active', value: 'approved' },
        { label: 'Pending', value: 'pending' },
        { label: 'Exited', value: 'inactive' },
    ]);

    const [empStatus, setempStatus] = useState("");


    useEffect(() => {
        if (isFocused == true) {

            console.log(i18n.language);
            console.log(I18nManager.isRTL);
            // getDropDownMaster()

            if (props?.route?.params) {
                let pdata = props?.route?.params?.paramData;
                console.log("Data from employee list page ====> ", pdata);
                // alert(masterData)
                setSearchVal(pdata?.searchkey);

                // clients
                setclient_id(pdata?.client_id ? pdata?.client_id : []);
                setclient_ids(HelperFunctions.updateSelectedArrObjects(masterData?.clients, pdata?.client_id ? pdata?.client_id : [], '_id'));
              
                setbranch_id(pdata?.branch_id ? pdata?.branch_id : []);
                setbranch_ids(HelperFunctions.updateSelectedArrObjects(masterData?.branch?.company_branch, pdata?.branch_id ? pdata?.branch_id : [], '_id'));

                setdepartment_id(pdata?.department_id ? pdata?.department_id : []);
                setdepartment_ids(HelperFunctions.updateSelectedArrObjects(masterData?.department, pdata?.department_id ? pdata?.department_id : [], '_id'));

                setdesignation_id(pdata?.designation_id ? pdata?.designation_id : []);
                setdesignation_ids(HelperFunctions.updateSelectedArrObjects(masterData?.designation, pdata?.designation_id ? pdata?.designation_id : [], '_id'));

                sethod_id(pdata?.hod_id ? pdata?.hod_id : []);
                sethod_ids(HelperFunctions.updateSelectedArrObjects(masterData?.hod, pdata?.hod_id ? pdata?.hod_id : [], '_id'));


                if (pdata?.advance_filter == "yes") {
                    setAdvance_filter(pdata?.advance_filter);

                    setgender(pdata?.gender)
                    setgenders(HelperFunctions.updateSelectedObjects(genders, pdata?.gender))

                    setregion(pdata?.region)
                    setregions(HelperFunctions.updateSelectedObjects(regions, pdata?.religion))

                    //setStartdate(HelperFunctions.convertToISOWithTime(pdata?.wage_from_date));
                    //setEndDate(HelperFunctions.convertToISOWithTime(pdata?.wage_to_date));

                    setdoj_from(doj_from);
                    setdoj_to(doj_to);

                    setdoe_from(doe_from);
                    setdoe_to(doe_to);

                    setempStatus(pdata?.emp_status ? pdata?.emp_status : "");
                    setempStatusArr(HelperFunctions.updateSelectedArrObjects(empStatusArr, pdata?.emp_status ? pdata?.emp_status : [], 'value'));
                }
            }
        }

    }, [isFocused]);


    useEffect(() => { }, []);

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



    const _applyFilter = () => {

        let apiParam = {
            "searchkey": search ? search : "",
            "department_id": department_id != "" ? department_id : "",
            "designation_id": designation_id != "" ? designation_id : "",
            "branch_id": branch_id != "" ? branch_id : "",
            "client_id": client_id != "" ? client_id : "",
            "hod_id": hod_id != "" ? hod_id : "",
            "gender": gender ? gender : "",
            "religion": region ? region : "",
            "client_code": "",
            "age_from": age_from ? age_from : "",
            "age_to": age_to ? age_to : "",
            "doj_from": doj_from ? doj_from : "",
            "doe_from": doe_from ? doe_from : "",
            "doj_to": doj_to ? doj_to : "",
            "doe_to": doe_to ? doe_to : "",
            "search_type": "effective_date",
            "bank_id": "",
            "emp_status": "",
            "advance_filter": advanceFilter
        }

         console.log(apiParam);
        // dispatch(_setreffeshStatus(true));
        // props.navigation.navigate('Employees', { paramData: apiParam })
        
    }


    const _clearFilter = () => {
        setSearchVal("");

        setbranch_id([]);
        setbranch_ids([]);

        setdepartment_id([]);
        setdepartment_ids([]);

        setdepartment_id([]);
        setdepartment_ids([]);

        setdepartment_id([]);
        setdepartment_ids([]);


        setdesignation_id([]);
        setdesignation_ids([]);

        sethod_id([]);
        sethod_ids([]);


        let paramData = {
            "pageno": 1,
            "perpage": 100,
            "department_id": "",
            "hod_id": "",
            "designation_id": "",
            "branch_id": "",
            "multiEdit": "",
            "searchkey": "",
            //"attendance_type": attendance_type?.value,
            "filter_type": "apply_revision",
        }

        props.navigation.navigate('ApplyRevision', { paramData: paramData })
        dispatch(_setreffeshStatus(true));
    }

    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.main}>
                <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
               <CustomHeader hideUserIcon={true}
                    buttonText={t('Filter')}
                    style={{ flexDirection: 'row' }}
                    iconStyle={{ height: 28, width: 28, borderRadius: 50 }}
                    icon={LOCAL_IMAGES.user}
                    searchIcon={false}
                />

                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={{ paddingHorizontal: 14, marginTop: 12 }}>

                        <View style={{ padding: 12, backgroundColor: colors.white, borderRadius: 8, marginBottom: 20 }}>

                            <FloatingLabelInput
                                label="Search"
                                placeholder="Search"
                                inputContainerColor="#CACDD4"
                                labelBg={colors.white}
                                labelColor="#007AFF"
                                placeholderColor="#8A8E9C"
                                inputColor={colors.primary}
                                value={search}
                                onChangeText={setSearchVal}
                            />


                            <FloatingDropdown
                                multiSelect={true}
                                labelName="Client"
                                selectedValueData={client_id != '' ? client_id : ""}
                                options={client_ids}
                                listLabelKeyName={['client_name']}
                                onSelect={(option) => {
                                    let data = HelperFunctions.copyArrayOfObj(client_ids);
                                    for (let k = 0; k < data.length; k++) {
                                        if (data[k]._id == option._id) {
                                            data[k].selected = data[k].selected == true ? false : true;
                                        }
                                    }

                                    setclient_ids(data);


                                    setclient_id(prevClients => {
                                        // Check if the client is already in the list
                                        const isClientExists = prevClients.some(existingClient => existingClient._id === option._id);

                                        if (isClientExists) {
                                            // Remove the client if it exists
                                            return prevClients.filter(existingClient => existingClient._id !== option._id);
                                        } else {
                                            // Add the client if it does not exist
                                            return [...prevClients, option];
                                        }
                                    });
                                }}
                                inputContainerColor="#CACDD4"
                                labelBg={colors.white}
                                labelColor="#007AFF"
                                placeholderColor="#8A8E9C"
                                inputColor={colors.primary}
                                inputMargin={0}
                            />



                            <FloatingDropdown
                                multiSelect={true}
                                labelName="Branch"
                                selectedValueData={branch_id != '' ? branch_id : ""}
                                options={branch_ids}
                                listLabelKeyName={['branch_name']}
                                onSelect={(option) => {
                                    let data = HelperFunctions.copyArrayOfObj(branch_ids);
                                    for (let k = 0; k < data.length; k++) {
                                        if (data[k]._id == option._id) {
                                            data[k].selected = data[k].selected == true ? false : true;
                                            // setdepartment_id(data[k])
                                        }
                                    }

                                    setbranch_ids(data)

                                    setbranch_id(prevClients => {
                                        // Check if the client is already in the list
                                        const isClientExists = prevClients.some(existingClient => existingClient._id === option._id);

                                        if (isClientExists) {
                                            // Remove the client if it exists
                                            return prevClients.filter(existingClient => existingClient._id !== option._id);
                                        } else {
                                            // Add the client if it does not exist
                                            return [...prevClients, option];
                                        }
                                    });

                                }}
                                inputContainerColor="#CACDD4"
                                labelBg={colors.white}
                                labelColor="#007AFF"
                                placeholderColor="#8A8E9C"
                                inputColor={colors.primary}
                                inputMargin={15}
                            />

                            <FloatingDropdown
                                multiSelect={true}
                                labelName="Department"
                                selectedValueData={department_id != '' ? department_id : ""}
                                options={department_ids}
                                listLabelKeyName={['department_name']}
                                onSelect={(option) => {
                                    let data = HelperFunctions.copyArrayOfObj(department_ids);
                                    for (let k = 0; k < data.length; k++) {
                                        if (data[k]._id == option._id) {
                                            data[k].selected = data[k].selected == true ? false : true;
                                            // setdepartment_id(data[k])
                                        }
                                    }

                                    setdepartment_ids(data)

                                    setdepartment_id(prevClients => {
                                        // Check if the client is already in the list
                                        const isClientExists = prevClients.some(existingClient => existingClient._id === option._id);

                                        if (isClientExists) {
                                            // Remove the client if it exists
                                            return prevClients.filter(existingClient => existingClient._id !== option._id);
                                        } else {
                                            // Add the client if it does not exist
                                            return [...prevClients, option];
                                        }
                                    });

                                }}
                                inputContainerColor="#CACDD4"
                                labelBg={colors.white}
                                labelColor="#007AFF"
                                placeholderColor="#8A8E9C"
                                inputColor={colors.primary}
                                inputMargin={18}
                            />


                            <FloatingDropdown
                                multiSelect={true}
                                labelName="Designation"
                                selectedValueData={designation_id != '' ? designation_id : ""}
                                options={designation_ids}
                                listLabelKeyName={['designation_name']}
                                onSelect={(option) => {
                                    let data = HelperFunctions.copyArrayOfObj(designation_ids);
                                    for (let k = 0; k < data.length; k++) {
                                        if (data[k]._id == option._id) {
                                            data[k].selected = data[k].selected == true ? false : true;
                                            // setdepartment_id(data[k])
                                        }
                                    }

                                    setdesignation_ids(data);
                                    setdesignation_id(prevClients => {
                                        // Check if the client is already in the list
                                        const isClientExists = prevClients.some(existingClient => existingClient._id === option._id);

                                        if (isClientExists) {
                                            // Remove the client if it exists
                                            return prevClients.filter(existingClient => existingClient._id !== option._id);
                                        } else {
                                            // Add the client if it does not exist
                                            return [...prevClients, option];
                                        }
                                    });

                                }}
                                inputContainerColor="#CACDD4"
                                labelBg={colors.white}
                                labelColor="#007AFF"
                                placeholderColor="#8A8E9C"
                                inputColor={colors.primary}
                                inputMargin={18}
                            />

                            <FloatingDropdown
                                multiSelect={true}
                                labelName="HOD"
                                selectedValueData={hod_id != '' ? hod_id : ""}
                                options={hod_ids}
                                listLabelKeyName={['first_name', 'last_name']}
                                onSelect={(option) => {
                                    let data = HelperFunctions.copyArrayOfObj(hod_ids);
                                    for (let k = 0; k < data.length; k++) {
                                        if (data[k]._id == option._id) {
                                            data[k].selected = data[k].selected == true ? false : true;
                                            // setdepartment_id(data[k])
                                        }
                                    }

                                    sethod_ids(data)
                                    sethod_id(prevClients => {
                                        // Check if the client is already in the list
                                        const isClientExists = prevClients.some(existingClient => existingClient._id === option._id);

                                        if (isClientExists) {
                                            // Remove the client if it exists
                                            return prevClients.filter(existingClient => existingClient._id !== option._id);
                                        } else {
                                            // Add the client if it does not exist
                                            return [...prevClients, option];
                                        }
                                    });

                                }}
                                inputContainerColor="#CACDD4"
                                labelBg={colors.white}
                                labelColor="#007AFF"
                                placeholderColor="#8A8E9C"
                                inputColor={colors.primary}
                                inputMargin={18}
                            />

                            <FloatingDropdown
                                multiSelect={false}
                                labelName="Status"
                                selectedValueData={empStatus != '' ? empStatus : ""}
                                options={empStatusArr}
                                listLabelKeyName={['label']}
                                onSelect={(option) => {
                                    let data = HelperFunctions.copyArrayOfObj(empStatusArr);
                                    for (let k = 0; k < data.length; k++) {
                                        if (data[k].value == option.value) {
                                            data[k].selected = data[k].selected == true;
                                            setempStatus(data[k])
                                        } else {
                                            data[k].selected = data[k].selected == false;
                                        }
                                    }

                                    setempStatusArr(data);
                                }}
                                inputContainerColor="#CACDD4"
                                labelBg={colors.white}
                                labelColor="#007AFF"
                                placeholderColor="#8A8E9C"
                                inputColor={colors.primary}
                                inputMargin={18}
                            />


                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                                <Pressable onPress={() => { setAdvance_filter(advanceFilter == 'yes' ? 'no' : 'yes') }} style={{ borderWidth: 1, marginTop: 18, borderColor: advanceFilter == 'yes' ? colors.primary : "#CACDD4", borderRadius: 6, paddingHorizontal: 4, paddingVertical: 12, width: '45%' }}>
                                    <Text style={{ fontFamily: FontFamily.semibold, color: advanceFilter == 'yes' ? colors.primary : '#4E525E', fontSize: sizes.h6 - 1, textAlign: 'center' }}>
                                        Advance Filter
                                    </Text>
                                </Pressable>
                            </View>


                            {advanceFilter == 'yes' ? <>

                                <FloatingDropdown
                                    multiSelect={false}
                                    labelName="Select Gender"
                                    selectedValueData={gender != '' ? gender : ""}
                                    options={genders}
                                    listLabelKeyName={['label']}
                                    onSelect={(option) => {
                                        let data = HelperFunctions.copyArrayOfObj(genders);
                                        for (let k = 0; k < data.length; k++) {
                                            if (data[k].value == option.value) {
                                                data[k].selected = data[k].selected == true;
                                                setgender(data[k])
                                            } else {
                                                data[k].selected = data[k].selected == false;
                                            }
                                        }

                                        setgenders(data)
                                    }}
                                    inputContainerColor="#CACDD4"
                                    labelBg={colors.white}
                                    labelColor="#007AFF"
                                    placeholderColor="#8A8E9C"
                                    inputColor={colors.primary}
                                    inputMargin={18}
                                />

                                <FloatingDropdown
                                    multiSelect={false}
                                    labelName="Select Region"
                                    selectedValueData={region != '' ? region : ""}
                                    options={regions}
                                    listLabelKeyName={['label']}
                                    onSelect={(option) => {
                                        let data = HelperFunctions.copyArrayOfObj(regions);
                                        for (let k = 0; k < data.length; k++) {
                                            if (data[k].value == option.value) {
                                                data[k].selected = data[k].selected == true;
                                                setregion(data[k])
                                            } else {
                                                data[k].selected = data[k].selected == false;
                                            }
                                        }

                                        setregions(data)
                                    }}
                                    inputContainerColor="#CACDD4"
                                    labelBg={colors.white}
                                    labelColor="#007AFF"
                                    placeholderColor="#8A8E9C"
                                    inputColor={colors.primary}
                                    inputMargin={18}
                                />

                                <View style={{ marginBottom: 4, marginTop: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 0 }}>
                                    <Text style={{ fontFamily: FontFamily.semibold, color: '#5A5B5B', fontSize: sizes.h6, lineHeight: 35 }}>
                                        Age
                                    </Text>
                                </View>
                                <>
                                    <FloatingLabelInput
                                        label="From"
                                        placeholder="Age from"
                                        inputContainerColor="#CACDD4"
                                        labelBg={colors.white}
                                        labelColor="#007AFF"
                                        placeholderColor="#8A8E9C"
                                        inputColor={colors.primary}
                                        value={age_from}
                                        onChangeText={(res)=>{
                                            console.log("hi")
                                            if(res <= 60){
                                                setage_from(res)
                                            }
                                        }}
                                        keyboardType='number-pad'
                                        maxlength={2}
                                    />

                                    <FloatingLabelInput
                                        label="To"
                                        placeholder="Age upto"
                                        inputContainerColor="#CACDD4"
                                        labelBg={colors.white}
                                        labelColor="#007AFF"
                                        placeholderColor="#8A8E9C"
                                        inputColor={colors.primary}
                                        value={age_to}
                                        onChangeText={(res)=>{
                                            console.log("hi")
                                            if(res <= 60){
                                                setage_to(res)
                                            }
                                        }}
                                        keyboardType='number-pad'
                                        maxlength={2}
                                    />
                                </>


                                <View style={{ marginBottom: 4, marginTop: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 0 }}>
                                    <Text style={{ fontFamily: FontFamily.semibold, color: '#5A5B5B', fontSize: sizes.h6, lineHeight: 35 }}>Date of Joining</Text>
                                </View>
                                
                                    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>

                                        <View style={{width:'48%', marginBottom: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 0 }}>
                                            <FloatingTimePicker
                                                pickerType="date"
                                                pickerIconStyle={{ height: 18, width: 18, tintColor: '#707070' }}
                                                pickerIcon={LOCAL_ICONS.calender}
                                                editableStatus={true}
                                                labelName={'Date From'}
                                                inputContainerColor="#CACDD4"
                                                labelBg={colors.white}
                                                labelColor="#007AFF"
                                                placeholderColor="#8A8E9C"
                                                inputColor="#5A5B5B"
                                                //selectedValue={loginTime ? HelperFunctions.convertTo12HourFormat(loginTime) : ""}
                                                selectedValue={doj_from}
                                                inputMargin={0}
                                                confirmDateClick={(timestamp) => {
                                                    let formatedDate = (timestamp).toISOString().split('T')[0];
                                                    // setStartdate(formatedDate)
                                                    setdoj_from(formatedDate)
                                                }}
                                            />
                                        </View>

                                        <View style={{width:'48%', marginBottom: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 0 }}>
                                            <FloatingTimePicker
                                                pickerType="date"
                                                pickerIconStyle={{ height: 18, width: 18, tintColor: '#707070' }}
                                                pickerIcon={LOCAL_ICONS.calender}
                                                editableStatus={true}
                                                labelName={'Date To'}
                                                inputContainerColor="#CACDD4"
                                                labelBg={colors.white}
                                                labelColor="#007AFF"
                                                placeholderColor="#8A8E9C"
                                                inputColor="#5A5B5B"
                                                //selectedValue={loginTime ? HelperFunctions.convertTo12HourFormat(loginTime) : ""}
                                                selectedValue={doj_to}
                                                inputMargin={0}
                                                confirmDateClick={(timestamp) => {
                                                    let formatedDate = (timestamp).toISOString().split('T')[0];
                                                    // setStartdate(formatedDate)
                                                    setdoj_to(formatedDate)
                                                }}
                                            />
                                        </View>

                                    </View>

                                


                                <View style={{ marginBottom: 4, marginTop: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 0 }}>
                                    <Text style={{ fontFamily: FontFamily.semibold, color: '#5A5B5B', fontSize: sizes.h6, lineHeight: 35 }}>
                                        Date of exit
                                    </Text>
                                </View>
                                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>

                                        <View style={{width:'48%', marginBottom: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 0 }}>
                                            <FloatingTimePicker
                                                pickerType="date"
                                                pickerIconStyle={{ height: 18, width: 18, tintColor: '#707070' }}
                                                pickerIcon={LOCAL_ICONS.calender}
                                                editableStatus={true}
                                                labelName={'Date from'}
                                                inputContainerColor="#CACDD4"
                                                labelBg={colors.white}
                                                labelColor="#007AFF"
                                                placeholderColor="#8A8E9C"
                                                inputColor="#5A5B5B"
                                                //selectedValue={loginTime ? HelperFunctions.convertTo12HourFormat(loginTime) : ""}
                                                selectedValue={doe_from}
                                                inputMargin={0}
                                                confirmDateClick={(timestamp) => {
                                                    let formatedDate = (timestamp).toISOString().split('T')[0];
                                                    // setStartdate(formatedDate)
                                                    setdoe_from(formatedDate)
                                                }}
                                            />
                                        </View>

                                        <View style={{width:'48%', marginBottom: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 0 }}>
                                            <FloatingTimePicker
                                                pickerType="date"
                                                pickerIconStyle={{ height: 18, width: 18, tintColor: '#707070' }}
                                                pickerIcon={LOCAL_ICONS.calender}
                                                editableStatus={true}
                                                labelName={'Date To'}
                                                inputContainerColor="#CACDD4"
                                                labelBg={colors.white}
                                                labelColor="#007AFF"
                                                placeholderColor="#8A8E9C"
                                                inputColor="#5A5B5B"
                                                //selectedValue={loginTime ? HelperFunctions.convertTo12HourFormat(loginTime) : ""}
                                                selectedValue={doe_to}
                                                inputMargin={0}
                                                confirmDateClick={(timestamp) => {
                                                    let formatedDate = (timestamp).toISOString().split('T')[0];
                                                    // setStartdate(formatedDate)
                                                    setdoe_to(formatedDate)
                                                }}
                                            />
                                        </View>

                                    </View>

                            </> : null}


                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>

                                <CustomButton
                                    requireBorder={true}
                                    isLoading={btnLoaderStatus}
                                    backgroundColor={colors.white}
                                    buttonText="Clear Filter"
                                    buttonTextStyle={{ textAlign: 'center', letterSpacing: 1.2, fontFamily: FontFamily.medium, color: colors.primary, fontSize: sizes.h6 }}

                                    borderColor={colors.primary}
                                    style={{ width: '48%', borderRadius: 4, marginTop: 20, opacity: 1 }}
                                    onPress={() => {
                                        _clearFilter()
                                    }}
                                />

                                <CustomButton
                                    isLoading={btnLoaderStatus}
                                    backgroundColor={colors.primary}
                                    buttonText="Apply"
                                    buttonTextStyle={{ textAlign: 'center', letterSpacing: 1.2, fontFamily: FontFamily.medium, color: '#fff', fontSize: sizes.h6 }}
                                    requireBorder={false}
                                    borderColor={colors.white}
                                    style={{ width: '48%', borderRadius: 4, marginTop: 20, opacity: 1 }}
                                    onPress={() => {
                                        _applyFilter()
                                    }}
                                />
                            </View>
                        </View>
                    </View>

                </ScrollView>
                <Loader isLoading={waitLoaderStatus} />
            </View>


        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#F5F7FB'
    },
    optionsContainer: {
        //position: 'absolute',
        // top: 60, // Adjust the top position as per your UI design
        //left: 0,
        // right: 0,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 8,
        maxHeight: 200,
        marginTop: 6
        //zIndex: 100,
        //elevation: 5, // For Android elevation
    },
    optionItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },



});
export default EmployeeFilter;