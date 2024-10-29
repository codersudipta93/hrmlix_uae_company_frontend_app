
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


const BillingList = props => {
    const isFocused = useIsFocused();
    const route = useRoute();
    const dispatch = useDispatch();
    const { userDetails,companyData, token } = useSelector(state => state.project);

    const { t, i18n } = useTranslation();

    const [isModalVisible, setModalVisible] = useState(false);
    const [invoiceHistory, setInvoiceHistory] = useState("");
    const [selectedInvoice, setselectedInvoice] = useState("");
    const [loadingView, setloadingView] = useState(false);
    // Animation state
    const [animValue] = useState(new Animated.Value(1000)); // Start off-screen




    useEffect(() => {
        if (isFocused == true) {
            console.log(i18n.language);
            console.log(I18nManager.isRTL);
            getInvoiceHistoryList();

           
        }
    }, [isFocused]);

    const requestStoragePermission = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'App needs access to your storage to save files.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
          console.warn(err);
          return false;
        }
      };
    const getInvoiceHistoryList = () => {
        setloadingView(true)
        let paramData = { pageno: 1, orderby: "desc" };
        postApi("company/get-payment-history", paramData, token)
            .then((resp) => {
                console.log(resp);
                if (resp?.status == 'success') {
                    setInvoiceHistory(resp?.payment_history?.docs);
                    setloadingView(false)
                    //HelperFunctions.showToastMsg(resp.message);
                } else if (resp?.status == 'val_err') {
                    let message = ""
                    for (const key in resp.val_msg) {
                        if (resp.val_msg[key].message) {
                            message = resp.val_msg[key].message;
                            break;
                        }
                    }
                    HelperFunctions.showToastMsg(message);
                    setloadingView(false)
                } else {
                    HelperFunctions.showToastMsg(resp.message);
                    setloadingView(false)
                }

            }).catch((err) => {
                console.log(err);
                setloadingView(false);
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



    const toggleModal = () => {
        if (isModalVisible) {
            // Hide modal
            Animated.timing(animValue, {
                toValue: 1000,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setModalVisible(false));
        } else {
            // Show modal
            setModalVisible(true);
            Animated.timing(animValue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    const ListRender = ({ index, item }) => (
        <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, borderTopRightRadius: index == 0 ? 8 : 0, borderTopLeftRadius: index == 0 ? 8 : 0, borderBottomLeftRadius: invoiceHistory.length - 1 == index ? 8 : 0, borderBottomRightRadius: invoiceHistory.length - 1 == index ? 8 : 0 }]}>
            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <View style={{ paddingHorizontal: 12 }}>
                    <Text style={{ fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md - 1, textAlign: 'left' }}>Invoice No</Text>
                    <Text onPress={() => {
                        setselectedInvoice(item)
                        toggleModal()
                    }} style={{ fontFamily: FontFamily.medium, color: '#60B057', fontSize: sizes.h6 - 1, textAlign: 'left', marginTop: 6 }}>{item?.inv_id}</Text>
                </View>
            </View>
            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <View style={{ paddingHorizontal: 12 }}>
                    <Text style={{ fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md - 1, textAlign: 'left' }}>Date</Text>
                    <Text style={{ fontFamily: FontFamily.medium, color: '#4E525E', fontSize: sizes.h6 - 1, textAlign: 'left', marginTop: 6 }}>{HelperFunctions.getDateDDMMYY(item?.created_at)}</Text>
                </View>
            </View>
        </View>
    );

    // Function to save a file to the Downloads folder
const saveFileToDownloads = async (fileName, base64Data) => {
    try {
      // Get the path for Downloads folder
      const downloadsPath = RNFS.DownloadDirectoryPath;
      const filePath = `${downloadsPath}/${fileName}`;
  
      // Write the file
      await RNFS.writeFile(filePath, base64Data, 'base64');
  
      // Verify file creation
      const fileExists = await RNFS.exists(filePath);
      if (!fileExists) {
        throw new Error('File was not created successfully.');
      }
  
      Alert.alert(
        'Save Complete',
        `File saved to ${filePath}`,
        [{ text: 'OK', onPress: () => console.log('File saved') }],
        { cancelable: false }
      );
  
    } catch (error) {
      console.error(error);
      Alert.alert('Save failed', error.message);
    }
  };
  
  // Example usage
  const downloadFile = async (url, params, token) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token ,
        },
        body: JSON.stringify(params),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText} - ${errorText}`);
      }
  
      const blob = await response.blob();
      const base64Data = await blobToBase64(blob);
      const fileName = 'payment_history.xlsx'; // Specify file name
  
      // Save file to Downloads folder
      await saveFileToDownloads(fileName, base64Data);
  
    } catch (error) {
      console.error(error);
      Alert.alert('Download failed', error.message);
    }
  };
  
  // Helper function to convert blob to base64 string
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result.split(',')[1]); // Strip out the data URL prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };


    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.main}>
                <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
               <CustomHeader hideUserIcon={true}
                    buttonText={t('Invoices')}
                    buttonTextStyle={{ lineHeight: 21 }}
                    style={{ flexDirection: 'row' }}
                    iconStyle={{ height: 30, width: 30, borderRadius: 50 }}
                    icon={LOCAL_IMAGES.user}
                    searchIcon={false}
                    customIcon={false}

                />

                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 12 }}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={invoiceHistory}
                            renderItem={ListRender}
                            contentContainerStyle={{ marginBottom: 30 }}
                        />
                    </View>
                </ScrollView>
                <BootomSheet
                    toggleModal={toggleModal}
                    isModalVisible={isModalVisible}
                    animValue={animValue}
                    modalContainerStyle={{
                        backgroundColor: 'white',
                        //padding: 20,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                    }}
                >
                    <View>
                        <View style={{
                            backgroundColor: '#1E2538', paddingVertical: 15, paddingHorizontal: 12, borderTopLeftRadius: 10,
                            borderTopRightRadius: 10, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <Text style={styles.modalheadingText}>Invoice</Text>
                            <IonIcon
                                name="cloud-download-outline"
                                size={25}
                                color="#fff"
                                onPress={() => {
                                   
                                    const url = 'https://uaedevcombackend.hrmlix.com/api/company-backend-service/company/get-payment-history';
                                    const params = {
                                        pageno: 1,
                                        checked_row_ids: '["66cc5119b5dc79748960cf90"]',
                                        generate: 'excel',
                                        row_checked_all: false,
                                        unchecked_row_ids: '[]'
                                    };


                                    downloadFile(url, params, token);
                                }}
                            />
                        </View>
                        <View style={{ paddingHorizontal: 20 }}>
                            <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: '#E7EAF1', borderBottomWidth: 1, paddingBottom: 8 }}>
                                <View><Text style={styles.leftText}>Invoice Date</Text></View>
                                <View><Text style={styles.rightText}>{HelperFunctions.getDateDDMMYY(selectedInvoice?.created_at)}</Text></View>
                            </View>
                            <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: '#E7EAF1', borderBottomWidth: 1, paddingBottom: 8 }}>
                                <View><Text style={styles.leftText}>Invoice No</Text></View>
                                <View><Text style={styles.rightText}>{selectedInvoice?.inv_id}</Text></View>
                            </View>
                            <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: '#E7EAF1', borderBottomWidth: 1, paddingBottom: 8 }}>
                                <View><Text style={styles.leftText}>Transaction No</Text></View>
                                <View><Text style={styles.rightText}>{selectedInvoice?.razorpay_payment_id}</Text></View>
                            </View>
                            <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: '#E7EAF1', borderBottomWidth: 1, paddingBottom: 8 }}>
                                <View><Text style={styles.leftText}>Gateway</Text></View>
                                <View><Text style={[styles.rightText, { textTransform: 'capitalize' }]}>{selectedInvoice?.gateway}</Text></View>
                            </View>
                            <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: '#E7EAF1', borderBottomWidth: 1, paddingBottom: 8 }}>
                                <View><Text style={styles.leftText}>Gateway ID</Text></View>
                                <View><Text style={styles.rightText}>{selectedInvoice?.razorpay_order_id}</Text></View>
                            </View>
                            <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: '#E7EAF1', borderBottomWidth: 1, paddingBottom: 8 }}>
                                <View><Text style={styles.leftText}>Inv Value</Text></View>
                                <View><Text style={styles.rightText}>{parseFloat((selectedInvoice?.credit_qty)).toLocaleString('en-US')}</Text></View>
                            </View>
                            <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: '#E7EAF1', borderBottomWidth: 1, paddingBottom: 8 }}>
                                <View><Text style={styles.leftText}>Payment Value</Text></View>
                                <View><Text style={styles.rightText}>{parseFloat((selectedInvoice?.credit_amount)).toLocaleString('en-US')}</Text></View>
                            </View>
                            <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: '#E7EAF1', borderBottomWidth: 1, paddingBottom: 8 }}>
                                <View><Text style={styles.leftText}>Payment Method</Text></View>
                                <View><Text style={[styles.rightText, { textTransform: 'capitalize' }]}>{selectedInvoice?.method}</Text></View>
                            </View>
                            <View style={{ marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: '#E7EAF1', borderBottomWidth: 1, paddingBottom: 8 }}>
                                <View><Text style={styles.leftText}>Status</Text></View>
                                <View><Text style={[styles.rightText, { textTransform: 'capitalize' }]}>{selectedInvoice?.status}</Text></View>
                            </View>

                            <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}>
                                <CustomButton
                                    style={{ width: '20%', height: 40, backgroundColor: colors.primary }}
                                    buttonText="OK"
                                    onPress={() => { toggleModal() }}
                                />
                            </View>
                        </View>
                    </View>
                </BootomSheet>
            </View>
            <Loader isLoading={loadingView} />
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
export default BillingList;