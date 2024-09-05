
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
    Modal,
    TextInput,
    Switch
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

import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from 'react-native/Libraries/NewAppScreen';
import CustomHeader from '../component/Header';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useTranslation } from 'react-i18next'; //for translation service
import IonIcon from 'react-native-vector-icons/Ionicons';
import Delete from '../assets/icons/Delete';
import Eye from '../assets/icons/Eye';
import BootomSheet from '../component/BootomSheet';
import CustomButton from '../component/CustomButton';
import Arrow from '../assets/icons/Arrow';
import { postApi } from '../Service/service';
import FloatingLabelInput from '../component/FloatingLabelInput';
import Loader from '../component/Loader';

const DocumentVault = props => {
    const isFocused = useIsFocused();
    const route = useRoute();
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();

    const { userDetails, token } = useSelector(state => state.project);

    // Animation state
    const [animValue] = useState(new Animated.Value(1000)); // Start off-screen

    const [docActionModalVisible, setDocActionModalVisible] = useState(false);
    const [formModalVisibility, setformModalVisibility] = useState(false);
    const [loadingView, setloadingView] = useState(false);
    const [isBtnLoading, setBtnLoading]= useState(false);

    const [selectedOption, setSelectedOption] = useState('');
    const [documentList, setdocumentList] = useState('');
    const [selectedDoc, setselectedDoc] = useState('');
    const [vaultName, setVaultName] = useState("");
    const [vaultDescription, onChangeVaultDescription] = useState('');
    const [validationRequireStatus, setValidationRequireStatus] = useState(false);
    const expireValiditySwitch = () => setValidationRequireStatus(previousState => !previousState);


    const [expireNotificationStatus, setExpireNotificationStatus] = useState(false);
    const expireToggleSwitch = () => setExpireNotificationStatus(previousState => !previousState);

    const [vaultExpiryDays, setVaultExpiryDays] = useState('');


    

    useEffect(() => {
        if (isFocused == true) {
            console.log(i18n.language);
            console.log(I18nManager.isRTL);
           
            getFolderData()
        }
    }, [isFocused]);


    const getFolderData = () => {
        setloadingView(!loadingView)
        postApi("company/get-document-master", { pageno: 1 }, token)
            .then((resp) => {
                console.log(resp);

                if (resp?.status == 'success') {
                    setdocumentList(resp?.data?.docs);
                    setloadingView(false);
                    setformModalVisibility(false);
                } else if (resp?.status == 'val_err') {
                    setloadingView(false)
                    let message = ""
                    for (const key in resp.val_msg) {
                        if (resp.val_msg[key].message) {
                            message = resp.val_msg[key].message;
                            break;
                        }
                    }
                    HelperFunctions.showToastMsg(message);

                } else {
                    setloadingView(false)
                    HelperFunctions.showToastMsg(resp.message);

                }

            }).catch((err) => {
                setloadingView(false)
                HelperFunctions.showToastMsg(err.message);
            })
    }

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


    const deleteValutForm = () => {
        if (token) {
            setDocActionModalVisible(!docActionModalVisible)
            Acknoledge_delete();
        } else {
            setDocActionModalVisible(!docActionModalVisible)
        }
    }

    const openDocmentFormModal = (ACTION_TYPE) => {
        setformModalVisibility(!formModalVisibility);
        setDocActionModalVisible(false);
        if (ACTION_TYPE == 'Edit') {
            setVaultName(selectedDoc?.document_type_name)
            onChangeVaultDescription(selectedDoc?.description)
            setValidationRequireStatus(selectedDoc?.validity_req != null ? selectedDoc?.validity_req == 'yes' ? true : false : false)
            setExpireNotificationStatus(selectedDoc?.notification_req != null ? selectedDoc?.notification_req == 'yes' ? true : false : false)
            setVaultExpiryDays(selectedDoc?.no_of_days)
        } else {
            setVaultName();
            onChangeVaultDescription();
            setValidationRequireStatus(false);
            setExpireNotificationStatus(false);
            setVaultExpiryDays("");
        }
    }

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    //Add or Update value
    submitValue = () => {
        if (!vaultName) {
            HelperFunctions.showToastMsg("Please enter vault name");
        } else if (expireNotificationStatus == true && !vaultExpiryDays) {
            HelperFunctions.showToastMsg("Please enter vault expiry in days");
        } else {
            setBtnLoading(true);
            documentSubmitApi();
        }
    }

   

    const documentSubmitApi = () => {
        let param = {
            "document_master_id": selectedDoc?._id ? selectedDoc?._id : null,
            "document_type_name": vaultName,
            "validity_req": validationRequireStatus == true ? 'yes' : 'no',
            "description": vaultDescription,
            "notification_req": expireNotificationStatus == true ? 'yes' : 'no',
            "no_of_days": vaultExpiryDays
        }
        
        console.log(param)
        postApi(selectedDoc != "" ? "company/edit-document-master" : "company/add-document-master", param, token)
            .then((resp) => {
                console.log(resp);
                if (resp?.status == 'success') {
                    HelperFunctions.showToastMsg(resp?.message);
                    getFolderData();
                    setBtnLoading(false);
                } else if (resp?.status == 'val_err') {
                    setBtnLoading(false);
                    let message = ""
                    for (const key in resp.val_msg) {
                        if (resp.val_msg[key].message) {
                            message = resp.val_msg[key].message;
                            break;
                        }
                    }
                    HelperFunctions.showToastMsg(message);
                } else {
                    setBtnLoading(false);
                    HelperFunctions.showToastMsg(resp.message);
                }

            }).catch((err) => {
                setBtnLoading(false);
                console.log(err);
                HelperFunctions.showToastMsg(err.message);
            })
    }

    const Acknoledge_delete = () => {
        Alert.alert('Alert', 'Are you sure, you want to delete ' + selectedDoc?.document_type_name + ' ?', [
            {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
            },
            {
                text: 'YES', onPress: () => {
                    postApi("company/delete-document-master", { document_master_id: selectedDoc?._id }, token)
                        .then((resp) => {
                            console.log(resp);
                            if (resp?.status == 'success') {
                                HelperFunctions.showToastMsg('Successfully Deleted');
                                getFolderData()
                            } else if (resp?.status == 'val_err') {
                                let message = ""
                                for (const key in resp.val_msg) {
                                    if (resp.val_msg[key].message) {
                                        message = resp.val_msg[key].message;
                                        break;
                                    }
                                }
                                HelperFunctions.showToastMsg(message);
                            } else {
                                HelperFunctions.showToastMsg(resp.message);
                            }

                        }).catch((err) => {
                            console.log(err);
                            HelperFunctions.showToastMsg(err.message);
                        })
                }
            },
        ]);
        return true;
    };



    const folderRender = ({ index, item }) => (
        <View style={styles.card}>
            <View style={{ height: '50%' }}>
                <Icon name="folder" size={50} color="#007BFF" />
            </View>
            <View style={{ height: '50%' }}>
                <Text style={styles.label} numberOfLines={2} ellipsizeMode='head'>{item?.document_type_name}</Text>
            </View>

            <TouchableOpacity onPress={() => {
                setselectedDoc(item);
                setDocActionModalVisible(!docActionModalVisible)
            }} style={styles.moreButton}>
                <Icon name="more-vert" size={20} color="#333" />
            </TouchableOpacity>
        </View>
    );



    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.main}>
                <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
                <CustomHeader
                    buttonText={t('Documents Vault')}
                    style={{ flexDirection: 'row' }}
                    iconStyle={{ height: 30, width: 30, borderRadius: 50 }}
                    icon={LOCAL_IMAGES.user}
                    searchIcon={true}
                />

                <View style={{ paddingTop: 12, justifyContent: 'center', alignItems: 'center' }}>
                    <FlatList
                        data={documentList}
                        renderItem={folderRender}
                        keyExtractor={(item) => item.id}
                        numColumns={3}
                    />

                </View>

                <TouchableOpacity onPress={() => {
                    setselectedDoc("");
                    setSelectedOption("Add");
                    openDocmentFormModal("Add");
                }} style={styles.addButton}>
                    <Icon name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>


            <Modal
                animationType="fade"
                transparent={true}
                visible={docActionModalVisible}
                onRequestClose={() => onClose(null)}

            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingVertical: 0 }}>

                            <IonIcon
                                name="close"
                                size={24}
                                color={'#8A8E9C'}
                                onPress={() => { setDocActionModalVisible(!docActionModalVisible) }}
                            />
                        </View>
                        <View style={[styles.radioContainer, { marginTop: 20 }]}>
                            <Pressable onPress={() => handleOptionChange('Edit')} style={styles.radioButton}>
                                {/* <View style={selectedOption === 'Edit' ? styles.radioSelected : styles.radioUnselected} /> */}
                                <Icon name={selectedOption === 'Edit' ? "radio-button-checked" : "radio-button-unchecked"} size={24} color={selectedOption === 'Edit' ? colors.primary : "#ACACAC"} />
                                <Text style={styles.radioText}>Edit</Text>
                            </Pressable>

                            <Pressable onPress={() => handleOptionChange('Delete')} style={styles.radioButton}>
                                {/* <View style={selectedOption === 'Delete' ? styles.radioSelected : styles.radioUnselected} /> */}
                                <Icon name={selectedOption === 'Delete' ? "radio-button-checked" : "radio-button-unchecked"} size={24} color={selectedOption === 'Delete' ? colors.primary : "#ACACAC"} />
                                <Text style={styles.radioText}>Delete</Text>
                            </Pressable>
                        </View>

                        <TouchableOpacity onPress={() => { selectedOption == "Edit" ? openDocmentFormModal('Edit') : deleteValutForm() }} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>


            <Modal
                animationType="fade"
                transparent={true}
                visible={formModalVisibility}
                onRequestClose={() => onClose(null)}

            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { width: '90%', maxHeight: '100%', }]}>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 }}>
                            <Text style={{ fontFamily: FontFamily.semibold, fontSize: sizes.h5, color: '#4E525E' }}> {selectedOption == 'Edit' ? 'Update Valut' : 'Add Vault'}</Text>
                            <IonIcon
                                name="close"
                                size={24}
                                color={'#8A8E9C'}
                                onPress={() => { setformModalVisibility(!formModalVisibility) }}
                            />
                        </View>
                        <View style={[styles.radioContainer, { width: '100%', flexDirection: 'column',marginBottom:20 }]}>
                            <FloatingLabelInput
                                labelColor="#6F7880"
                                labelBg="#fff"
                                inputColor="#5A5B5B"
                                placeholderColor="#8A8E9C"
                                inputContainerColor={vaultName != "" ? "#60B057" : "#CACDD4"}
                                //top={20}
                                marginBottom={12}
                                label="Vault Name"
                                placeholder="Write vault name"
                                value={vaultName != null ? vaultName.toString() : vaultName}
                                onChangeText={setVaultName}
                            />

                            <TextInput
                                onChangeText={onChangeVaultDescription}
                                value={vaultDescription}
                                multiline={true}
                                numberOfLines={10}
                                placeholder='Vault Description'
                                style={{ color: "#5A5B5B", height: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: '#CACDD4', borderRadius: 8, paddingLeft: 12, fontFamily: FontFamily.regular, fontSize: sizes.h6 }}
                            />
                            <View style={{ fontFamily: FontFamily.regular, fontSize: sizes.h6 - 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', paddingLeft: 6, marginTop: 12 }}>

                                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontFamily: FontFamily.regular, fontSize: sizes.h6 - 1 }}>Validity Required?</Text>
                                    <Switch
                                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                                        thumbColor={validationRequireStatus ? '#007AFF' : '#f4f3f4'}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={expireValiditySwitch}
                                        value={validationRequireStatus}
                                    />
                                </View>
                                {validationRequireStatus == true ?
                                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
                                        <Text style={{ fontFamily: FontFamily.regular, fontSize: sizes.h6 - 1 }}>Expiring Notification ?</Text>
                                        <Switch
                                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                                            thumbColor={expireNotificationStatus ? '#007AFF' : '#f4f3f4'}
                                            ios_backgroundColor="#3e3e3e"
                                            onValueChange={expireToggleSwitch}
                                            value={expireNotificationStatus}
                                        />
                                    </View>
                                    : null}

                                {expireNotificationStatus == true ?
                                    <FloatingLabelInput
                                        labelColor="#6F7880"
                                        labelBg="#fff"
                                        inputColor="#5A5B5B"
                                        placeholderColor="#8A8E9C"
                                        inputContainerColor={vaultExpiryDays != "" ? "#60B057" : "#CACDD4"}
                                        top={20}
                                        //marginBottom={12}
                                        label="Expire in (days)"
                                        placeholder="No of days"
                                        value={vaultExpiryDays != null ? vaultExpiryDays.toString() : vaultExpiryDays}
                                        onChangeText={setVaultExpiryDays}
                                    />
                                    : null}

                            </View>

                        </View>

                        {/* <TouchableOpacity onPress={() => { submitValue() }} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Submit</Text>
                        </TouchableOpacity> */}

                        <CustomButton
                            isLoading={isBtnLoading}
                            backgroundColor={colors.primary}
                            buttonText={selectedOption == 'Add' ? "SUBMIT" : 'UPDATE'}
                            buttonTextStyle={{ textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1.2, fontFamily: FontFamily.medium, color: '#fff', fontSize: sizes.h6 - 1, lineHeight: 23 }}
                            requireBorder={false}
                            borderColor={colors.white}
                            style={{ width: '40%', borderRadius: 8, marginTop: 0, paddingVertical: 0 }}
                            onPress={() => { submitValue() }}
                        />

                    </View>

                </View>
            </Modal>

            <Loader isLoading={loadingView} />
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#F5F7FB',


    },
    modalheadingText: {
        fontSize: sizes.h5,
        marginBottom: 10,
        fontFamily: FontFamily.semibold,
        color: '#4E525E'
    },
    leftText: {
        fontSize: sizes.h6,
        marginBottom: 10,
        fontFamily: FontFamily.regular,
        color: '#868F9A'
    },
    rightText: {
        fontSize: sizes.h6,
        marginBottom: 10,
        fontFamily: FontFamily.medium,
        color: '#4E525E'
    },

    row: {
        justifyContent: 'space-between',
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#007BFF',
        borderRadius: 50,
        padding: 15,
        elevation: 5,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        width: '28%',
        position: 'relative',
        height: 129,

    },
    label: {
        marginTop: 10,
        fontSize: 14,
        color: '#3E3E3E',
        textAlign: 'center',
        fontFamily: FontFamily.medium,
        textTransform: "capitalize"
    },
    moreButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 10,
        borderRadius: 10,
        width: '60%',
        maxHeight: '80%',
        justifyContent: 'center',
        alignItems: 'center'
    },

    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 35,
        marginTop: 25,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioText: {
        marginLeft: 10,
        fontSize: 14,
        fontFamily: FontFamily.medium,
        color: '#656667'
    },
    radioSelected: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#2089dc',
        backgroundColor: '#2089dc',
    },
    radioUnselected: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#2089dc',
        backgroundColor: 'white',
    },
    submitButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 8,
        paddingHorizontal: 5,
        width: '40%'
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center'
    },
});
export default DocumentVault;