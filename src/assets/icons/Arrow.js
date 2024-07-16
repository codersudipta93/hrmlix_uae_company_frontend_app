import * as React from "react"
import Svg, { G, Circle, Path } from "react-native-svg"

function Arrow(props) {
    return (
        <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M17.6 9.6L12 14.4 6.4 9.6"
                stroke={props?.color ? props?.color : "#fff"}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>

    )
}

export default Arrow