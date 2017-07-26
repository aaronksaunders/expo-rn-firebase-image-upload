import { StackNavigator } from 'react-navigation';
import React from 'react';

import SignIn from '../screens/SignInScreen'
import SignUp from '../screens/SignUpScreen'


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