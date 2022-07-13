import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Table, TableBody, TableRow, TableCell } from "@mui/material";

const BlogList = () => {
  const blogs = useSelector((state) => state.blog);

  return (
    <Table>
      <TableBody>
        {blogs.map((blog) => {
          return (
            <TableRow key={blog.id}>
              <TableCell>
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default BlogList;
