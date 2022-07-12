import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemButton } from "@mui/material";

const BlogList = () => {
  const blogs = useSelector((state) => state.blog);

  return (
    <div>
      <List>
        {blogs.map((blog) => {
          return (
            <ListItem key={blog.id}>
              <ListItemButton>
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default BlogList;
