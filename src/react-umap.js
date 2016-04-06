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

const UMap = React.createClass({
  displayName: 'UMap',

  mixins: [ContainerMixin],

  componentDidMount: function () {
    const domNode = ReactDOM.findDOMNode(this);

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

  componentDidUpdate: function(oldProps) {
    console.log(this.name || this.displayName, 'cdu', arguments);
  },

  componentWillUnmount: function () {
    this.unmountChildren();
  },

  shouldComponentUpdate: function() {
    return false; // !!
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

//------------

const MyMap = React.createClass({
  render: function () {
    return (
      <UMap>
        <p>Some text</p>
      </UMap>
    );
  },
});

const div = document.createElement('div');
document.body.appendChild(div);
ReactDOM.render(<MyMap />, div);
