import {StyleSheet, StatusBar, Platform} from 'react-native';
import Theme, {colors, FontFamily, sizes} from './Theme';

const GlobalStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Platform.OS === 'ios' ? StatusBar.currentHeight : 0,
      backgroundColor: colors.primary,
    },
   
  });
};

export default GlobalStyles;
