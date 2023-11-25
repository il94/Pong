import styled from 'styled-components'
import { Link } from 'react-router-dom'
import colors from '../../utils/colors'
import effects from '../../utils/effects'

const LinkButtonFix = styled(Link)<{ width: string }>`

	width: ${(props) => props.width};

	padding-top: 1px;
	padding-left: 1px;
	padding-bottom: 3px;
	padding-right: 3px;

	cursor: pointer;

	font-size: 35px;
	text-decoration: none;
	text-align: center;

	${effects.shadowButton};
	${effects.pixelateWindow};
	
	color: ${colors.text};
	background-color: ${colors.button};

	&:hover {
		transform: scale(1.015);
	}
	&:active {
		transform: scale(0.95);
		transform: translate(2px, 2px);
		background-color: ${colors.shadowButton};
		border-color: ${colors.shadowButton};
	}

`

export default LinkButtonFix