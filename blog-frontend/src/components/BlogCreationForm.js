import { TextField, Button } from "@mui/material";

import { useState } from "react";

const BlogCreationForm = ({ addBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleTitleChange = ({ target }) => {
    setTitle(target.value);
  };
  const handleAuthorChange = ({ target }) => {
    setAuthor(target.value);
  };
  const handleUrlChange = ({ target }) => {
    setUrl(target.value);
  };

  const handleBlogSubmit = (event) => {
    event.preventDefault();
    console.log("Submitting", title, author, url);
    const blogObject = {
      title: title,
      author: author,
      url: url,
    };
    setTitle("");
    setAuthor("");
    setUrl("");
    addBlog(blogObject);
  };

  return (
    <form onSubmit={handleBlogSubmit}>
      <div>
        <TextField
          type={"text"}
          value={title}
          onChange={handleTitleChange}
          className={"titleInput"}
          label="Title"
        />
      </div>
      <div>
        <TextField
          type={"text"}
          value={author}
          onChange={handleAuthorChange}
          className={"authorInput"}
          label="Author"
        />
      </div>
      <div>
        <TextField
          type={"text"}
          value={url}
          onChange={handleUrlChange}
          className={"urlInput"}
          label="URL"
        />
      </div>
      <div>
        <Button
          type="submit"
          className="submitButton"
          variant="contained"
          color="primary"
        >
          Create
        </Button>
      </div>
    </form>
  );
};

export default BlogCreationForm;
