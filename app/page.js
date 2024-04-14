'use client'
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { fetchQuestion, fetchCategories } from "./triviaAPI";

export default function Home() {
  const [isStarted, setIsStarted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);

  useEffect(() => { 
    async function fetchCategories() {
      const response = await fetch('https://opentdb.com/api_category.php');
      const data = await response.json();
      setCategories(data.trivia_categories);
    }
    fetchCategories();
  }, []);

  const handleStartFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const chosenCategories = formData.getAll('category').map(category => category.replace(/[:\s]/g, '')); // replace colons and spaces
    const difficulties = formData.getAll('difficulty');

    if (chosenCategories.length === 0 || difficulties.length === 0) {
      alert("Please select at least one category and difficulty level");
      return;
    }

    setSelectedCategories(chosenCategories);
    setSelectedDifficulties(difficulties);

    const question = await fetchQuestion(chosenCategories, difficulties);
    
    setCurrentQuestion(question) 
    setCorrectAnswer(question.correct_answer);
    setIncorrectAnswers(question.incorrect_answers);
    setIsStarted(true);
  }

  const handleAnswerClick = async (event) => {
    const answer = event.target.innerHTML;

    const answerButtons = document.querySelectorAll(".answerButton");
    answerButtons.forEach(button => {
      button.disabled = true
      if (button.innerHTML === correctAnswer) {
        button.style.backgroundColor = "green";
      } else {
        button.style.backgroundColor = "red";
      }
    });

    setTimeout(async () => {
      setQuestionNumber(questionNumber + 1);
      const question = await fetchQuestion(selectedCategories, selectedDifficulties)
      setCurrentQuestion(question) 
      setCorrectAnswer(question.correct_answer);
      setIncorrectAnswers(question.incorrect_answers);
  
      answerButtons.forEach(button => { 
        button.disabled = false;
        button.style.backgroundColor = "white";
      });
    }, 3000);

  }

  const allAnswers = [correctAnswer, ...incorrectAnswers];
  const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);
  const answerButtons = shuffledAnswers.map((answer, index) => (
    <button onClick={handleAnswerClick} key={index} dangerouslySetInnerHTML={{ __html: answer}} className="answerButton"></button>
  ));
  return (
    <main className={styles.main}>
      {isStarted ?
        (
          <div>
            <h1>Question {questionNumber}</h1>
            <h2>{currentQuestion.category} : {currentQuestion.difficulty}</h2>
            <hr></hr>
            <p dangerouslySetInnerHTML={{ __html: JSON.stringify(currentQuestion.question)}}></p>
            <div className="answerButtonContainer">
              {answerButtons}
            </div>
          </div>
        ) : (
          <div>
            <h1>Trivia Game</h1>
            <form onSubmit={handleStartFormSubmit}>
              <h2>Select Categories:</h2>
              <div className="form-categories">
                {categories.map((category, index) => (
                  <label key={index}>
                    <input type="checkbox" name="category" value={category.name} /> {category.name}
                  </label>
                ))}
              </div>
              <div className="form-difficulty">
                <h2>Select Difficulty:</h2>
                <label>
                  <input type="checkbox" name="difficulty" value="easy" /> Easy
                </label>
                <label>
                  <input type="checkbox" name="difficulty" value="medium" /> Medium
                </label>
                <label>
                  <input type="checkbox" name="difficulty" value="hard" /> Hard
                </label>
              </div>
              <button type="submit">Start</button>
            </form>
          </div>
        )}
    </main>
  );
}
