import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const BlogList = () => {
  const blogs = useSelector((state) => state.blog);

  return (
    <table>
      <tbody>
        {blogs.map((blog) => {
          return (
            <tr key={blog.id}>
              <td>
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default BlogList;
