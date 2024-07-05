import AsyncStorage from '@react-native-async-storage/async-storage';

const getData = async key => {
  let value = await AsyncStorage.getItem(key);
  return value;
};

const setData = async (key, value) => {
  let resp = await AsyncStorage.setItem(key, value);
};

const deleteData = async () => {
  let resp = await AsyncStorage.clear();
};

export {getData, setData, deleteData};
