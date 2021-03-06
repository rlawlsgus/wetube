/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-cycle
import routes from "../routes";
import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 });
    res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    console.log(error);
    res.render("home", { pageTitle: "Home", videos: [] });
  }
};
export const search = async (req, res) => {
  const {
    query: { term: searchingBy }
  } = req;
  let videos = [];
  try {
    videos = await Video.find({
      title: { $regex: searchingBy, $options: "i" }
    });
  } catch (error) {
    console.log(error);
  }
  res.render("search", { pageTitle: "Search", searchingBy, videos });
};

export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });
export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { location }
  } = req;
  const newVideo = await Video.create({
    fileUrl: location,
    title,
    description,
    creator: req.user.id
  });
  req.user.videos.push(newVideo.id);
  req.user.save();
  res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id)
      .populate("creator")
      .populate("comments");
    res.render("videoDetail", { pageTitle: video.title, video });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const getEditVideo = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    const userId = req.user._id;
    if (String(video.creator) !== String(userId)) {
      throw Error();
    } else {
      res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
    }
  } catch (error) {
    res.redirect(routes.home);
  }
};
export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description }
  } = req;
  try {
    await Video.findOneAndUpdate({ _id: id }, { title, description });
  } catch (error) {
    console.log(error);
  }
  res.redirect(routes.home);
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id).populate("comments");
    const userId = req.user._id;
    const user = await User.findById(userId).populate("videos");
    const tmpVideoArr = await user.videos.filter(arr => {
      return arr.id !== id;
    });
    console.log(id, tmpVideoArr);
    if (String(video.creator) !== String(userId)) {
      throw Error();
    } else {
      await User.findByIdAndUpdate(userId, { videos: tmpVideoArr });
      await Video.findOneAndRemove({ _id: id });
      await Comment.deleteMany({ videos: id });
    }
  } catch (error) {
    console.log(error);
  } finally {
    res.redirect(routes.home);
  }
};

export const postRegisterView = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    video.views += 1;
    video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const postAddComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
    user
  } = req;
  try {
    const video = await Video.findById(id);
    const newComment = await Comment.create({
      text: comment,
      creator: user.id,
      videos: video.id
    });
    video.comments.push(newComment.id);
    video.save();
    res.json({ commentId: newComment.id });
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const postDeleteComment = async (req, res) => {
  const {
    params: { id },
    body: { comment }
  } = req;
  try {
    const video = await Video.findById(id).populate("comments");
    const commentDb = await Comment.findById(comment);
    const userId = req.user._id;
    const tmpCommentArr = await video.comments.filter(arr => {
      return arr.id !== comment;
    });
    if (String(commentDb.creator) !== String(userId)) {
      throw Error();
    } else {
      await Video.findByIdAndUpdate(id, { comments: tmpCommentArr });
      await Comment.findByIdAndRemove(comment);
    }
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};
