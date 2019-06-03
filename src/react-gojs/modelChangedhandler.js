"use strict";
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
var gojs_1 = require("gojs");
var modelChangeEvent_1 = require("./modelChangeEvent");
var nodePropertyName = 'nodeDataArray';
var linkPropertyName = 'linkDataArray';
var AddNodeModelChangedHandler = /** @class */ (function () {
    function AddNodeModelChangedHandler() {
    }
    AddNodeModelChangedHandler.prototype.canHandle = function (evt) {
        return evt.change === gojs_1.ChangedEvent.Insert && evt.propertyName === nodePropertyName;
    };
    AddNodeModelChangedHandler.prototype.handle = function (evt, model, onModelChange) {
        if (!model.nodeDataArray.some(function (el) { return el.key === evt.newValue.key; })) {
            onModelChange({
                eventType: modelChangeEvent_1.ModelChangeEventType.Add,
                nodeData: __assign({}, evt.newValue),
                model: getNewModel(evt)
            });
        }
    };
    return AddNodeModelChangedHandler;
}());
exports.AddNodeModelChangedHandler = AddNodeModelChangedHandler;
var AddLinkModelChangedHandler = /** @class */ (function () {
    function AddLinkModelChangedHandler() {
    }
    AddLinkModelChangedHandler.prototype.canHandle = function (evt) {
        if (evt.change === gojs_1.ChangedEvent.Insert && evt.propertyName === linkPropertyName) {
            console.log('add link evt: ', evt);
        }
        return evt.change === gojs_1.ChangedEvent.Insert && evt.propertyName === linkPropertyName;
    };
    AddLinkModelChangedHandler.prototype.handle = function (evt, model, onModelChange) {
        if (!model.linkDataArray.some(function (el) { return el.from === evt.newValue.from && el.to === evt.newValue.to; })) {
            onModelChange({
                eventType: modelChangeEvent_1.ModelChangeEventType.Add,
                linkData: __assign({}, evt.newValue),
                model: getNewModel(evt)
            });
        }
    };
    return AddLinkModelChangedHandler;
}());
exports.AddLinkModelChangedHandler = AddLinkModelChangedHandler;
var RemoveNodeModelChangedHandler = /** @class */ (function () {
    function RemoveNodeModelChangedHandler() {
    }
    RemoveNodeModelChangedHandler.prototype.canHandle = function (evt) {
        return evt.change === gojs_1.ChangedEvent.Remove && evt.propertyName === nodePropertyName;
    };
    RemoveNodeModelChangedHandler.prototype.handle = function (evt, model, onModelChange) {
        if (model.nodeDataArray.some(function (el) { return el.key === evt.oldValue.key; })) {
            onModelChange({
                eventType: modelChangeEvent_1.ModelChangeEventType.Remove,
                nodeData: __assign({}, evt.oldValue),
                model: getNewModel(evt)
            });
        }
    };
    return RemoveNodeModelChangedHandler;
}());
exports.RemoveNodeModelChangedHandler = RemoveNodeModelChangedHandler;
var RemoveLinkModelChangedHandler = /** @class */ (function () {
    function RemoveLinkModelChangedHandler() {
    }
    RemoveLinkModelChangedHandler.prototype.canHandle = function (evt) {
        return evt.change === gojs_1.ChangedEvent.Remove && evt.propertyName === linkPropertyName;
    };
    RemoveLinkModelChangedHandler.prototype.handle = function (evt, model, onModelChange) {
        console.log('remove link handler:', evt);
        console.log('lda: ', model.linkDataArray);
        if (model.linkDataArray.some(function (el) { return el.from === evt.oldValue.from && el.to === evt.oldValue.to; })) {
            onModelChange({
                eventType: modelChangeEvent_1.ModelChangeEventType.Remove,
                linkData: __assign({}, evt.oldValue),
                model: getNewModel(evt)
            });
        }
    };
    return RemoveLinkModelChangedHandler;
}());
exports.RemoveLinkModelChangedHandler = RemoveLinkModelChangedHandler;
var GroupNodeModelChangedHandler = /** @class */ (function () {
    function GroupNodeModelChangedHandler() {
    }
    GroupNodeModelChangedHandler.prototype.canHandle = function (evt) {
        return evt.modelChange === 'nodeGroupKey' || evt.modelChange === 'nodeParentKey';
    };
    GroupNodeModelChangedHandler.prototype.handle = function (evt, model, onModelChange) {
        onModelChange({
            eventType: modelChangeEvent_1.ModelChangeEventType.Group,
            nodeData: __assign({}, evt.object),
            model: getNewModel(evt)
        });
    };
    return GroupNodeModelChangedHandler;
}());
exports.GroupNodeModelChangedHandler = GroupNodeModelChangedHandler;
var getNewModel = function (changedEvent) {
    return {
        nodeDataArray: changedEvent.model.nodeDataArray.slice(),
        linkDataArray: changedEvent.model.linkDataArray.slice()
    };
};
//# sourceMappingURL=modelChangedhandler.js.map