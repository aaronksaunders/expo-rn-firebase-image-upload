import * as firebase from 'firebase';

const firebaseConfig = {

};

firebase.initializeApp(firebaseConfig);


export const login = (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email, password)
}


export const getImagesFromFirebase = () => {

  return new Promise((resolve, reject) => {
    // Get a reference to the database service
    var database = firebase.database();
    let a = [];

    database.ref('assets').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        a.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        })
      });

      resolve(a)
    });
  })
}

/**
 * 
 * @memberof HomeScreen
 */
export const uploadAsByteArray = async (pickerResultAsByteArray, progressCallback) => {

  try {

    var metadata = {
      contentType: 'image/jpeg',
    };

    var storageRef = firebase.storage().ref();
    var ref = storageRef.child('images/mountains.jpg')
    let uploadTask = ref.put(pickerResultAsByteArray, metadata)

    uploadTask.on('state_changed', function (snapshot) {

      progressCallback && progressCallback(snapshot.bytesTransferred / snapshot.totalBytes)

      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');

    }, function (error) {
      console.log("in _uploadAsByteArray ", error)
    }, function () {
      var downloadURL = uploadTask.snapshot.downloadURL;
      console.log("_uploadAsByteArray ", uploadTask.snapshot.downloadURL)
    });


  } catch (ee) {
    console.log("when trying to load _uploadAsByteArray ", ee)
  }
}
