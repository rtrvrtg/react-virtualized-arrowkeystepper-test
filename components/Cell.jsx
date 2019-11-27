import React from 'react';

const Cell = ({ selected, style, followFocus, onClick, children }) => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (selected && followFocus) {
      ref.current.focus();
    }
  }, [selected, followFocus]);

  return (
    <div
      style={style}
      tabIndex={-1}
      ref={ref}
      onKeyUp={({ key }) => {
        if (key === 'Enter') {
          alert(children.toString());
        }
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Cell;
