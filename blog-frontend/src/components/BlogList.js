import Blog from "./Blog";

const BlogList = ({ blogs, addLike, removeBlog, user }) => {
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
