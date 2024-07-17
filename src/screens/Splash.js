import {
    View,
    StatusBar,
    Image,
    StyleSheet
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';

import React, {
    useEffect,
    useState,
    useRef
} from 'react';

import { colors } from '../constants/Theme';
import { LOCAL_ICONS } from '../constants/PathConfig';
import * as Animatable from 'react-native-animatable';

import { getData, setData, deleteData } from '../Service/localStorage';
import { useDispatch, useSelector } from 'react-redux';
import {_setUserData, _setToken} from '../Store/Reducers/ProjectReducer';

const Splash = props => {
    const isFocused = useIsFocused();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isFocused == true) {
            setTimeout(()=>{
                _checkLoginStaus()
            },2000)
        }
    }, [isFocused]);

    const _checkLoginStaus = () =>{
        getData('userDetails').then((userRes) => {
            console.log('userRes', userRes)
            if (userRes) {
                _dataStoreToRedux(JSON.parse(userRes));
            } else {

              props.navigation.replace('Signin');
            }
          })
    }

    const _dataStoreToRedux = (res) => {
        if (res != null) {
          console.log("data fetched from local db for auto login ===>", res)
          console.log('response_data -->', res?.token)
          dispatch(_setUserData(res?.userDetails))
          dispatch(_setToken(res?.token))
          props.navigation.replace('TabNavigator');
        }
      };

    return (
        <View style={styles.container}>
            <StatusBar barStyle={'light-content'} backgroundColor={colors.secondary} />
            <Animatable.View style={styles.logoContainer} animation="zoomInUp">
                <Image
                    style={styles.logo}
                    source={LOCAL_ICONS.logo}
                />
            </Animatable.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        height: 42,
        width: 170
    },
});

export default Splash;
