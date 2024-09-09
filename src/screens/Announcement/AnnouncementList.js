
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
  Animated
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
import NoDataFound from '../../component/NoDataFound';
const AnnouncementList = props => {
  const isFocused = useIsFocused();
  const route = useRoute();
  const dispatch = useDispatch();
  const { userDetails, token } = useSelector(state => state.project);

  const { t, i18n } = useTranslation();
  const [selecteddetails, setselectedDetails] = useState("");
  const [announcementData, setannouncementData] = useState("");

  const [waitLoaderStatus, setWaitLoaderStatus] = useState(false);
  const [animValue] = useState(new Animated.Value(1000)); // Start off-screen
  const [modalOpen, SetmodalOpen] = React.useState(false); // modal Open close

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
    }
    postApi("company/get-announcement-list", paramData, token)
      .then((resp) => {
        console.log(resp?.post_data?.docs);
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

  const updatePublishStatus = (item) => {
    setWaitLoaderStatus(true)
    let paramData = {
      title: item?.title,
      _id: item?._id,
      publish_status: item?.publish_status == "published" ? "private" : "published"
    }
    postApi("company/update-publish-status", paramData, token)
      .then((resp) => {
        console.log(resp?.post_data?.docs);
        if (resp?.status == 'success') {
          getPosts()
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


  const postAction = (type) => {
    if (type == "delete") {
      Acknoledge_delete()
    } else {
      props.navigation.navigate('AnnouncementEdit', { paramData: selecteddetails, mode: 'edit' })
    }
  }


  const Acknoledge_delete = () => {
    Alert.alert('Are you sure want to remove?', 'You will not be able to recover this data!', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'YES', onPress: () => {
          setWaitLoaderStatus(true)
          let paramData = {
            _id: selecteddetails?._id,
          }
          postApi("company/delete-announcement", paramData, token)
            .then((resp) => {
              console.log(resp?.post_data?.docs);
              if (resp?.status == 'success') {
                getPosts();
                Animated.timing(animValue, {
                  toValue: 1000,
                  duration: 300,
                  useNativeDriver: true,
                }).start(() => SetmodalOpen(false));
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
      },
    ]);
    return true;
  };

  const openUploadModal = (item) => {
    setselectedDetails(item)
    if (modalOpen) {
      // Hide modal
      Animated.timing(animValue, {
        toValue: 1000,
        duration: 300,
        useNativeDriver: true,
      }).start(() => SetmodalOpen(false));
    } else {
      // Show modal
      SetmodalOpen(true);
      Animated.timing(animValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
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
    <View style={[styles.listCard, { paddingVertical: 22, marginBottom: 12, borderRadius: 12 }]}>
      <View style={{ width: '70%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
        <View style={{ paddingLeft: 6 }}>
          <Text onPress={() => { props.navigation.navigate("AnnouncementDetails", { id: item?._id }) }} style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h6, textAlign: 'left' }}>{item?.title}</Text>
          <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={item?.publish_status == "published" ? '#007AFF' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                updatePublishStatus(item)
                let data = HelperFunctions.copyArrayOfObj(announcementData);
                for (let k = 0; k < data.length; k++) {
                  if (index == k) {
                    data[k].publish_status = !data[k].publish_status
                  }

                }
                setannouncementData(data)
              }}
              value={item?.publish_status == "published" ? true : false}
            />
            <Text style={{ fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md }}>{item?.publish_status == "published" ? "Published" : 'Private'}</Text>
          </View>
        </View>
      </View>
      <View style={{ paddingLeft: 12, width: '30%', flexDirection: 'row', justifyContent: 'flex-end', height: '100%' }}>
        <Pressable onPress={() => { openUploadModal(item) }}>
          <Icon name="ellipsis-vertical" size={20} color="#878787" />
        </Pressable>
      </View>
    </View>
  );



  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.main}>
        <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
        <CustomHeader
          buttonText={t('Announcement')}
          style={{ flexDirection: 'row' }}
          iconStyle={{ height: 30, width: 30, borderRadius: 50 }}
          icon={LOCAL_IMAGES.user}
          searchIcon={true}
          onPressSearchIcon={() => { props.navigation.navigate("AnnouncementListSearch") }}
        />


        <View style={{ position: 'relative', paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 12, flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, }}>
            <Text style={{ fontFamily: FontFamily.semibold, color: '#4E525E', fontSize: sizes.h5 }}>Announcement List</Text>
            {/* <TouchableOpacity style={{ padding: 6, paddingHorizontal: 10 }}>
                <Filter />
              </TouchableOpacity> */}
          </View>

          {announcementData != "" ?
            <FlatList
              showsVerticalScrollIndicator={false}
              data={announcementData}
              renderItem={ListRender}
              contentContainerStyle={{ marginBottom: 30 }}
            />
            : <NoDataFound />
          }

          <TouchableOpacity onPress={() => {
            props.navigation.navigate('AnnouncementEdit', { paramData: "", mode: 'add' })
          }} style={styles.addButton}>
            <Icon name="add" size={24} color="#fff" />
          </TouchableOpacity>

        </View>

      </View>
      <Loader isLoading={waitLoaderStatus} />
      <BootomSheet
        toggleModal={openUploadModal}
        isModalVisible={modalOpen}
        animValue={animValue}
        modalContainerStyle={{
          backgroundColor: 'white',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
      >

        <View style={{ marginTop: 15 }}>
          <Pressable style={styles.actionSheetContentWrapper} onPress={() => postAction("edit")}>
            <Icon name="create" size={20} color="#878787" />
            <Text style={styles.uploadSourceText}>Edit</Text>
          </Pressable>
          <Pressable style={styles.actionSheetContentWrapper} onPress={() => postAction("delete")}>
            <Icon name="trash-bin" size={20} color="#878787" />
            <Text style={styles.uploadSourceText}>Delete</Text>
          </Pressable>
        </View>
      </BootomSheet>
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
    //borderWidth: 0.5,
    //borderColor: '#00000012',
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    //marginBottom: 8
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
    marginLeft: 8
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007BFF',
    borderRadius: 50,
    padding: 15,
    elevation: 5,
  }
});
export default AnnouncementList;