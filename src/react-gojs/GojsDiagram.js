"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var go = require("gojs");
var modelChangedhandler_1 = require("./modelChangedhandler");
var GojsDiagram = /** @class */ (function (_super) {
    __extends(GojsDiagram, _super);
    function GojsDiagram(props) {
        var _this = _super.call(this, props) || this;
        _this.modelChangedHandlers = [
            new modelChangedhandler_1.AddNodeModelChangedHandler(),
            new modelChangedhandler_1.AddLinkModelChangedHandler(),
            new modelChangedhandler_1.RemoveNodeModelChangedHandler(),
            new modelChangedhandler_1.RemoveLinkModelChangedHandler(),
            new modelChangedhandler_1.GroupNodeModelChangedHandler()
        ];
        _this.modelChangedHandler = _this.modelChangedHandler.bind(_this);
        return _this;
    }
    GojsDiagram.prototype.componentDidMount = function () {
        this.init();
    };
    GojsDiagram.prototype.componentWillUnmount = function () {
        if (this.props.onModelChange) {
            this.myDiagram.removeModelChangedListener(this.modelChangedHandler);
        }
        this.myDiagram.clear();
    };
    GojsDiagram.prototype.componentDidUpdate = function () {
        this.myDiagram.startTransaction();
        this.applyAddRemoveLinksFromModel();
        this.applyAddRemoveNodesFromModel();
        this.applyUpdatesFromModel();
        this.myDiagram.updateAllRelationshipsFromData();
        this.myDiagram.updateAllTargetBindings();
        this.myDiagram.commitTransaction('updated');
    };
    GojsDiagram.prototype.init = function () {
        var _a = this.props, createDiagram = _a.createDiagram, diagramId = _a.diagramId, onModelChange = _a.onModelChange;
        this.myDiagram = createDiagram(diagramId);
        if (onModelChange) {
            this.myDiagram.addModelChangedListener(this.modelChangedHandler);
        }
        this.myDiagram.model = go.GraphObject.make(go.GraphLinksModel, __assign({}, (this.props.makeUniqueKeyFunction && {
            makeUniqueKeyFunction: this.props.makeUniqueKeyFunction
        }), { linkFromPortIdProperty: this.props.linkFromPortIdProperty || '', linkToPortIdProperty: this.props.linkToPortIdProperty || '', nodeDataArray: this.props.model.nodeDataArray.slice(), linkDataArray: this.props.model.linkDataArray.slice(), nodeCategoryProperty: this.props.nodeCategoryProperty || 'category' }));
    };
    GojsDiagram.prototype.render = function () {
        return React.createElement("div", { id: this.props.diagramId, className: this.props.className });
    };
    GojsDiagram.prototype.modelChangedHandler = function (evt) {
        var _this = this;
        this.modelChangedHandlers.forEach(function (handler) {
            if (handler.canHandle(evt)) {
                console.log('handler: ', handler);
                handler.handle(evt, _this.props.model, _this.props.onModelChange);
            }
        });
    };
    GojsDiagram.prototype.applyAddRemoveNodesFromModel = function () {
        var _this = this;
        var nodesToAdd = this.props.model.nodeDataArray
            .filter(function (e) { return _this.myDiagram.model.nodeDataArray.findIndex(function (el) { return el.key === e.key; }) === -1; })
            .map(function (node) { return Object.assign({}, node); });
        this.myDiagram.model.addNodeDataCollection(nodesToAdd);
        var nodesToRemove = this.myDiagram.model.nodeDataArray.filter(function (e) { return _this.props.model.nodeDataArray.findIndex(function (el) { return el.key === e.key; }) === -1; });
        this.myDiagram.model.removeNodeDataCollection(nodesToRemove);
    };
    GojsDiagram.prototype.applyAddRemoveLinksFromModel = function () {
        var _this = this;
        var linksToAdd = this.props.model.linkDataArray
            .filter(function (e) {
            return _this.myDiagram.model.linkDataArray.findIndex(function (el) { return el.from === e.from && el.to === e.to; }) === -1;
        })
            .map(function (link) { return Object.assign({}, link); });
        this.myDiagram.model.addLinkDataCollection(linksToAdd);
        var linksToRemove = this.myDiagram.model.linkDataArray.filter(function (e) {
            return _this.props.model.linkDataArray.findIndex(function (el) { return el.from === e.from && el.to === e.to; }) === -1;
        });
        this.myDiagram.model.removeLinkDataCollection(linksToRemove);
    };
    GojsDiagram.prototype.applyUpdatesFromModel = function () {
        this.myDiagram.model.applyIncrementalJson({
            class: 'go.GraphLinksModel',
            incremental: 1,
            nodeKeyProperty: 'key',
            linkKeyProperty: 'key',
            linkFromPortIdProperty: this.props.linkFromPortIdProperty || '',
            linkToPortIdProperty: this.props.linkToPortIdProperty || '',
            modifiedNodeData: this.props.model.nodeDataArray,
            modifiedLinkData: this.props.model.linkDataArray
        });
    };
    return GojsDiagram;
}(React.PureComponent));
exports.default = GojsDiagram;
//# sourceMappingURL=GojsDiagram.js.map