import { useContext } from "react";
import { motion } from "framer-motion";
import SearchBar from "../../components/searchBar/SearchBar";
import ScrollAnimation from "../../components/ScrollAnimation/ScrollAnimation";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";

function HomePage() {

  const {currentUser} = useContext(AuthContext)

  return (
    <motion.div 
      className="homePage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="textContainer">
        <div className="wrapper">
                  <motion.h1 
                    className="title"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    Find Your Dream Home with PropertyHub
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    India's most trusted real estate platform connecting you with verified properties. 
                    From modern apartments to premium villas, discover your perfect home 
                    with our comprehensive network of trusted listings.
                  </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <SearchBar />
          </motion.div>
          <div className="boxes">
                    <ScrollAnimation animation="fadeInUp" delay={0.1}>
                      <motion.div 
                        className="box"
                        whileHover={{ scale: 1.05, y: -5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h1>10,000+</h1>
                        <h2>Properties Listed</h2>
                      </motion.div>
                    </ScrollAnimation>
                    <ScrollAnimation animation="fadeInUp" delay={0.2}>
                      <motion.div 
                        className="box"
                        whileHover={{ scale: 1.05, y: -5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h1>50,000+</h1>
                        <h2>Happy Customers</h2>
                      </motion.div>
                    </ScrollAnimation>
                    <ScrollAnimation animation="fadeInUp" delay={0.3}>
                      <motion.div 
                        className="box"
                        whileHover={{ scale: 1.05, y: -5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h1>25+</h1>
                        <h2>Cities Covered</h2>
                      </motion.div>
                    </ScrollAnimation>
          </div>
        </div>
      </div>
      <motion.div 
        className="visualContainer"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="geometricShapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
                <div className="floatingElements">
                  <motion.div 
                    className="floatingCard card-1"
                    animate={{ 
                      y: [0, -20, 0],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    whileHover={{ 
                      scale: 1.1,
                      y: -10,
                      rotate: 5
                    }}
                  >
                    <div className="cardIcon">🏠</div>
                    <span>Premium Villas</span>
                  </motion.div>
                  <motion.div 
                    className="floatingCard card-2"
                    animate={{ 
                      y: [0, -15, 0],
                      rotate: [0, -3, 0]
                    }}
                    transition={{ 
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                    whileHover={{ 
                      scale: 1.1,
                      y: -10,
                      rotate: -3
                    }}
                  >
                    <div className="cardIcon">🏢</div>
                    <span>Commercial Spaces</span>
                  </motion.div>
                  <motion.div 
                    className="floatingCard card-3"
                    animate={{ 
                      y: [0, -25, 0],
                      rotate: [0, 2, 0]
                    }}
                    transition={{ 
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                    whileHover={{ 
                      scale: 1.1,
                      y: -10,
                      rotate: 2
                    }}
                  >
                    <div className="cardIcon">🏘️</div>
                    <span>Modern Apartments</span>
                  </motion.div>
                </div>
      </motion.div>
    </motion.div>
  );
}

export default HomePage;
