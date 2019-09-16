/* React wrappers to bootstrap-multiselect widgets */
/* Note: bootstrap-multiselect exists in the global JS context (imported in base.html) */

import React from 'react';
import $ from 'jquery';
import isEqual from 'react-fast-compare';

/*
  Props:

    - options: list of objects with 'value' and 'label' (assumes values are ints!)
    - selected: single value, or array of values of selected options
    - onSelectCb: a callback function that takes a list of selected values
    - isMultiSelect: boolean - is a multi-select?
    - forceEmptySelect: boolean - in single select, force "None selected" even if empty option is not provided
    - nonSelectText: string - the text to display on an empty selection
 */
export class Select extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.clearInternalSelection = this.clearInternalSelection.bind(this);
    }

    onChange() {
        let selectedValues = this.$el.find('option:selected').map(function() { return parseInt($(this).val()) }).get();

        if (this.props.onSelectCb) {
            this.props.onSelectCb(selectedValues);
        }
    }

    clearInternalSelection() {
        // Set "none" selected in single select mode, with no empty option
        // these do not trigger any bs-multiselect callbacks
        if (this.props.forceEmptySelect) {
            this.$el.val('');
        }
    }

    componentDidMount() {
        const {nonSelectText} = this.props;

        const multiSelectOptions = {
            nonSelectedText: nonSelectText,
            includeSelectAllOption: true,
            enableFiltering: true,
            enableCaseInsensitiveFiltering: true,
            numberDisplayed: 1,
            maxHeight: 320,
            buttonClass: 'btn btn-light form-control',
            templates: {
                filter: '<li class="multiselect-item filter"><div class="input-group"><input class="form-control multiselect-search" type="text"></div></li>',
                filterClearBtn: '<span class="input-group-btn"><button class="btn btn-default multiselect-clear-filter" type="button"><i class="fas fa-times-circle"></i></button></span>',
            },

            onChange: this.onChange,
            onSelectAll: this.onChange,
            onDeselectAll: this.onChange,
        };

        // jquery ref to select element
        this.$el = $(this.el);

        // initial setup of BS multiselect
        this.$el.multiselect(multiSelectOptions);

        // set the selection and options
        this.componentDidUpdate();
    }

    componentDidUpdate(prevProps) {
        const {options, selected} = this.props;

        // Setting the options clears the filter search field which is not desired behavior
        // As such, limit setting the options unless they really have changed
        // Hopefully this deep check isn't too slow for a large number of options
        if (!prevProps || !isEqual(prevProps.options, options)) {
            this.$el.multiselect('dataprovider', options);
        }

        this.$el.multiselect('select', selected);

        if (selected.length === 0) {
            this.clearInternalSelection();
        }

        this.$el.multiselect('refresh');
    }

    componentWillUnmount() {
        this.$el.multiselect('destroy');
      }

    render() {
        const isMultiSelect = this.props.isMultiSelect ? "multiple" : null;

        return <select className="form-control" ref={el => this.el = el} multiple={isMultiSelect} />
    }
}
