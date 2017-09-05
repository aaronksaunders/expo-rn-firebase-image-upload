//
// see - for example of how to use "http://remotedev.io/local/" and react-dev-tools to monitor
// the state in your mobx application
//
// https://github.com/HaveF/mobx-react-native-template-remotedev
// 
import { useStrict, observable, autorun, action, computed, extendObservable } from 'mobx'

// MOBX remote dev tools
import remotedev from 'mobx-remotedev';

useStrict(true);

let SquadStore = remotedev(
  class SquadStore {


    constructor() {

      extendObservable(this, {
        // PROPERTIES
        username: '',
        user: {},
        SQUADS: observable.map(),

        // FUNCTIONS

        addUserToSquad: action(function addUserToSquad(_squadMemberData) {

          console.log('add')
          let key = _squadMemberData.name
          let value = this.SQUADS.get(key)

          let element = Object.assign(_squadMemberData, { id: new Date().getTime() + "" })

          if (value) {
            let newArray = value
            newArray.push(element)
            this.SQUADS.set(key, newArray)
          } else {
            this.SQUADS.set(key, observable([element]))
          }

        })
      })

      this.SQUADS = observable.map({
        'admin': [{
          id: new Date().getTime() + "",
          name: 'admin',
          memberName: 'admin User',
          role: 'admin'
        }]
      })
    }
  }, { remote: true })

const squadStore = new SquadStore

export default squadStore