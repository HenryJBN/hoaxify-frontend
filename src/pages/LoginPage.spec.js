import React from 'react';
import { fireEvent, render, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import {LoginPage} from './LoginPage';

describe('LoginPage', ()=>{

    describe('Layout', ()=>{
        it('has a header of Login', ()=>{

            const {container} = render(<LoginPage/>);
            const header = container.querySelector('h1');
            expect(header).toHaveTextContent('Login');
        });

        it('has input for username', ()=>{
            const {queryByPlaceholderText} = render(<LoginPage/>)
            const usernameInput = queryByPlaceholderText('Your username');
            expect(usernameInput).toBeInTheDocument();
        });


        it('has input for password', ()=>{
            const {queryByPlaceholderText} = render(<LoginPage/>)
            const passwordInput = queryByPlaceholderText('Your password');
            expect(passwordInput).toBeInTheDocument();
        });

        it('has password type for password input', ()=>{

            const {queryByPlaceholderText} = render(<LoginPage/>)
            const passwordInput = queryByPlaceholderText('Your password');
            expect(passwordInput.type).toBe('password');
        });


        it('has a login button', ()=>{

            const {container} = render(<LoginPage/>);
            const button = container.querySelector('button');
            expect(button).toBeInTheDocument();
        });


    });


    describe('interactions', ()=>{


        const changeEvent = (content)=> {
            
            return {
                target: {
                    value: content
                }
            }
        };

        const  mockAsyncDelayed = ()=>{
           
            return jest.fn().mockImplementation(()=>{

                return new Promise((resolve, error)=>{
                    setTimeout(()=> {
                        resolve({});
                    }, 100)
                   
                });
            })
        };

        let usernameInput, passwordInput, button;

        const setupForSubmit = (props)=> {

            const rendered = render(<LoginPage {...props}/>) ;
            const {container, queryByPlaceholderText} = rendered;
            usernameInput = queryByPlaceholderText('Your username');
            fireEvent.change(usernameInput, changeEvent('my-user-name'));
             passwordInput = queryByPlaceholderText('Your password');
            fireEvent.change(passwordInput, changeEvent('P4ssword'));
            button = container.querySelector('button');
            //fireEvent.click(button);

            return rendered;


        }


        it('sets username value into state', ()=>{
            const {queryByPlaceholderText} = render(<LoginPage/>)
            const usernameInput = queryByPlaceholderText('Your username');
            fireEvent.change(usernameInput, changeEvent('my-user-name'));
            expect(usernameInput).toHaveValue('my-user-name');
        });

        it('sets password value into state', ()=>{
            const {queryByPlaceholderText} = render(<LoginPage/>)
            const passwordInput = queryByPlaceholderText('Your password');
            fireEvent.change(passwordInput, changeEvent('P4ssword'));
            expect(passwordInput).toHaveValue('P4ssword');
        });


        it('calls postLogin when actions are provided in props and input fields have values', ()=>{
            const actions = {
                postLogin: jest.fn().mockResolvedValue({})
            }
            setupForSubmit({actions});
            fireEvent.click(button);

            expect(actions.postLogin).toHaveBeenCalledTimes(1);

        });

        it('does not throw exceptions when clicking button  when actions are not provided in props', ()=>{
            
            setupForSubmit();
            expect(()=> fireEvent.click(button)).not.toThrow();

        });

        it('calls postLogin with credentials in body', ()=>{
            const actions = {
                postLogin: jest.fn().mockResolvedValue({})
            }

            const expectedUserObject = {
                username: 'my-user-name',
                password: 'P4ssword'
            }

            setupForSubmit({actions});
            fireEvent.click(button);
            expect(actions.postLogin).toHaveBeenCalledWith(expectedUserObject);

        });

        it('enables login button when username and password are not empty', ()=>{
            setupForSubmit();
            expect(button).not.toBeDisabled();
        });

        it('disables login button when username is  empty', ()=>{
            setupForSubmit();
            fireEvent.change(usernameInput, changeEvent(''));
            expect(button).toBeDisabled();
        });

        it('disables login button when  password is  empty', ()=>{
            setupForSubmit();
            fireEvent.change(passwordInput, changeEvent(''));
            expect(button).toBeDisabled();
        });

        it('displays an alert when login fails', async ()=>{

            const actions = {
                postLogin: jest.fn().mockRejectedValue({
                    response: {
                        data: {
                            message: 'Login failed'
                        }
                    }
                })
            }
           const  {queryByText} = setupForSubmit({actions});
           fireEvent.click(button);
           await  waitFor(()=> { expect(queryByText('Login failed')).toBeInTheDocument() });
          

        });

        it('clears  alert when user changes username', async ()=>{

            const actions = {
                postLogin: jest.fn().mockRejectedValue({
                    response: {
                        data: {
                            message: 'Login failed'
                        }
                    }
                })
            }
           const  {queryByText} = setupForSubmit({actions});
           fireEvent.click(button);
           await  waitFor(()=> { expect(queryByText('Login failed'))});

          fireEvent.change(usernameInput, changeEvent('Updated-username'));
          await  waitFor(()=> { expect(queryByText('Login failed')).not.toBeInTheDocument()});
         
        });

        it('clears  alert when user changes password', async ()=>{

            const actions = {
                postLogin: jest.fn().mockRejectedValue({
                    response: {
                        data: {
                            message: 'Login failed'
                        }
                    }
                })
            }
           const  {queryByText} = setupForSubmit({actions});
           fireEvent.click(button);
           await  waitFor(()=> { expect(queryByText('Login failed'))});

          fireEvent.change(passwordInput, changeEvent('Updated-password'));
          await  waitFor(()=> { expect(queryByText('Login failed')).not.toBeInTheDocument()});
         
        });


        it('does not allow users to click the login button when there is an ongoing api call', ()=> {
            const actions = {
                postLogin: mockAsyncDelayed()
            }

            setupForSubmit({actions});
            fireEvent.click(button);

            fireEvent.click(button);
            expect(actions.postLogin).toHaveBeenCalledTimes(1);

        });

        it('display spinner when there is an ongoing api call', ()=> {
            const actions = {
                postLogin: mockAsyncDelayed()
            }

            const {queryByText} = setupForSubmit({actions});
            fireEvent.click(button);

            const spinner = queryByText('Loading...');
            expect(spinner).toBeInTheDocument();

        });


        it('hides spinner after api call finishes successfully', async () => {
            const actions = {
                postLogin: mockAsyncDelayed()
            };
            const { queryByText } = setupForSubmit({ actions });
            fireEvent.click(button);
            
            // this can be used
            await waitForElementToBeRemoved(() => queryByText('Loading...'))
         
            const spinner = queryByText('Loading...');
            expect(spinner).not.toBeInTheDocument();
        });


        it('hides spinner after api call finishes with an error', async () => {
            const actions = {
                postLogin: jest.fn().mockImplementation(()=>{
                    return new Promise((resolve, reject)=>{
                         setTimeout(()=>{
                            reject({
                                response: {data:{}}
                            })
                         }, 200)
                    })
                })
            };
            const { queryByText } = setupForSubmit({ actions });
            fireEvent.click(button);
            
            // this can be used
            await waitForElementToBeRemoved(() => queryByText('Loading...'))
         
            const spinner = queryByText('Loading...');
            expect(spinner).not.toBeInTheDocument();
        });


    });


});