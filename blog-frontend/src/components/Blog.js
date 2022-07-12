import { useNavigate } from "react-router-dom";
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

  const handleAddCommentClick = () => {
    if ("comments" in blog) {
      const blogObject = {
        user: blog.user.id,
        likes: blog.likes,
        author: blog.author,
        title: blog.title,
        url: blog.url,
        comments: blog.comments.concat("New comment"),
      };
      addComment(blogObject, blog.id);
    } else {
      const blogObject = {
        user: blog.user.id,
        likes: blog.likes,
        author: blog.author,
        title: blog.title,
        url: blog.url,
        comments: [].concat("Init comment"),
      };
      addComment(blogObject, blog.id);
    }
  };

  const handleRemoveClick = () => {
    removeBlog(blog);
    navigate("/");
  };

  const addRemoveButton = () => {
    if (blog.user.username === currentUser.username) {
      return (
        <button onClick={handleRemoveClick} className="removeButton">
          Remove
        </button>
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
          <h3>Comments</h3>
          <ul>
            {blog.comments.map((comment) => {
              return <li key={generateId()}>{comment}</li>;
            })}
          </ul>
        </div>
      );
    }
  };

  return (
    <div>
      <div>
        <h2>{blog.title}</h2>
        <a href={blog.url}>{blog.url}</a>
        <div>
          {blog.likes} likes <button onClick={handleLikeClick}>Like</button>
        </div>
        <div>
          Added by {blog.user.name} {addRemoveButton()}
        </div>
        <div>{addCommentSection()}</div>
        <div>
          <button onClick={handleAddCommentClick}>Add comment</button>
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
