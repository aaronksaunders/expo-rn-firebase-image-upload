# Example of how to upload image in expo with react-native and firebase

**Problem:** Issue uploading files in react-native in expo without detaching?? 

**Solution: ** Thanks to the latest release of Expo and React-Native it can be done exactly as described in the Firebase documentation. See below and sample app in repo


Upload function
```Javascript
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
```  
          

#### make sure you set your firebase configuration in `HomeScreen.js` on line 26

## Fix For VS Code Rendering

https://github.com/Microsoft/vscode/issues/21577#issuecomment-283272360
