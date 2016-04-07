const L = require('leaflet');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactInstanceMap = require('react/lib/ReactInstanceMap');
const ReactMultiChild = require('react/lib/ReactMultiChild');
const ReactUpdates = require('react/lib/ReactUpdates');

function createComponent(name) {
  const ReactUmapComponent = function(element) {
    this.node = null;
    this.subscriptions = null;
    this.listeners = null;
    this._mountImage = null; // ?
    this._renderedChildren = null; // ?
    this.construct(element); // ???
  };
  ReactUmapComponent.displayName = name;
  for (var i = 1, l = arguments.length; i < l; i++) {
    Object.assign(ReactUmapComponent.prototype, arguments[i]);
  }

  return ReactUmapComponent;
}

const ContainerMixin = Object.assign({}, ReactMultiChild.Mixin, {
  moveChild: function() {
    console.log(this.name || this.displayName, 'moveChild', arguments);
  },

  createChild: function() {
    console.log(this.name || this.displayName, 'createChild', arguments);
  },

  removeChild: function() {
    console.log(this.name || this.displayName, 'removeChild', arguments);
  },

  updateChildrenAtRoot: function() {
    console.log(this.name || this.displayName, 'updateChildrenAtRoot', arguments);
  },

  mountAndInjectChildrenAtRoot: function() {
    console.log(this.name || this.displayName, 'mountAndInjectChildrenAtRoot', arguments);
  },

  updateChildren: function() {
    console.log(this.name || this.displayName, 'updateChildren', arguments);
  },

  mountAndInjectChildren: function() {
    console.log(this.name || this.displayName, 'mountAndInjectChildren', arguments);
  },
});

const MapContainer = React.createClass({
  displayName: 'MapContainer',

  propTypes: {
    className: React.PropTypes.string,
    style: React.PropTypes.object,
    onMount: React.PropTypes.func.isRequired,
  },

  componentDidMount: function () {
    this.props.onMount(ReactDOM.findDOMNode(this));
  },

  shouldComponentUpdate: function () {
    return false;
  },

  render: function () {
    return (
      <div
        className={ this.props.className }
        style={ this.props.style }
      />
    );
  },
});

const UMap = React.createClass({
  displayName: 'UMap',

  mixins: [ContainerMixin],

  componentDidUpdate: function(oldProps) {
    const transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
    transaction.perform(
      this.updateChildren,
      this,
      this.props.children,
      transaction,
      ReactInstanceMap.get(this)._context
    );
    ReactUpdates.ReactReconcileTransaction.release(transaction);
    // console.log(this.name || this.displayName, 'cdu', arguments);
  },

  componentWillUnmount: function () {
    this.unmountChildren();
  },

  handleContainerMount: function (domNode) {
    const leafletMap = L.map(domNode, { /* options */ });

    this.node = {
      leafletMap
    };
    const transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
    console.log('cdm>>', { this });
    transaction.perform(
      this.mountAndInjectChildren,
      this,
      this.props.children,
      transaction,
      ReactInstanceMap.get(this)._context
    );
    ReactUpdates.ReactReconcileTransaction.release(transaction);
  },

  render: function () {
    return (
      <MapContainer
        onMount={ this.handleContainerMount }
        className={ this.props.className }
        style={ this.props.style }
      >
        { this.props.children }
      </MapContainer>
    );
  },
});

//------------

const MyMap = React.createClass({
  getInitialState: function () {
    return { other: false };
  },

  componentDidMount: function () {
    setTimeout(() => {
      this.setState({ other: true });
    }, 3000);
  },

  render: function () {
    return (
      <UMap>
        <p>Some text</p>
        { this.state.other ? <span>hello</span> : null }
      </UMap>
    );
  },
});

const div = document.createElement('div');
document.body.appendChild(div);
ReactDOM.render(<MyMap />, div);
