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
import IonIcon from 'react-native-vector-icons/Ionicons';
import Delete from '../../assets/icons/Delete';
import Filter from '../../assets/icons/Filter';
import FloatingLabelInput from '../../component/FloatingLabelInput';
import FloatingDropdown from '../../component/FloatingDropdown';
import CustomButton from '../../component/CustomButton';
import { postApi } from '../../Service/service';
import Loader from '../../component/Loader';
import FloatingTimePicker from '../../component/FloatingTimePicker';
import FloatingYearMonthPicker from '../../component/FloatingYearMonthPicker';

const CalculatedRevisionFilter = props => {
    const isFocused = useIsFocused();
    const route = useRoute();
    const dispatch = useDispatch();
    const { userDetails, token, needRefresh, masterData } = useSelector(state => state.project);
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


    const [btnLoaderStatus, setBtnLoaderStatus] = useState(false);
    const [waitLoaderStatus, setWaitLoaderStatus] = useState(false);



    useEffect(() => {
        if (isFocused == true) {

            console.log(i18n.language);
            console.log(I18nManager.isRTL);
            // getDropDownMaster()

            if (props?.route?.params) {
                let pdata = props?.route?.params?.paramData;
                console.log("Data from salary revision page ====> ", pdata);

                setSearchVal(pdata?.searchkey);


                setbranch_id(pdata?.branch_id ? pdata?.branch_id : []);
                setbranch_ids(HelperFunctions.updateSelectedArrObjects(masterData?.branch?.company_branch, pdata?.branch_id ? pdata?.branch_id : [], '_id'));

                setdepartment_id(pdata?.department_id ? pdata?.department_id : []);
                setdepartment_ids(HelperFunctions.updateSelectedArrObjects(masterData?.department, pdata?.department_id ? pdata?.department_id : [], '_id'));

                setdepartment_id(pdata?.department_id ? pdata?.department_id : []);
                setdepartment_ids(HelperFunctions.updateSelectedArrObjects(masterData?.department, pdata?.department_id ? pdata?.department_id : [], '_id'));

                setdepartment_id(pdata?.department_id ? pdata?.department_id : []);
                setdepartment_ids(HelperFunctions.updateSelectedArrObjects(masterData?.department, pdata?.department_id ? pdata?.department_id : [], '_id'));


                setdesignation_id(pdata?.designation_id ? pdata?.designation_id : []);
                setdesignation_ids(HelperFunctions.updateSelectedArrObjects(masterData?.designation, pdata?.designation_id ? pdata?.designation_id : [], '_id'));

                sethod_id(pdata?.hod_id ? pdata?.hod_id : []);
                sethod_ids(HelperFunctions.updateSelectedArrObjects(masterData?.hod, pdata?.hod_id ? pdata?.hod_id : [], '_id'));
            }
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


    const _applyFilter = () => {
        let paramData = {
            "pageno": 1,
            "perpage": 100,
            "department_id": department_id != "" ? department_id : "",
            "hod_id": hod_id != "" ? hod_id : "",
            "designation_id": designation_id != "" ? designation_id : "",
            "branch_id": branch_id != "" ? branch_id : "",
            "searchkey": search ? search : "",
        }

        props.navigation.navigate('CalculatedRevision', { paramData: paramData })
        dispatch(_setreffeshStatus(true));
        console.log(paramData)
    }

    const clearFilter = () => {
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
            "department_id":  "",
            "hod_id":  "",
            "designation_id":  "",
            "branch_id":  "",
            "searchkey":  "",
        }

        props.navigation.navigate('CalculatedRevision', { paramData: paramData })
        dispatch(_setreffeshStatus(true));

    }

    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.main}>
                <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
                <CustomHeader
                    buttonText={t('Filter')}
                    style={{ flexDirection: 'row' }}
                    iconStyle={{ height: 28, width: 28, borderRadius: 50 }}
                    icon={LOCAL_IMAGES.user}
                    searchIcon={false}
                />

                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={{ paddingHorizontal: 14, marginTop: 12 }}>
                        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, }}>
                            <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h5 }}>Apply Revision</Text>
                        </View> */}

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
                                inputMargin={0}
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
                                    let data = HelperFunctions.copyArrayOfObj(department_ids);
                                    for (let k = 0; k < data.length; k++) {
                                        if (data[k]._id == option._id) {
                                            data[k].selected = data[k].selected == true ? false : true;
                                            // setdepartment_id(data[k])
                                        }
                                    }

                                    setdesignation_ids(data)

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




                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                                <CustomButton
                                    requireBorder={true}
                                    isLoading={btnLoaderStatus}
                                    backgroundColor={colors.white}
                                    buttonText="Clear Filter"
                                    buttonTextStyle={{ textAlign: 'center', letterSpacing: 1.2, fontFamily: FontFamily.medium, color: colors.primary, fontSize: sizes.h6 }}

                                    borderColor={colors.primary}
                                    style={{ width: '48%', borderRadius: 4, marginTop: 20, opacity: 1 }}
                                    onPress={() => {
                                        clearFilter()
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
export default CalculatedRevisionFilter;