import * as React from "react"
import Svg, { G, Circle, Path } from "react-native-svg"

function TimeIcon(props) {
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width ? props.width: 20} height={props.height} viewBox="0 0 20 20">
            <G id="Group_7769" data-name="Group 7769" transform="translate(-1 -1)">
                <Path id="Path_5112" data-name="Path 5112" d="M11,1A10,10,0,1,0,21,11,10,10,0,0,0,11,1Zm0,18.182A8.182,8.182,0,1,1,19.182,11,8.182,8.182,0,0,1,11,19.182Z" fill={props.color} />
                <Path id="Path_5113" data-name="Path 5113" d="M13,11.586V6a1,1,0,0,0-2,0v6a1,1,0,0,0,.293.707l3,3a1,1,0,1,0,1.414-1.414Z" transform="translate(-2.176 -0.545)" fill={props.color} />
            </G>
        </Svg>


    )
}

export default TimeIcon