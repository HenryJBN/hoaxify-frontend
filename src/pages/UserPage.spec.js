import React from "react";
import { queryByTestId, render } from "@testing-library/react";
import UserPage from './UserPage';

describe('UserPage', ()=>{

    describe('Layout', ()=>{
        it('has a root page div', ()=>{
            const {queryByTestId} = render(<UserPage/>);
            const userPageDiv = queryByTestId('userpage');
            expect(userPageDiv).toBeInTheDocument();
        })

    });
});