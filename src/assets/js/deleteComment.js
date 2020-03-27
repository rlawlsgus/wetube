/* eslint-disable no-plusplus */
import axios from "axios";

const deleteBtn = document.querySelectorAll(".jsDeleteComment");
const commentNumber = document.getElementById("jsCommentNumber");

const decreaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
};

const deleteComment = comment => {
  const commentList = document.getElementById(`li${comment}`);
  commentList.innerHTML = "";
  commentList.parentNode.removeChild(commentList);
  decreaseNumber();
};

const handleDeleteComment = async event => {
  const comment = event.target.id;
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
  deleteBtn.forEach(each => {
    const btn = each;
    btn.addEventListener("click", handleDeleteComment);
  });
};

if (deleteBtn) {
  init();
}
