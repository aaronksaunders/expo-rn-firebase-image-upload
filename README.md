## Example of how to upload image in expo with react-native and firebase

**Problem:** Issue uploading files in react-native in expo without detaching and issues with base64 images.

**Solution: [Works on IOS Only]** Use `XMLHttpRequest` read in the file and convert it to a `Uint8Array` the upload it to firebase

```javascript
    var xhr = new XMLHttpRequest();
    
    // value from ImagePicker.launchCameraAsync or ImagePicker.launchImageLibraryAsync
    xhr.open('GET', pickerResult.uri, true);

    xhr.responseType = 'arraybuffer';

    xhr.onload = function (e) {
      if (this.status == 200) {
        var uInt8Array = new Uint8Array(this.response);

        var metadata = {
          contentType: 'image/jpeg',
        };

        var storageRef = firebase.storage().ref();
        var ref = storageRef.child('images/mountains.jpg')
        let uploadTask = ref.put(uInt8Array, metadata)
      }
    }
```
          

#### make sure you set your firebase configuration in `HomeScreen.js` on line 26
