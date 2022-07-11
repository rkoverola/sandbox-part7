import { useSelector } from "react-redux";
import Blog from "./Blog";

const BlogList = ({ addLike, removeBlog }) => {
  const blogs = useSelector((state) => state.blog);
  const user = useSelector((state) => state.user);

  return (
    <table>
      <tbody>
        {blogs.map((blog) => {
          return (
            <Blog
              key={blog.id}
              blog={blog}
              addLike={addLike}
              removeBlog={removeBlog}
              currentUser={user}
            />
          );
        })}
      </tbody>
    </table>
  );
};

export default BlogList;
