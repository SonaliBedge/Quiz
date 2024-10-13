import React, { useState, useRef, useEffect } from "react";
import QuizPopup from "./QuizPopup";
import {
  Text,
  View,
  Button,
  Image,
  StyleSheet,
  Modal,
  Animated,
  Easing,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ConfettiCannon from "react-native-confetti-cannon";

const correctAnswerIcon = require("../assets/images/CorrectAnswerIcon.png");
const wrongAnswerIcon = require("../assets/images/WrongAnswerIcon.png");

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
  hint?: string;
};

export default function Quiz() {
  const questions: Question[] = [
    {
      question: "What will be the output of the following code?",
      options: ["Hello", "undefined", "Error", "null"],
      correctAnswer: "Hello",
      hint: "Check the console output",
    },
    // Additional questions...
  ];

  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showScore, setShowScore] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>("Submit");

  // Simplified state for animation and shake effect
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Resetting states between questions
    setSelectedOption(null);
    setIsCorrect(null);
    setButtonText("Submit");
  }, [currentQuestion]);

  const handleAnswer = () => {
    const correct = selectedOption === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    setButtonText(correct ? "Next" : "Retry");

    if (correct) {
      setScore(score + 1);
    } else {
      triggerShakeAnimation();
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowScore(true);
    }
  };

  const triggerShakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <LinearGradient colors={["#0FD0C4", "#4D5CE2"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View>
          {showScore ? (
            <View style={styles.scoreContainer}>
              <Text style={styles.resultText}>
                Your score: {score} / {questions.length}
              </Text>
              <Button
                title="Restart Quiz"
                onPress={() => {
                  setScore(0);
                  setCurrentQuestion(0);
                  setShowScore(false);
                }}
              />
            </View>
          ) : (
            <View>
              <Text style={styles.questionText}>
                {questions[currentQuestion].question}
              </Text>

              {questions[currentQuestion].options.map((option, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.optionButton,
                    selectedOption === option && {
                      backgroundColor: isCorrect ? "#0A1C7A" : "#C5020E",
                    },
                  ]}
                  onPress={() => setSelectedOption(option)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}

              <Button
                title={buttonText}
                onPress={buttonText === "Next" ? handleNext : handleAnswer}
                disabled={!selectedOption}
              />

              {isCorrect === false && (
                <Text style={styles.hintText}>
                  Hint: {questions[currentQuestion].hint}
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 6,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  optionButton: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  optionText: {
    fontSize: 16,
  },
  hintText: {
    fontStyle: "italic",
    color: "#888",
  },
  scoreContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  resultText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
