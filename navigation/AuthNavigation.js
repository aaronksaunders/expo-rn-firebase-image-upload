import { StackNavigator } from 'react-navigation';
import React from 'react';

import SignIn from '../components/SignIn'
import SignUp from '../components/SignUp'

import { Toast } from 'native-base';


export default AuthNavigation = StackNavigator({
    SignIn: {
        screen: SignIn,
        navigationOptions: {
            title: "Sign In"
        }
    },
    SignUp: {
        screen: SignUp,
        navigationOptions: {
            title: "Sign Up"
        }
    },
});