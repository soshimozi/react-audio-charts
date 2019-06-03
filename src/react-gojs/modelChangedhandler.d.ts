import { ChangedEvent } from 'gojs';
import { BaseNodeModel, LinkModel, DiagramModel } from '.';
import { ModelChangeEvent } from './modelChangeEvent';
export interface ModelChangedHandler<N extends BaseNodeModel, L extends LinkModel> {
    canHandle: (evt: ChangedEvent) => boolean;
    handle: (evt: ChangedEvent, model: DiagramModel<N, L>, onModelChange: (event: ModelChangeEvent<N, L>) => void) => void;
}
export declare class AddNodeModelChangedHandler<N extends BaseNodeModel, L extends LinkModel> implements ModelChangedHandler<N, L> {
    canHandle(evt: ChangedEvent): boolean;
    handle(evt: ChangedEvent, model: DiagramModel<N, L>, onModelChange: (event: ModelChangeEvent<N, L>) => void): void;
}
export declare class AddLinkModelChangedHandler<N extends BaseNodeModel, L extends LinkModel> implements ModelChangedHandler<N, L> {
    canHandle(evt: ChangedEvent): boolean;
    handle(evt: ChangedEvent, model: DiagramModel<N, L>, onModelChange: (event: ModelChangeEvent<N, L>) => void): void;
}
export declare class RemoveNodeModelChangedHandler<N extends BaseNodeModel, L extends LinkModel> implements ModelChangedHandler<N, L> {
    canHandle(evt: ChangedEvent): boolean;
    handle(evt: ChangedEvent, model: DiagramModel<N, L>, onModelChange: (event: ModelChangeEvent<N, L>) => void): void;
}
export declare class RemoveLinkModelChangedHandler<N extends BaseNodeModel, L extends LinkModel> implements ModelChangedHandler<N, L> {
    canHandle(evt: ChangedEvent): boolean;
    handle(evt: ChangedEvent, model: DiagramModel<N, L>, onModelChange: (event: ModelChangeEvent<N, L>) => void): void;
}
export declare class GroupNodeModelChangedHandler<N extends BaseNodeModel, L extends LinkModel> implements ModelChangedHandler<N, L> {
    canHandle(evt: ChangedEvent): boolean;
    handle(evt: ChangedEvent, model: DiagramModel<N, L>, onModelChange: (event: ModelChangeEvent<N, L>) => void): void;
}
