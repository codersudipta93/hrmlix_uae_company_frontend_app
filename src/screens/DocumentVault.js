
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
    Modal
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

const DocumentVault = props => {
    const isFocused = useIsFocused();
    const route = useRoute();
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();

    const { userDetails, token } = useSelector(state => state.project);

    const folderData = [
        { id: '1', label: 'Aadhaar Files' },
        { id: '2', label: '80C Investments' },
        { id: '3', label: 'PAN' },
        { id: '4', label: 'Passport Images' },
        { id: '2', label: '80C Investments' },
        { id: '3', label: 'PAN' },
        { id: '4', label: 'Passport Images' },
        // Add more items as needed
    ];



    // Animation state
    const [animValue] = useState(new Animated.Value(1000)); // Start off-screen


    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Edit');
    const [documentList, setdocumentList] = useState('');
    const [selectedDoc, setselectedDoc] = useState('');

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    useEffect(() => {
        if (isFocused == true) {
            console.log(i18n.language);
            console.log(I18nManager.isRTL);
            getFolderData()
        }
    }, [isFocused]);


    const getFolderData = () =>{
        postApi("company/get-document-master", { pageno: 1 }, token)
            .then((resp) => {
                console.log(resp);

                if (resp?.status == 'success') {
                    setdocumentList(resp?.data?.docs)
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


    const deleteValut = () => {
        if (token) {
            toggleModal();
            console.log(selectedDoc)
            Acknoledge_delete();
        } else {
            toggleModal();
        }
    }

    const Acknoledge_delete = () => {
        Alert.alert('Alert', 'Are you sure, you want to delete' + selectedDoc?.document_type_name + '?', [
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
                                HelperFunctions.showToastMsg('Successfully logout');
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
                toggleModal()
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

                <View  style={{paddingTop:12,justifyContent:'center', alignItems:'center'}}>
                    <FlatList
                        data={documentList}
                        renderItem={folderRender}
                        keyExtractor={(item) => item.id}
                        numColumns={3}
                    />

                </View>
                <TouchableOpacity style={styles.addButton}>
                    <Icon name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>


            <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => onClose(null)}

            >
                <View style={styles.modalContainer}>

                    <View style={styles.modalContent}>
                        <View style={styles.radioContainer}>
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

                        <TouchableOpacity onPress={selectedOption == "Edit" ? toggleModal : deleteValut} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>
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