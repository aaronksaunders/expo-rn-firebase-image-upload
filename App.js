import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading } from 'expo';
import { FontAwesome } from '@expo/vector-icons';
import RootNavigation from './navigation/RootNavigation';

import { Root } from "native-base";

import * as api from './api/firebaseService'

import cacheAssetsAsync from './utilities/cacheAssetsAsync';

import SignIn from './components/SignIn'

import { Toast } from 'native-base';

export default class AppContainer extends React.Component {
  state = {
    appIsReady: false,
  };

  isSignedIn() {
    return new Promise((resolve) => {
      resolve(false)
    })
  }


  componentWillMount() {
    this._loadAssetsAsync();
  }

  async _loadAssetsAsync() {
    try {
      await cacheAssetsAsync({
        images: [require('./assets/images/expo-wordmark.png')],
        fonts: [
          FontAwesome.font,
          { 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf') },
        ],
      });
    } catch (e) {
      console.warn(
        'There was an error caching assets (see: main.js), perhaps due to a ' +
        'network timeout, so we skipped caching. Reload the app to try again.'
      );
      console.log(e.message);
    } finally {
      this.setState({ appIsReady: true });
    }
  }

  renderMainApp() {
    return (
      <Root>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          {Platform.OS === 'android' &&
            <View style={styles.statusBarUnderlay} />}
          <RootNavigation />
        </View>
      </Root>
    );
  }


  _handleLogin({ email, password }) {
    console.log(email, password)
    api.login(email, password).then((_user) => {
      this.setState({ auth: true })
      console.log("success",_user)
    }, ({message}) => {

      Toast.show({
        text: message,
        position: 'bottom',
        type: 'danger',
        buttonText: 'Okay'
      })
    })
  }
  renderLoginComponent() {
    return (
      <Root>
        <SignIn onLogin={(_params) => this._handleLogin(_params)} />
      </Root>
    )
  }

  render() {
    if (this.state.appIsReady) {
      { return this.state.auth ? this.renderMainApp() : this.renderLoginComponent() }
    } else {
      return <AppLoading />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
