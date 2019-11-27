import React from 'react';
import { ArrowKeyStepper, AutoSizer, Grid } from 'react-virtualized';

import FocusTrapper from '../components/FocusTrapper';
import CustomArrowKeyStepper from '../components/CustomArrowKeyStepper';
import Cell from '../components/Cell';

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