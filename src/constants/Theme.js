import {Dimensions} from 'react-native';
export const {width, height} = Dimensions.get('window');

export const colors = {
  primary: "#007AFF",
  secondary:"#0E1F33",
  placeholder: "#8A8E9C",
  darkGrey: "#EEEEEE",
  mediumGrey: "#CACDD4",
  lightGrey: "#E7EAF1",
  error: "#FC6860",
  white: "#ffff",
  black:'#4E525E',
  yellow:"#FFAC10",
  green:"#60B057",
};

// Light theme colors
const lightColors = {};

// Dark theme colors
const darkColors = {};

export const sizes = {
  sm: 10,
  md: 12,
  h6: 14,
  h5: 16,
  h4: 18,
  h3: 20,
  h2: 22,
  h1: 24,
  xlarge: 32,
  width,
  height,
  padding: 20,
};

export const FontFamily = {
  regular: 'OutfitRegular',
  medium: 'OutfitMedium',
  bold: 'OutfitBold',
  semibold: 'OutfitSemiBold',
};

const Theme = {colors, sizes, FontFamily, lightColors, darkColors};

export default Theme;
