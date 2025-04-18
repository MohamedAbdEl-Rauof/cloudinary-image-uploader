// firebase/utils.ts
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAL2CmKq5b8cCxhyQsVVL5PiHcjfyr-zB4",
    authDomain: "e-commerce-project-210dd.firebaseapp.com",
    projectId: "e-commerce-project-210dd",
    storageBucket: "e-commerce-project-210dd.firebasestorage.app",
    messagingSenderId: "986246532904",
    appId: "1:986246532904:web:48ba614c86d4dd20414a1d",
    measurementId: "G-NNL75PTJJT"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Function to upload image and get URL
const uploadImage = async (file: File, path: string): Promise<string | null> => {
    try {
        const storageRef = ref(storage, path); // Create a reference to the storage location
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Listen for state changes, errors, and completion of the upload.
        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
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
                    console.error("Upload failed", error);
                    reject(error);
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        resolve(downloadURL);
                    });
                }
            );
        });
    } catch (error) {
        console.error("Error uploading file: ", error);
        return null;
    }
};

export { storage, uploadImage };
