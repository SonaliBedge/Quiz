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
};

export default function Quiz() {
  const questions: Question[] = [
    {
      question: "What will be the output of the following code?",
      code: "Console.log('Hello')",
      options: ["Hello", "undefined", "Error", "null"],
      correctAnswer: "Hello",
      hint: "Check the console output",
    },

    {
      question: "What is the default port for a React development server?",
      code: "console.log('Starting React server...');",
      options: ["3000", "8080", "5000", "8000"],
      correctAnswer: "3000",
      hint: "Check the commonly used port for React apps.",
    },

    {
      question:
        "Which of the following is used to create a functional component in React?",
      code: "const MyComponent = () => { return <div>Hello World</div>; };",
      options: [
        "class MyComponent",
        "function MyComponent",
        "const MyComponent",
        "createComponent",
      ],
      correctAnswer: "const MyComponent",
      hint: "Functional components are defined using an arrow function or the function keyword.",
    },

    {
      question: "What is the purpose of useEffect hook in React?",
      code: "useEffect(() => { console.log('Effect'); }, []);",
      options: [
        "To manage state",
        "To manage side effects",
        "To render components",
        "To handle events",
      ],
      correctAnswer: "To manage side effects",
      hint: "Consider what happens when components mount or update.",
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [index, setIndex] = useState<number>(0);
  const [scrollbarWidth, setScrollbarWidth] = useState<number>(200);
  const [showScore, setShowScore] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);  
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [hint, setHint] = useState<boolean>(false);
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const [buttonText, setButtonText] = useState<string | null>("Submit");
  const [isNext, setIsNext] = useState<boolean | null>(false);
  const [isDisable, setIsDisable] = useState<boolean | null>(false);
  const [isRetry, setIsRetry] = useState<boolean | null>(false);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(
    null
  );
  const [questionResults, setQuestionResults] = useState<Array<boolean | null>>(
    Array(questions.length).fill(null)
  );

  useEffect(() => {
    // Set the scrollbar width dynamically
    setScrollbarWidth(200 / questions.length);
  }, [questions.length]);
  const OptionSelected = (option: string): void => {
    setSelectedOption(option);
    setSelectedOptionIdx(idx);
  };
  const handleAnswer = () => {
    const correct = selectedOption === questions[currentQuestion].correctAnswer;
    // Update the array of results
    setQuestionResults((prevResults) => {
      const updatedResults = [...prevResults];
      updatedResults[currentQuestion] = correct;
      return updatedResults;
    });

    if (correct) {
      setScore(score + 1);
      setHint(false);
      setButtonText("Next");
      setIsNext(true);
      setSelectedOption(null);
      setIsDisable(false);
    } else {
      triggerShakeAnimation(); // Trigger the shake animation on incorrect answer
      if (!isRetry) {
        setButtonText("Submit");
        setIsNext(true);
      } else {
        setButtonText("Next");
        setIsNext(false);
      }
      setIsDisable(true);

      setTimeout(() => {
        setIsDisable(false);
        setSelectedOptionIdx(null);
        setSelectedOption(null);
        setHint(true);
      }, 3000); // Delay of 1000 milliseconds (1 second)
    }
    setIsCorrect(correct);
    setShowPopup(true);

    setTimeout(() => setShowPopup(false), 3000);
    const result = (score * 100) / questions.length;

    let message = "";
    switch (true) {
      case result >= 80:
        message = "Excellent!";
        break;
      case result >= 60:
        message = "Good Job!";
        break;
      default:
        message = "Keep Trying!";
    }

    setResultMessage(message);
  };
  const handleRetry = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setShowPopup(false);
    setHint(true);
    setIsRetry(true);
    setIsCorrect(null);
    setButtonText("Submit");
    setIsDisable(false);
    setSelectedOptionIdx(null);  
  };

  const handleNext = (): void => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedOption(null);
      setIsCorrect(null);
      setIndex(index + 1);
      setHint(false);
      setIsNext(false);
      setIsRetry(false);
      setIsDisable(false);
      setButtonText("Submit");
      setSelectedOptionIdx(null);
   
    } else {
      setShowScore(true);
      setIndex(0);
    }
  };
  const handleOptionPress = (option: string, idx: number) => {
    setSelectedOption(option);
    setSelectedOptionIdx(idx); // Track the selected option index
   
    //  setIsNext(true);
  };
  const triggerShakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
    ]).start();
  };
  return (
    <LinearGradient
      colors={["#0FD0C4", "#94DBD7", "#4D5CE2", "#076633"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View>
          {showScore ? (
            <View style={styles.restartContainer}>
              <Text style={styles.resultMessage}>{resultMessage}</Text>
              <Text style={styles.scoreText}>
                Your score: {score} out of {questions.length}
              </Text>
              <View style={styles.restartButtonContainer}>
                <TouchableOpacity
                  style={styles.restartButton}
                  onPress={() => {
                    setScore(0);
                    setCurrentQuestion(0);
                    setSelectedOption(null);
                    setIsCorrect(null);
                    setShowScore(false);
                    setIsNext(false);
                    setIndex(0);
                    setButtonText("Submit");
                    setSelectedOptionIdx(null);
                    setQuestionResults(Array(questions.length).fill(null));
                  }}
                >
                  <Text style={styles.restartButtonText}>Restart Quiz</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <View style={styles.scrollContainer}>
                {questions.map((_, i) => (
                  <Text
                    key={i}
                    style={[
                      styles.scrollbar,
                      { width: scrollbarWidth },
                      questionResults[i] !== null && {
                        backgroundColor:
                          questionResults[i] === true
                            ? "#0A1C7A" // Correct answer color
                            : "#C5020E", // Incorrect answer color
                      },
                    ]}
                  />
                ))}
              </View>

              <Text style={styles.questionCounter}>
                {index + 1} / {questions.length}
              </Text>

              <View style={styles.quizContainer}>
                {/* ScrollView for the question text */}
                <ScrollView style={styles.questionScroll}>
                  <Text style={styles.questionText}>
                    {questions[currentQuestion].question}
                  </Text>
                </ScrollView>

                {/* ScrollView for the code text (only if 'code' is present) */}
                {questions[currentQuestion].code && (
                  <ScrollView style={styles.codeScroll}>
                    <Text style={styles.codeText}>
                      {questions[currentQuestion].code}
                    </Text>
                  </ScrollView>
                )}
              </View>

              {questions[currentQuestion].options.map((option, idx) => (
                <Animated.View
                  key={idx}
                  style={[
                    {
                      transform: [
                        {
                          translateX:
                            selectedOption === option && !isCorrect
                              ? shakeAnimation
                              : 0,
                        },
                      ],
                    },
                  ]}
                >
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.optionButton,                   
                      isNext
                        ? selectedOptionIdx === idx
                          ? isCorrect
                            ? { backgroundColor: "#055F34" } //green
                            : { backgroundColor: "#CE1010" } //red
                          : { backgroundColor: "fff" } //white
                        : selectedOptionIdx === idx
                        ? { backgroundColor: "#A69E9E" } //gray
                        : { backgroundColor: "#fff" }, //white
                    ]}
                    onPress={() => {
                      handleOptionPress(option, idx);
                    }}
                    disabled={isDisable}
                  >
                    <Text
                      style={[
                        styles.optionButtonText,                      
                        isNext
                          ? selectedOptionIdx === idx
                            ? isCorrect
                              ? { color: "#fff" }
                              : { color: "#fff" }
                            : { color: "#333" }
                          : selectedOptionIdx === idx
                          ? { color: "#333" }
                          : { color: "#333" },
                      ]}
                    >
                      {isNext && selectedOptionIdx === idx && (
                        <Image
                          source={
                            isCorrect ? correctAnswerIcon : wrongAnswerIcon
                          }
                          style={styles.iconStyle}
                        />
                      )}
                      {option}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}

              <TouchableOpacity
                style={styles.nextButton}
                onPress={buttonText === "Next" ? handleNext : handleAnswer}
              >
                <Text style={styles.nextButtonText}>{buttonText}</Text>
              </TouchableOpacity>

              {/* Call the QuizPopup component */}
              {showPopup && (
                <QuizPopup
                  isCorrect={isCorrect}
                  showPopup={showPopup}
                  badgeEarned={isCorrect ? "Good Job!" : "Try Again!"}
                  onRetry={handleRetry}
                  IsRetry={isRetry}
                />
              )}
              {hint && (
                <Text style={styles.hintText}>
                  {questions[currentQuestion].hint}
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
  quizContainer: {
    width: "100%",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  scrollContainer: {
    flexDirection: "row",
    marginBottom: 20,
    width: "100%",
    justifyContent: "left",
  },
  restartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  restartButtonContainer: {
    width: "90%",
    marginTop: 20,
  },
  restartButton: {
    backgroundColor: "#07A417",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  restartButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  resultMessage: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  iconStyle: {
    width: 25,
    height: 25,
    borderRadius: 10,
    marginRight: 10,
  },
  scrollbar: {
    height: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  questionCounter: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
  questionScroll: {
    maxHeight: 150,
  },
  codeScroll: {
    maxHeight: 100,
    backgroundColor: "#424140",
    width: 380,
    borderRadius: 10,
    marginBottom: 20,
  },

  questionText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    backgroundColor: "#55D6CE",
    padding: 20,
    borderRadius: 15,
    width: 390,
    height: 100,
    minHeight: 60,
    marginBottom: 30,
    flexShrink: 1,
  },

  codeText: {
    fontSize: 18,
    color: "#fff",
    padding: 20,
    borderRadius: 15,
    width: 380,
    minHeight: 60,
  },
  optionButton: {
    width: 380,
    backgroundColor: "#f5f5f5",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "flex-start",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#020923",
    minHeight: 50,
  },
  optionButtonText: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold",
    flexShrink: 1,
  },
  nextButton: {
    width: 380,
    backgroundColor: "#07A417",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 20,
  },
  nextButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  scoreText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  hintText: {
    marginTop: 15,
    fontSize: 16,
    fontStyle: "italic",
    color: "#FF5733",
    backgroundColor: "#FEEFB3",
    padding: 10,
    borderRadius: 10,
    textAlign: "center",
    width: 380,
  },
});
