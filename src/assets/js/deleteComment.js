// import axios from "axios";

const deleteComment = document.getElementById("jsDeleteComment");

const handleDeleteComment = () => {
  console.log(deleteComment);
};

const init = () => {
  deleteComment.addEventListener("click", handleDeleteComment);
};

init();
