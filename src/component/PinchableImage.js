// CustomImageViewer.js
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Modal, TouchableOpacity, Text, Dimensions, View, Image, Platform, StyleSheet } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Orientation from 'react-native-orientation-locker';
import WebView from 'react-native-webview';

const CustomImageViewer = ({backgroundColor, images, isVisible, onClose, innerHtml = true }) => {
	const [orientation, setOrientation] = useState('PORTRAIT');
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const handleOrientationChange = (orientation) => {
			setOrientation(orientation);
		};

		Orientation.addOrientationListener(handleOrientationChange);

		return () => {
			Orientation.removeOrientationListener(handleOrientationChange);
		};
	}, []);

	const onChangeImage = (index) => {
		setCurrentIndex(index);
	};

	const getContainerStyle = () => {
		const { width, height } = Dimensions.get('window');
		return orientation === 'PORTRAIT' ? { width, height } : { width: height, height: width };
	};

	const injectedJavaScript = `
    document.body.style.backgroundColor = 'transparent';
    document.documentElement.style.backgroundColor = 'transparent';
    document.body.style.color = 'red'; // Change text color to red
    true; // note: this is required, or you'll sometimes get silent failures
  `;

	return (
		<Modal visible={isVisible} transparent={true} onRequestClose={onClose}>
			<View style={{
				// flex: 1,
				width: Dimensions.get('window').width,
				height: Dimensions.get('window').height,
				backgroundColor: 'white',
				justifyContent: 'center',
				alignItems: 'center'
			}}>
				<ImageViewer
					imageUrls={images}
					enableSwipeDown
					onSwipeDown={onClose}
					backgroundColor={backgroundColor ? backgroundColor : "#000" }
					style={getContainerStyle()}
					onChange={onChangeImage}
				/>
				{/* {images[currentIndex]?.description ?
					<View style={{ position: 'absolute', bottom: 50, left: 10, right: 10, alignItems: 'center', marginTop: 10 }}>
						{innerHtml ?
							<View style={{
								minHeight: 60, width: '100%',
								justifyContent: 'center',
								// flex: 1,
								backgroundColor: 'transparent',
							}}>
								<WebView
									originWhitelist={['*']}
									injectedJavaScript={injectedJavaScript}
									javaScriptEnabled={true}
									style={{
										flex: 1,
										// backgroundColor: 'transparent',
										// backgroundColor: 'black',
										color: 'white'
									}}
									source={{
										// html: RoomImageZoom[0]?.description
										// html: `<div style=" letter-spacing:0.5;font-size:35px;">${RoomImageZoom[0]?.description} </div>`
										html: Platform.isPad ? `<div style=" letter-spacing:0.5;font-size:18px;">${images[currentIndex]?.description} </div>` :
											`<div style=" letter-spacing:0.5;font-size:16px;color:'white';">${images[currentIndex]?.description} </div>`
									}}
								/>
							</View>
							:
							<Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>
								{images[currentIndex]?.description}
							</Text>
						}

					</View>
					: null} */}

				<TouchableOpacity style={{ position: 'absolute', top: 40, right: 30, }} onPress={onClose}>
					<View style={{ paddingVertical: 2, paddingHorizontal: 6, backgroundColor: 'black', borderRadius: 5, borderWidth: 1, borderColor: 'white' }}>
						<Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>X</Text>
					</View>
				</TouchableOpacity>
			</View>
		</Modal>
	);
};

export default CustomImageViewer;

const styles = StyleSheet.create({

})