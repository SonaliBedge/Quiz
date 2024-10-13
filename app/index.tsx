import { Text, View, StyleSheet, Image } from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function Index() {
  return (
    <LinearGradient
      colors={["#0FD0C4", "#94DBD7", "#4D5CE2", "#076633"]}
      style={styles.container}
    >
      <Image
        source={require("../assets/images/QuizTime.png")}
        style={styles.topImage}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.heading}>Welcome to the Quiz</Text>
        <Link href={"/Quiz"} style={styles.linkButton}>
          <Text style={styles.linkText}>Start Quiz</Text>
        </Link>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start", // Align elements from the top
    alignItems: "center",
    padding: 20, // Add padding to avoid content touching the edges
  },
  topImage: {
    width: "100%", // Full width of the screen
    height: 280, // Adjust height as per your preference
    marginBottom: 30, // Space between the image and the content below
  },
  content: {
    width: "100%", // Make the content take up full width
    alignItems: "center", // Center the text and button horizontally
  },
  heading: {
    fontSize: 32, // Larger font size for the heading
    fontWeight: "bold", // Bold font for emphasis
    color: "#fff", // White text color for better contrast with background
    marginBottom: 20, // Space between the heading and the button
    textAlign: "center", // Center the text horizontally
  },
  linkButton: {
    backgroundColor: "#029110", // Green background color for the button
    paddingVertical: 12, // Padding inside the button
    paddingHorizontal: 40, // Horizontal padding for a wider button
    borderRadius: 20, // Rounded corners
    marginTop: 20, // Space above the button
  },
  linkText: {
    color: "#fff", // White text color
    fontSize: 18, // Larger font size for the button text
    fontWeight: "bold", // Bold text for emphasis
    textAlign: "center", // Center text inside the button
  },
});
