import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TopBar from './TopBar';
import {MemoryRouter} from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import authReducer from '../redux/authReducer';


const loggedInState = {
    id:1,
    username: 'username1',
    displayName:'user1',
    password: 'P4ssword',
    image: 'profile-image.png',
    isLoggedIn: true
}

const defaultState = {
    id:0,
    username: '',
    displayName:'',
    password: '',
    image: '',
    isLoggedIn: false
}

const setup = (state=defaultState)=>{
    const store = createStore(authReducer, state);
    return render(
        <Provider store={store}>
            <MemoryRouter>
            <TopBar/>
        </MemoryRouter>
        </Provider>
    )
};

describe('TopBar', ()=> {
    
    describe('Layout', ()=>{
        it('has application logo', ()=> {
            const {container} =setup();
            const image = container.querySelector('img');
            expect(image.src).toContain('hoaxify-logo.png');
        });

        it('has link to home page from logo', ()=>{
            const {container} =setup();
            const image = container.querySelector('img');
            expect(image.parentElement.getAttribute('href')).toBe('/');
        });

        it('has link to sign up page', ()=> {
            const {queryByText} =setup();
            const signupLink = queryByText('Sign up');
            expect(signupLink.getAttribute('href')).toBe('/signup');
        });

        it('has link to login page', ()=> {
            const {queryByText} =setup();
            const loginLink = queryByText('Login');
            expect(loginLink.getAttribute('href')).toBe('/login');
        });

        it('has link  logout link when user logs in', ()=> {
            const {queryByText} =setup(loggedInState);
            const logoutLink = queryByText('Logout');
            expect(logoutLink).toBeInTheDocument();
        });

        it('has link  profile link when user logs in', ()=> {
            const {queryByText} =setup(loggedInState);
            const profileLink = queryByText('My Profile');
            expect(profileLink.getAttribute("href")).toBe("/username1");
        });


    });


    describe('interaction', ()=>{

        it('displays login and signup links when user clicks logout', ()=>{
            const {queryByText} =setup(loggedInState);
            const logoutLink = queryByText('Logout');
            fireEvent.click(logoutLink);
            const loginLink = queryByText('Login');
            expect(loginLink).toBeInTheDocument();

        });

    });

});