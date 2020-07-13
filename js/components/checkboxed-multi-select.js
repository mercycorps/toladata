import React from 'react'
import Select, {components} from 'react-select'
import {VirtualizedMenuList as MenuList} from './virtualized-react-select'
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import {observer} from 'mobx-react'


const CountLabel = props => {
    return (
        <div className="count__label">
            {props.children}
            {(props.clearable &&
                <div onClick={ props.clearSelect }>
                    <i className="fa fa-times" aria-hidden="true" />
                </div>
              )}
        </div>
    );
        
}

const boldStyles = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            fontWeight: data.bold ? "bold" : "normal"
        }
    }
}

@observer
class CheckboxedMultiSelect extends React.Component {
    constructor(props) {
        super(props);
    }
    clearSelect = (e) => {
        e.stopPropagation();
        this.props.onChange([]);;
    }
    makeLabel = (_ref3) => {
        var placeholderButtonLabel = _ref3.placeholderButtonLabel,
            thisValue = _ref3.value;
    
        if (!thisValue) {
          return <CountLabel clearable={false}>
                    {placeholderButtonLabel}
                </CountLabel>;
        }
    
        if (Array.isArray(thisValue)) {
          if (thisValue.length === 0) {
            return <CountLabel clearable={false}>
                        {placeholderButtonLabel}
                    </CountLabel>
          }
    
          if (thisValue.length === 1) {
            return <CountLabel clearable={true} clearSelect={this.clearSelect}>
                        {thisValue[0].label}
                    </CountLabel>;
          }
          return (
           <CountLabel clearable={true} clearSelect={this.clearSelect}>
                {"".concat(thisValue.length," ", gettext("selected"))}
            </CountLabel>
            );
        }
    
        return <CountLabel clearable={false}>
                    {thisValue.label}
               </CountLabel>;
      };
      render() {
        return <ReactMultiSelectCheckboxes
                { ...this.props}
                styles={boldStyles}
                placeholder={ gettext("Search")}
                placeholderButtonLabel={ this.props.placeholder }
                getDropdownButtonLabel={ this.makeLabel }
                components={{MenuList}}
                />;
      }
}

export default CheckboxedMultiSelect
