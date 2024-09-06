
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
} from '../constants/Theme';

import { LOCAL_IMAGES, LOCAL_ICONS, AllSourcePath } from '../constants/PathConfig';
import { HelperFunctions } from '../constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { getData, setData, deleteData } from '../Service/localStorage';
import { useDispatch, useSelector } from 'react-redux';
import { postApi } from '../Service/service';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from 'react-native/Libraries/NewAppScreen';
import CustomHeader from '../component/Header';

import { useTranslation } from 'react-i18next'; //for translation service
import IonIcon from 'react-native-vector-icons/Ionicons';
import Delete from '../assets/icons/Delete';
import Eye from '../assets/icons/Eye';
import BootomSheet from '../component/BootomSheet';
import CustomButton from '../component/CustomButton';
import { LinearGradient } from 'react-native-linear-gradient';
import NoDataFound from '../component/NoDataFound';
import Loader from '../component/Loader';


const GovtRule = props => {
  const isFocused = useIsFocused();
  const route = useRoute();
  const dispatch = useDispatch();
  const { userDetails, token, needRefresh } = useSelector(state => state.project);
  const { t, i18n } = useTranslation();
  const [loadingView, setloadingView] = useState(false);
  const [govtRules, setGovtRules] = useState("");

  useEffect(() => {
    if (isFocused == true) {
      console.log(i18n.language);
      console.log(I18nManager.isRTL);
      getGovtRule()
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



  const ListRender = ({ index, item }) => (
    <View style={[styles.listCard, { marginBottom: 8 }]}>
      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
        <View style={{}}>
          <Text style={{ fontFamily: FontFamily.medium, color: '#4E525E', fontSize: sizes.h6, textAlign: 'left' }}>Rule {index + 1}</Text>
          <View style={{ borderBottomWidth: 0.5, borderColor: '#E7EAF1', marginTop: 8 }}></View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 6 }}>
            <Text style={{ fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md, textAlign: 'left', marginTop: 6 }}>Service Year</Text>
            <Text style={{ fontFamily: FontFamily.regular, color: '#8A8E9C', fontSize: sizes.md, textAlign: 'left', marginTop: 6 }}>Service Days</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 10 }}>
            <View style={{ backgroundColor: '#D9FCDC', borderWidth: 1, borderColor: '#539964', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 }}>
              <Text style={{ fontFamily: FontFamily.bold, color: '#539964', fontSize: sizes.h6, textAlign: 'left' }}>{item?.service_year_no} {item?.service_year_no_rule == "greater" ? ">" : "<="}</Text>
            </View>
            <View style={{ backgroundColor: '#D9FCDC', borderWidth: 1, borderColor: '#539964', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 }}>
              <Text style={{ fontFamily: FontFamily.bold, color: '#539964', fontSize: sizes.h6, textAlign: 'left' }}>{item?.service_days} {item?.service_year_no_rule == "greater" ? ">" : "<="}</Text>
            </View>
          </View>
        </View>
      </View>
      {/* <View style={{ paddingLeft: 12, width: '40%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

        <Pressable onPress={() => { toggleModal() }}>
          <Eye fillColor='#FC6860' style={{ transform: [{ rotate: '-90deg' }] }} />
        </Pressable>

        <Pressable style={{ marginLeft: 14 }} onPress={() => { console.log('delete action') }}>
          <Delete fillColor='#FC6860' style={{ transform: [{ rotate: '-90deg' }] }} />
        </Pressable>
      </View> */}
    </View>
  );

  const getGovtRule = () => {
    setloadingView(!loadingView)
    postApi("company/get_gratuity_rule", { pageno: 1 }, token)
      .then((resp) => {
        console.log(resp);

        if (resp?.status == 'success') {
          setGovtRules(resp?.gratuity?.docs[0]?.gratuity_rule);
          setloadingView(false);

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


  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.main}>
        <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
        <CustomHeader
          buttonText={t('Govt. Rules')}
          style={{ flexDirection: 'row' }}
          iconStyle={{ height: 30, width: 30, borderRadius: 50 }}
          icon={LOCAL_IMAGES.user}
          searchIcon={false}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: 14, flexDirection: 'column', justifyContent: 'space-between', marginTop: 12 }}>
            {govtRules != "" ?
              <FlatList
                showsVerticalScrollIndicator={false}
                data={govtRules}
                renderItem={ListRender}
                contentContainerStyle={{ marginBottom: 30 }}
              />
              : <NoDataFound />
            }
          </View>
        </ScrollView>
      </View>
      <Loader isLoading={loadingView} />

    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#F5F7FB'
  },

  listCard: {
    backgroundColor: '#FFFFFF',
    //width: '100%',
    borderRadius: 8,
    padding: 14,
    //paddingVertical: 10,
    //borderWidth: 0.5,
    //borderColor: '#00000012',
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    //marginBottom: 8
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


});
export default GovtRule;