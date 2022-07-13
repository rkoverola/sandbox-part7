import { useNavigate, Link } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  Card,
  CardContent,
  CardActions,
  Box,
} from "@mui/material";
import PropTypes from "prop-types";

const Blog = ({ blog, addLike, addComment, removeBlog, currentUser }) => {
  if (!blog) {
    return null;
  }
  const navigate = useNavigate();

  const handleLikeClick = () => {
    const blogObject = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    };
    addLike(blogObject, blog.id);
  };

  const handleAddCommentClick = (event) => {
    event.preventDefault();
    console.log("Got value", window.comment.value);
    if ("comments" in blog) {
      const blogObject = {
        user: blog.user.id,
        likes: blog.likes,
        author: blog.author,
        title: blog.title,
        url: blog.url,
        comments: blog.comments.concat(window.comment.value),
      };
      addComment(blogObject, blog.id);
      window.comment.value = "";
    } else {
      const blogObject = {
        user: blog.user.id,
        likes: blog.likes,
        author: blog.author,
        title: blog.title,
        url: blog.url,
        comments: [].concat(window.comment.value),
      };
      addComment(blogObject, blog.id);
      window.comment.value = "";
    }
  };

  const handleRemoveClick = () => {
    removeBlog(blog);
    navigate("/");
  };

  const addRemoveButton = () => {
    if (blog.user.username === currentUser.username) {
      return (
        <Button onClick={handleRemoveClick} className="removeButton">
          Remove
        </Button>
      );
    }
  };

  const generateId = () => {
    return Math.floor(Math.random() * 100000);
  };

  const addCommentSection = () => {
    if ("comments" in blog) {
      return (
        <div>
          <Box sx={{ p: 1 }}>
            <Typography variant="h5">Comments</Typography>
          </Box>
          <List>
            {blog.comments.map((comment) => {
              return <ListItem key={generateId()}>{comment}</ListItem>;
            })}
          </List>
        </div>
      );
    }
  };

  return (
    <div>
      <div>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6">{blog.title}</Typography>
            <Typography variant="body1" component={Link} to={blog.url}>
              {blog.url}
            </Typography>
            <Typography variant="body1">{blog.likes} likes </Typography>
            <Typography variant="body1">Added by {blog.user.name}</Typography>
          </CardContent>
          <CardActions>
            <Button onClick={handleLikeClick} variant="outlined" size="small">
              Like
            </Button>
            {addRemoveButton()}
          </CardActions>
        </Card>
        <div>{addCommentSection()}</div>
        <div>
          <form onSubmit={handleAddCommentClick}>
            <TextField type={"text"} id="comment" required />
            <Button variant="contained" color="primary">
              Add comment
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

Blog.propTypes = {
  addLike: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default Blog;
