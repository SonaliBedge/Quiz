import React, { useState, useRef, useEffect } from "react";
import QuizPopup from "./QuizPopup";
import {
  Text,
  View,
  Image,
  StyleSheet,
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
  code?: string;
  hint?: string;
};

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

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>("Submit");
  const [isNext, setIsNext] = useState<boolean>(false);
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(
    null
  );
  const [questionResults, setQuestionResults] = useState<Array<boolean | null>>(
    Array(questions.length).fill(null)
  );
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setScrollbarWidth(200 / questions.length);
  }, [questions.length]);

  const handleOptionPress = (option: string, idx: number) => {
    setSelectedOption(option);
    setSelectedOptionIdx(idx);
  };

  const handleAnswer = () => {
    const correct = selectedOption === questions[currentQuestion].correctAnswer;
    setQuestionResults((prevResults) => {
      const updatedResults = [...prevResults];
      updatedResults[currentQuestion] = correct;
      return updatedResults;
    });
    setIsCorrect(correct);
    if (correct) {
      setScore(score + 1);
      setButtonText("Next");
      setIsNext(true);
      setSelectedOption(null);
      setIsDisable(false);
    } else {
      triggerShakeAnimation();
      setButtonText("Next");
      setIsNext(false);
      setIsDisable(true);
    }
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleNext = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedOption(null);
      setIsCorrect(null);
      setIsNext(false);
      setIsDisable(false);
      setButtonText("Submit");
      setSelectedOptionIdx(null);
    } else {
      setShowScore(true);
    }
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
            <ScoreView score={score} questions={questions} />
          ) : (
            <QuizView
              currentQuestion={currentQuestion}
              questions={questions}
              selectedOption={selectedOption}
              isCorrect={isCorrect}
              isNext={isNext}
              isDisable={isDisable}
              selectedOptionIdx={selectedOptionIdx}
              handleOptionPress={handleOptionPress}
              handleAnswer={handleAnswer}
              handleNext={handleNext}
              buttonText={buttonText}
              shakeAnimation={shakeAnimation}
              questionResults={questionResults}
              showPopup={showPopup}
              setShowPopup={setShowPopup}
              setIsCorrect={setIsCorrect}
              setSelectedOption={setSelectedOption}
              setIsNext={setIsNext}
              setIsDisable={setIsDisable}
              setButtonText={setButtonText}
              setSelectedOptionIdx={setSelectedOptionIdx}
              setQuestionResults={setQuestionResults}
              setScore={setScore}
              setCurrentQuestion={setCurrentQuestion}
            />
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
  scrollContainer: {
    flexDirection: "row",
    marginBottom: 20,
    width: "100%",
    justifyContent: "left",
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
  iconStyle: {
    width: 25,
    height: 25,
    borderRadius: 10,
    marginRight: 10,
  },
});
