import { Button, Divider } from '@mui/material'
import './Header.css'
import { useNavigate } from 'react-router-dom'

export default function Header() {

    const navigate = useNavigate();

    function handleBtnClick() {
        navigate('/workspace');
    }

    return (
        <section id='mobile-header-wrapper'>
            <div id="mobile-header">
                <div className="header__title">
                    <h1>GenImgSite</h1>
                </div>
                <Button className='main-gradient'
                variant='contained'
                sx={
                    {
                        textTransform: 'none',
                        color: 'white',
                        height: '50px',
                        fontSize: '20px',
                        paddingLeft: '30px',
                        paddingRight: '30px'
                    }
                }
                onClick={handleBtnClick}
                >
                    Generate
                </Button>
                
            </div>
            <Divider color="white" flexItem/>
        </section>
    )
}