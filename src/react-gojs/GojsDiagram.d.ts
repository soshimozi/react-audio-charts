import * as React from 'react';
import * as go from 'gojs';
import { Diagram } from 'gojs';
import { DiagramModel, BaseNodeModel, LinkModel } from './model';
import { ModelChangeEvent } from './modelChangeEvent';
export interface GojsDiagramProps<N extends BaseNodeModel, L extends LinkModel> {
    model: DiagramModel<N, L>;
    createDiagram: (id: string) => Diagram;
    diagramId: string;
    className: string;
    onModelChange?: (event: ModelChangeEvent<N, L>) => void;
    linkFromPortIdProperty?: string;
    linkToPortIdProperty?: string;
    nodeCategoryProperty?: string;
    makeUniqueKeyFunction?: () => void;
}
export interface GojsModel extends go.Model {
    linkDataArray: Object[];
    addLinkDataCollection: (links: Object[]) => void;
    removeLinkDataCollection: (links: Object[]) => void;
    addLinkData: (link: Object) => void;
    removeLinkData: (link: Object) => void;
}
declare class GojsDiagram<N extends BaseNodeModel, L extends LinkModel> extends React.PureComponent<GojsDiagramProps<N, L>> {
    private myDiagram;
    private modelChangedHandlers;
    constructor(props: GojsDiagramProps<N, L>);
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(): void;
    init(): void;
    render(): JSX.Element;
    private modelChangedHandler;
    private applyAddRemoveNodesFromModel;
    private applyAddRemoveLinksFromModel;
    private applyUpdatesFromModel;
}
export default GojsDiagram;
