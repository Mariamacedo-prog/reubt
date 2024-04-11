import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/storage';

export const firebaseapp = {
  apiKey: "AIzaSyDOxLrl76jmttfD0pZSwG84lkIlfXp0L-E",
  authDomain: "reurb-6fc7d.firebaseapp.com",
  projectId: "reurb-6fc7d",
  storageBucket: "reurb-6fc7d.appspot.com",
  messagingSenderId: "60391473788",
  appId: "1:60391473788:web:2ac1e1871aeef6ab1abff9",
  measurementId: "G-5TN0Q74VFJ"
};

export const firebase = initializeApp(firebaseapp);

export const firestore = getFirestore(firebase);



// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// const firebaseConfig = {
//   apiKey: "AIzaSyDOxLrl76jmttfD0pZSwG84lkIlfXp0L-E",
//   authDomain: "reurb-6fc7d.firebaseapp.com",
//   projectId: "reurb-6fc7d",
//   storageBucket: "reurb-6fc7d.appspot.com",
//   messagingSenderId: "60391473788",
//   appId: "1:60391473788:web:2ac1e1871aeef6ab1abff9",
//   measurementId: "G-5TN0Q74VFJ"
// };
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);




// import firebase from 'firebase/app';
// import 'firebase/firestore';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent {
//   constructor() {
//     const firestore = firebase.firestore();
//     firestore.collection('collectionName').doc('documentId').get().then((doc) => {
//       if (doc.exists) {
//         console.log('Document data:', doc.data());
//       } else {
//         console.log('Document not found');
//       }
//     }).catch((error) => {
//       console.error('Error getting document:', error);
//     });
//   }
// }