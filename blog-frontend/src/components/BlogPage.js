import BlogCreationForm from "./BlogCreationForm";
import BlogList from "./BlogList";
import Togglable from "./Togglable";

const BlogPage = ({ blogCreationFormRef, addBlog, addLike, removeBlog }) => {
  return (
    <div>
      <h2>Create new</h2>
      <div>
        <Togglable buttonText={"Create new"} ref={blogCreationFormRef}>
          <BlogCreationForm addBlog={addBlog} />
        </Togglable>
      </div>
      <div>
        <BlogList addLike={addLike} removeBlog={removeBlog} />
      </div>
    </div>
  );
};

export default BlogPage;