import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Title, IconButton} from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import {AuthContext} from '../navigation/AuthProvider';
import ImagePicker from 'react-native-image-picker';
import userProfileImage from '../images/profile-icon-png.png';
export default function SignupScreen({navigation}) {
  const {register} = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avartar, setAvatar] = useState('');

  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#f5f5f5',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleText: {
      fontSize: 24,
      marginBottom: 10,
    },
    loginButtonLabel: {
      fontSize: 22,
    },
    navButtonText: {
      fontSize: 18,
    },
    navButton: {
      marginTop: 10,
    },
    userProfile: {
      width: 150,
      height: 150,
    },
  });
  const options = {
    title: 'Select Avatar',
    maxWidth: 500,
    maxHeight: 500,
    quality: 0.5,
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: '카메라 권한',
          message:
            '프로필 사진등록을 위해선' +
            '카메라 권한과 파일읽기 권한이 필요합니다.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ImagePicker.showImagePicker(options, (response) => {
          console.log('Response = ', response);
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker error ', response.error);
          } else if (response.CustomButton) {
            console.log('User tapped custom button: ', response.customButton);
          } else {
            // const source = {uri: response.uri};
            setAvatar(response.uri);
          }
        });
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Show me What you got?</Text>
      <Title style={styles.titleText} onPress={requestCameraPermission} />
      {/* <IconButton
        icon={(source = {uri: avartar})}
        size={50}
        onPress={requestCameraPermission}
      /> */}
      <TouchableOpacity onPress={requestCameraPermission}>
        {avartar === '' ? (
          <Image style={styles.userProfile} source={userProfileImage} />
        ) : (
          <Image
            style={styles.userProfile}
            source={{
              uri: avartar,
            }}
          />
        )}
      </TouchableOpacity>
      <FormInput
        labelName="Email"
        value={email}
        autoCapitalize="none"
        onChangeText={(userEmail) => setEmail(userEmail)}
      />
      <FormInput
        labelName="Password"
        value={password}
        secureTextEntry={true}
        onChangeText={(userPassword) => setPassword(userPassword)}
      />
      <FormButton
        title="Signup"
        modeValue="contained"
        labelStyle={styles.loginButtonLabel}
        onPress={() => register(email, password, avartar)}
      />
      <IconButton
        icon="keyboard-backspace"
        size={30}
        style={styles.navButton}
        color="#6646ee"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}
