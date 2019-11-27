import React from 'react';
import { debounce } from 'debounce';

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

export default CustomArrowKeyStepper;
