import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../config/firebaseClient';
import { updatePhotoURL } from './setDocToFirestore';

// Uploads a file to the Firebase Storage
// See the details; https://firebase.google.com/docs/storage/web/upload-files
interface UploadAnImageToFirebaseStorageProps {
  docId: string;
  file: File;
  isUploaded: number;
  setIsUploaded: (arg0: number) => void;
}
const uploadAnImageToFirebaseStorage = async ({
  docId,
  file,
  isUploaded,
  setIsUploaded
}: UploadAnImageToFirebaseStorageProps) => {
  // Create a root reference
  const extension = file.name.split('.').pop();
  const fileName = `${docId}.${extension}`;
  const path = 'avatar/' + fileName;
  const storageRef = ref(storage, path);

  // Upload a file here.
  const uploadTask = uploadBytesResumable(storageRef, file);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(
    'state_changed',
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded

      // Display this progress on the UI in the future.
      // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      // console.log('Upload is ' + progress + '% done');

      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    },
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          console.log('User does not have permission to access the object');
          break;
        case 'storage/canceled':
          console.log('User canceled the upload');
          break;
        case 'storage/unknown':
          console.log('Unknown error occurred, inspect error.serverResponse');
          console.log('error.serverResponse is:', error.serverResponse);
          break;
      }
    },
    async () => {
      // Upload completed successfully, now we can get the download URL
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      await updatePhotoURL(docId, downloadURL);
      setIsUploaded(isUploaded + 1);
    }
  );
};

export default uploadAnImageToFirebaseStorage;
