import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const [isSaving, setIsSaving] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    setIsSaving(true);
    try {
      if (saved) {
        await apiRequest.delete(`/users/save/${post.id}`);
        setSaved(false);
      } else {
        await apiRequest.post("/users/save", { postId: post.id });
        setSaved(true);
      }
    } catch (err) {
      console.log(err);
      alert("Failed to save property. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendMessage = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setShowMessageModal(true);
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    console.log('Sending message:', {
      postId: post.id,
      userId: post.userId,
      message: message.trim()
    });
    
    setIsSending(true);
    try {
      const response = await apiRequest.post("/messages", {
        postId: post.id,
        userId: post.userId,
        message: message.trim()
      });
      
      console.log('Message sent successfully:', response.data);
      setMessageSent(true);
      setMessage("");
      setTimeout(() => {
        setShowMessageModal(false);
        setMessageSent(false);
      }, 2000);
    } catch (err) {
      console.error('Error sending message:', err);
      console.error('Error response:', err.response?.data);
      alert(`Failed to send message: ${err.response?.data?.message || 'Please try again.'}`);
    } finally {
      setIsSending(false);
    }
  };


  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                <div className="price">₹ {post.price.toLocaleString('en-IN')}</div>
              </div>
              <div className="user">
                <img src={post.user.avatar} alt="" />
                <span>{post.user.username}</span>
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail.desc),
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Utilities</span>
                {post.postDetail.utilities === "owner" ? (
                  <p>Owner is responsible</p>
                ) : (
                  <p>Tenant is responsible</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Pet Policy</span>
                {post.postDetail.pet === "allowed" ? (
                  <p>Pets Allowed</p>
                ) : (
                  <p>Pets not Allowed</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Income Policy</span>
                <p>{post.postDetail.income}</p>
              </div>
            </div>
          </div>
          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.postDetail.size} sqft</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post.bedroom} beds</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{post.bathroom} bathroom</span>
            </div>
          </div>
          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>School</span>
                <p>
                  {post.postDetail.school > 999
                    ? post.postDetail.school / 1000 + "km"
                    : post.postDetail.school + "m"}{" "}
                  away
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>{post.postDetail.bus}m away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>{post.postDetail.restaurant}m away</p>
              </div>
            </div>
          </div>
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
            {currentUser && currentUser.id !== post.userId && (
              <motion.button 
                onClick={handleSendMessage}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img src="/chat.png" alt="" />
                Send a Message
              </motion.button>
            )}
            {currentUser && currentUser.id !== post.userId && (
              <motion.button
                onClick={handleSave}
                disabled={isSaving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={saved ? "saved" : ""}
              >
                <img src="/save.png" alt="" />
                {isSaving ? "Saving..." : saved ? "Place Saved" : "Save the Place"}
              </motion.button>
            )}
            {(!currentUser || currentUser.id === post.userId) && (
              <div className="ownerMessage">
                <p>This is your property listing</p>
                <span>Manage your property from your profile page</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <motion.div 
          className="messageModal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="modalContent"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className="modalHeader">
              <h3>Send Message to {post.user.username}</h3>
              <button 
                className="closeBtn"
                onClick={() => setShowMessageModal(false)}
              >
                ✕
              </button>
            </div>
            
            {messageSent ? (
              <div className="successMessage">
                <div className="successIcon">✓</div>
                <h4>Message Sent Successfully!</h4>
                <p>Your message has been sent to {post.user.username}</p>
              </div>
            ) : (
              <form onSubmit={handleMessageSubmit} className="messageForm">
                <div className="formGroup">
                  <label>Your Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    rows={4}
                    required
                  />
                </div>
                <div className="formActions">
                  <button 
                    type="button" 
                    className="cancelBtn"
                    onClick={() => setShowMessageModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="sendBtn"
                    disabled={isSending || !message.trim()}
                  >
                    {isSending ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}

    </div>
  );
}

export default SinglePage;
