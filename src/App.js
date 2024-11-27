import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // State to store quiz questions and user's answers
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(60); // Set the timer to 60 seconds



  // Fetch quiz questions from the backend when the app loads
  useEffect(() => {
    fetch("https://quiz-app-backend-b7u3.onrender.com/api/questions")
    .then((response) => response.json())
    .then((data) => {
      setQuestions(data); // Set the questions
      setLoading(false);  // Stop loading after data is fetched
    })
    .catch((error) => {
      console.error("Error fetching questions:", error);
      setLoading(false);  // Stop loading even if there's an error
    });
  }, []);  

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1); // Decrease time
      }, 1000);
  
      return () => clearInterval(timer); // Clear the interval when the component unmounts
    }
  }, [timeRemaining]);

  useEffect(() => {
    const savedScore = localStorage.getItem("quizScore");
    if (savedScore) {
      setScore(savedScore);
    }
  }, []);

  // Handle answer selection
  const handleAnswerChange = (e, questionId) => {
    const newAnswers = [...answers];
    newAnswers[questionId - 1] = e.target.value;
    setAnswers(newAnswers);
  };

  // Handle form submission to calculate score
  const handleSubmit = () => {
    fetch("http://localhost:5000/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: answers }),
    })
      .then((response) => response.json())
      .then((data) => {
        setScore(data.score);
        localStorage.setItem("quizScore", data.score);  // Save score to localStorage
      });
  };

  return (
    <div className="App">
      <h1>Quiz App</h1>

      {/* Display a loading message if the data is still being fetched */}
    {loading ? (
      <p>Loading questions...</p>
    ) : (
      <div>
        <p>Time Remaining: {timeRemaining} seconds</p>
        {questions.map((question, index) => (
          <div key={question.id} className="question">
            <p>{question.question}</p>
            <div>
              {question.options.map((option, i) => (
                <label key={i}>
                  <input
                    type="radio"
                    value={option}
                    checked={answers[index] === option}
                    onChange={(e) => handleAnswerChange(e, question.id)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button onClick={handleSubmit}>Submit Answers</button>
      </div>
    )}

    {/* Display score after submission */}
    {score !== null && (
      <div>
        <h2>Your Score: {score} / {questions.length}</h2>
      </div>
    )}
    </div>
  );
}

export default App;
