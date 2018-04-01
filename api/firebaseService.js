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


export const uploadAsFile = async (uri, progressCallback) => {

  console.log("uploadAsFile", uri)
  const response = await fetch(uri);
  const blob = await response.blob();

  var metadata = {
    contentType: 'image/jpeg',
  };

  let name = new Date().getTime() + "-media.jpg"
  const ref = firebase
    .storage()
    .ref()
    .child('assets/' + name)

  const task = ref.put(blob, metadata);

  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      (snapshot) => {
        progressCallback && progressCallback(snapshot.bytesTransferred / snapshot.totalBytes)

        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => reject(error), /* this is where you would put an error callback! */
      () => {
        var downloadURL = task.snapshot.downloadURL;
        console.log("_uploadAsByteArray ", task.snapshot.downloadURL)

        // save a reference to the image for listing purposes
        var ref = firebase.database().ref('assets');
        ref.push({
          'URL': downloadURL,
          //'thumb': _imageData['thumb'],
          'name': name,
          //'coords': _imageData['coords'],
          'owner': firebase.auth().currentUser && firebase.auth().currentUser.uid,
          'when': new Date().getTime()
        }).then(r => resolve(r), e => reject(e))
      }
    );
  });
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

    let name = new Date().getTime() + "-media.jpg"
    var storageRef = firebase.storage().ref();
    var ref = storageRef.child('assets/' + name)
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

      // save a reference to the image for listing purposes
      var ref = firebase.database().ref('assets');
      ref.push({
        'URL': downloadURL,
        //'thumb': _imageData['thumb'],
        'name': name,
        //'coords': _imageData['coords'],
        'owner': firebase.auth().currentUser && firebase.auth().currentUser.uid,
        'when': new Date().getTime()
      })
    });


  } catch (ee) {
    console.log("when trying to load _uploadAsByteArray ", ee)
  }
}

