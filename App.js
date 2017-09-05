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

// MOBX
import { Provider } from 'mobx-react'
import squadStore from './store/store'

export default class AppContainer extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      appIsReady: false,
      auth: false
    };

    _unsubscribe = api.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("--------- LOGGED AS " + user.email + " ---------")
        this.setState({ auth: true })
        // firebaseApp.database().ref('users').child(user.uid).once('value')
        //   .then((snapshot) => {
        //     this.props.appStore.post_count = parseInt(snapshot.val().post_count)
        //     this.props.appStore.order_count = parseInt(snapshot.val().order_count)
        //     this.props.appStore.chat_count = parseInt(snapshot.val().chat_count)
        //   })
        // Actions.home({ type: 'replace', postProps: this.props.postProps })
      }
      else {
        //this.setState({ initialScreen: true })
      }
      _unsubscribe()
    })
  }


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
      <Provider squadStore={squadStore}>
        <Root>
          <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            {Platform.OS === 'android' &&
              <View style={styles.statusBarUnderlay} />}
            <RootNavigation />
          </View>
        </Root>
      </Provider>
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
      <Provider squadStore={squadStore}>
        <Root>
          <AuthNavigation screenProps={{
            onLogin: (_params) => this._handleLogin(_params),
            onSignUp: (_params) => this._handleSignUp(_params)
          }} />
        </Root>
      </Provider>
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
