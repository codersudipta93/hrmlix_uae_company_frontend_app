
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
  Switch,
  Animated,
  useWindowDimensions,
  Modal,
  TextInput,
  Keyboard
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
import Loader from '../../component/Loader';
import BootomSheet from '../../component/BootomSheet';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RenderHtml from 'react-native-render-html';


const AnnouncementListPublic = props => {
  const isFocused = useIsFocused();
  const route = useRoute();
  const dispatch = useDispatch();
  const { userDetails, token } = useSelector(state => state.project);

  const { t, i18n } = useTranslation();
  const [selecteddetails, setselectedDetails] = useState("");
  const [announcementData, setannouncementData] = useState("");
  const [commentArr, setCommmentArr] = useState("");

  const [waitLoaderStatus, setWaitLoaderStatus] = useState(false);
  const [comment, setCommment] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const flatListRef = useRef(null);
  const [isTexinputFocused, setIsTextInputFocused] = useState(false);
  const [parentId, setparentid] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    if (isFocused == true) {
      console.log(i18n.language);
      console.log(I18nManager.isRTL);
      getPosts()
    }
  }, [isFocused]);



  useEffect(() => {
    console.log("api")

  }, []);

  const getPosts = () => {
    setWaitLoaderStatus(true)
    let paramData = {
      "pageno": 1,
      "searchkey": "",
      "status": "published"
    }
    postApi("company/get-announcement-list", paramData, token)
      .then((resp) => {
        console.log(resp)
        if (resp?.status == 'success') {
          setannouncementData(resp?.post_data?.docs);
          setWaitLoaderStatus(false)
        } else if (resp?.status == 'val_err') {
          let message = ""
          for (const key in resp.val_msg) {
            if (resp.val_msg[key].message) {
              message = resp.val_msg[key].message;
              break;
            }
          }
          setWaitLoaderStatus(false)
          HelperFunctions.showToastMsg(message);

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


  const getComments = (parent_id) => {
    setModalVisible(true)
    setWaitLoaderStatus(true);
    setparentid(parent_id)
    let paramData = {
      "parent_id": parent_id
    }
    postApi("company/announcement-reply-list", paramData, token)
      .then((resp) => {
        console.log(resp)
        if (resp?.status == 'success') {
          setCommmentArr(resp?.data);
          setWaitLoaderStatus(false);
          flatListRef.current.scrollToEnd({ animated: true });
        } else if (resp?.status == 'val_err') {
          let message = ""
          for (const key in resp.val_msg) {
            if (resp.val_msg[key].message) {
              message = resp.val_msg[key].message;
              break;
            }
          }
          setWaitLoaderStatus(false)
          HelperFunctions.showToastMsg(message);

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

  placeComment = () => {
    setWaitLoaderStatus(true)
    let paramData = {
      "parent_id": parentId,
      "reply_description": comment
    }
    postApi("company/company-dashboard-create-reply", paramData, token)
      .then((resp) => {
        console.log(resp)
        if (resp?.status == 'success') {
          getComments(parentId)
          setWaitLoaderStatus(false);
          setCommment("")
        } else if (resp?.status == 'val_err') {
          let message = ""
          for (const key in resp.val_msg) {
            if (resp.val_msg[key].message) {
              message = resp.val_msg[key].message;
              break;
            }
          }
          setWaitLoaderStatus(false)
          HelperFunctions.showToastMsg(message);

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






  const ListRender = ({ index, item }) => (
    <View style={[styles.listCard, { paddingVertical: 18, marginBottom: 12, borderRadius: 12 }]}>
      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
        <View style={{ width: '70%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
          <View style={{ paddingLeft: 12 }}>
            <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6, textAlign: 'left' }}>{item?.title}</Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 10, paddingLeft: 8, width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ width: '70%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
          <Image
            style={{ height: 28, width: 28, borderRadius: 50 }}
            source={{ uri: item?.company_logo }}
          />
          <Text style={{ marginLeft: 8, fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md }}>by <Text style={{ color: colors.primary }}>{item?.company_name}</Text></Text>
        </View>

        <View style={{ width: '30%', paddingRight: 12, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
          <Icon name="calendar" size={20} color="#878787" />
          <Text style={{ marginLeft: 8, fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md, marginRight: 8 }}>{HelperFunctions.getDateandtime(item?.created_at)}</Text>
        </View>
      </View>


      <View style={{ paddingLeft: 8, marginTop: 8 }}>
        <RenderHtml
          contentWidth={width}
          source={{ html: item?.description }}
        />
      </View>

      <View style={{ paddingLeft: 8, marginTop: 6, width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Pressable onPress={(() => {
          item?.reply_length > 0 ?
            getComments(item?._id) : null;
          setIsTextInputFocused(false);
        })} style={{ marginTop: 6, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
          <MaterialIcons name="message-reply-text-outline" size={25} color="#878787" />
          <Text style={{ marginLeft: 8, marginBottom: 4, fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md, color: colors.primary }}>{item?.reply_length > 0 ? item?.reply_length : null} Comments</Text>
        </Pressable>

        <Pressable onPress={(() => {
          item?.reply_length > 0 ? getComments(item?._id) : null
          setIsTextInputFocused(true);
        })} style={{ marginTop: 6, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingRight: 14 }}>
          <MaterialIcons name="reply-outline" size={25} color="#878787" />
          <Text style={{ marginLeft: 8, fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md, color: colors.primary }}>Reply</Text>
        </Pressable>
      </View>

    </View>
  );

  const commentsRender = ({ index, item }) => (
    <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 0, borderRadius: 0, }]}>
      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', height: 35, width: 35, backgroundColor: '#007AFF', borderRadius: 50 }}>
          <Image source={{ uri: item?.company_logo }} style={{ height: '100%', width: '100%', borderRadius: 50, objectFit: 'cover' }} />
        </View>
        <View style={{ paddingLeft: 12 }}>
          <Text style={{ fontFamily: FontFamily.medium, color: '#4E525E', fontSize: sizes.h6, textAlign: 'left' }}>{item?.company_name}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 8 }}>
            <Icon name="calendar" size={16} color="#878787" />
            <Text style={{ fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md, textAlign: 'left', marginTop: 0, marginRight: 50, marginLeft: 4 }}>{HelperFunctions.getDateandtime(item?.created_at)}</Text>
          </View>
          <View style={{ width: '90%', backgroundColor: '#F5F7FB', marginRight: 20, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8, marginRight: 22, marginTop: 12 }}>
            <Text style={{ fontFamily: FontFamily.regular, color: '#4E525E', fontSize: sizes.md + 1, textAlign: 'left', }}>{item?.reply_description}</Text>
          </View>
        </View>
      </View>

    </View>
  );


  const placeholderComments = ({ index, item }) => (

    <SkeletonPlaceholder >
      <View style={{
        borderRadius: 8,
        padding: 12,
        paddingVertical: 18,
        marginBottom: 12,
        width: '100%'
      }}>

        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: 6 }}>
          <View style={{ width: 30, height: 30, borderRadius: 50 }} />
          <View style={{ width: "100%" }}>
            <View style={{ width: "80%", height: 20, marginLeft: 4 }} />
            <View style={{ width: "20%", height: 10, marginLeft: 4, marginTop: 8 }} />
            <View style={{ width: "80%", height: 90, marginLeft: 4, marginTop: 8 }} />
          </View>
        </View>
      </View>
    </SkeletonPlaceholder>
  );



  const placeholderList = ({ index, item }) => (

    < SkeletonPlaceholder >
      <View style={{
        borderRadius: 8,
        padding: 12,
        paddingVertical: 18,
        marginBottom: 12,
        borderRadius: 12,
        //borderWidth: 1
      }}>
        <View style={{ width: "100%", height: 20 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
          <View style={{ width: "60%", height: 20, }} />
          <View style={{ width: "20%", height: 20 }} />
        </View>
        <View style={{ width: "100%", height: 150, marginTop: 10 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <View style={{ width: "20%", height: 20, }} />
          <View style={{ width: "20%", height: 20 }} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.main}>
        <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
        <CustomHeader
          buttonText={t('Announcement Details')}
          style={{ flexDirection: 'row' }}
          iconStyle={{ height: 30, width: 30, borderRadius: 50 }}
          icon={LOCAL_IMAGES.user}
          searchIcon={false}
        />

        <View style={{ paddingHorizontal: 14, marginTop: 12 }}>
          {announcementData == "" && waitLoaderStatus == true ?

            < FlatList
              showsVerticalScrollIndicator={false}
              data={[1, 1, 1, 1]}
              renderItem={placeholderList}
              contentContainerStyle={{ marginBottom: 30 }}
            />

            : <FlatList
              showsVerticalScrollIndicator={false}
              data={announcementData}
              renderItem={ListRender}
              contentContainerStyle={{ marginBottom: 30 }}
            />

          }
        </View>

      </View>
      {/* <Loader isLoading={waitLoaderStatus} /> */}

      <View style={{}} >
        <Modal
          animationType="slide"
          transparent={false} // This makes the modal full-screen
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingHorizontal: 12 }}>
              <Text style={{
                color: 'black',
                fontSize: 20,
                fontWeight: 'bold',
              }}>Comments</Text>
              <Pressable onPress={(() => {
                setModalVisible(false);
                setCommmentArr("");
                setparentid("")
                getPosts()

              })} style={{ alignSelf: 'flex-end', paddingBottom: 10, paddingTop: 10, paddingRight: 4 }}>
                <IonIcon
                  name={"close"}
                  size={24}
                  color={'#0E1F33'}
                />
              </Pressable>
            </View>

            {commentArr == "" && waitLoaderStatus == true ?
              <FlatList
                showsVerticalScrollIndicator={false}
                data={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
                renderItem={placeholderComments}
                contentContainerStyle={{ marginBottom: 30 }}
              />
              :
              <FlatList
                showsVerticalScrollIndicator={false}
                data={commentArr}
                renderItem={commentsRender}
                contentContainerStyle={{ marginBottom: 30 }}
                ref={flatListRef}
              />
            }
          </View>
          {/* Footer Section */}
          <View style={styles.footer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginLeft: 12 }}>

              <TextInput
                style={styles.input}
                placeholder="Write your comment..."
                value={comment}
                onChangeText={(text) => {
                  setCommment(text)
                }}

                autoFocus={isTexinputFocused ? true : false}
                ref={inputRef}
              />
              <MaterialIcons onPress={() => {
                comment != "" ? placeComment() : null
              }} name="send-circle" size={40} color={comment != "" ? colors.primary : "#878787"} />
            </View>
          </View>
        </Modal>
      </View>


    </SafeAreaView >
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
    //borderWidth: 0.5,
    //borderColor: '#00000012',
    backgroundColor: colors.white,

    //marginBottom: 8
  },
  input: {
    height: 42,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 0,
    borderRadius: 5,
    width: '85%'
  },
  openButton: {
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'white',
  },
  modalText: {
    fontSize: 24,
    marginBottom: 20,
  },
  closeButton: {
    padding: 15,
    backgroundColor: '#FF6347',
    borderRadius: 5,
  },
  footer: {
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
  },
});
export default AnnouncementListPublic;