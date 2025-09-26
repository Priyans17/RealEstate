import { useState } from "react";
import { motion } from "framer-motion";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";

function NewPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          images: images,
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
        },
      });
      navigate("/"+res.data.id)
    } catch (err) {
      console.log(err);
      setError("Failed to create property listing. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="newPostPage"
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
          List Your Property
        </motion.h1>
        <div className="wrapper">
          <motion.form 
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="formSection">
              <h2>Basic Information</h2>
              <div className="formGrid">
                <div className="item">
                  <label htmlFor="title">Property Title *</label>
                  <input id="title" name="title" type="text" required />
                </div>
                <div className="item">
                  <label htmlFor="price">Price (₹) *</label>
                  <input id="price" name="price" type="number" required />
                </div>
                <div className="item fullWidth">
                  <label htmlFor="address">Address *</label>
                  <input id="address" name="address" type="text" required />
                </div>
                <div className="item">
                  <label htmlFor="city">City *</label>
                  <input id="city" name="city" type="text" required />
                </div>
                <div className="item">
                  <label htmlFor="bedroom">Bedrooms *</label>
                  <input min={1} id="bedroom" name="bedroom" type="number" required />
                </div>
                <div className="item">
                  <label htmlFor="bathroom">Bathrooms *</label>
                  <input min={1} id="bathroom" name="bathroom" type="number" required />
                </div>
                <div className="item">
                  <label htmlFor="size">Total Size (sqft) *</label>
                  <input min={0} id="size" name="size" type="number" required />
                </div>
              </div>
            </div>

            <div className="formSection">
              <h2>Property Details</h2>
              <div className="formGrid">
                <div className="item">
                  <label htmlFor="type">Type *</label>
                  <select name="type" required>
                    <option value="rent">For Rent</option>
                    <option value="buy">For Sale</option>
                  </select>
                </div>
                <div className="item">
                  <label htmlFor="property">Property Type *</label>
                  <select name="property" required>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="condo">Condo</option>
                    <option value="land">Land</option>
                  </select>
                </div>
                <div className="item">
                  <label htmlFor="utilities">Utilities Policy</label>
                  <select name="utilities">
                    <option value="owner">Owner is responsible</option>
                    <option value="tenant">Tenant is responsible</option>
                    <option value="shared">Shared</option>
                  </select>
                </div>
                <div className="item">
                  <label htmlFor="pet">Pet Policy</label>
                  <select name="pet">
                    <option value="allowed">Pets Allowed</option>
                    <option value="not-allowed">Pets Not Allowed</option>
                  </select>
                </div>
                <div className="item fullWidth">
                  <label htmlFor="income">Income Policy</label>
                  <input
                    id="income"
                    name="income"
                    type="text"
                    placeholder="e.g., 3x monthly rent"
                  />
                </div>
              </div>
            </div>

                    <div className="formSection">
                      <h2>Location Details</h2>
                      <div className="formGrid">
                        <div className="item">
                          <label htmlFor="latitude">Latitude (Mumbai: 19.0760)</label>
                          <input 
                            id="latitude" 
                            name="latitude" 
                            type="text" 
                            placeholder="19.0760"
                            defaultValue="19.0760"
                          />
                        </div>
                        <div className="item">
                          <label htmlFor="longitude">Longitude (Mumbai: 72.8777)</label>
                          <input 
                            id="longitude" 
                            name="longitude" 
                            type="text" 
                            placeholder="72.8777"
                            defaultValue="72.8777"
                          />
                        </div>
                <div className="item">
                  <label htmlFor="school">School (meters)</label>
                  <input min={0} id="school" name="school" type="number" />
                </div>
                <div className="item">
                  <label htmlFor="bus">Bus Stop (meters)</label>
                  <input min={0} id="bus" name="bus" type="number" />
                </div>
                <div className="item">
                  <label htmlFor="restaurant">Restaurant (meters)</label>
                  <input min={0} id="restaurant" name="restaurant" type="number" />
                </div>
              </div>
            </div>

            <div className="formSection">
              <h2>Description</h2>
              <div className="item description">
                <label htmlFor="desc">Property Description *</label>
                <ReactQuill theme="snow" onChange={setValue} value={value} />
              </div>
            </div>

            <div className="formActions">
              <motion.button 
                type="submit" 
                className="submitButton"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? "Creating Listing..." : "Create Property Listing"}
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
            </div>
          </motion.form>
        </div>
      </div>
      
      <motion.div 
        className="sideContainer"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="uploadSection">
          <h3>Property Images</h3>
          <p>Upload high-quality images of your property</p>
          <div className="imageGrid">
            {images.map((image, index) => (
              <motion.div 
                key={index}
                className="imageContainer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <img 
                  src={image} 
                  alt={`Property ${index + 1}`}
                />
                <button 
                  className="removeImage"
                  onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                  type="button"
                >
                  ✕
                </button>
              </motion.div>
            ))}
          </div>
          <UploadWidget
            uwConfig={{
              multiple: true,
              cloudName: "lamadev",
              uploadPreset: "estate",
              folder: "posts",
            }}
            setState={setImages}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default NewPostPage;
