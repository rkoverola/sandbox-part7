import { Button } from "@mui/material";
import { useState, forwardRef, useImperativeHandle } from "react";

const Togglable = forwardRef((props, ref) => {
  const [isHidden, setHidden] = useState(true);

  const buttonText = isHidden ? props.buttonText : "Cancel";

  const contentStyle = isHidden ? { display: "none" } : { display: "" };

  const toggleVisibility = () => {
    setHidden(!isHidden);
  };

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div>
      <div style={contentStyle}>{props.children}</div>
      <Button onClick={toggleVisibility} variant="outlined" color="primary">
        {buttonText}
      </Button>
    </div>
  );
});

Togglable.displayName = "Togglable";

export default Togglable;
