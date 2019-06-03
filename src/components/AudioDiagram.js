import React, { Component } from 'react';
import * as go from 'gojs';
import { GojsDiagram } from '../react-gojs';
import WebKnobEditor from './WebKnobEditor';
import './AudioDiagram.css';

const colors = {
    "red": "#aa3939",
    "brown": "#aa6c39",
    "blue": "#226666",
    "green": "#2d882d",
    "white": "#fefefe",
    "gray": "#404040",
    "link": "#003333"
};          

export default class AudioDiagram extends Component {

    constructor(props) {
        super(props);

        const $ = go.GraphObject.make;

        this.createDiagram = this.createDiagram.bind(this);
        this.processNodeLink = this.processNodeLink.bind(this);
        this.onModelChange= this.onModelChange.bind(this);

        // TODO: move into reflux store
        this.state = {
            model: props.model
        };
    }

    onModelChange = e => {

        this.setState({model: e.model});
        console.log("onModelChanged =>", e);
    }

    createDiagram = diagramId => {
        const $ = go.GraphObject.make;

        const myDiagram = $(go.Diagram, diagramId, {
            initialContentAlignment: go.Spot.LeftCenter,
            initialAutoScale: go.Diagram.UniformToFill,
            layout: $(go.LayeredDigraphLayout, { direction: 0 }),
            allowDrop: true,  // Nodes from the Palette can be dropped into the Diagram
            "undoManager.isEnabled": true,
            "ModelChanged": (e) => {
            }
        });

        const linkTemplateMap = new go.Map("string", go.Link);
        linkTemplateMap.add("", 
            $(go.Link, {
                    routing: go.Link.Orthogonal, corner: 5,
                    relinkableFrom: true, relinkableTo: true
                },
                $(go.Shape, { stroke: colors.link, strokeWidth: 2 }),
                $(go.Shape, { stroke: colors.link, fill: colors.link, toArrow: "Standard" })
            )
        );

        linkTemplateMap.add("modulate",               
        $(go.Link, {
                routing: go.Link.Orthogonal, corner: 5,
                relinkableFrom: true, relinkableTo: true
                },
                new go.Binding("points").makeTwoWay(),
                $(go.Shape, { stroke: colors.link, strokeWidth: 2, strokeDashArray: [4, 4] }),
                $(go.Shape, { toArrow: "Standard", fill: colors.link, stroke: colors.link })
            )
        );
        
        myDiagram.linkTemplateMap = linkTemplateMap;
        myDiagram.nodeTemplateMap.add("oscillator", this.createOscillatorNode(colors.red, colors.gray));


        function checkResonance(textblock, oldstr, newstr) {
            const reg = new RegExp(/^-?\d+\.?\d*$/);

            if(reg.test(newstr)) {
                let value = parseFloat(newstr);
                return value <= 1;
            }

            return false;

        }

        function checkCutoff(textblock, oldstr, newstr) {
            const reg = new RegExp(/^-?\d+\.?\d*$/);
            return reg.test(newstr);
          };

        const filterTemplate = () => {
            return [
                $(go.TextBlock, 
                    {
                    row: 0,
                    columnSpan: 3,
                    editable: true,
                    stroke: "white",
                    font: "9pt Inconsolata",
                    textAlign: 'center',
                    margin: 3
                    
                    },
                    new go.Binding("text", "name")
                ),
                    $(go.TextBlock, "Q",
                        {
                        row: 1,
                        stroke: "yellow",
                        textAlign: 'center',
                        font: "bold 9pt Inconsolata"
                        }
                    ),                    
                    $(go.TextBlock, 
                        {
                        row: 2,
                        editable: true,
                        stroke: "white",
                        textAlign: "left",
                        font: "9pt Inconsolata",
                        textAlign: 'center',
                        margin: 2,
                        textEditor: WebKnobEditor
                        },
                        new go.Binding("text", "res")
                    ),
                    $(go.TextBlock, "Cutoff",
                    {
                        row: 3,
                        stroke: "yellow",
                        font: "bold 9pt Inconsolata"
                    },
                    ),            
                    $(go.TextBlock, 
                        {
                            row: 4,
                            editable: true,
                            maxSize: new go.Size(80, 40),
                            stroke: "white",
                            font: "9pt Inconsolata",
                            textAlign: 'center',
                            textValidation: checkCutoff
                        },
                        new go.Binding("text", "cutoff")
                    )
            ];
        }

        const outputTemplate = () => {
            return [
                $(go.TextBlock, "OUTPUT",
                    {
                        row: 0,
                        editable: false,
                        margin:5,
                        maxSize: new go.Size(80, 40),
                        stroke: "white",
                        font: "bold 9pt Arial"
                    }
                ),                
                $(go.Picture, require('../images/volume-high.png'), { row: 1, width: 34, height: 32 }),
                // $(go.TextBlock, "OUTPUT",
                //     {
                //     row: 1,
                //     margin: 3,
                //     editable: false,
                //     maxSize: new go.Size(80, 40),
                //     stroke: "white",
                //     font: "bold 9pt Arial"
                //     }
                // )
            ];        
        }

        console.log('url: ', require('../images/volume-high.png'));

        myDiagram.nodeTemplateMap.add("filter", this.createTemplate(go.Spot.Top, colors.green, colors.white, filterTemplate(),  [this.makePort("IN", true), this.makePort("CUTOFF", true)], [this.makePort("OUT", false)]));
        myDiagram.nodeTemplateMap.add("output", this.createTemplate(go.Spot.Center, colors.blue, colors.gray, outputTemplate(), [this.makePort("IN", true)], []));
    

        myDiagram.addDiagramListener("LinkRelinked", this.processNodeLink);
        myDiagram.addDiagramListener("LinkDrawn", this.processNodeLink);   

        myDiagram.addDiagramListener("ChangedSelection", (e) => {
            var selnode = myDiagram.selection.first();
            this.setState({ selectedNodeData:(selnode instanceof go.Node ? selnode.data : null) });
        });


        return myDiagram;        
    }

    processNodeLink = e => {

        e.subject.category = "";

        var modulationMap = {
            "oscillator": ["FM"],
            "filter": ["RES", "CUTOFF"],
            "gain" : ["GAIN"]
        };

        var modulation = false;
        var nodeCategory = e.subject.toNode.category;

        if (modulationMap.hasOwnProperty(nodeCategory)) {
            var i;
            for (i = 0; i < modulationMap[nodeCategory].length; i++) {
                if (modulationMap[nodeCategory][i] === e.subject.toPortId) {
                    modulation = true;
                    break;
                }
            }
        }

        if (modulation) {
            e.subject.category = "modulate";
        }
    }     

    createTemplate(align, fillColor, strokeColor, elements, inports, outports) {
        const $ = go.GraphObject.make;

        var node = 
        $(go.Node, "Spot", { deletable: false },
            $(go.Panel, "Auto", { width: 150, height: 180 },
              $(go.Shape, "RoundedRectangle", {
                    fill: fillColor, stroke: strokeColor, strokeWidth: 2,
                    spot1: go.Spot.TopLeft, spot2: go.Spot.BottomRight
                }),
              $(go.Panel, go.Panel.Table, { alignment: align, padding: 4 },
                elements
              )
            ),
            $(go.Panel, "Vertical", {
                  alignment: go.Spot.Left,
                  alignmentFocus: new go.Spot(0, 0.5, -8, 0)
              }, inports),
            $(go.Panel, "Vertical", {
                  alignment: go.Spot.Right,
                  alignmentFocus: new go.Spot(1, 0.5, 8, 0)
              }, outports)
          );

        node.selectionAdornmentTemplate = $(go.Adornment, "Spot",
            $(go.Panel, "Auto",
                $(go.Shape, { 
                        stroke: "dodgerblue", 
                        strokeWidth: 2, 
                        fill: null}),
                $(go.Placeholder)),
            $(go.Panel, "Horizontal", { alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom },
                $("Button", { click: (e) => { }  },
                    $(go.TextBlock, { text: "Change Props" })
                )
            )
        );

        return node;
    }

    createOscillatorNode(fillcolor, strokecolor, changeHandler) {

        const $ = go.GraphObject.make;

        var node =$(go.Node, "Spot",
           $(go.Panel, "Auto", { width: 150, height: 180 },
             $(go.Shape, "RoundedRectangle", {
                    fill: fillcolor, stroke: strokecolor, strokeWidth: 2,
                    spot1: go.Spot.TopLeft, spot2: go.Spot.BottomRight
                }),
             $(go.Panel, "Table",
               $(go.TextBlock, "Oscillator", {
                      row: 0,
                      margin: 3,
                      maxSize: new go.Size(80, NaN),
                      stroke: "white",
                      font: "bold 11pt Arial"
                  }),
               $(go.TextBlock, {
                      row: 2,
                      margin: 3,
                      editable: false,
                      maxSize: new go.Size(80, 40),
                      stroke: "white",
                      font: "bold 9pt Arial"
                  },
                  new go.Binding("text", "freq").makeTwoWay()),
               $(go.TextBlock, {
                      row: 4,
                      margin: 3,
                      editable: true,
                      maxSize: new go.Size(80, 40),
                      stroke: "white",
                      font: "bold 9pt Arial"
                  },
                  new go.Binding("text", "name").makeTwoWay())
              )
            ),
           $(go.Panel, "Vertical", {
                  alignment: go.Spot.Left,
                  alignmentFocus: new go.Spot(0, 0.5, -8, 0)
              }, [this.makePort("FM", true)]),
           $(go.Panel, "Vertical", {
                  alignment: go.Spot.Right,
                  alignmentFocus: new go.Spot(1, 0.5, 8, 0)
              }, [this.makePort("OUT", false)])
          );

        node.selectionAdornmentTemplate =$(go.Adornment, "Spot",
           $(go.Panel, "Auto",
               $(go.Shape, { 
                        stroke: "dodgerblue", 
                        strokeWidth: 2, 
                        fill: null}),
               $(go.Placeholder)),
           $(go.Panel, "Horizontal", { alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom },
               $("Button", { click: (e) => { console.log('click!', e); }  },
                   $(go.TextBlock, { text: "Change Props" })
                )
            )
        );
        
        return node;    
    }

    makePort = (name, leftside) => {
        const $ = go.GraphObject.make;
        
        const port = go.GraphObject.make(go.Shape, {
            name: "SHAPE",
            fill: "#919191",
            geometryString: "F1 m 0,0 l 5,0 1,4 -1,4 -5,0 1,-4 -1,-4 z",
            desiredSize: new go.Size(10, 10),
            portId: name,  // declare this object to be a "port"
            toMaxLinks: 1,  // don't allow more than one link into a port
            cursor: "pointer" // show a different cursor to indicate potential link point

        });

        const label = $(go.TextBlock, name, 
                            { 
                                font: "bold 6pt sans-serif" 
                            }
                        );
        const panel = $(go.Panel, "Horizontal", 
                            {
                                margin: new go.Margin(2, 0) 
                            }
                        );

        if (leftside) {
            port.toSpot = go.Spot.Left;
            port.toLinkable = true;
            label.margin = new go.Margin(1, 0, 0, 1);
            panel.alignment = go.Spot.TopLeft;
            panel.add(port);
            panel.add(label);
        } else {
            port.fromSpot = go.Spot.Right;
            port.fromLinkable = true;
            label.margin = new go.Margin(1, 1, 0, 0);
            panel.alignment = go.Spot.TopRight;
            panel.add(label);
            panel.add(port);
        }
            
        return panel;
    }

    render() {
        return (
            <GojsDiagram
                diagramId="myDiagramDiv"
                model={this.state.model}
                createDiagram={this.createDiagram}
                nodeCategoryProperty="type"
                linkFromPortIdProperty="frompid"
                linkToPortIdProperty="topid"
                className="myDiagram"
                onModelChange={this.onModelChange}
            />            
        );
    }
}