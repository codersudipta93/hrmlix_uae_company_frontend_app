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

const FilterPayroll = props => {
    const isFocused = useIsFocused();
    const route = useRoute();
    const dispatch = useDispatch();
    const { userDetails,companyData, token, needRefresh, masterData } = useSelector(state => state.project);
    const { t, i18n } = useTranslation();

    const [search, setSearchVal] = useState('');

    const [years, setYears] = useState(HelperFunctions.getLastFiveYears());
    const [selectedYear, setYear] = useState("");

    const [selectMonth, setMonth] = useState("");
    const [months, setMonths] = useState(HelperFunctions.getLastTwelveMonths());

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

    const [bank_id, setbank_id] = useState("");
    const [bank_ids, setbank_ids] = useState("");

    const [btnLoaderStatus, setBtnLoaderStatus] = useState(false);
    const [waitLoaderStatus, setWaitLoaderStatus] = useState(false);



    const [doj_from, setdoj_from] = useState("");
    const [doj_to, setdoj_to] = useState("");


    useEffect(() => {
        if (isFocused == true) {

            console.log(i18n.language);
            console.log(I18nManager.isRTL);
            // getDropDownMaster()

            if (props?.route?.params) {
                let pdata = props?.route?.params?.paramData;
                console.log("Data from employee list page ====> ", pdata);
                console.log("masterData", masterData)
                setSearchVal(pdata?.emp_name);

                // clients
                setclient_id(pdata?.client_id ? pdata?.client_id : []); 
                setclient_ids(HelperFunctions.updateSelectedArrObjects(masterData?.clients, pdata?.client_id ? pdata?.client_id : [], '_id'));

                setbranch_id(pdata?.branch_id ? pdata?.branch_id : []);
                setbranch_ids(HelperFunctions.updateSelectedArrObjects(masterData?.branch?.company_branch, pdata?.branch_id ? pdata?.branch_id : [], '_id'));

                setdepartment_id(pdata?.department_id ? pdata?.department_id : []);
                setdepartment_ids(HelperFunctions.updateSelectedArrObjects(masterData?.department, pdata?.department_id ? pdata?.department_id : [], '_id'));

                setdesignation_id(pdata?.designation_id ? pdata?.designation_id : []);
                setdesignation_ids(HelperFunctions.updateSelectedArrObjects(masterData?.designation, pdata?.designation_id ? pdata?.designation_id : [], '_id'));
                setMonth(pdata?.search_month);
                setMonths(HelperFunctions.updateSelectedObjects(months, pdata?.search_month ? pdata?.search_month :""))
                setYear(pdata?.search_year);
                setYears(HelperFunctions.updateSelectedObjects(years, pdata?.search_year ? pdata?.search_year : ""))

                let bankAccount = masterData?.bank_accounts;
                let bankAccountArr = [];
                console.log("masterData?.bank_accounts");

                for (let k = 0; k < bankAccount.length; k++) {
                    if (bankAccount[k] != "") {
                        let obj = {
                            "bank_name": bankAccount[k],
                        }
                        bankAccountArr.push(obj)
                    }
                }

                console.log(bankAccountArr);
                setbank_ids(bankAccountArr);
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
            "department_id": department_id != "" ? department_id : "",
            "designation_id": designation_id != "" ? designation_id : "",
            "branch_id": branch_id != "" ? branch_id : "",
            "client_id": client_id != "" ? client_id : "",
            "hod_id": hod_id != "" ? hod_id : "",
            "doj_from": doj_from ? doj_from : "",
            "doj_to": doj_to ? doj_to : "",
            "emp_name": search
        }

        console.log(apiParam);
        dispatch(_setreffeshStatus(true));
        // alert(props?.route?.params?.paramData?.page_component_name)
        props.navigation.navigate(props?.route?.params?.paramData?.page_component_name, { paramData: apiParam })

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

        setdoj_from([]);
        setdoj_from([]);

        let paramData = {
            "department_id": "",
            "designation_id": "",
            "branch_id": "",
            "client_id": "",
            "hod_id": "",
            "doj_from": "",
            "doj_to": "",
            "emp_name": ""
        }

        props.navigation.navigate(props?.route?.params?.paramData?.page_component_name, { paramData: paramData })
        dispatch(_setreffeshStatus(true));
    }

    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.main}>
                <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
               <CustomHeader hideUserIcon={true}
                    buttonText={t('Filterss')}
                    style={{ flexDirection: 'row' }}
                    iconStyle={{ height: 28, width: 28, borderRadius: 50 }}
                    icon={LOCAL_IMAGES.user}
                    searchIcon={false}
                />

                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={{ paddingHorizontal: 14, marginTop: 12 }}>

                        <View style={{ padding: 12, backgroundColor: colors.white, borderRadius: 8, marginBottom: 20 }}>

                            <FloatingLabelInput
                                label={"Search"}
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


                            <FloatingDropdown
                                multiSelect={false}
                                labelName="Bank Name"
                                selectedValueData={bank_id != '' ? bank_id : ""}
                                options={bank_ids}
                                listLabelKeyName={['bank_name']}
                                onSelect={(option) => {

                                    let data = HelperFunctions.copyArrayOfObj(bank_ids);
                                    for (let k = 0; k < data.length; k++) {
                                        if (data[k].bank_name == option.bank_name) {
                                            data[k].selected = data[k].selected == true ? false : true;
                                            setbank_id(data[k])
                                        } else {
                                            data[k].selected = false;
                                        }
                                    }

                                    setbank_ids(data)
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
                                inputMargin={16}
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
export default FilterPayroll;