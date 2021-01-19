import React from 'react'

/* Sidebar expando/collapso mimicking bootstrap behavior
 * CSS in components/_folding_sidebar.scss
 * Usage: <FoldingSidebar>
 *          children to be hidden when toggle is clicked
 *         </FoldingSidebar>
 */

class FoldingSidebar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            folding: false,
            folded: false,
            resize: false
        };
        this.contentsContainer = React.createRef();
    }

    componentDidMount() {
        this.contentWidth = this.contentsContainer.current.offsetWidth;
        window.addEventListener("resize", this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions = () => {
        if (!this.state.folded && !this.state.folding) {
            this.setState(() => ({resize: true}),
                          () => {
                            this.contentWidth = this.contentsContainer.current.offsetWidth;
                            this.setState({resize: false});
                          });
        }
    }

    toggleFolded() {
        if (!this.state.folding) {
            this.setState(
                {folding: true,
                 folded: !this.state.folded});
        } else {
            this.foldComplete();
        }
    }

    foldComplete() {
        this.setState(() => ({folding: false}), this.updateDimensions);
    }

    render() {
        const {className, ...props} = this.props
        const icon = this.state.folded
                     ? this.state.folding
                        ? "fa-angle-double-left" : "fa-chevron-right"
                     : this.state.folding
                        ? "fa-angle-double-right" : "fa-chevron-left";
        const width = this.state.folded ? "0px" : this.state.resize ? "auto" : this.contentWidth + "px";
        const overflow = (this.state.folded || this.state.folding) ? "hidden" : "visible";
        return (
        <div className={"folding-sidebar "+(className || '')} {...props}>
            <div className="folding-sidebar__container">
                <div className="folding-sidebar__contents__container">
                    <div className="folding-sidebar__contents"
                        onTransitionEnd={() => this.foldComplete()}
                        ref={this.contentsContainer}
                        style={{width: width, overflow: overflow }}
                        >
                        <React.Fragment>{this.props.children}</React.Fragment>
                    </div>
                </div>
                <div className="folding-sidebar__trigger" onClick={() => this.toggleFolded()}>
                    <i key={icon}><span className={"fa "+icon}></span></i>
                </div>
            </div>
        </div>
        );
    }
}

export default FoldingSidebar
