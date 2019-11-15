import React from 'react';
import { FilterDisplay } from '../../helpers/ConfigParser/types';
import{ Range, getTrackBackground } from 'react-range'

interface FilterRangeProps {
  filter: FilterDisplay;
  onChange: Function;
}

export const FilterRange: React.FC<FilterRangeProps> = (props) => {
  const filter = props.filter;
  const values = [filter.localMin, filter.localMax]

  return (
    <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}
      >
        <Range
          values={values}
          step={1}
          min={filter.min}
          max={filter.max}
          onChange={values => props.onChange(filter, values)}
          renderTrack={({ props, children }) => (
            <div
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              style={{
                ...props.style,
                height: '36px',
                display: 'flex',
                width: '95%'
              }}
            >
              <div
                ref={props.ref}
                style={{
                  height: '5px',
                  width: '100%',
                  borderRadius: '4px',
                  background: getTrackBackground({
                    values: values,
                    colors: ['#ccc', '#548BF4', '#ccc'],
                    min: filter.min,
                    max: filter.max
                  }),
                  alignSelf: 'center'
                }}
              >
                {children}
              </div>
            </div>
          )}
          renderThumb={({ index, props, isDragged }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '42px',
                width: '42px',
                borderRadius: '4px',
                backgroundColor: '#FFF',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0px 2px 6px #AAA'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-28px',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  fontFamily: 'Arial,Helvetica Neue,Helvetica,sans-serif',
                  padding: '4px',
                  borderRadius: '4px',
                  backgroundColor: '#548BF4'
                }}
              >
                {values[index].toFixed(1)}
              </div>
              <div
                style={{
                  height: '16px',
                  width: '5px',
                  backgroundColor: isDragged ? '#548BF4' : '#CCC'
                }}
              />
            </div>
          )}
        />
      </div>
  )
}
