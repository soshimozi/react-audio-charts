import React, { Component } from 'react';
import './WebAudioKnob.css';
import ReactTooltip from 'react-tooltip'

export default class WebAudioKnob extends Component {
    constructor(props) {
        super(props);

        this.state = {
            digits : parseInt(props.digits || 0, 10),
            max: parseFloat(props.max || 100),
            min: parseFloat(props.min || 0),
            step: parseFloat(props.step || 0),
            sprites: parseInt(props.sprites || 0),
            width: props.width,
            height: props.height,
            units: props.units,
            knobStyle: this.buildKnobStyle(),
            valuedisp: "0"
        };


        console.log('value => ', props.step);


        //this.setValue(props.value || 0);
    }

    buildKnobStyle() {
        return  {
            backgroundImage: 'url('+this.props.src || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACg0lEQVR42u2bvW7CMBCAwwswMCB14AUQb8BjsHbKUqljngClW16gUxkYeQXmTrRTXqEjTCiiGYJ7iS5SlAZIgu98wbH0CWTxc3ex785n23Ho2wRYAD6wAXbADxABCRJh3w4/4+N3Jk5H2xwIgBBQdxLib82lKz0EPE1KXzOGh/8lSnEfh3FtZcbAMzJubogI/9O4IV6BQ9MnOQW+gWgwyPgCpu1GxAFlYG8zYNt2KL+Bwkd4PSNH7LtjamxRJpbmouduLfAKiAGFxNh3p39IUDbSFuhwZkQGyAmolF/r8uapsr8w5HMDpO9XeqPFWrfyG53h7AMUjgs+IMY+zSFzI+7JV02Bs/4poHUkBARCUfsAbT7BpcroilNA0U2BIm6bOJ9QCVSeAgROsCpENsoTtoTCZE+7HAWIR0CeLNVObxW1ARiiQBU30+Zhm9xecBSoWjtcXUD5DEKod+BUGAEn7HN48K89/YhDiBdgXwiDe+xjMkB0aRR4TAKoJ2AJfCJL7HP48KoMEDIKoEbADBnxKp9Xlv7V8JRlzMlTXuEExoa/EMJi3V5ZSrbvsLDYAAu25EcovvZqT8fIqkY7iw2Q6p5tStpqgFR3nvxfKKnudJWfDpD0BuinQO8E+zBofSJkfSps/WLI+uWw9QWRviTWF0Xtmwah0Y0RAXhGt8YE5P9Do5ujEpIfo9vjBrm5Pc5yQMIgtc8Vbx9Q+dpHZMgPSRmq/DQ+TO0+kAFaH6IOHi3lFXFUlhFth6a7WDXSdli6iyNB+3H5LvkEsgsTxeiQCA115FdminmCpGSJ9dJUOW02uXYwdm2uvIBqfHFSw5JWxMXJsiGsvDpb1ay8PH2pib4+/wcnUdJ/bu6siQAAAABJRU5ErkJggg=='+ ')',
            width: (this.props.width || 64) +'px',
            height: (this.props.height || 64) +'px',
            backgroundSize: '100% ' + ((parseInt(this.props.sprites || 0)+1)*100)+'%',
            backgroundPosition: "0px 0px",
            transform: 'rotate(0deg)'
        };
    }

    componentDidMount() {
        this.updateValue(this.props.value || 0);
    }

    redraw() {
                
        let knobStyle = this.buildKnobStyle();

        console.log('state; ', this.state);

        var range = this.state.max - this.state.min;
        if(this.state.sprites) {
            var offset = ~~(this.state.sprites * (this.state.value - this.state.min) / range) * this.state.height;

            console.log('offset: ', offset);

            knobStyle.backgroundPosition = "0px -" + offset + "px";
            knobStyle.transform = 'rotate(0deg)';
        }
        else {
            var deg = 270*((this.state.value-this.state.min)/range-0.5);
            knobStyle.transform = 'rotate('+deg+'deg)';
        }   
        
        this.setState({knobStyle});
    }    

    updateValue = value => {

        value = parseFloat(value);

        console.log('value: ', value);

        if(!isNaN(value)) {
            value = value < this.state.min ? this.state.min : value > this.state.max ? this.state.max : value;

            let valueNumber = value;

            //this.viewValue = valueNumber;
            let valuedisp = valueNumber.toFixed(this.state.digits);

            if ((this.digits === 0) && (valueNumber>1000)) {
                valueNumber = valueNumber/1000;

                // between 1k and 10k - show two digits, else show one
                valuedisp = valueNumber.toFixed((valueNumber<10)?2:1) + "k";

            }

            this.setState({
                valuedisp,
                value
            }, () => this.redraw());
        }
    }

    getKnobStyle() {
        return this.state.knobStyle;
    }

    render() {
        return (
            <div>
                <div className="webaudio-knob-body" touch-action="none">
                    <div className="webaudio-knob-handle" 
                        touch-action="none" data-tip={this.state.valuedisp + ' ' + this.state.units}
                        style={this.getKnobStyle()}>
                    </div>
                </div>      
                <ReactTooltip place="top" type="info" effect="float" />                  
            </div>
            
        )
    };
}