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

import { getData, setData, deleteData } from '../../Service/localStorage';
import { useDispatch, useSelector } from 'react-redux';

const Splash = props => {
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused == true) {
            setTimeout(() => {
                props.navigation.navigate('Signin');
                
            }, 1000);
        }
    }, [isFocused]);


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
