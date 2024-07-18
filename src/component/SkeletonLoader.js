import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

const SkeletonLoader = ({ width = '100%', height = 20, borderRadius = 8, style }) => {
    const shimmerValue = useRef(new Animated.Value(-1)).current;

    useEffect(() => {
        const animateShimmer = () => {
            shimmerValue.setValue(-1);
            Animated.timing(shimmerValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }).start(() => animateShimmer());
        };

        animateShimmer();
    }, [shimmerValue]);

    const shimmerTranslate = shimmerValue.interpolate({
        inputRange: [-1, 1],
        outputRange: [-screenWidth, screenWidth],
    });

    return (
        <View style={[styles.container, { width, height }, style]}>
            <Animated.View
                style={[
                    styles.shimmer,
                    { transform: [{ translateX: shimmerTranslate }], borderRadius },
                ]}
            >
                <LinearGradient
                    colors={['#f5f7fa', '#c3cfe2']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.linearGradient, {  }]}
                />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        backgroundColor: '#E0E0E0',
    },
    shimmer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden', // Ensure the shimmer effect respects border radius
    },
    linearGradient: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default SkeletonLoader;
