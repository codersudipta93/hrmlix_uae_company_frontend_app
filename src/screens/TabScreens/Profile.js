
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Image,
  ScrollView,
  FlatList,
  RefreshControl,
  Pressable,
  ActivityIndicator,
  Dimensions,
  BackHandler,
  Alert,

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
import EditIcon from '../../assets/icons/EditIcon';
import PayrollIcon from '../../assets/icons/PayrollIcon';
import AppraisalIcon from '../../assets/icons/AppraisalIcon';
import Holiday from '../../assets/icons/Holiday';
import Billing from '../../assets/icons/Billing';
import Approval from '../../assets/icons/Approval';
import Document from '../../assets/icons/Document';
import Logout from '../../assets/icons/Logout';
import Arrow from '../../assets/icons/Arrow';

const Profile = props => {

  const isFocused = useIsFocused();
  const route = useRoute();
  const dispatch = useDispatch();

  const [menuName, setMenuName] = useState("");


  useEffect(() => {
    if (isFocused == true) {
    }
  }, [isFocused]);

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


  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.main}>
        <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />

        <ImageBackground
          source={LOCAL_IMAGES.profileBg}
          style={styles.background}
        >
          <View>
            <Text style={styles.headerText}>Profile</Text>
          </View>
          <View style={styles.container}>

            <Pressable style={{ position: 'relative' }} >
              <Image
                style={styles.user}
                source={LOCAL_IMAGES.user}
              />
              <View style={styles.editcontainer}>
                <EditIcon />
              </View>

            </Pressable>
            <Text style={styles.text}>Mukund Jha</Text>
            <Text style={styles.subtext}>ID: 2589756</Text>
          </View>
        </ImageBackground>

        <ScrollView showsVerticalScrollIndicator={false} style={{ paddingTop: 18 }}>
          <Pressable style={[styles.listItem, { paddingLeft: 12, paddingVertical: 12 }]}>
            <PayrollIcon />
            <View>
              <Text style={styles.itemText}>Salary/Payroll</Text>
            </View>
          </Pressable>

          <Pressable style={[styles.listItem, { paddingLeft: 12 }]}>
            <AppraisalIcon />
            <View>
              <Text style={styles.itemText}>Salary Revision/Appraisal</Text>
            </View>
          </Pressable>

          <Pressable style={[styles.listItem, { paddingLeft: 12 }]}>
            <Holiday />
            <View>
              <Text style={styles.itemText}>Holiday</Text>
            </View>
          </Pressable>

          <Pressable style={[styles.listItem, { paddingLeft: 12 }]}>
            <Billing />
            <View>
              <Text style={styles.itemText}>Billing</Text>
            </View>
          </Pressable>

          <Pressable style={[styles.listItem, { paddingLeft: 12 }]}>
            <Approval />
            <View>
              <Text style={styles.itemText}>Approval</Text>
            </View>
          </Pressable>

          <Pressable style={[styles.listItem, { paddingLeft: 12 }]}>
            <Document />
            <View>
              <Text style={styles.itemText}>Document Vault</Text>
            </View>
          </Pressable>


          <Pressable style={[styles.listItem, { paddingLeft: 12 }]}>
            <View style={[styles.listSeg1, { paddingBottom: 0, flexDirection: 'column' }]}>
              <Pressable style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }} onPress={() => {
                menuName == 'settings' ? setMenuName('') : setMenuName('settings')
              }}>
                <Holiday />
                <Text style={[styles.itemText, { color: menuName == 'settings' ? colors.primary : '#404040' }]}>Settings</Text>
              </Pressable>
              {menuName == 'settings' ?
                <View>
                  <View style={{ marginTop: 16, marginLeft: 28 }}>
                    <Text style={[styles.itemText, { fontSize: sizes.h6, marginBottom: 16, fontFamily: FontFamily.regular }]}>Govt.Rules</Text>
                    <Text style={[styles.itemText, { fontSize: sizes.h6, fontFamily: FontFamily.regular }]}>Company Policy</Text>
                  </View>
                </View> : null}
            </View>

            <Pressable style={styles.listSeg2} onPress={() => {
              menuName == 'settings' ? setMenuName('') : setMenuName('settings')
            }}>
              <Arrow size={50} color={menuName == 'settings' ? colors.primary : '#404040'} style={{ transform: [{ rotate: menuName == 'settings' ? '0deg' : '-90deg' }] }} />
            </Pressable>
          </Pressable>

          <Pressable style={[styles.listItem, { paddingLeft: 12 }]}>
            <View style={[styles.listSeg1, { paddingBottom: 0, flexDirection: 'column' }]}>
              <Pressable style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }} onPress={() => {
                menuName == 'appsettings' ? setMenuName('') : setMenuName('appsettings')
              }}>
                <Holiday />
                <Text style={[styles.itemText, { color: menuName == 'appsettings' ? colors.primary : '#404040' }]}>App Settings</Text>
              </Pressable>
              {menuName == 'appsettings' ?
                <View>
                  <View style={{ marginTop: 16, marginLeft: 28 }}>
                    <Text style={[styles.itemText, { fontSize: sizes.h6, marginBottom: 16, fontFamily: FontFamily.regular }]}>Change Language</Text>
                    <Text style={[styles.itemText, { fontSize: sizes.h6, fontFamily: FontFamily.regular }]}>Change Password</Text>
                  </View>
                </View>
                : null}
            </View>

            <Pressable style={styles.listSeg2} onPress={() => {
              menuName == 'appsettings' ? setMenuName('') : setMenuName('appsettings')
            }}>
              <Arrow size={50} color={menuName == 'appsettings' ? colors.primary : '#404040'} style={{ transform: [{ rotate: menuName == 'appsettings' ? '0deg' : '-90deg' }] }} />
            </Pressable>
          </Pressable>

          <Pressable style={[styles.listItem, { paddingLeft: 12, paddingBottom: 45 }]}>
            <Logout />
            <View>
              <Text style={styles.itemText}>Logout</Text>
            </View>
          </Pressable>

        </ScrollView>


      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#F5F7FB'
  },
  background: {
    height: 342,
    resizeMode: 'cover', // or 'stretch' or 'contain'
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editcontainer: {
    position: 'absolute',
    width: 28,
    height: 28,
    right: -10,
    top: 15,
    bottom: 0,
    borderRadius: 40,
    //top: 50px;
    backgroundColor: "#0E1F33",
    // borderWidth:1,
    //display: flex;
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    color: 'white',
    fontSize: sizes.h4,
    fontFamily: FontFamily.semibold,
    letterSpacing: 0.5,
    textAlign: 'left',
    paddingTop: 20,
    marginLeft: 6
  },
  text: {
    color: 'white',
    fontSize: sizes.h4,
    fontFamily: FontFamily.semibold,
    marginTop: 7
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8
  },
  arrow: {
    width: 20,
    height: 20,
  },
  subtext: {
    color: '#D1D4DC',
    fontSize: sizes.h6,
    fontFamily: FontFamily.regular,
    marginTop: 9
  },
  user: {
    width: 84,
    height: 84,
    borderRadius: 50,
    //borderWidth: 2.5,
    borderColor: colors.white
  },
  listContent: {
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    paddingBottom: 8,
    backgroundColor: colors.white,
  },
  listItem: {
    flexDirection: 'row',
    borderBottomColor: '#EDE7E7',
    borderBottomWidth: 1,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 20
  },
  listSeg2: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-end', width: '40%', height: '100%', paddingRight: 12 },
  listSeg1: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', width: '60%', height: '100%', },
  itemText: { fontSize: sizes.h5, color: '#404040', fontFamily: FontFamily.medium, lineHeight: 20, marginLeft: 8 }
});
export default Profile;