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
    ScrollView,
    Button,
    TextInput,
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
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";


const AnnouncementEdit = props => {
    const isFocused = useIsFocused();
    const route = useRoute();
    const dispatch = useDispatch();
    const { userDetails, token } = useSelector(state => state.project);
    const { t, i18n } = useTranslation();

    const [title, setTitle] = useState('');
    const [publishStatusArr, setpublishStatusArr] = useState([{ label: 'published', value: 'published' }, { label: 'private', value: 'private' }]);
    const [selectedPublishStatus, setSelectedPublishStatus] = useState("");


    const [btnLoaderStatus, setBtnLoaderStatus] = useState(false);
    const [waitLoaderStatus, setWaitLoaderStatus] = useState(false);
    const richText = useRef();
    const [showRichEditor, setshowRichEditor] = useState(false)
    const [descHTML, setDescHTML] = useState('');
    const [showDescError, setShowDescError] = useState(false);

    const [imageUrl, setImageUrl] = useState(''); // State to store image URL
    const [showImageModal, setShowImageModal] = useState(false);

    // Function to insert image from URL
    const insertImageFromUrl = () => {
        if (imageUrl) {
            richText.current?.insertImage(imageUrl); // Insert image into the editor
            setImageUrl(''); // Clear the URL input after insertion+
            setShowImageModal(false);
        }
    };


    useEffect(() => {
        if (isFocused == true) {

            console.log(i18n.language);
            console.log(I18nManager.isRTL);
            // getDropDownMaster()
            if (props?.route?.params) {
                let pdata = props?.route?.params?.paramData;
                console.log("Data from attendance page ====> ", pdata);
                if(props?.route?.params?.mode == 'edit'){
                    setTitle(pdata?.title);
                    setSelectedPublishStatus({ label: pdata?.publish_status, value: pdata?.publish_status, selected:true });
                    setDescHTML(pdata?.description);
                }else{
                    setTitle("");
                    setSelectedPublishStatus({ label: "published", value: "published" , selected:true});
                    setDescHTML("");
                }
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

    const richTextHandle = (descriptionText) => {
        if (descriptionText) {
            setShowDescError(false);
            setDescHTML(descriptionText);
        } else {
            setShowDescError(true);
            setDescHTML("");
        }
    };


    const SubmitAnnouncement = () => {
        if (!title.trim()) {
            HelperFunctions.showToastMsg("Please enter title")
        }else if(descHTML == ""){
            HelperFunctions.showToastMsg("Please enter description")
        } else {
            setWaitLoaderStatus(true)
            let paramData = {
                title: title,
                _id: props?.route?.params?.paramData?._id,
                publish_status: selectedPublishStatus?.value,
                description:descHTML
            }
            postApi(props?.route?.params?.mode == 'edit' ? "company/update-announcement" : "company/create-announcement", paramData, token)
                .then((resp) => {

                    if (resp?.status == 'success') {
                        HelperFunctions.showToastMsg(resp.message);
                        setWaitLoaderStatus(false)
                    } else if (resp?.status == 'val_err') {
                        setWaitLoaderStatus(false)
                        let message = ""
                        for (const key in resp.val_msg) {
                            if (resp.val_msg[key].message) {
                                message = resp.val_msg[key].message;
                                break;
                            }
                        }
                        HelperFunctions.showToastMsg(message);
                    } else {
                        setWaitLoaderStatus(false)
                        HelperFunctions.showToastMsg(resp.message);
                    }

                }).catch((err) => {
                    console.log(err);
                    setWaitLoaderStatus(false)
                    HelperFunctions.showToastMsg(err.message);
                })
        }
    }



    const _applyFilter = () => {

        //update-announcement
    }

    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.main}>
                <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
                <CustomHeader
                    buttonText={t('Announcement')}
                    style={{ flexDirection: 'row' }}
                    iconStyle={{ height: 28, width: 28, borderRadius: 50 }}
                    icon={LOCAL_IMAGES.user}
                    searchIcon={true}
                />

                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={{ paddingHorizontal: 14, marginTop: 12 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, }}>
                            <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h5, lineHeight: 21 }}>Edit Announcement</Text>
                        </View>

                        <View style={{ padding: 12, backgroundColor: colors.white, borderRadius: 8, marginBottom: 20 }}>


                            <FloatingLabelInput
                                label="Title"
                                placeholder="Enter title name"
                                inputContainerColor="#CACDD4"
                                labelBg={colors.white}
                                labelColor="#007AFF"
                                placeholderColor="#8A8E9C"
                                inputColor={colors.primary}
                                value={title}
                                onChangeText={setTitle}
                            />

                            <FloatingDropdown
                                multiSelect={false}
                                labelName="Publish Status"
                                selectedValueData={selectedPublishStatus != '' ? selectedPublishStatus : ""}
                                options={publishStatusArr}
                                listLabelKeyName={['label']}
                                onSelect={(option) => {

                                    let data = HelperFunctions.copyArrayOfObj(publishStatusArr);
                                    for (let k = 0; k < data.length; k++) {
                                        if (data[k].value == option.value) {
                                            data[k].selected = data[k].selected == true ? false : true;
                                            setSelectedPublishStatus(data[k])
                                        } else {
                                            data[k].selected = false;
                                        }
                                    }

                                    setpublishStatusArr(data)

                                }}
                                inputContainerColor="#CACDD4"
                                labelBg={colors.white}
                                labelColor="#007AFF"
                                placeholderColor="#8A8E9C"
                                inputColor={colors.primary}
                                isFocusVal={selectedPublishStatus ? true : false}
                                inputMargin={0}
                            />


                            <View style={[styles.richTextContainer, {}]}>
                                <RichEditor
                                    ref={richText}
                                    onChange={richTextHandle}
                                    placeholder="Write your cool content here :)"
                                    androidHardwareAccelerationDisabled={true}
                                    style={styles.richTextEditorStyle}
                                    initialHeight={250}
                                    height={500}
                                    initialContentHTML={descHTML}
                                    initialFocus={true}
                                />
                                <RichToolbar
                                    editor={richText}
                                    selectedIconTint="#ff0000"
                                    iconTint="#2A2A2A"
                                    actions={[

                                        actions.setBold,
                                        actions.setItalic,
                                        // actions.insertBulletsList,
                                        //actions.insertOrderedList,
                                        //actions.insertLink,
                                        actions.setStrikethrough,
                                        actions.setUnderline,
                                        actions.insertImage,
                                    ]}
                                    style={styles.richTextToolbarStyle}
                                    onPressAddImage={() => setShowImageModal(true)} // Trigger modal on image icon press
                                />
                            </View>

                            {/* <TextInput
                                style={styles.input}
                                placeholder="Enter Image URL"
                                value={imageUrl}
                                onChangeText={(text) => setImageUrl(text)}
                            />
                            <Button title="Insert Image" onPress={insertImageFromUrl} /> */}

                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>



                                <CustomButton
                                    isLoading={btnLoaderStatus}
                                    backgroundColor={colors.primary}
                                    buttonText="Update"
                                    buttonTextStyle={{ textAlign: 'center', letterSpacing: 1.2, fontFamily: FontFamily.medium, color: '#fff', fontSize: sizes.h6 - 1 }}
                                    requireBorder={false}
                                    borderColor={colors.white}
                                    style={{ width: '40%', borderRadius: 8, marginTop: 20, opacity: 1 }}
                                    onPress={() => {
                                        console.log(descHTML)
                                        SubmitAnnouncement()
                                    }}
                                />
                            </View>
                        </View>
                    </View>

                </ScrollView>
                <Loader isLoading={waitLoaderStatus} />

                <Modal visible={showImageModal} transparent={true} animationType="slide">
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Insert Image URL</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Image URL"
                                value={imageUrl}
                                onChangeText={(text) => setImageUrl(text)}
                            />
                            {/* <Button title="Insert Image" onPress={insertImageFromUrl} />
                            <Button title="Cancel" onPress={() => setShowImageModal(false)} /> */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                                <CustomButton
                                    requireBorder={true}
                                    isLoading={btnLoaderStatus}
                                    backgroundColor={colors.white}
                                    buttonText="Cancel"
                                    buttonTextStyle={{ textAlign: 'center', letterSpacing: 1.2, fontFamily: FontFamily.medium, color: colors.primary, fontSize: sizes.h6 }}

                                    borderColor={colors.primary}
                                    style={{ width: '48%', borderRadius: 8, marginTop: 20, opacity: 1 }}
                                    onPress={() => setShowImageModal(false)}
                                />

                                <CustomButton
                                    isLoading={btnLoaderStatus}
                                    backgroundColor={colors.primary}
                                    buttonText="Insert"
                                    buttonTextStyle={{ textAlign: 'center', letterSpacing: 1.2, fontFamily: FontFamily.medium, color: '#fff', fontSize: sizes.h6 }}
                                    requireBorder={false}
                                    borderColor={colors.white}
                                    style={{ width: '48%', borderRadius: 8, marginTop: 20, opacity: 1 }}
                                    onPress={insertImageFromUrl}
                                />
                            </View>

                        </View>
                    </View>
                </Modal>


            </View>

            <Loader isLoading={waitLoaderStatus} />

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
    richTextContainer: {
        display: "flex",
        flexDirection: "column-reverse",
        width: "100%",
        marginBottom: 0,
        marginTop: 14,

    },

    richTextEditorStyle: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: "#DDDDDD",

        // shadowColor: "#000",
        // shadowOffset: {
        //   width: 0,
        //   height: 1,
        // },
        // shadowOpacity: 0.23,
        // shadowRadius: 1.62,
        // elevation: 1,
        fontSize: 14,
        marginBottom: 14

    },

    richTextToolbarStyle: {
        backgroundColor: "#00000012",
        borderColor: "#00000012",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderWidth: 1,
    },
    htmlBoxStyle: {
        height: 200,
        width: 330,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});
export default AnnouncementEdit;