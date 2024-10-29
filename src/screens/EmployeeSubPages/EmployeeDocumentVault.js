
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
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useTranslation } from 'react-i18next'; //for translation service
import IonIcon from 'react-native-vector-icons/Ionicons';
import Delete from '../../assets/icons/Delete';
import Eye from '../../assets/icons/Eye';
import BootomSheet from '../../component/BootomSheet';
import CustomButton from '../../component/CustomButton';
import Arrow from '../../assets/icons/Arrow';
import { postApi } from '../../Service/service';
import FloatingLabelInput from '../../component/FloatingLabelInput';
import Loader from '../../component/Loader';
import NoDataFound from '../../component/NoDataFound';
import SkeletonLoader from '../../component/SkeletonLoader';

const EmployeeDocumentVault = props => {
    const isFocused = useIsFocused();
    const route = useRoute();
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();

    const { userDetails,companyData, token } = useSelector(state => state.project);

    // Animation state
    const [animValue] = useState(new Animated.Value(1000)); // Start off-screen

    const [docActionModalVisible, setDocActionModalVisible] = useState(false);
    const [formModalVisibility, setformModalVisibility] = useState(false);
    const [loadingView, setloadingView] = useState(false);
    const [isBtnLoading, setBtnLoading] = useState(false);

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
        if (props?.route?.params) {
            console.log("page paramData ======> ")
            console.log(props?.route?.params?.paramData);
        }
    }, []);

    useEffect(() => {
        if (isFocused == true) {
            console.log(i18n.language);
            console.log(I18nManager.isRTL);

            getEmpLoyeeDocFolder();

        }
    }, [isFocused]);

    const getEmpLoyeeDocFolder = () => {
        setdocumentList("")
        setloadingView(!loadingView)
        postApi("company/employee-file-document-list", { employee_id: props?.route?.params?.paramData?._id }, token)
            .then((resp) => {
                console.log(resp);
                if (resp?.status == 'success') {
                    //setdocumentList(resp?.data);
                    getMasterDocFolder(resp?.data)
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


    const getMasterDocFolder = (api1res) => {
        setloadingView(!loadingView)
        postApi("company/get-document-master", {}, token)
            .then((resp) => {
                console.log(resp);
                if (resp?.status == 'success') {
                    console.log("api1res", resp?.data?.docs)
                    setdocumentList(api1res.concat(resp?.data?.docs));
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





    const folderRender = ({ index, item }) => (
        <Pressable onPress={() => {
            console.log(item)
            if (item?.upload_for) {
                let param = {
                    "upload_for": item?.upload_for,
                    "emp_id": props?.route?.params?.paramData?._id,
                    "name":item?.document_type_name ? item?.document_type_name : item?.folder_name,
                    "action_type":'limited',
                    "validity_req":'no',
                    "expire_in_days":""
                }
                props.navigation.navigate('EmployeeDocuments', { paramData: param });
            } else {
                let param = {
                    "system": "document_user_vault",
                    "document_id": item?._id,
                    "emp_id": props?.route?.params?.paramData?._id,
                    "name":item?.document_type_name ? item?.document_type_name : item?.folder_name,
                    "action_type":'all',
                    "validity_req":item?.validity_req,
                    "expire_in_days" : item?.expire_in_days
                }
                props.navigation.navigate('EmployeeDocuments', { paramData: param });
            }

        }} style={styles.card}>
            <View style={{ height: '50%' }}>
                <Icon name="folder" size={50} color="#007BFF" />
            </View>
            <View style={{ height: '50%' }}>
                <Text style={styles.label} numberOfLines={2} ellipsizeMode='head'>{item?.document_type_name ? item?.document_type_name : item?.folder_name}</Text>
            </View>
        </Pressable>
    );


    const placeholderRenderList = ({ index, item }) => (
        <SkeletonLoader width={'30%'} height={80} borderRadius={10} style={{   backgroundColor: '#fff',
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
            height: 129, }} />
      );


    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.main}>
                <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
               <CustomHeader hideUserIcon={true}
                    buttonText={t('Documents Vault')}
                    style={{ flexDirection: 'row' }}
                    iconStyle={{ height: 30, width: 30, borderRadius: 50 }}
                    icon={LOCAL_IMAGES.user}
                    searchIcon={false}
                />

                <View style={{ paddingTop: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 100 }}>
                    
                    {loadingView ? (
                        <FlatList
                            data={[1,1,1,1,1,1,1,1,1]}
                            renderItem={placeholderRenderList} // Adjust rendering logic as per your data structure
                            keyExtractor={(item) => item.id}
                            numColumns={3}
                        />
                   
                    ) : (
                        // Show actual data
                        documentList != "" ?
                            <FlatList
                                data={documentList}
                                renderItem={folderRender}
                                keyExtractor={(item) => item.id}
                                numColumns={3}
                            />
                            : <NoDataFound />
                    )}
                </View>
            </View>


            {/* <Loader isLoading={loadingView} /> */}
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
        fontSize: 12,
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
export default EmployeeDocumentVault;