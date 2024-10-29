
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
    Switch,
    PermissionsAndroid,
    Platform
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
import { postApi, saveDocumentApi } from '../../Service/service';
import FloatingLabelInput from '../../component/FloatingLabelInput';
import Loader from '../../component/Loader';
import NoDataFound from '../../component/NoDataFound';
import SkeletonLoader from '../../component/SkeletonLoader';
import FloatingTimePicker from '../../component/FloatingTimePicker';
import * as ImagePicker from "react-native-image-picker";
import CustomImageViewer from '../../component/PinchableImage';

import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';


const EmployeeDocuments = props => {
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

    const [validFrom, setvalidFrom] = useState("");
    const [validTo, setvalidTo] = useState("");

    const [optionModal, setoptionModal] = useState(false)
    const [document, setDocument] = useState("");
    const [imageModalVisible, setImageModalVisibility] = useState(false);
    const [imageUrl, setImageurl] = useState("");
    const [basicLoading, setbasicLoading] = useState(false);

    useEffect(() => {
        if (isFocused == true) {
            console.log(i18n.language);
            console.log(I18nManager.isRTL);
            if (props?.route?.params) {

                console.log("page paramData ======> ")
                console.log(props?.route?.params?.paramData);
                getFolderData()
            }

        }
    }, [isFocused]);

    useEffect(() => {

    }, []);


    const getFolderData = () => {
        setloadingView(!loadingView)
        postApi("company/employee-file-document-list-details", props?.route?.params?.paramData, token)
            .then((resp) => {
                console.log(resp);
                if (resp?.status == 'success') {
                    setdocumentList(resp?.data);
                    setloadingView(false);
                    setformModalVisibility(false);
                    setbasicLoading(false)
                } else if (resp?.status == 'val_err') {
                    setloadingView(false)
                    setbasicLoading(false)
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
                    setbasicLoading(false)
                    HelperFunctions.showToastMsg(resp.message);

                }

            }).catch((err) => {
                setloadingView(false)
                setbasicLoading(false)
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
            setoptionModal(!optionModal)
            Acknoledge_delete();
        } else {
            setoptionModal(!optionModal)
        }
    }

    const openDocmentFormModal = (ACTION_TYPE) => {
        setformModalVisibility(!formModalVisibility);
        setDocActionModalVisible(false);
        setoptionModal(false)
        if (ACTION_TYPE == 'edit') {
            setVaultName(selectedDoc?.document_name)
            console.log(selectedDoc)
        } else {
            setVaultName();
            setvalidFrom();
            setvalidTo();
            setDocument("");
        }
    }

     //Add or Update value
     submitValue = () => {
        if (!vaultName) {
            HelperFunctions.showToastMsg("Please enter vault name");
        } else if (selectedOption == 'add' && !document) {
            HelperFunctions.showToastMsg("Please upload document");
        } else if (selectedOption == 'add' && props?.route?.params?.paramData?.validity_req == 'yes' && validFrom == "") {
            HelperFunctions.showToastMsg("Please enter document validation start date");
        } else if (selectedOption == 'add' &&props?.route?.params?.paramData?.validity_req == 'yes' && validTo == "") {
            HelperFunctions.showToastMsg("Please enter document validation expire date");
        } else {
            //setBtnLoading(true);
            if(selectedOption == 'add'){
                saveDocument();
            }else{
                updateDocument();
            }
        }
    }

    const updateDocument = () => {
        console.log(selectedDoc)
        let param = {
            "emp_id": selectedDoc?.emp_db_id,
            "document_name": vaultName,
            "document_id": selectedDoc?._id,
            "valid_from": selectedDoc?.valid_from,
            "valid_to":  selectedDoc?.valid_to
        }
        console.log(param)
        // console.log(param)
        postApi("company/edit-document-vault", param, token)
            .then((resp) => {
                console.log(resp)
                if (resp.status == "success") {
                    HelperFunctions.showToastMsg(resp.message)
                    //showDetails();
                    setBtnLoading(false)
                    getFolderData();
                    setVaultName();
                    setvalidFrom();
                    setvalidTo();
                    setDocument("");
                    setSelectedOption("");
                    setformModalVisibility('false');
                    setselectedDoc("")
                } else {
                    HelperFunctions.showToastMsg(resp.message);
                    setBtnLoading(false)
                }
            })
            .catch((error) => {

                saveDocument(response);
                console.log('try again...', error)
                //HelperFunctions.showToastMsg('Sorry! Something went to wrong');
            })
    }



    const saveDocument = () => {
        let param = {
            "document_type_id": props?.route?.params?.paramData?.document_id,
            "emp_id": props?.route?.params?.paramData?.emp_id,
            "valid_from": validFrom,
            "valid_to": validTo,
            "file": {
                uri: document?.uri,
                type: document?.type,
                name: document?.fileName,
            },
            "document_name": vaultName,
            "description": ""
        }

        //console.log(param)
        saveDocumentApi("company/add-document-to-vault", param, token)
            .then((resp) => {
                console.log(resp)
                if (resp.status == "success") {
                    HelperFunctions.showToastMsg(resp.message)
                    //showDetails();
                    setBtnLoading(false)
                    getFolderData()
                } else {
                    HelperFunctions.showToastMsg(resp.message);
                    setBtnLoading(false)
                }
            })
            .catch((error) => {

                saveDocument(response);
                console.log('try again...', error)
                //HelperFunctions.showToastMsg('Sorry! Something went to wrong');
            })
    }

    const openUploadModal = (item) => {
        //setselectedDetails(item)
        if (docActionModalVisible) {
            // Hide modal
            Animated.timing(animValue, {
                toValue: 1000,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setDocActionModalVisible(false));
        } else {
            // Show modal
            setDocActionModalVisible(true);
            Animated.timing(animValue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }


    async function uploadSource(mediaType) {
        //alert("await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA")
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 200,
            maxWidth: 200,
            quality: 1
        }
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);

        if (granted === PermissionsAndroid.RESULTS.GRANTED || Platform.OS === 'ios') {
            mediaType == 'camera' ? ImagePicker.launchCamera(options, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else {
                    setDocActionModalVisible(false)
                    console.log(response?.assets[0])
                    setDocument(response?.assets[0])
                }
            },
            ) :
                ImagePicker.launchImageLibrary(options, (response) => {
                    if (response.didCancel) {
                        console.log('User cancelled image picker');
                    } else if (response.error) {
                        console.log('ImagePicker Error: ', response.error);
                    } else {
                        setDocActionModalVisible(false);
                        setDocument(response?.assets[0])
                        //uploadType == 'userimage' ? setimageLoader(true) : null
                        // savePhotoApi(response?.assets[0]);
                    }
                },
                )
        } else {
            HelperFunctions.showToastMsg("Permission denied")
        }
    }

    const openOptionModal = (item) => {
        //setselectedDetails(item)
        if (optionModal) {
            // Hide modal
            Animated.timing(animValue, {
                toValue: 1000,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setoptionModal(false));
        } else {
            // Show modal
            setoptionModal(true);
            Animated.timing(animValue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }

    const handleOptionChange = (option) => {
        setSelectedOption(option);
        if (option == "view") {
            showImage()
        } else if (option == "edit") {
           
            openDocmentFormModal("edit");

        } else if (option == 'download') {
            setbasicLoading(true);
            let param = { image_path: selectedDoc?.file ? selectedDoc?.file : selectedDoc?.file_path ? selectedDoc?.file_path : "" }
            postApi("/company/single-view-image", param, token)
                .then((resp) => {
                    if (resp?.status == 'success') {
                        setbasicLoading(true);
                        downloadFile(resp?.image);
                        setoptionModal(false);
                    } else {
                        HelperFunctions.showToastMsg("download failed! try again");
                        setbasicLoading(false);
                    }
                }).catch((err) => {
                    console.log(err);
                    setbasicLoading(false);
                    HelperFunctions.showToastMsg(err.message);
                })
        }
    };


    const downloadFile = (linkData) => {
        const url = linkData;
        if (url) {
            let fileNameType = selectedDoc?.file ? selectedDoc?.file.split('/')[4] : selectedDoc?.file_path ? selectedDoc?.file_path.split('/')[4] : ""
            const filePath = RNFS.DownloadDirectoryPath + '/' + fileNameType;
            //`${RNFS.DownloadDirectoryPath}/${fileName}`;
            console.log(filePath)
            RNFS.downloadFile({
                fromUrl: url,
                toFile: filePath,
                background: true, // Enable downloading in the background (iOS only)
                discretionary: true, // Allow the OS to control the timing and speed (iOS only)
                progress: (res) => {
                    // Handle download progress updates if needed
                    const progress = (res.bytesWritten / res.contentLength) * 100;
                    console.log(`Progress: ${progress.toFixed(2)}%`);
                    //HelperFunctions.showToastMsg(`Progress: ${progress.toFixed(2)}%`);
                },
            })
                .promise.then((response) => {
                    setbasicLoading(false)
                    console.log('File downloaded!', response);
                    HelperFunctions.showToastMsg('File downloaded!');
                    setselectedDoc("");
                })
                .catch((err) => {
                    console.log('Download error:', err);
                });
        }
    };



    const getPermission = async () => {
        // if (Platform.OS === 'ios') {
        //   actualDownload();
        // } else {
        //   try {
        //     const granted = await PermissionsAndroid.request(
        //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        //     );
        //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //       actualDownload();
        //     } else {
        //       console.log("please grant permission");
        //     }
        //   } catch (err) {
        //     console.log("display error",err)    }
        // }
        //actualDownload();
    };

    // const actualDownload = () => {
    //     const { dirs } = RNFetchBlob.fs;
    //     const dirToSave = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    //     console.log(dirToSave)

    //     const configfb = {
    //         fileCache: true,
    //         addAndroidDownloads: {
    //             useDownloadManager: true,
    //             notification: true,
    //             mediaScannable: true,
    //             title: selectedDoc?.file.split('/')[4],
    //             path: `${dirs.DownloadDir}/${selectedDoc?.file.split('/')[4]}`,
    //         },
    //         useDownloadManager: true,
    //         notification: true,
    //         mediaScannable: true,
    //         title: selectedDoc?.file.split('/')[4],
    //         path: `${dirToSave}/${selectedDoc?.file.split('/')[4]}`,
    //     };
    //     const configOptions = Platform.select({
    //         ios: configfb,
    //         android: configfb,
    //     });

    //     RNFetchBlob.config(configOptions || {})
    //         .fetch('https://uaedevcombackend.hrmlix.com/api/company-backend-service/company/download-document-vault', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'x-access-token': token,
    //             },
    //             body: JSON.stringify({
    //                 "document_id": selectedDoc?._id,
    //                 "emp_id": props?.route?.params?.paramData?.emp_id,
    //             }),
    //         })
    //         .then(res => {

    //             console.log(res)

    //             // if (Platform.OS === 'ios') {
    //             //     RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
    //             //     RNFetchBlob.ios.previewDocument(configfb.path);
    //             // }
    //             // if (Platform.OS === 'android') {
    //             //     console.log("file downloaded")
    //             // }
    //         })
    //         .catch(e => {
    //             console.log('invoice Download==>', e);
    //         });
    // }








    // // Example usage
    // const downloadFile = async (url, params, token) => {
    //     try {
    //         const response = await fetch(url, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'x-access-token': token,
    //             },
    //             body: JSON.stringify(params),
    //         });

    //         if (!response.ok) {
    //             const errorText = await response.text();
    //             throw new Error(`Network response was not ok: ${response.status} ${response.statusText} - ${errorText}`);
    //         }

    //         console.log(response)
    //         const blob = await response?.blob();
    //         const base64Data = await blobToBase64(blob);
    //         const fileName = 'payment_history.xlsx'; // Specify file name

    //         // Save file to Downloads folder
    //         await saveFileToDownloads(fileName, base64Data);

    //     } catch (error) {
    //         console.error(error);
    //         Alert.alert('Download failed', error.message);
    //     }
    // };


    // const saveFileToDownloads = async (fileName, base64Data) => {
    //     try {
    //         // Get the path for Downloads folder
    //         const downloadsPath = RNFS.DownloadDirectoryPath;
    //         const filePath = `${downloadsPath}/${selectedDoc?.file.split('/')[4]}`;
    //         console.log(selectedDoc?.file.split('/')[4])
    //         console.log(selectedDoc?.file)
    //         // Write the file
    //         await RNFS.writeFile(filePath, base64Data, 'base64');

    //         // Verify file creation
    //         const fileExists = await RNFS.exists(filePath);
    //         if (!fileExists) {
    //             throw new Error('File was not created successfully.');
    //         }

    //         Alert.alert(
    //             'Save Complete',
    //             `File saved to ${filePath}`,
    //             [{ text: 'OK', onPress: () => console.log('File saved') }],
    //             { cancelable: false }
    //         );

    //     } catch (error) {
    //         console.error(error);
    //         Alert.alert('Save failed', error.message);
    //     }
    // };

    // // Helper function to convert blob to base64 string
    // const blobToBase64 = (blob) => {
    //     return new Promise((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             resolve(reader.result.split(',')[1]); // Strip out the data URL prefix
    //         };
    //         reader.onerror = reject;
    //         reader.readAsDataURL(blob);
    //     });
    // };

    const showImage = () => {
        setbasicLoading(true)
        console.log(selectedDoc)
        let param = { image_path: selectedDoc?.file ? selectedDoc?.file : selectedDoc?.file_path ? selectedDoc?.file_path : "" }
        postApi("/company/single-view-image", param, token)
            .then((resp) => {
                if (resp?.status == 'success') {
                    setImageurl(resp?.image)
                    console.log(resp?.image)
                    setbasicLoading(false);
                    setoptionModal(false);
                    setselectedDoc("");
                } else {
                    HelperFunctions.showToastMsg(resp.message);
                    setbasicLoading(false);
                    setoptionModal(false);
                }
            }).catch((err) => {
                console.log(err);
                setbasicLoading(false);
                setoptionModal(false);
                HelperFunctions.showToastMsg(err.message);
            })
    }


    useEffect(() => { if (imageUrl != "") { setImageModalVisibility(true) } }, [imageUrl]);

   

    const Acknoledge_delete = () => {
        let fileNameType = selectedDoc?.file ? selectedDoc?.file.split('/')[4] : selectedDoc?.file_path ? selectedDoc?.file_path.split('/')[4] : ""
        Alert.alert('Alert', 'Are you sure, you want to delete ' + fileNameType + ' ?', [
            {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
            },
            {
                text: 'YES', onPress: () => {

                    setbasicLoading(true)
                    postApi("company/delete-document-vault", {
                        "document_id": selectedDoc?._id,
                        "emp_id": props?.route?.params?.paramData?.emp_id,
                    }, token)
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
                                setbasicLoading(false)
                                HelperFunctions.showToastMsg(message);
                            } else {
                                setbasicLoading(false)
                                HelperFunctions.showToastMsg(resp.message);
                            }

                        }).catch((err) => {
                            setbasicLoading(false)
                            console.log(err);
                            HelperFunctions.showToastMsg(err.message);
                        })
                }
            },
        ]);
        return true;
    };



    const folderRender = ({ index, item }) => (
        <View style={[styles.card, { paddingHorizontal: 0, opacity: item?.expire_in_days > 0 ? 1 : 0.8 }]}>
            <View style={{ height: '50%' }}>
                <IonIcon name="document" size={50} color={item?.expire_in_days ? item?.expire_in_days > 0 ? "#FFAC10" : '#C5C5C57D' : '#FFAC10'} />
            </View>
            <View style={{ height: '50%', width: '100%', paddingHorizontal: 15 }}>
                <Text style={styles.label} numberOfLines={2} ellipsizeMode='head'>{item?.file_name ? item?.file_name : item?.document_name}</Text>
            </View>
            <TouchableOpacity onPress={() => {
                setselectedDoc(item);
                openOptionModal();
            }} style={styles.moreButton}>
                <Icon name="more-vert" size={20} color="#333" />
            </TouchableOpacity>

            {item?.expire_in_days && item?.expire_in_days < 30 ?
                <View style={{ bottom: 15, height: 20, width: '100%', backgroundColor: item?.expire_in_days > 0 ? '#ff6b00' : '#000', position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={[styles.label, { textTransform: 'none', marginTop: 0, color: '#fff' }]}>{item?.expire_in_days > 0 && item?.expire_in_days < 30 ? "Expire in " + item?.expire_in_days + ' days' : item?.expire_in_days < 1 ? 'Expired' : null} </Text>
                </View>
                : null}
        </View>


    );

    const placeholderRenderList = ({ index, item }) => (
        <SkeletonLoader width={'30%'} height={80} borderRadius={10} speed={1} style={{
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
        }} />

    );


    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.main}>
                <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
               <CustomHeader hideUserIcon={true}
                    buttonText={props?.route?.params?.paramData?.name}
                    style={{ flexDirection: 'row' }}
                    iconStyle={{ height: 30, width: 30, borderRadius: 50 }}
                    icon={LOCAL_IMAGES.user}
                    searchIcon={false}
                />

                <View style={{ paddingTop: 12, width: '100%' }}>
                    {loadingView == true ? (
                        <FlatList
                            data={[1, 1, 1, 1, 1]}
                            renderItem={placeholderRenderList} // Adjust rendering logic as per your data structure
                            keyExtractor={(item) => item.id}
                            numColumns={3}
                        />

                    ) : (
                        // Show actual data
                        documentList != "" && loadingView != true ?
                            <FlatList
                                data={documentList}
                                renderItem={folderRender}
                                keyExtractor={(item) => item.id}
                                numColumns={3}
                            />
                            : <NoDataFound />
                    )}
                </View>

                {props?.route?.params?.paramData.action_type == 'all' ?
                    <TouchableOpacity onPress={() => {
                        setselectedDoc("");
                        setSelectedOption("add");
                        openDocmentFormModal("add");
                    }} style={styles.addButton}>
                        <Icon name="add" size={24} color="#fff" />
                    </TouchableOpacity>
                    : null}
            </View>


            <BootomSheet
                toggleModal={openOptionModal}
                isModalVisible={optionModal}
                animValue={animValue}
                modalContainerStyle={{
                    backgroundColor: 'white',
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                }}
            >

                <View style={{ marginTop: 15 }}>
                    <Pressable style={styles.actionSheetContentWrapper} onPress={() => {
                        handleOptionChange("view")

                    }}>
                        <IonIcon name="eye" size={20} color="#878787" />
                        <Text style={styles.uploadSourceText}> View</Text>
                    </Pressable>

                    {props?.route?.params?.paramData?.action_type == 'all' ? <>
                        <Pressable style={styles.actionSheetContentWrapper} onPress={() => handleOptionChange("edit")}>
                            <Icon name="create" size={20} color="#878787" />
                            <Text style={styles.uploadSourceText}> Edit</Text>
                        </Pressable>

                        <Pressable style={styles.actionSheetContentWrapper} onPress={() => deleteValutForm('delete')}>
                            <IonIcon name="trash" size={20} color="#878787" />
                            <Text style={styles.uploadSourceText}> Delete</Text>
                        </Pressable>
                    </> : null}

                    <Pressable style={styles.actionSheetContentWrapper} onPress={() => handleOptionChange("download")}>
                        <IonIcon name="download" size={20} color="#878787" />
                        <Text style={styles.uploadSourceText}> Download</Text>
                    </Pressable>
                </View>
            </BootomSheet>

            <BootomSheet
                toggleModal={openUploadModal}
                isModalVisible={docActionModalVisible}
                animValue={animValue}
                modalContainerStyle={{
                    backgroundColor: 'white',
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                }}
            >

                <View style={{ marginTop: 15 }}>
                    <Pressable style={styles.actionSheetContentWrapper} onPress={() => uploadSource("camera")}>
                        <Image source={LOCAL_ICONS.camera} style={styles.uploadSourceIcon} />
                        <Text style={styles.uploadSourceText}>Take a photo</Text>
                    </Pressable>
                    <Pressable style={styles.actionSheetContentWrapper} onPress={() => uploadSource("gallery")}>
                        <Image source={LOCAL_ICONS.gallery} style={styles.uploadSourceIcon} />
                        <Text style={styles.uploadSourceText}>Select from gallery</Text>
                    </Pressable>
                </View>
            </BootomSheet>

            <Modal
                animationType="fade"
                transparent={true}
                visible={formModalVisibility}
                onRequestClose={() => onClose(null)}

            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { width: '90%', maxHeight: '100%', }]}>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 }}>
                            <Text style={{ fontFamily: FontFamily.semibold, fontSize: sizes.h5, color: '#4E525E' }}> {selectedOption == 'edit' ? 'Update Document' : 'Add Document'}</Text>
                            <IonIcon
                                name="close"
                                size={24}
                                color={'#8A8E9C'}
                                onPress={() => { setformModalVisibility(!formModalVisibility) }}
                            />
                        </View>
                        <View style={[styles.radioContainer, { width: '100%', flexDirection: 'column', marginBottom: 20 }]}>
                            <FloatingLabelInput
                                labelColor="#007AFF"
                                labelBg="#fff"
                                inputColor="#5A5B5B"
                                placeholderColor="#8A8E9C"
                                inputContainerColor={vaultName != "" ? "#60B057" : "#CACDD4"}
                                //top={20}
                                marginBottom={12}
                                label="Document Name"
                                placeholder="Write document name"
                                value={vaultName != null ? vaultName : vaultName}
                                onChangeText={setVaultName}
                            />

                            {selectedOption == 'add' ? <>

                                <View style={{ marginBottom: 8, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 0 }}>
                                    <View style={{
                                        height: 42,
                                        borderColor: '#60B057',
                                        borderWidth: 1,
                                        borderRadius: 8,
                                        paddingHorizontal: 6,
                                        marginBottom: 0,
                                        justifyContent: 'space-between',
                                        alignItems: "center",
                                        width: '100%',
                                        flexDirection: 'row'
                                    }}>
                                        <View style={{ width: '90%' }}>
                                            <Text style={{ fontFamily: FontFamily.semibold, fontSize: sizes.h6 - 2, color: document?.fileName ? '#4E525E' : '#8A8E9C', paddingRight: 12 }} >{document?.fileName ? document?.fileName : 'Upload Doc'}</Text>
                                        </View>
                                        <View style={{ width: '10%' }}>
                                            <IonIcon
                                                name="cloud-upload-sharp"
                                                size={24}
                                                color={'#8A8E9C'}
                                                onPress={() => { openUploadModal() }}
                                            />
                                        </View>
                                    </View>
                                </View>

                                {props?.route?.params?.paramData?.validity_req == 'yes' ? <>
                                    <View style={{ marginBottom: 8, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 0 }}>
                                        <FloatingTimePicker
                                            pickerType="date"
                                            pickerIconStyle={{ height: 18, width: 18, tintColor: '#707070' }}
                                            pickerIcon={LOCAL_ICONS.calender}
                                            editableStatus={true}
                                            labelName={'Valid From'}
                                            inputContainerColor="#CACDD4"
                                            labelBg={colors.white}
                                            labelColor="#007AFF"
                                            placeholderColor="#8A8E9C"
                                            inputColor="#5A5B5B"
                                            //selectedValue={loginTime ? HelperFunctions.convertTo12HourFormat(loginTime) : ""}
                                            selectedValue={validFrom}
                                            inputMargin={0}
                                            confirmDateClick={(timestamp) => {
                                                let formatedDate = (timestamp).toISOString().split('T')[0];
                                                // setStartdate(formatedDate)
                                                setvalidFrom(formatedDate)
                                            }}
                                        />
                                    </View>

                                    <View style={{ marginBottom: 8, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 0 }}>
                                        <FloatingTimePicker
                                            pickerType="date"
                                            pickerIconStyle={{ height: 18, width: 18, tintColor: '#707070' }}
                                            pickerIcon={LOCAL_ICONS.calender}
                                            editableStatus={true}
                                            labelName={'Valid to'}
                                            inputContainerColor="#CACDD4"
                                            labelBg={colors.white}
                                            labelColor="#007AFF"
                                            placeholderColor="#8A8E9C"
                                            inputColor="#5A5B5B"
                                            //selectedValue={loginTime ? HelperFunctions.convertTo12HourFormat(loginTime) : ""}
                                            selectedValue={validTo}
                                            inputMargin={20}
                                            confirmDateClick={(time) => {
                                                console.log(time)
                                             let formatedDate = (time).toISOString().split('T')[0];
                                                // // setStartdate(formatedDate)
                                                // //console.log(formatedDate)
                                                setvalidTo(formatedDate)
                                            }}
                                        />
                                    </View>
                                </> : null}

                            </> : null}
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

            <CustomImageViewer
                backgroundColor={'#fff'}
                images={[{
                    url: imageUrl,
                }]}
                isVisible={imageModalVisible}
                onClose={() => {
                    // setRoomImageZoom([]);
                    setImageurl("")
                    setImageModalVisibility(false);
                }}
            />

            <Loader isLoading={basicLoading} />
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
    actionSheetContentWrapper: {
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingBottom: 24,
    },
    uploadSourceText: {
        fontFamily: FontFamily.medium,
        color: colors.black,
        fontSize: sizes.h6,
        marginLeft: 8
    },
    actionSheetContentWrapper: {
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingBottom: 24,
    },
    uploadSourceIcon: {
        height: 20,
        width: 20,
        resizeMode: 'contain',
        marginRight: 8
    },
    uploadSourceText: {
        fontFamily: FontFamily.medium,
        color: colors.black,
        fontSize: sizes.h6,
    },
});
export default EmployeeDocuments;