import React from 'react';
import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Input from './input';

describe('Layout', ()=>{

    it('has input item', ()=>{
        const {container} = render(<Input/>);
        const input = container.querySelector('input');
        expect(input).toBeInTheDocument();

    });


    it('displays the label provided as props', ()=>{
        const {queryByText} = render(<Input label="Text label"/>);
        const label = queryByText('Text label');
        expect(label).toBeInTheDocument();

    });

    it('does not display the label  when no label is provided as props', ()=>{
        const {container} = render(<Input />);
        const label = container.querySelector('label');
        expect(label).not.toBeInTheDocument();

    });


    it('has a text type for input   when no type  is provided as props', ()=>{
        const {container} = render(<Input />);
        const input = container.querySelector('input');
        expect(input.type).toBe('text');

    });


    it('has a password type for input   when password type  is provided as props', ()=>{
        const {container} = render(<Input type="password"/>);
        const input = container.querySelector('input');
        expect(input.type).toBe('password');

    });


    it('displays  placeholder  when  provided as props', ()=>{
        const {container} = render(<Input  placeholder="Test placeholder"/>);
        const input = container.querySelector('input');
        expect(input.placeholder).toBe('Test placeholder');

    });

    it('has value for input when provided as props', ()=>{
        const {container} = render(<Input  value="Test value"/>);
        const input = container.querySelector('input');
        expect(input.value).toBe('Test value');

    });


    it('has a for input when provided as props', ()=>{
        const {container} = render(<Input  value="Test value"/>);
        const input = container.querySelector('input');
        expect(input.value).toBe('Test value');

    });

    it('has onChange callback  when provided as props', ()=>{
        const onChange = jest.fn();
        const {container} = render(<Input onChange={onChange}/>)
        const input = container.querySelector('input');
        fireEvent.change(input, { target: { value: 'new-input' } })
        expect(onChange).toHaveBeenCalledTimes(1);

    });

    it('has default style when no validation  error or success', ()=>{
    
        const {container} = render(<Input/>)
        const input = container.querySelector('input');
        expect(input.className).toBe('form-control');

    });

    it('has success style when   hasError property is false', ()=>{
    
        const {container} = render(<Input hasError={false}/>)
        const input = container.querySelector('input');
        expect(input.className).toBe('form-control is-valid');

    });

    it('has  style for error case when  there is error', ()=>{
    
        const {container} = render(<Input hasError={true}/>)
        const input = container.querySelector('input');
        expect(input.className).toBe('form-control is-invalid');

    });

    it('has displays error text when it is provided', ()=>{
    
        const {queryByText} = render(<Input hasError={true} error="Cannot be null"/>);
        expect(queryByText('Cannot be null')).toBeInTheDocument();

    });

    it('does not display error text when hasError is not provided', ()=>{
    
        const {queryByText} = render(<Input  />);
        expect(queryByText('Cannot be null')).not.toBeInTheDocument();

    });

})

