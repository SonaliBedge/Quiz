import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  Animated,
  TouchableOpacity,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon"; // for confetti
import BadgeIcon from "../assets/images/Badge_images.png"; // Badge image file
const correctAnswerIcon = require("../assets/images/CorrectAnswerIcon.png"); // Path to correct icon
const wrongAnswerIcon = require("../assets/images/WrongAnswerIcon.png"); // Path to wrong icon

const QuizPopup = ({ isCorrect, showPopup, badgeEarned, onRetry, IsRetry }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const badgeScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isCorrect && showPopup) {
      // Trigger the animations when the popup is displayed for a correct answer
      setShowConfetti(true);
      triggerBadgeAnimation();
    }
  }, [isCorrect, showPopup]);

  useEffect(() => {
    if (!showPopup) {
      badgeScale.setValue(0); // Reset the badge scale when the popup closes
    }
  }, [showPopup]);

  const triggerBadgeAnimation = () => {
    Animated.timing(badgeScale, {
      toValue: 1, // Scale up the badge
      friction: 5,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Modal transparent={true} visible={showPopup} animationType="fade">
      <View style={styles.popupContainer}>
        <View style={styles.popup}>
          {/* Popup Message */}
          <Text style={styles.popupText}>
            {isCorrect ? (
              <View style={styles.textWithIcon}>
                <Text style={styles.popupText}>Great Job! </Text>
                <Image
                  source={correctAnswerIcon}
                  style={styles.iconStylePopup}
                />
                <Text style={styles.popupText}>Correct Answer. </Text>
              </View>
            ) : (
              <View style={styles.textWithIcon}>
                <Text style={styles.popupText}>Oops! </Text>
                <Image source={wrongAnswerIcon} style={styles.iconStylePopup} />
                <Text style={styles.popupText}>That's not quite right.</Text>

                {/* Retry Button */}
                {!IsRetry &&  <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>}
              </View>
            )}
          </Text>

          {/* Badge Animation */}
          {isCorrect && (
            <Animated.View
              style={[
                styles.badgeContainer,
                { transform: [{ scale: badgeScale }] },
              ]}
            >
              <Image source={BadgeIcon} style={styles.badgeIcon} />
            </Animated.View>
          )}

          {/* Confetti Cannon */}
          {showConfetti && (
            <ConfettiCannon
              count={200} // Number of confetti pieces
              origin={{ x: 0, y: 0 }} // Confetti starts from the top left
              autoStart={true}
              fadeOut={true}
              onAnimationEnd={() => setShowConfetti(false)} // Stop the confetti after it completes
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

// Styles for your components
const styles = {
  popupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dimmed background
  },
  popup: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  textWithIcon: {
    flexDirection: "column",
    justifyContent: "center", // Ensure the text and icon are centered
    alignItems: "center",
  },
  popupText: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
  },
  iconStylePopup: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 20,
  },
  badgeContainer: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeIcon: {
    width: 100,
    height: 100,
  },
  retryButton: {
    backgroundColor: "#f44336", // Red background for retry
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
};

export default QuizPopup;
