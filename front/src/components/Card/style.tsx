import styled from "styled-components"

import colors from "../../utils/colors"
import effects from "../../utils/effects"

export const Style = styled.div<{ $left?: number, $right?: number, $top?: number, $bottom?: number, $zIndex: number }>`

	display: flex;

	flex-direction: column;
	align-items: center;

	position: absolute;
	left: ${(props) => props.$left}px;
	right: ${(props) => props.$right}px;
	top: ${(props) => props.$top}px;
	bottom: ${(props) => props.$bottom}px;
	z-index: ${(props) => props.$zIndex};

	width: 240px;
	height: 371px;
	min-width: 240px;
	min-height: 371px;

	clip-path: ${effects.pixelateWindow};

	background-color: ${colors.module};
	
`

export const Avatar = styled.img`

	width: 92px;
	height: 92px;
	min-width: 92px;
	min-height: 92px;

	margin-top: 9px;
	margin-left: 64px;
	margin-right: auto;
	border: 10px solid ${colors.rankGold};

	border-radius: 50%;

	object-fit: cover; 
	object-position: center;

`

export const UserName = styled.p`

	margin-top: 5px;

	font-size: 27px;

`