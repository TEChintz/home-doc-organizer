import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import "./iphone-mockup.css";

export function IPhoneMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="ip-scene mx-auto">
      <div className="ip-phone-con">
        <motion.div 
          className="ip-phone"
          animate={{ y: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          {/* Buttons */}
          <div className="ip-buttons">
            <div className="ip-left">
              <div className="ip-button"></div>
              <div className="ip-button"></div>
              <div className="ip-button"></div>
            </div>
            <div className="ip-right">
              <div className="ip-button"></div>
            </div>
          </div>
          
          {/* Camera hardware punch-hole */}
          <div className="ip-camera"></div>
          
          {/* Screen container */}
          <div className="ip-screen-container">
            <div className="ip-bg"></div>
            
            <div className="ip-notch-container" tabIndex={0}>
              <div className="ip-notch">
                <div className="ip-content">
                  <div className="ip-left">
                    <div className="ip-tile">
                      <FileText className="size-5 text-white/80" />
                    </div>
                    <div className="ip-text"></div>
                  </div>
                  <div className="ip-right"></div>
                </div>
              </div>
            </div>
            
            <div className="ip-notch-blur"></div>
            
            <div className="ip-screen">
              {children}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
