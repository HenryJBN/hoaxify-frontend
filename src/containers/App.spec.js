import React from  'react';
import { fireEvent, queryAllByTestId, waitFor, render } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import authReducer from '../redux/authReducer';
import axios from 'axios';





describe('App', ()=>{

    const setup =(path)=>{
        
        const store = createStore(authReducer);
        return render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[path]}>
                    <App/>
                </MemoryRouter>
            </Provider>
        )
       
    }

    const changeEvent=(content)=>{
        return {
            target: {
                value: content
            }
        }
    }

    it('displays HomePage when url is /', ()=>{
        const {queryByTestId}= setup('/');
        expect(queryByTestId('homepage')).toBeInTheDocument();
    });

    it('displays LoginPage when url is /login', ()=>{
        const {container} = setup('/login');
        const header = container.querySelector('h1');
        expect(header).toHaveTextContent('Login');

    });

    it('displays only LoginPage when url is /login', ()=>{
        const {queryByTestId} = setup('/login');
        const homepage = queryByTestId('homepage');
        expect(homepage).not.toBeInTheDocument();

    });

    it('displays  UserSignupPage when url is /signup', ()=>{
        const {container} = setup('/signup');
        const header = container.querySelector('h1');
        expect(header).toHaveTextContent('Sign Up');

    });

    it('displays UserPage when url is not /, /login or /signup', ()=>{
        const {queryByTestId} = setup('/userpage');
        const userpage = queryByTestId('userpage');
        expect(userpage).toBeInTheDocument();

    });

    it('displays  top bar  when url is /', () => {
        const {container} = setup('/');
        const navigation = container.querySelector('nav');
        expect(navigation).toBeInTheDocument();

    });

    it('displays  top bar  when url is /signup', () => {
        const {container} = setup('/signup');
        const navigation = container.querySelector('nav');
        expect(navigation).toBeInTheDocument();

    });

    it('displays  top bar  when url is /login', () => {
        const {container} = setup('/login');
        const navigation = container.querySelector('nav');
        expect(navigation).toBeInTheDocument();

    });

    it('displays  top bar  when url is /user1', () => {
        const {container} = setup('/user1');
        const navigation = container.querySelector('nav');
        expect(navigation).toBeInTheDocument();

    });

    it('shows  UserSignupPage  when clicking /signup', () => {
        const {queryByText, container} = setup('/');
        const signupLink = queryByText('Sign up');
        fireEvent.click(signupLink);

        const header = container.querySelector('h1');
        expect(header).toHaveTextContent('Sign Up');

    });

    it('shows  LoginPage  when clicking /login', () => {
        const {queryByText, container} = setup('/');
        const loginLink = queryByText('Login');
        fireEvent.click(loginLink);

        const header = container.querySelector('h1');
        expect(header).toHaveTextContent('Login');

    });

    it('shows  LoginPage  when clicking logo', () => {
        const {queryByTestId, container} = setup('/login');
        const logo = container.querySelector('img');
        fireEvent.click(logo);
        expect(queryByTestId('homepage')).toBeInTheDocument();

    });

    it('displays My Profile on the top bar after login success', async ()=>{

        const {queryByPlaceholderText, container, queryByText} = setup('/login');
        const usernameInput = queryByPlaceholderText('Your username');
        fireEvent.change(usernameInput, changeEvent('test-user'))

        const passwordInput = queryByPlaceholderText('Your password');
        fireEvent.change(passwordInput, changeEvent('P4ssword'))
        const button =container.querySelector('button');
        axios.post = jest.fn().mockResolvedValue({
            data: {
                id:1,
                username:'username1',
                displayName:'user1',
                image: 'profile-image.png'
            }
        });

        fireEvent.click(button);

        await waitFor(()=>expect(queryByText('My Profile')).toBeInTheDocument());


    });

    it('displays My Profile onn the top bar after sign up success', async ()=> {

        const {queryByPlaceholderText, container, queryByText} = setup('/signup');
        const displayNameInput = queryByPlaceholderText('Your display name');
        const usernameInput = queryByPlaceholderText('Your username');
        const passwordInput = queryByPlaceholderText('Your password');
        const passwordRepeat = queryByPlaceholderText('Repeat your password');
            
        fireEvent.change(displayNameInput, changeEvent('user1'));
        fireEvent.change(usernameInput, changeEvent('display1'));
        fireEvent.change(passwordInput, changeEvent('P4ssword'));
        fireEvent.change(passwordRepeat, changeEvent('P4ssword'));
        const button =container.querySelector('button');

        axios.post = jest.fn()
        
        .mockResolvedValueOnce({
            message: 'User saved'
        })
        
        .mockResolvedValueOnce({
            data: {
                id:1,
                username: 'user1',
                displayName:'display1',
                image: 'profile1-image.png',
                isLoggedIn: true

            }
        });
        fireEvent.click(button);
        await waitFor(()=> expect(queryByText("My Profile")).toBeInTheDocument());
       



    });

});