import React, { useState, useEffect, useRef } from "react";
import {
  Animated,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ConfettiCannon from "react-native-confetti-cannon";
import QuizPopup from "./QuizPopup";

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
  ];

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [hint, setHint] = useState<boolean>(false);
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const [buttonText, setButtonText] = useState<string>("Submit");
  const [showScore, setShowScore] = useState<boolean>(false);
  const [isNext, setIsNext] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [index, setIndex] = useState<number>(0);
  const [scrollbarWidth, setScrollbarWidth] = useState<number>(0);
  // const [buttonText, setButtonText] = useState<string | null>("Submit");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(
    null
  );
  const [questionResults, setQuestionResults] = useState<Array<boolean | null>>(
    Array(questions.length).fill(null)
  );

  useEffect(() => {
    setScrollbarWidth(200 / questions.length);
  }, [questions.length]);

  const handleOptionPress = (option: string, idx: number): void => {
    setSelectedOption(option);
    setSelectedOptionIdx(idx);
    setButtonText("Submit");
  };

  const handleAnswer = () => {
    if (selectedOption === null) return;

    const correct = selectedOption === questions[currentQuestion].correctAnswer;

    setQuestionResults((prevResults) => {
      const updatedResults = [...prevResults];
      updatedResults[currentQuestion] = correct;
      return updatedResults;
    });

    if (correct) {
      setScore(score + 1);
      setHint(false);
      setButtonText("Next");
      setSelectedOptionIdx(null);
      setSelectedOption(null);
      setIsNext(true); // Disable options until "Next" is clicked
    } else {
      // Handle incorrect answer logic here
    }
  };

  const handleNext = () => {
    setCurrentQuestion(currentQuestion + 1);
    setIsNext(false);
    setSelectedOption(null);
    setSelectedOptionIdx(null);
    setButtonText("Submit");
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
                      selectedOptionIdx === idx
                        ? { backgroundColor: "gray" }
                        : { backgroundColor: "white" },
                    ]}
                    onPress={() => {
                      handleOptionPress(option, idx);
                    }}
                    disabled={!!selectedOption} // Disable if an option is already selected
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        // selectedOption === option && { color: "white" },
                      ]}
                    >
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
    flex: 1, // Make sure it takes up full height
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
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
    width: 20,
    height: 20,
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
    maxHeight: 150, // Adjust the height to limit scrolling area for the question
  },
  codeScroll: {
    maxHeight: 100, // Restrict height for scrolling code
    backgroundColor: "#2e2e2e",
    width: 380,
    // height: 120,
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
    width: 390, // Fixed width
    height: 100,
    minHeight: 60, // Minimum height to maintain consistency
    marginBottom: 30,
    // borderWidth: 2,
    // borderColor: "#020923",
    flexShrink: 1,
  },

  codeText: {
    fontSize: 18,
    color: "#fff",
    padding: 20,
    borderRadius: 15,
    width: "90%", // Fixed width
    minHeight: 60, // Minimum height to maintain consistency
  },
  optionButton: {
    width: "90%", // Fixed width
    backgroundColor: "#f5f5f5",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "flex-start",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#020923",
    minHeight: 50, // Set minimum height
  },
  optionButtonText: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold",
    flexShrink: 1, // Ensure text wraps
    width: "100%", // Full width of the button
  },
  nextButton: {
    width: "90%",
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
    color: "#FF5733", // Hint color (choose a color that suits your design)
    backgroundColor: "#FEEFB3", // Background for the hint text
    padding: 10,
    borderRadius: 10,
    textAlign: "center",
    width: "90%", // Width to align with other elements
  },
});
