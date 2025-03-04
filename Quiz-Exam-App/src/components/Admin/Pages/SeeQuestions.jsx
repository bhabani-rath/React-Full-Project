import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EditQuestionModal from "./EditQuestionModal.jsx";
import Pagination from "@mui/material/Pagination";
import axios from "axios"; // Import axios

const SeeQuestions = () => {
 const { tech } = useParams();
 const [questions, setQuestions] = useState([]);
 const [error, setError] = useState("");
 const [editedQuestion, setEditedQuestion] = useState(null);
 const [showEditModal, setShowEditModal] = useState(false);
 const [page, setPage] = useState(1);
 const [currentSet, setCurrentSet] = useState([]);
 const quesPerPage = 12;

 useEffect(() => {
  fetchQuestions();
 }, []);

 const fetchQuestions = async () => {
  try {
   const response = await axios.get(
    `http://localhost:8080/api/questions/ques-${tech}`
   ); // Enclose URL in backticks

   setQuestions(response.data);
   setCurrentSet(response.data.slice(0, quesPerPage));
  } catch (error) {
   setError("Failed to fetch questions");
  }
 };

 const handleDeleteQuestion = async (id) => {
  try {
   console.log(id);
   await axios.delete(`http://localhost:8080/api/questions/${id}`); // Enclose URL in backticks
   fetchQuestions(); // Refresh the question list
  } catch (error) {
   setError("Failed to delete question");
  }
 };

 const handleEditQuestion = (question) => {
  setEditedQuestion(question);
  setShowEditModal(true);
 };

 const handleUpdateQuestion = async (updatedQuestion) => {
  try {
   await axios.put(
    `http://localhost:8080/api/questions/${updatedQuestion.id}`, // Enclose URL in backticks
    updatedQuestion
   );
   fetchQuestions(); // Refresh the question list
   setShowEditModal(false); // Close the edit modal
  } catch (error) {
   setError("Failed to update question");
  }
 };

 const changePage = (e, value) => {
  setPage(value);
  const start = (value - 1) * quesPerPage;
  const end = start + quesPerPage;
  setCurrentSet(questions.slice(start, end));
 };

 return (
  <div>
   <div className="container">
    <h2 className="mt-4 mb-3">Show Questions</h2>
    {questions.length > 0 ? (
     <table className="table table-hover table-striped">
      <thead className="table table-primary">
       <tr>
        <th>Question</th>
        <th>Option1</th>
        <th>Option2</th>
        <th>Option3</th>
        <th>Option4</th>
        <th>Correct Solution</th>
        <th>Technology</th>
        <th>Action</th>
       </tr>
      </thead>
      <tbody>
       {currentSet.map((question) => (
        <tr key={question.id}>
         <td>{question.questionText}</td>
         <td>{question.option1}</td>
         <td>{question.option2}</td>
         <td>{question.option3}</td>
         <td>{question.option4}</td>
         <td>{question.correctOption}</td>
         <td>{question.technology}</td>
         <td>
          <button
           className="btn btn-outline-danger"
           onClick={() => handleDeleteQuestion(question.id)}
          >
           Delete
          </button>
          <button
           className="btn btn-outline-primary"
           onClick={() => handleEditQuestion(question)}
          >
           Edit
          </button>
         </td>
        </tr>
       ))}
       <Pagination
        count={Math.ceil(questions.length / quesPerPage)}
        color="secondary"
        page={page}
        onChange={changePage}
       />
      </tbody>
     </table>
    ) : (
     <p>No questions found</p>
    )}
    {showEditModal && (
     <EditQuestionModal
      question={editedQuestion}
      onUpdateQuestion={handleUpdateQuestion}
      onClose={() => setShowEditModal(false)}
     />
    )}
    {error && <div className="text-danger mt-2">{error}</div>}
   </div>
  </div>
 );
};

export default SeeQuestions;
