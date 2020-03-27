import axios from "axios";

const deleteBtn = document.getElementById("jsDeleteComment");

const deleteComment = comment => {
  console.log(comment);
};

const handleDeleteComment = async () => {
  const comment = deleteBtn.className;
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/comment/delete`,
    method: "POST",
    data: {
      comment
    }
  });
  if (response.status === 200) {
    deleteComment(comment);
  }
};

const init = () => {
  deleteBtn.addEventListener("click", handleDeleteComment);
};

init();
