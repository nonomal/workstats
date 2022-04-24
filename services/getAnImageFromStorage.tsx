import { getDownloadURL, getStorage, ref } from 'firebase/storage';

const getAvatarUrl = (docId: string) => {
  // Create a reference to the file we want to download.
  // The official document is here: https://firebase.google.com/docs/storage/web/download-files
  const storage = getStorage();
  const avatarPath = `avatar/${docId}.jpg`;
  const avatarRef = ref(storage, avatarPath);
  const noImage = '/noProfileImage.png';

  // Get the download URL
  const avatarUrl = getDownloadURL(avatarRef)
    .then((url) => {
      return url;
    })
    .catch((error) => {
      // A full list of error codes is available at https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/object-not-found':
          console.log('The file does not exist');
          break;
        case 'storage/unauthorized':
          console.log('User does not have permission to access the object');
          break;
        case 'storage/canceled':
          console.log('User canceled the upload');
          break;
        case 'storage/unknown':
          console.log('Unknown error occurred, inspect the server response');
      }
      return noImage;
    });

  return avatarUrl;
};

export default getAvatarUrl;
