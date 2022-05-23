import { deleteUser, reauthenticateWithPopup } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import {
  auth,
  db,
  githubProvider,
  googleProvider
} from '../config/firebaseClient';

// const user = auth.currentUser;
const handleSubmitCancelMembership = async (docId: string) => {
  // Confirm user wants to cancel membership
  const confirm = window.confirm(
    'Are you sure you want to cancel your membership?'
  );
  if (confirm) {
    // Delete a user document in Firestore User collection first.
    const docRef = doc(db, 'users', docId);
    deleteDoc(docRef)
      .then(() => {
        alert('Your user information has been deleted.');
      })
      .catch((error) => {
        console.log(error);
      });

    // Then delete a user account from firebase authentication.
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        deleteUser(user)
          .then(() => {
            alert('User account has been deleted successfully!!');
          })
          .catch((error) => {
            // If the user has signed in too long ago, deleting the user will fail. In this case, we have to reauthenticate the user with their credential.
            if (error.code === 'auth/requires-recent-login') {
              let provider = googleProvider;
              if (user.providerData[0].providerId === 'github.com') {
                provider = githubProvider;
              }
              reauthenticateWithPopup(user, provider)
                .then(() => {
                  deleteUser(user)
                    .then(() => {
                      alert('User account has been deleted successfully!!');
                      window.location.reload();
                    })
                    .catch((error) => {
                      console.log(
                        'User deletion failed despite re-authentication.',
                        error
                      );
                    });
                })
                .catch((error) => {
                  console.log('User re-authentication itself failed.', error);
                });
            } else {
              console.log(
                'User deletion failed for reasons other than "auth/requires-recent-login".',
                error
              );
            }
          });
      } else {
        return;
      }
    });
  }
};

export default handleSubmitCancelMembership;
