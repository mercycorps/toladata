import React from 'react'
import Select, {components} from 'react-select'
import {VirtualizedMenuList as MenuList} from './virtualized-react-select'
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import CheckboxGroup from 'react-multiselect-checkboxes/lib/CheckboxGroup';
import { css } from 'emotion';
import {observer} from 'mobx-react'


/* JSX Element to display, e.g. "4 selected" in a multiselect dropdown */
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

/*
 * CheckboxGroup drop in replacement that delivers a heading without a checkbox if the optgroup has
 * the attribute "selectable: false"
 * Also adds a vertical divider above any optgroup with the attribute divider: true
 */
function Group(props) {
    if (props.data.selectable === false) {
        const {
            children,
            className,
            cx,
            getStyles,
            Heading,
            setValue,
            data,
            label,
            getValue,
            theme,
            selectProps: { getOptionValue },
          } = props;
          let headingProps = {getStyles: getStyles, cx: cx, theme: theme, indeterminate: false, checked: false};
          return (
            <div className={cx(css(getStyles('group', props)), { group: true }, className)}>
                <div className={cx(css(getStyles('groupHeading', {...headingProps})),
                    {'group-heading': true}, className)}>{props.data.label}</div>
                <div>{props.children}</div>
            </div>);
    }
    if (props.data.divider === true) {
        return (<React.Fragment>
                <hr style={{ margin: '3px 0px 0px 0px' }} />
                <CheckboxGroup {... props} />
                </React.Fragment>);
    }
    return <CheckboxGroup {... props} />;
}


/*
 *  A wrapper for react-multiselect-checkboxes which implements:
 *      - translated "n selected" if multiple options are selected (including a "noList" attribute for uncounted selections
 *      - optgroups without checkboxes if {selectable: false} applied to optgroup object
 *      - virtualization (??) - this functionality from external vendor needs verification
 */
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
            // don't count options with the option attribute noList: true
            let filteredValues = thisValue.filter(option => !option.noList);
          if (filteredValues.length === 0) {
            return <CountLabel clearable={false}>
                        {placeholderButtonLabel}
                    </CountLabel>
          }
    
          if (filteredValues.length === 1) {
            return <CountLabel clearable={true} clearSelect={this.clearSelect}>
                        {filteredValues[0].label}
                    </CountLabel>;
          }
          return (
           <CountLabel clearable={true} clearSelect={this.clearSelect}>
                {
                    // # Translators: prefixed with a number, as in "4 selected" displayed on a multi-select
                    "".concat(filteredValues.length," ", gettext("selected"))}
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
                placeholder={
                    // # Translators: placeholder text in a search box
                    gettext("Search")}
                placeholderButtonLabel={ this.props.placeholder }
                getDropdownButtonLabel={ this.makeLabel }
                components={{MenuList, Group }}
                />;
      }
}

export default CheckboxedMultiSelect
