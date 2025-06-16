import { auth, provider, signInWithPopup, db } from "../../../firebaseConfig";
import { getDoc, setDoc, doc } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";
import { loginGoogle } from "../../../services/googleService";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { getUserIdFromToken } from "../../../utils/jwtHelper";

const MySwal = withReactContent(Swal);

const GoogleLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = async () => {
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const credential = GoogleAuthProvider.credentialFromResult(result);
      const idToken = credential?.idToken;
      // console.log("idToken:", idToken );

      MySwal.fire({
        title: "Processing...",
        text: "Please wait a moment.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      if (!idToken) {
        console.error("Không thể lấy ID Token từ Google!");
        return;
      }
      let userName = user.displayName; // Mặc định là tên từ Google
      let phoneNumber = user.phoneNumber;
      if (result.user) {
        const userDocRef = doc(db, "Users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userNameFromFirestore = userDocSnap.data().userName;
          if (userNameFromFirestore) userName = userNameFromFirestore;
          const numberPhoneFromFirestore = userDocSnap.data().phoneNumber;
          phoneNumber = numberPhoneFromFirestore;
        } else {
          console.log("User document not found!");
        }

        await setDoc(
          doc(db, "Users", user.uid),
          {
            email: user.email,
            name: user.displayName,
          },
          { merge: true }
        );

        const response = await loginGoogle(
          idToken,
          user.email ?? "",
          userName ?? "",
          phoneNumber ?? ""
        );

        if (response.status === 200) {
          const { accessToken, refreshToken } = response.data;

          localStorage.setItem("token", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          const userId = getUserIdFromToken(accessToken);
          if (userId) {
            localStorage.setItem("userId", userId);
            console.log("Stored userId in localStorage:", userId);
          } else {
            console.warn("Could not extract userId from token");
          }

          MySwal.fire({
            icon: "success",
            title: "Login Successful!",
            text: "Redirecting to your profile...",
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            navigate("/");
          });
        }
        if (!response) {
          throw new Error("Failed to save user to database");
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Response error:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }

      MySwal.fire({
        icon: "error",
        title: "Login Failed",
        text: "An error occurred. Please try again!",
      });

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleLogin} disabled={isLoading}>
        <i className="bx bxl-google"></i>
      </button>
    </div>
  );
};

export default GoogleLogin;
