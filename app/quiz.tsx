import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView, // Import ScrollView
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

export default function Quiz() {
  const questions: Question[] = [
    {
      question: "What is the capital of France?",
      options: ["Paris", "Berlin", "Madrid", "Rome"],
      correctAnswer: "Paris",
    },
    {
      question: "Who developed the theory of relativity?",
      options: ["Newton", "Einstein", "Galileo", "Tesla"],
      correctAnswer: "Einstein",
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Venus", "Mars", "Jupiter"],
      correctAnswer: "Mars",
    },
    
    {
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      correctAnswer: "Pacific",
    },
    {
      question: "Who painted the Mona Lisa?",
      options: [
        "Vincent van Gogh",
        "Pablo Picasso",
        "Leonardo da Vinci",
        "Claude Monet",
      ],
      correctAnswer: "Leonardo da Vinci",
    },
    {
      question: "What is the hardest natural substance on Earth?",
      options: ["Gold", "Diamond", "Iron", "Quartz"],
      correctAnswer: "Diamond",
    },
    // {
    //   question: "Which country is known as the Land of the Rising Sun?",
    //   options: ["China", "Japan", "South Korea", "Thailand"],
    //   correctAnswer: "Japan",
    // },
    // {
    //   question: "Who was the first President of the United States?",
    //   options: [
    //     "Abraham Lincoln",
    //     "George Washington",
    //     "Thomas Jefferson",
    //     "John Adams",
    //   ],
    //   correctAnswer: "George Washington",
    // },
    // {
    //   question: "What is the chemical symbol for water?",
    //   options: ["O2", "H2", "CO2", "H2O"],
    //   correctAnswer: "H2O",
    // },
    // {
    //   question: "Which country hosted the 2016 Summer Olympics?",
    //   options: ["China", "Brazil", "Japan", "Russia"],
    //   correctAnswer: "Brazil",
    // },
  ];

  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [index, setIndex] = useState<number>(0);
  const [scrollbarWidth, setScrollbarWidth] = useState<number>(200);
  const [showScore, setShowScore] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [questionResults, setQuestionResults] = useState<Array<boolean | null>>(
  Array(questions.length).fill(null)
  );

  useEffect(() => {
    // Set the scrollbar width dynamically
    setScrollbarWidth(200 / questions.length); // This should work fine
  }, [questions.length]);

  const handleAnswer = (option: string): void => {
    setSelectedOption(option);
    const correct = option === questions[currentQuestion].correctAnswer;

    // Update the array of results
    setQuestionResults((prevResults) => {
      const updatedResults = [...prevResults];
      updatedResults[currentQuestion] = correct;
      return updatedResults;
    });

    if (correct) {
      setScore(score + 1);
    }
    setIsCorrect(correct);
  };

  const handleNext = (): void => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedOption(null);
      setIsCorrect(null);
      setIndex(index + 1);
    } else {
      setShowScore(true);
      setIndex(0);
    }
  };

  return (
    <LinearGradient
      colors={["#0FD0C4", "#94DBD7", "#4D5CE2", "#076633"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View>
          {showScore ? (
            <View>
              <Text>Good Job!</Text>
              <Text style={styles.scoreText}>
                Your score: {score} out of {questions.length}
              </Text>
              <Button
                title="Restart Quiz"
                onPress={() => {
                  setScore(0);
                  setCurrentQuestion(0);
                  setShowScore(false);
                  setQuestionResults(Array(questions.length).fill(null));
                }}
              />
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
              <Text style={styles.questionText}>
                {questions[currentQuestion].question}
              </Text>
              {questions[currentQuestion].options.map((option, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.optionButton,
                    selectedOption === option && {
                      backgroundColor: isCorrect ? "green" : "red",
                    },
                  ]}
                  onPress={() => handleAnswer(option)}
                  disabled={!!selectedOption} // Disable if an option is already selected
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      selectedOption === option && { color: "white" },
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
              {selectedOption && (
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={handleNext}
                >
                  <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
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
    justifyContent: "flex-start", // Align everything to the top
    alignItems: "center",
    padding: 6,
  },
  scrollViewContent: {
    flexGrow: 1, // Allow the content to grow
    justifyContent: "flex-start", // Align content to the top
    alignItems: "center",
  },
  scrollContainer: {
    flexDirection: "row",
    marginBottom: 20,
    width: "100%",
    justifyContent: "left", // Center the scrollbar dots
  },
  scrollbar: {
    height: 10,
    backgroundColor: "#ccc", // Inactive dot color
    borderRadius: 5,
    marginHorizontal: 5, // Space between each dot
  },
 
  questionCounter: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
  questionText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center", // Center the question text
    color: "#333",
    backgroundColor: "#f5f5f5", // Background color for the question
    padding: 20,
    borderRadius: 15, // Rounded corners for the question container
    width: "90%",
    marginBottom: 30, // Space between the question and options
    borderWidth: 2, // Add border width
    borderColor: "#020923", // Set border color
  },
  optionButton: {
    width: "90%", // Full width for the buttons
    backgroundColor: "#f5f5f5", // Light background for the button
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10, // Rounded corners for buttons
    marginBottom: 10, // Space between buttons
    alignItems: "flex-start", // Align text to the left
    justifyContent: "center",
    elevation: 3, // Add shadow (Android)
    borderWidth: 2,
    borderColor: "#020923",
  },
  optionButtonText: {
    color: "#333", // Darker text color
    fontSize: 18, // Larger font size
    fontWeight: "bold", // Bold text for emphasis
  },
  nextButton: {
    width: "90%", // Full width for the button
    backgroundColor: "#07A417", // Color for the next button
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20, // Rounded corners for buttons
    alignItems: "center", // Center the text
    marginTop: 20, // Space above the next button
  },
  nextButtonText: {
    color: "white", // White text color for the next button
    fontSize: 18, // Larger font size for the button
    fontWeight: "bold", // Bold text for emphasis
  },
  scoreText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff", // White text for score display
    marginBottom: 20,
    textAlign: "center", // Center the score text
  },
});
