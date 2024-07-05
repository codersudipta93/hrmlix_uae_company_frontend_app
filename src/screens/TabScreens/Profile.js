
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
    Alert
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
  
  const Profile = props => {
    
    const isFocused = useIsFocused();
    const route = useRoute();
    const dispatch = useDispatch();
  
  
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
          <StatusBar barStyle={'light-content'} backgroundColor={colors.primary} />
        </View>
      </SafeAreaView>
    )
  }
  
  const styles = StyleSheet.create({
    main: {
      flex: 1
    },
    
  });
  export default Profile;