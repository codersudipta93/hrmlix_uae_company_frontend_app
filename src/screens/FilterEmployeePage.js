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
} from '../constants/Theme';

import { LOCAL_IMAGES, LOCAL_ICONS, AllSourcePath } from '../constants/PathConfig';
import { HelperFunctions } from '../constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { getData, setData, deleteData } from '../Service/localStorage';
import { useDispatch, useSelector } from 'react-redux';
import { _setreffeshStatus } from '../Store/Reducers/ProjectReducer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from 'react-native/Libraries/NewAppScreen';
import CustomHeader from '../component/Header';

import { useTranslation } from 'react-i18next'; //for translation service
import IonIcon from 'react-native-vector-icons/Ionicons';
import Delete from '../assets/icons/Delete';
import Filter from '../assets/icons/Filter';
import FloatingLabelInput from '../component/FloatingLabelInput';
import FloatingDropdown from '../component/FloatingDropdown';
import CustomButton from '../component/CustomButton';
import { postApi } from '../Service/service';
import Loader from '../component/Loader';

const FilterEmployeePage = props => {
    const isFocused = useIsFocused();
    const route = useRoute();
    const dispatch = useDispatch();
    const { userDetails, token } = useSelector(state => state.project);
    const { t, i18n } = useTranslation();

    const [search, setSearchVal] = useState('');
    const [years, setYears] = useState(HelperFunctions.getLastFiveYears());
    const [selectedYear, setYear] = useState("");

    const [selectMonth, setMonth] = useState("");
    const [months, setMonths] = useState(HelperFunctions.getLastTwelveMonths());

    const [attendance, setattendance] = useState([{ label: 'Whole Day', value: 'wholeday' }, { label: 'Monthly', value: 'monthly' }, { label: 'Time', value: 'time' }, { label: 'Half Day', value: 'halfday' }]);
    const [selectedAttendance, setSelectedAttendance] = useState("");


    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState([]);

    const [branchData, setBranch] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState([]);

    const [departmentData, setDepartment] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState([]);

    const [designationData, setDesignation] = useState([]);
    const [selectedDesignation, setSelectedDesignation] = useState([]);

    const [hodData, setHod] = useState([]);
    const [selectedHod, setSelectedHod] = useState([]);

    const [btnLoaderStatus, setBtnLoaderStatus] = useState(false);
    const [waitLoaderStatus, setWaitLoaderStatus] = useState(false);



    const handleSelect = (option) => {
        setYear(option);
        console.log(option)
    };

    useEffect(() => {
        if (isFocused == true) {

            console.log(i18n.language);
            console.log(I18nManager.isRTL);
            getDropDownMaster()
        }
    }, [isFocused]);


    useEffect(() => {

    }, []);

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


    const getDropDownMaster = () => {
        setWaitLoaderStatus(true)
        postApi("company/get-employee-master", {}, token)
            .then((resp) => {
                console.log(resp?.masters);

                if (resp?.status == 'success') {
                    let mData = resp?.masters;
                    setClients(mData?.clients)
                    setBranch(mData?.branch?.company_branch)
                    setDepartment(mData?.department)
                    setHod(mData?.hod);
                    setDesignation(mData?.designation);

                    if (props?.route?.params) {
                        let pdata = props?.route?.params?.paramData;
                        console.log("Data from attendance page ====> ", pdata);

                        setSearchVal(pdata?.searchkey);
                        setClients(HelperFunctions.updateSelectedArrObjects(mData?.clients, pdata?.clientData, '_id'))
                        setSelectedClient(pdata?.clientData);

                        setDepartment(HelperFunctions.updateSelectedArrObjects(mData?.department, pdata?.departmentData, '_id'))
                        setSelectedDepartment(pdata?.departmentData);

                        setSelectedAttendance(pdata?.attendance_type);
                        setattendance(HelperFunctions.updateSelectedObjects(attendance, pdata?.attendance_type))

                        setYear(pdata?.search_year);
                        setYears(HelperFunctions.updateSelectedObjects(years, pdata?.search_year))

                        setMonth(pdata?.search_month);
                        setMonths(HelperFunctions.updateSelectedObjects(months, pdata?.search_month))

                        setDesignation(HelperFunctions.updateSelectedArrObjects(mData?.designation, pdata?.designationData, '_id'))
                        setSelectedDesignation(pdata?.designationData);

                        setBranch(HelperFunctions.updateSelectedArrObjects(mData?.branch?.company_branch, pdata?.branchData, '_id'))
                        setSelectedBranch(pdata?.branchData);

                        setHod(HelperFunctions.updateSelectedArrObjects(mData?.hod, pdata?.hodData, '_id'))
                        setSelectedHod(pdata?.hodData);

                    }

                    setWaitLoaderStatus(false)
                } else {
                    HelperFunctions.showToastMsg(resp.message);
                    setWaitLoaderStatus(false)
                }

            }).catch((err) => {
                console.log(err);
                setWaitLoaderStatus(false)
                HelperFunctions.showToastMsg(err.message);
            })
    }



    const _applyFilter = () => {
        let paramData = {
            "pageno": 1,
            "search_month": selectMonth,
            "search_year": selectedYear,
            "attendance_type": selectedAttendance,
            "branchData": selectedBranch,
            "designationData": selectedDesignation,
            "departmentData": selectedDepartment,
            "hodData": selectedHod,
            "clientData": selectedClient,
            "search_day": props?.route?.params?.paramData?.search_day ? props?.route?.params?.paramData?.search_day : "",
            "searchkey": search ? search : ""
        }

        if (props?.route?.params?.from == 'attendanceView_page') {
            console.log(props?.route?.params?.empData)
            props.navigation.navigate('EployeeAttendanceView', { empData: props?.route?.params?.empData, filterdata: paramData, })
        } else {
            props.navigation.navigate('Attendance', { paramData: paramData, from: "Filterpage" })
            dispatch(_setreffeshStatus(true))
        }

    }

    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.main}>
                <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
                <CustomHeader
                    buttonText={t('Attendance')}
                    style={{ flexDirection: 'row' }}
                    iconStyle={{ height: 28, width: 28, borderRadius: 50 }}
                    icon={LOCAL_IMAGES.user}
                    searchIcon={true}
                />

                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={{ paddingHorizontal: 14, marginTop: 12 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, }}>
                            <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h5 }}>Search Employee</Text>
                        </View>

                        <View style={{ padding: 12, backgroundColor: colors.white, borderRadius: 8, marginBottom: 20 }}>

                            {props?.route?.params?.from == "attendance_page" ?
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
                                : null}

                            <FloatingDropdown
                                multiSelect={false}
                                labelName="Year"
                                selectedValueData={selectedYear != '' ? selectedYear : ""}
                                options={years}
                                listLabelKeyName={['label']}
                                onSelect={(option) => {

                                    let data = HelperFunctions.copyArrayOfObj(years);
                                    for (let k = 0; k < data.length; k++) {
                                        if (data[k].value == option.value) {
                                            data[k].selected = data[k].selected == true ? false : true;
                                            setYear(data[k])
                                        } else {
                                            data[k].selected = false;
                                        }
                                    }

                                    setYears(data)

                                }}
                                inputContainerColor="#CACDD4"
                                labelBg={colors.white}
                                labelColor="#007AFF"
                                placeholderColor="#8A8E9C"
                                inputColor={colors.primary}
                                isFocusVal={selectedYear ? true : false}
                                inputMargin={0}
                            />

                            <FloatingDropdown
                                multiSelect={false}
                                labelName="Month"
                                selectedValueData={selectMonth != '' ? selectMonth : ""}
                                options={months}
                                listLabelKeyName={['label']}
                                onSelect={(option) => {

                                    let data = HelperFunctions.copyArrayOfObj(months);
                                    for (let k = 0; k < data.length; k++) {
                                        if (data[k].value == option.value) {
                                            data[k].selected = data[k].selected == true ? false : true;
                                            setMonth(data[k])
                                        } else {
                                            data[k].selected = false;
                                        }
                                    }

                                    setMonths(data)
                                }}
                                inputContainerColor="#CACDD4"
                                labelBg={colors.white}
                                labelColor="#007AFF"
                                placeholderColor="#8A8E9C"
                                inputColor={colors.primary}
                                isFocusVal={selectMonth ? true : false}
                                inputMargin={20}
                            />

                            {props?.route?.params?.from == "attendance_page" ?

                                <FloatingDropdown
                                    multiSelect={false}
                                    labelName="Attendance"
                                    options={attendance}
                                    listLabelKeyName={['label']}
                                    selectedValueData={selectedAttendance != '' ? selectedAttendance : ""}
                                    onSelect={(option) => {

                                        let data = HelperFunctions.copyArrayOfObj(attendance);
                                        for (let k = 0; k < data.length; k++) {
                                            if (data[k].value == option.value) {
                                                data[k].selected = data[k].selected == true ? false : true;
                                                setSelectedAttendance(data[k])
                                            } else {
                                                data[k].selected = false;
                                            }
                                        }

                                        setattendance(data)

                                    }}
                                    inputContainerColor="#CACDD4"
                                    labelBg={colors.white}
                                    labelColor="#007AFF"
                                    placeholderColor="#8A8E9C"
                                    inputColor={colors.primary}
                                    isFocusVal={selectMonth ? true : false}
                                    inputMargin={20}
                                />
                                : null}

                            {props?.route?.params?.from == "attendance_page" ? <>


                                <FloatingDropdown
                                    labelName="Client"
                                    multiSelect={true}
                                    options={clients}
                                    listLabelKeyName={['client_name', 'client_code']}
                                    bracketAfterPositionIndex={0}
                                    selectedValueData={selectedClient}
                                    onSelect={(option) => {
                                        let data = HelperFunctions.copyArrayOfObj(clients);
                                        for (let k = 0; k < data.length; k++) {
                                            if (data[k]._id == option._id) {
                                                data[k].selected = data[k].selected == true ? false : true
                                            }
                                        }

                                        setClients(data)

                                        setSelectedClient(prevClients => {
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
                                    inputMargin={20}
                                />


                                <FloatingDropdown
                                    multiSelect={true}
                                    labelName="Branch"
                                    options={branchData}
                                    listLabelKeyName={['branch_name']}
                                    selectedValueData={selectedBranch}

                                    onSelect={(option) => {
                                        let data = HelperFunctions.copyArrayOfObj(branchData);
                                        for (let k = 0; k < data.length; k++) {
                                            if (data[k]._id == option._id) {
                                                data[k].selected = data[k].selected == true ? false : true
                                            }
                                        }

                                        setBranch(data)

                                        setSelectedBranch(prevClients => {
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
                                    isFocusVal={selectMonth ? true : false}
                                    inputMargin={20}
                                />


                                <FloatingDropdown
                                    multiSelect={true}
                                    labelName="Department"
                                    options={departmentData}
                                    listLabelKeyName={['department_name']}
                                    selectedValueData={selectedDepartment}

                                    onSelect={(option) => {
                                        let data = HelperFunctions.copyArrayOfObj(departmentData);
                                        for (let k = 0; k < data.length; k++) {
                                            if (data[k]._id == option._id) {
                                                data[k].selected = data[k].selected == true ? false : true
                                            }
                                        }

                                        setDepartment(data)

                                        setSelectedDepartment(prevClients => {
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
                                    isFocusVal={selectMonth ? true : false}
                                    inputMargin={20}
                                />


                                <FloatingDropdown
                                    multiSelect={true}
                                    labelName="Designation"
                                    options={designationData}
                                    listLabelKeyName={['designation_name']}
                                    selectedValueData={selectedDesignation}

                                    onSelect={(option) => {
                                        let data = HelperFunctions.copyArrayOfObj(designationData);
                                        for (let k = 0; k < data.length; k++) {
                                            if (data[k]._id == option._id) {
                                                data[k].selected = data[k].selected == true ? false : true
                                            }
                                        }

                                        setDesignation(data)

                                        setSelectedDesignation(prevClients => {
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
                                    isFocusVal={selectMonth ? true : false}
                                    inputMargin={20}
                                    bracketAfterPositionIndex={1}
                                />

                                <FloatingDropdown
                                    multiSelect={true}
                                    labelName="HOD"
                                    options={hodData}
                                    listLabelKeyName={['first_name', 'last_name']}
                                    selectedValueData={selectedHod}

                                    onSelect={(option) => {
                                        let data = HelperFunctions.copyArrayOfObj(hodData);
                                        for (let k = 0; k < data.length; k++) {
                                            if (data[k]._id == option._id) {
                                                data[k].selected = data[k].selected == true ? false : true
                                            }
                                        }

                                        setHod(data)

                                        setSelectedHod(prevClients => {
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
                                    isFocusVal={selectMonth ? true : false}
                                    inputMargin={20}
                                    bracketAfterPositionIndex={1}
                                />

                            </> : null}

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                {props?.route?.params?.from == 'attendance_page' ?
                                    <CustomButton
                                        requireBorder={true}
                                        isLoading={btnLoaderStatus}
                                        backgroundColor={colors.white}
                                        buttonText="Clear Filter"
                                        buttonTextStyle={{ textAlign: 'center', letterSpacing: 1.2, fontFamily: FontFamily.medium, color: colors.primary, fontSize: sizes.h6 }}

                                        borderColor={colors.primary}
                                        style={{ width: '48%', borderRadius: 8, marginTop: 20, opacity: 1 }}
                                        onPress={() => {
                                            //_applyFilter()
                                        }}
                                    /> : null}

                                <CustomButton
                                    isLoading={btnLoaderStatus}
                                    backgroundColor={colors.primary}
                                    buttonText="Apply"
                                    buttonTextStyle={{ textAlign: 'center', letterSpacing: 1.2, fontFamily: FontFamily.medium, color: '#fff', fontSize: sizes.h6 }}
                                    requireBorder={false}
                                    borderColor={colors.white}
                                    style={{ width: props?.route?.params?.from == 'attendance_page' ?'48%' : '100%', borderRadius: 8, marginTop: 20, opacity: 1 }}
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
export default FilterEmployeePage;