import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading } from 'expo';
import { FontAwesome } from '@expo/vector-icons';
import RootNavigation from './navigation/RootNavigation';
import AuthNavigation from './navigation/AuthNavigation';

import { Root } from "native-base";

import * as api from './api/firebaseService'

import cacheAssetsAsync from './utilities/cacheAssetsAsync';


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
          { 'Roboto': require("native-base/Fonts/Roboto.ttf") },
          { 'Roboto_medium': require("native-base/Fonts/Roboto_medium.ttf") },
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
      console.log("success", _user)
    }, ({ message }) => {

      Toast.show({
        text: message,
        position: 'bottom',
        type: 'danger',
        buttonText: 'Okay'
      })
    })
  }


  _handleSignUp(params) {
    console.log(params)

    // api.login(email, password).then((_user) => {
    //   this.setState({ auth: true })
    //   console.log("success", _user)
    // }, ({ message }) => {

    //   Toast.show({
    //     text: message,
    //     position: 'bottom',
    //     type: 'danger',
    //     buttonText: 'Okay'
    //   })
    // })
  }


  renderAuthComponent() {
    return (
      <Root>
        <AuthNavigation screenProps={{
          onLogin: (_params) => this._handleLogin(_params),
          onSignUp: (_params) => this._handleSignUp(_params)
        }} />
      </Root>
    )
  }

  render() {
    if (this.state.appIsReady) {
      { return this.state.auth ? this.renderMainApp() : this.renderAuthComponent() }
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
