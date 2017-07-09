# Example of how to upload image in expo with react-native and firebase

**Problem:** Issue uploading files in react-native in expo without detaching and issues with base64 images.

**Solution: ** convert it to a `Uint8Array` the upload it to firebase, see [firebase documention on ByteArray](https://firebase.google.com/docs/storage/web/upload-files#upload_from_a_string) 

```javascript
this._uploadAsByteArray(this.convertToByteArray(pickerResult.base64), (progress) => {
  console.log(progress)
  this.setState({ progress })
})
```
Upload function
```Javascript
  _uploadAsByteArray = async (pickerResultAsByteArray, progressCallback) => {

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
```  
Helper functions...

```Javascript

  convertToByteArray = (input) => {
    var binary_string = this.atob(input);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes
  }
  
  atob = (input) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    let str = input.replace(/=+$/, '');
    let output = '';

    if (str.length % 4 == 1) {
      throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
    }
    for (let bc = 0, bs = 0, buffer, i = 0;
      buffer = str.charAt(i++);

      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  }
```  
          

#### make sure you set your firebase configuration in `HomeScreen.js` on line 26
