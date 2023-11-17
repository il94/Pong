import styled from "styled-components"
import colors from "../../../utils/colors"
import { RefObject } from "react"

export const Style = styled.div<{ ref: RefObject<HTMLElement> }>`

	display: flex;
	align-items: center;

	width: 240px;
	min-width: 240px;
	height: 53px;
	min-height: 53px;

	background-color: ${(props) => props.color};

	&:hover {
		cursor: pointer;
		background-color: ${colors.sectionHover};
	}

`

export const TempStyle = styled.div`

	display: flex;
	align-items: center;

	width: 240px;
	min-width: 240px;
	height: 53px;
	min-height: 53px;

`

export const ProfilePicture = styled.div`
	
	width: 32px;
	height: 32px;
	min-width: 32px;

	margin-left: 8px;

	border-radius: 50%;
	
	background-color: ${colors.profilePicture};

`

export const ProfileInfo = styled.div`

	display: flex;
	justify-content: space-between;
	flex-direction: column;

	margin-left: 8px;

	width: calc(100% - 32px);
	height: 32px;
`

export const ProfileName = styled.p`
	
	font-size: 13px;

`

export const ProfileStatus = styled.p`
	
	font-size: 10px;
	
`