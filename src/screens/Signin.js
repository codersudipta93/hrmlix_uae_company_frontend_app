
import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Dimensions,
  BackHandler,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  I18nManager,
  Keyboard
} from 'react-native';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import RNRestart from 'react-native-restart'; // for app restart
import { useTranslation } from 'react-i18next'; // for translation service
//Theme import
import {
  colors,
  height,
  sizes,
  width,
  FontFamily
} from '../constants/Theme';
//Asset 
import { LOCAL_ICONS, LOCAL_IMAGES } from '../constants/PathConfig';
import IonIcon from 'react-native-vector-icons/Ionicons';
//Component
import FloatingLabelInput from '../component/FloatingLabelInput';
import CustomButton from '../component/CustomButton';
import LanguageModal from '../component/LanguageModal';
//Common functions
import { HelperFunctions } from '../constants';
//API Service 
import { postApi } from '../Service/service';
//Local Storage
import { getData, setData, deleteData } from '../Service/localStorage';
//Redux
import { useDispatch, useSelector } from 'react-redux';
import { _setUserData, _setToken } from '../Store/Reducers/ProjectReducer';

const Signin = props => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch(); //Redux
  //Translation and RTL
  const [isRTL, setIsRTL] = useState(false);
  const { t, i18n } = useTranslation();

  const [languageModalVisibleStatus, setlanguageModalVisibleStatus] = useState(false);
  const [languages, setLanguages] = useState([{ label: 'English', value: 'en', selected: true }, { label: 'Arabic', value: 'ar', selected: false }]);
  const [selectedLanguage, setLanguage] = useState("");

  const [corporateId, setCorporateId] = useState('ivn123');
  const [empId, setEmpId] = useState('user001');
  const [password, setPassword] = useState('qwer1234');
  const [waitLoaderStatus, setWaitLoaderStatus] = useState(false);
  
  useEffect(() => {
    getData('defaultLanguage').then((lngRes) => {
      console.log('default Language', lngRes);
      if (lngRes != null) {
        console.log("saved language found", lngRes);
        if (lngRes == 'en') {
          console.log("if en", I18nManager.isRTL);
          setLanguage(lngRes)
          i18n.changeLanguage('en');
          setIsRTL(false);
          I18nManager.forceRTL(false);
          I18nManager.allowRTL(false);
          setData("defaultLanguage", 'en');

          let oldLanguagesArr = HelperFunctions.copyArrayOfObj(languages);
          for (let i = 0; i < oldLanguagesArr.length; i++) {
            if (oldLanguagesArr[i].value == 'en') {
              oldLanguagesArr[i].selected = true;
            } else {
              oldLanguagesArr[i].selected = false;
            }
          }
          setLanguages(oldLanguagesArr)
        } else {
          console.log("else ar", I18nManager.isRTL);
          setLanguage(lngRes)
          i18n.changeLanguage('ar');
          setIsRTL(true);
          I18nManager.forceRTL(true);
          I18nManager.allowRTL(true);
          setData("defaultLanguage", 'ar');

          let oldLanguagesArr = HelperFunctions.copyArrayOfObj(languages);
          for (let i = 0; i < oldLanguagesArr.length; i++) {
            if (oldLanguagesArr[i].value == 'ar') {
              oldLanguagesArr[i].selected = true;
            } else {
              oldLanguagesArr[i].selected = false;
            }
          }
          setLanguages(oldLanguagesArr)
        }

      } else {
       // console.log("else i ma call set english")
        setLanguage('en');
        i18n.changeLanguage('en');
        setIsRTL(false);
        I18nManager.forceRTL(false);
        I18nManager.allowRTL(false);
        setData("defaultLanguage", 'en');

        let oldLanguagesArr = HelperFunctions.copyArrayOfObj(languages);
        for (let i = 0; i < oldLanguagesArr.length; i++) {
          if (oldLanguagesArr[i].value == 'en') {
            oldLanguagesArr[i].selected = true;
          } else {
            oldLanguagesArr[i].selected = false;
          }
        }
        setLanguages(oldLanguagesArr)
      }
    })
  }, []);


  //Back button functionality
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


  const _signin = () => {
    if (!corporateId.trim()) {
      HelperFunctions.showToastMsg("Please enter Corporate ID")
    } else if (!empId.trim()) {
      HelperFunctions.showToastMsg("Please User ID")
    } else if (!password.trim()) {
      HelperFunctions.showToastMsg("Please enter Password")
    } else {
      Keyboard.dismiss()
      let paramData = { "corporate_id": corporateId, "userid": empId, "password": password };
      setWaitLoaderStatus(true);
      postApi("company_signin", paramData)
        .then((resp) => { 
          console.log(resp);
          setWaitLoaderStatus(false);
          if (resp?.status == 'success') {
            _saveData(resp);
          } else if (resp?.status == 'val_err') {
            let message = "";
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
          setWaitLoaderStatus(false);
          HelperFunctions.showToastMsg(err.message);
        })
    }
  }

  //Save data to redux and local storage

  const _saveData = (response_data) => {
    if (response_data?.curr_user_data && response_data?.token) {
      let data = {
        "userDetails": response_data.curr_user_data,
        "token": response_data?.token,
      }
      dispatch(_setUserData(response_data?.curr_user_data));
      dispatch(_setToken(response_data?.token));
      setData("userDetails", JSON.stringify(data));
      props.navigation.replace('TabNavigator');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
        <View style={[styles.headerSection]}>
          <TouchableOpacity style={styles.langInput}
            onPress={() => {
              setlanguageModalVisibleStatus(true)
            }}
          >
            <Text style={styles.langName}>{selectedLanguage == 'en' ? 'En' : 'Ar'}</Text>
            <IonIcon
              name="chevron-down-outline"
              size={15}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Image
            style={styles.logo}
            source={LOCAL_ICONS.logo}
          />
          <Text style={styles.headerText}>{t('signin')}</Text>
          <FloatingLabelInput
            label={t('corporate_id')}
            placeholder={t('corporate_id_placeholder')}
            value={corporateId}
            onChangeText={setCorporateId}

          />
          <FloatingLabelInput
            label={t('emp_id')}
            placeholder={t('emp_id_placeholder')}
            value={empId}
            onChangeText={setEmpId}
          />

          <FloatingLabelInput
            label={t('password')}
            placeholder={t('password_placeholder')}
            value={password}
            onChangeText={setPassword}
            secureTextEntryStatus={true}
          />

          <CustomButton
            isLoading={waitLoaderStatus}
            backgroundColor={colors.primary}
            buttonText={t('signin')}
            buttonTextStyle={{ textAlign: 'center', letterSpacing: 1.2, fontFamily: FontFamily.medium, color: '#fff', fontSize: sizes.h6 }}
            requireBorder={false}
            borderColor={colors.white}
            style={{ width: '100%', borderRadius: 8, opacity: !corporateId.trim() || !corporateId.trim() || !password.trim() ? 0.5 : 1 }}
            onPress={() => {
              corporateId.trim() && corporateId.trim() && password.trim() ? _signin() : null;
            }}
          />
        </View>
      </ScrollView>

      <LanguageModal
        // positionRight={0}
        languages={languages}
        onClose={() => { setlanguageModalVisibleStatus(!languageModalVisibleStatus) }}
        isVisible={languageModalVisibleStatus}
        onSelectLanguage={(data) => {
          console.log(data.value);
          //setLanguages
          let oldLanguagesArr = HelperFunctions.copyArrayOfObj(languages);
          for (let i = 0; i < oldLanguagesArr.length; i++) {
            if (oldLanguagesArr[i].value == data.value) {
              oldLanguagesArr[i].selected = true;
            } else {
              oldLanguagesArr[i].selected = false;
            }
          }
          setLanguages(oldLanguagesArr)
          setLanguage(data.value);

          if (data.value == 'ar') {
            console.log("if i ma call")
            i18n.changeLanguage('ar');
            setIsRTL(true);
            I18nManager.forceRTL(!isRTL);
            I18nManager.allowRTL(!isRTL);
            setData("defaultLanguage", 'ar');
            RNRestart.Restart();
          } else {
            console.log("else i ma call")
            i18n.changeLanguage('en');
            setIsRTL(false);
            I18nManager.forceRTL(false);
            I18nManager.allowRTL(false);
            setData("defaultLanguage", 'en');
            RNRestart.Restart();
          }

        }}
      />

      {/* <Loader isLoading={false} /> */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E1F33',
    paddingTop: 12,
    padding: 12,
  },
  form: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 70
  },
  logo: {
    height: 35,
    width: 135
  },
  headerText: {
    fontFamily: FontFamily.regular,
    color: colors.white,
    fontSize: sizes.h1 + 6,
    paddingTop: 50,
    paddingBottom: 50,
    lineHeight: 4
  },
  langInput: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14
  },
  langName: {
    color: '#fff',
    fontFamily: FontFamily.bold,
    fontSize: sizes.md + 1
  },
  headerSection: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center'
  }

});
export default Signin;