import { useContext, useState } from "react";
import { motion } from "framer-motion";
import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    try {
      const res = await apiRequest.put(`/users/${currentUser.id}`, {
        username,
        email,
        password,
        avatar: avatar[0]
      });
      updateUser(res.data);
      navigate("/profile");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="profileUpdatePage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="formContainer">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Update Profile
        </motion.h1>
        
        <motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="formGroup">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser.username}
              required
            />
          </div>
          
          <div className="formGroup">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email}
              required
            />
          </div>
          
          <div className="formGroup">
            <label htmlFor="password">New Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              placeholder="Leave blank to keep current password"
            />
          </div>
          
          <motion.button 
            type="submit"
            className="updateButton"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? "Updating..." : "Update Profile"}
          </motion.button>
          
          {error && (
            <motion.span 
              className="error"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.span>
          )}
        </motion.form>
      </div>
      
      <motion.div 
        className="sideContainer"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="avatarSection">
          <h3>Profile Picture</h3>
          <div className="avatarContainer">
            <img 
              src={avatar[0] || currentUser.avatar || "/noavatar.jpg"} 
              alt="Profile" 
              className="avatar" 
            />
            {(avatar[0] || currentUser.avatar) && (
              <button 
                className="removeAvatar"
                onClick={() => setAvatar([])}
                type="button"
              >
                ✕
              </button>
            )}
          </div>
          <UploadWidget
            uwConfig={{
              cloudName: "di3raumbr",
              uploadPreset: "Estate",
              multiple: false,
              maxImageFileSize: 2000000,  
              folder: "avatars",
            }}
            setState={setAvatar}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ProfileUpdatePage;
