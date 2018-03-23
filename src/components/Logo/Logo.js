import React from 'react';
import Tilt from 'react-tilt'
import 'tachyons';
import './Logo.css';
import brain from './Background-of-success-ideas/OIUH890.jpg';

const Logo = () =>{
	// console.log(brain);
	return (
		<div className='ma4 mt0'>
			<Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 150, width: 150 }} >
				<div className="Tilt-inner pa3">
					<img style={{paddingTop:'0px'}} src={brain} alt='Designed by Freepik'/>
					{/*<a href="https://www.freepik.com/free-vector/background-of-success-ideas_1048531.htm">Designed by Freepik</a>*/}
				</div>
			</Tilt>
		</div>
		);
};


export default Logo;