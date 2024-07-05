
import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Dimensions,
  BackHandler,
  Pressable,
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  I18nManager
} from 'react-native';
import FloatingLabelInput from '../component/FloatingLabelInput';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';

import RNRestart from 'react-native-restart';
import { useTranslation } from 'react-i18next'; //for translation service

import {
  colors,
  height,
  sizes,
  width,
  FontFamily
} from '../constants/Theme';
import CustomButton from '../component/CustomButton';
import { LOCAL_ICONS, LOCAL_IMAGES } from '../constants/PathConfig';
import IonIcon from 'react-native-vector-icons/Ionicons';
import LanguageModal from '../component/LanguageModal';
import { HelperFunctions } from '../constants';
import { getData, setData, deleteData } from '../Service/localStorage';

const Signin = props => {
  const isFocused = useIsFocused();

  const [isRTL, setIsRTL] = useState(false);
  const { t, i18n } = useTranslation();
  const [languageModalVisibleStatus, setlanguageModalVisibleStatus] = useState(false);
  const [languages, setLanguages] = useState([{ label: 'English', value: 'en', selected: true }, { label: 'Arabic', value: 'ar', selected: false }]);
  const [selectedLanguage, setLanguage] = useState("");

  const [corporateId, setCorporateId] = useState('');
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');


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
        console.log("else i ma call set english")
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

  useEffect(() => {
    //console.log("selectedLanguage : ", selectedLanguage);
    // if (selectedLanguage == 'ar') {
    //   console.log("if i ma call")
    //   i18n.changeLanguage('ar');
    //   setIsRTL(true);
    //   I18nManager.forceRTL(!isRTL);
    //   I18nManager.allowRTL(!isRTL);
    //   setData("defaultLanguage", 'ar');
    // } else {
    //   console.log("else i ma call")
    //   i18n.changeLanguage('en');
    //   setIsRTL(false);
    //   I18nManager.forceRTL(false);
    //   //I18nManager.allowRTL(false);
    //   setData("defaultLanguage", 'en');
    // }
  }, [selectedLanguage]);






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
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
            backgroundColor={colors.primary}
            buttonText={t('signin')}
            buttonTextStyle={{ textAlign: 'center', letterSpacing: 1.2, fontFamily: FontFamily.medium, color: '#fff', fontSize: sizes.h6 }}
            requireBorder={false}
            borderColor={colors.white}
            style={{ width: '100%', borderRadius: 8 }}
            onPress={() => { props.navigation.replace('TabNavigator'); }}
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
    lineHeight:4
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