import React from 'react';

const FocusTrapper = ({ children }) => {
  const container = React.useRef(null);
  const [focused, setFocused] = React.useState(false);

  React.useEffect(() => {
    const doFocus = (event) => setFocused(true);
    const doBlur = (event) => setFocused(false);
    if (container.current) {
      container.current.addEventListener('focusin', doFocus);
      container.current.addEventListener('focusout', doBlur);
    }
    return () => {
      container.current.removeEventListener('focusin', doFocus);
      container.current.removeEventListener('focusout', doBlur);
    };
  }, []);

  const runChildren = children({ focused });

  return <div ref={container} tabIndex={0}>{runChildren}</div>;
};

export default FocusTrapper;
