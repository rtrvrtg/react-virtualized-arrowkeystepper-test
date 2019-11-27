import React from 'react';
import { ArrowKeyStepper, AutoSizer, Grid } from 'react-virtualized';
import { debounce } from 'debounce';

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

const CustomArrowKeyStepper = ({
  children,
  scrollToRow,
  scrollToColumn,
  disabled,
  mode,
  columnCount,
  rowCount,
  followFocus,
  followFocusTimeout
}) => {
  const actuallyDisabled = disabled || false;
  const actualMode = mode || 'cells';

  const [currentRow, setCurrentRow] = React.useState(scrollToRow || 0);
  const [currentColumn, setCurrentColumn] = React.useState(scrollToColumn || 0);
  const [visibleArea, setVisibleArea] = React.useState({
    column: { start: 0, end: 0, },
    row: { start: 0, end: 0, },
  });

  const onKeyDown = (e) => {
    if (actuallyDisabled) {
      return;
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      e.stopPropagation();

      let newRow;
      let newCol;

      switch (e.key) {
        case 'ArrowDown':
          const endRow = rowCount - 1;
          newRow = actualMode === 'edges'
            ? Math.min(visibleArea.column.end + 1, endRow)
            : Math.min(currentRow + 1, endRow);
          break;

        case 'ArrowUp':
          newRow = actualMode === 'edges'
            ? Math.max(visibleArea.row.start - 1, 0)
            : Math.max(currentRow - 1, 0);
          break;

        case 'ArrowLeft':
          newCol = actualMode === 'edges'
            ? Math.max(visibleArea.column.start - 1, 0)
            : Math.max(currentColumn - 1, 0);
          break;

        case 'ArrowRight':
          const endCol = columnCount - 1;
          newCol = actualMode === 'edges'
            ? Math.min(visibleArea.column.end + 1, endCol)
            : Math.min(currentColumn + 1, endCol);
          break;
      }

      if (typeof newRow !== 'undefined' && newRow !== currentRow) {
        setCurrentRow(newRow);
      }
      if (typeof newCol !== 'undefined' && newCol !== currentColumn) {
        setCurrentColumn(newCol);
      }
    }
  };

  const doFollowFocus = (columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex) => {
    const newCol = Math.max(columnStartIndex, Math.min(columnStopIndex, currentColumn));
    const newRow = Math.max(rowStartIndex, Math.min(rowStopIndex, currentRow));
    if (newRow !== currentRow) {
      setCurrentRow(newRow);
    }
    if (newCol !== currentColumn) {
      setCurrentColumn(newCol);
    }
  };

  const debouncedDoFollowFocus = debounce(
    doFollowFocus,
    !isNaN(followFocusTimeout) && followFocusTimeout >= 0
      ? followFocusTimeout
      : 250
  );

  const onSectionRendered = ({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex }) => {
    setVisibleArea({
      column: {
        start: columnStartIndex,
        end: columnStopIndex,
      },
      row: {
        start: rowStartIndex,
        end: rowStopIndex,
      },
    });

    if (followFocus) {
      debouncedDoFollowFocus(columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex);
    }
  };

  const onUpdateFocus = ({ rowIndex, columnIndex }) => {
    setCurrentRow(rowIndex);
    setCurrentColumn(columnIndex);
  };

  const runChildren = children({
    onSectionRendered,
    onUpdateFocus,
    scrollToColumn: currentColumn,
    scrollToRow: currentRow,
  });

  return <div style={{ position: 'relative' }} onKeyDown={onKeyDown}>
    {runChildren}
  </div>
}

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

const rows = [];
for (let i = 0; i < 900; i++) {
  rows.push(i);
}

function Home() {
  const cellRenderer = ({
    key,
    columnIndex,
    rowIndex,
    isScrolling,
    isVisible,
    parent,
    style,
    focused,
    scrollToColumn,
    scrollToRow,
    onUpdateFocus
  }) => {
    const cellContent = rows[ rowIndex * 6 + columnIndex ];
    const cellStyle = {
      width: '100px',
      height: '100px',
      border: '1px solid blue',
      boxSizing: 'border-box',
      ...style
    };

    const selected = scrollToColumn === columnIndex && scrollToRow === rowIndex;

    return (
      <Cell
        key={key}
        style={cellStyle}
        selected={selected}
        followFocus={focused}
        onClick={() => {
          if (typeof onUpdateFocus === 'function') {
            onUpdateFocus({ columnIndex, rowIndex })
          };
        }}
      >
        hoi {cellContent}
      </Cell>
    );
  };

  const COLS = 6;

  return <div>
    <FocusTrapper>
      {({ focused }) => (
        <CustomArrowKeyStepper
          columnCount={COLS}
          rowCount={Math.ceil(rows.length / COLS)}
          followFocus={true}
        >
          {({ onSectionRendered, scrollToColumn, scrollToRow, onUpdateFocus }) => (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '90vh',
              border: '1px solid red',
            }}>
              <h1 style={{
                flex: '0 0 auto',
              }}>Hello</h1>
              <div style={{
                flex: '1 1 auto',
                border: '1px solid blue',
                position: 'relative',
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  border: '1px solid green',
                  position: 'relative',
                }}>
                  <AutoSizer>
                    {({ width, height }) => (
                      <Grid
                        key="grid"
                        style={{
                          border: '1px solid red',
                          boxSizing: 'border-box',
                        }}
                        cellRenderer={(params) => cellRenderer({
                          scrollToColumn,
                          scrollToRow,
                          focused,
                          onUpdateFocus,
                          ...params
                        })}
                        columnCount={COLS}
                        columnWidth={width / COLS}
                        height={height}
                        rowCount={Math.ceil(rows.length / COLS)}
                        rowHeight={width / COLS}
                        width={width}
                        onSectionRendered={onSectionRendered}
                        scrollToColumn={scrollToColumn}
                        scrollToRow={scrollToRow}
                      />
                    )}
                  </AutoSizer>
                </div>
              </div>
            </div>
          )}
        </CustomArrowKeyStepper>
      )}
    </FocusTrapper>
  </div>
}

export default Home