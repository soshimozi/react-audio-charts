import React, { Component } from 'react';
import AudioDiagram from '../components/AudioDiagram';
import './Home.css';



export default class Home extends Component {
    constructor(props) {
        super(props);

        const model = {
            nodeDataArray : [
                { 
                    key: 'OSC1', 
                    type: "oscillator",
                    name: 'OSC1', 
                    freq: 200 
                }, 
                {
                    key: 'FILTER1', 
                    type: "filter", 
                    name: 'FILTER1', 
                    cutoff: 220,
                    res: 0.2 
                },
                {
                    key: 'OUTPUT', 
                    type: "output"
                }                
            ],
            linkDataArray: []
        };

        this.state = {
            model
        };      
        
    }

    modelChangeHandler = e => {
        console.log('model changed:', e);
    }

    render() {
        return (
            <div>
                <AudioDiagram model={this.state.model} onModelChange={this.modelChangeHandler} />
            </div>
        );
    }
}
