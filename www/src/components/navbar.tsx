import {styled} from 'styled-components';



const Container = styled.div``;
const Wrapper = styled.div`
    max-width: 100%;
    max-height: 100%;
    display: flex;
    justify-content: space-between;
`;


export default function NavBar() {
    return (
        <Container className='max-w-screen max-h-44'>
            <Wrapper className='p-7'> 
                <Wrapper>
                    LOGO
                </Wrapper>
                <Wrapper>
                    MENU
                </Wrapper>
            </Wrapper>
        </Container>
    );
}
