import {app, h} from 'hyperapp';
import './index.css';

const keys = {};
const Button = (props, children) => <button class='button' oncreate={k => keys[children[0]] = k} {...props}>{children}</button>;

const CalcButton = ({char}) => (state, actions) => (
    <Button onclick={() => actions.writeChar(char)}>{char}</Button>
);

const OpButton = ({op}) => (state, actions) => (
    <Button onclick={() => actions.performOp(op)}>{op}</Button>
);

const round = (x, n) => Math.round(x * 10 ** n) / (10 ** n);
const ops = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
    '=': (a, b) => b
};

export const keyDownHandler = (e) => {
    const keyChar = e.key.replace('Enter', '=').replace('Backspace', 'C');
    const key = keys[keyChar];
    if (key) {
        key.click()
    }
};

const formatDisplayString = ({buffer, op, prev}) => {
    if (buffer)
        return buffer;
    if (op !== '=')
        return op;
    if (prev !== undefined)
        return round(prev, 6);
    return '_';
};

const Calculator = (state, actions) => (
    <div id="App" tabIndex="1" oncreate={() => window.location.hash = '#App'} onkeydown={keyDownHandler} className='container calculator'>
        <p class='display'>{formatDisplayString(state)}</p>
        {
            [[7, 8, 9], [4, 5, 6], [1, 2, 3]].map(i => (
                <div>{i.map(j => <CalcButton char={j}/>)}</div>
            ))
        }
        <div><CalcButton char='0'/><CalcButton char='.'/><OpButton op='='/></div>
        <br/>
        <div>{['+', '-', '*', '/'].map(i => <OpButton op={i}/>)}<Button onclick={() => actions.reset()}>C</Button></div>
    </div>
);

const state = {prev: undefined, op: '=', buffer: ''};
const actions = {
    writeChar: value => state => ({buffer: state.buffer + value}),
    performOp: newOp => ({buffer, prev, op}) => (
        {buffer: '', prev: buffer ? ops[op](prev, parseFloat(buffer)) : prev, op: newOp}
    ),
    reset: () => ({prev: undefined, op: '=', buffer: ''}),
};


app(state, actions, Calculator, document.body);
window.location.hash = '';
