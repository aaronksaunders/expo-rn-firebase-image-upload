import React from 'react';
import { Text, View, StyleSheet, TextInput, Button, Alert, ScrollView } from 'react-native';

// MOBX
import { observer, inject, Observer, action } from 'mobx-react/native'
/**
 * 
 * @param {*} param0 
 */

class SquadList extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        let squads = this.props.squadStore.SQUADS
        let list = []
        let returnArray = []

        squads.forEach((value, k, map) => {

            list = value.map((e, i) => {
                return <RenderMe key={e.id} e={e} />
            })
            returnArray = returnArray.concat(list)

        })

        return (
            <View>{returnArray}</View>
        )
    }

}

const RenderMe = observer(class RenderMe extends React.Component {

    constructor(props) {
        super(props);
    }

    renderMe = () => {
        let { e } = this.props;
        console.log('RenderMe', e)

        return <Text >{e.name} : {e.memberName}</Text>
    }

    render() {
        return this.renderMe()
    }
})

export default inject('squadStore')(observer(SquadList))