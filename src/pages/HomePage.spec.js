import React from 'react';
import { render } from '@testing-library/react';
import HomePage from './Homepage';



describe('HomePage', ()=>{

    
    describe('Layout', ()=>{
        it('has a root page div', ()=>{

            const {queryByTestId} = render(<HomePage/>);
            const homePageDiv = queryByTestId('homepage');
            expect(homePageDiv).toBeInTheDocument();

        })
    });
});