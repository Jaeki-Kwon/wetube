/* export const search = (req, res) => res.send("Home");
export const search = (req, res) => res.send("Search");
export const videos = (req, res) => res.send("Videos");
export const upload = (req, res) => res.send("Upload");
export const videoDetail = (req, res) => res.send("Video Detail");
export const editVideo = (req, res) => res.send("Edit Video");
export const deleteVideo = (req, res) => res.send("Delete Video");
*/
import routes from "../routes";
import Video from "../models/Video";
import Comment from "../models/Comment";

export const home = async (req, res) => {
    // await 부분이 끝나기 전까지 다음 부분을 실행 않함
    try{
        const videos = await Video.find({}).sort({_id: -1});
        // console.log(videos);
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
    } catch(error) {
        console.log(error);
    }
    // const searchingBy = req.query.term; 위에 꺼랑 같은 문장임
    res.render("search", { pageTitle: "Search", searchingBy, videos });
};
export const getUpload = (req, res) => {
    res.render("upload", { pageTitle: "Upload" });
};

export const postUpload = async (req, res) =>{
    const {
        body: { title, description },
        file : { path }
    } = req;
    const newVideo = await Video.create({
        fileUrl : path,
        title,
        description,
        creator: req.user.id
    });
    console.log(newVideo);
    // console.log(file, title, description);
    // To Do : Upload and save video (할 일 : 비디오 업로드 및 저장)
    req.user.videos.push(newVideo.id);
    req.user.save();
    res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
    const {
        params : {id}
    } = req;
    try {
      const video = await Video.findById(id)
        .populate("creator")
        .populate("comments");
      res.render("videoDetail", { pageTitle: video.title, video });
    } catch (error) {
        console.log(error);
        res.redirect(routes.home);
    }
};
    
    
export const getEditVideo = async (req, res) => {
    const {
      params: { id }
    } = req;
    try {
      const video = await Video.findById(id);
      if (String(video.creator) !== req.user.id) {
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
      res.redirect(routes.videoDetail(id));
    } catch (error) {
      res.redirect(routes.home);
    }
  };

export const deleteVideo = async (req, res) => {
    const {
      params: { id }
    } = req;
    try {
      const video = await Video.findById(id);
      if (String(video.creator) !== req.user.id) {
        throw Error();
      } else {
        await Video.findOneAndRemove({ _id: id });
      }
    } catch (error) {
      console.log(error);
    }
    res.redirect(routes.home);
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
      creator: user.id
    });
    video.comments.push(newComment.id);
    video.save();
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};